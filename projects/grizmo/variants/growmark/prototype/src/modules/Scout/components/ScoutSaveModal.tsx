// ScoutSaveModal — the one Save dialog (save-model consolidation).
//
// Generalized from the former ScoutPathModal. Names + saves a single object:
// a one-step save is a *prompt*, a multi-step save is a *path*. Editing is
// remove-only (drop / reorder / relabel) — adding steps is authoring and lives
// in the separate path-builder, not here. A name is always required.
//
// State lives in `state.saveModal` (single source of truth). All edits go
// through reducer actions so the modal stays a pure view + dispatcher.
//
// Reuses antd `Modal` directly per codebase convention
// (src/components/shared/Uploaders/UploadStatusModal/UploadStatusModal.tsx).

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseOutlined,
  CompressOutlined,
  EditOutlined,
  PlayCircleFilled,
  UndoOutlined,
} from '@ant-design/icons'
import { GraviButton } from '@gravitate-js/excalibrr'
import { Input, Modal, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import {
  flattenDescription,
  flattenStepsToPrompt,
  suggestSubject,
} from '../services/fakeLlm'
import { useScout } from '../state/ScoutContext'
import { SUBJECT_TAG_LABELS } from '../types'
import type { SavedItem, ShareTarget, SubjectTag } from '../types'

import { ScoutBookmarkIcon } from './ScoutBookmarkIcon'
import { ScoutSharePicker } from './ScoutSharePicker'

import './ScoutSaveModal.css'

const makeItemId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `item-${crypto.randomUUID()}`
  }
  return `item-${Date.now()}-${Math.floor(Math.random() * 1e6)}`
}

const makeStepId = (i: number): string => `step-${i}-${Date.now()}`

export const ScoutSaveModal = () => {
  const { state, actions } = useScout()
  const modal = state.saveModal
  const visible = !!modal

  const keptSteps = useMemo(
    () => (modal ? modal.steps.filter((s) => !s.dropped) : []),
    [modal],
  )
  const canSave =
    !!modal && modal.name.trim().length > 0 && keptSteps.length >= 1

  // Share-on-save: 'none' keeps it private, 'team' shares to everyone,
  // 'people' reveals the teammate multi-select. Reset each time the modal opens.
  const [shareScope, setShareScope] = useState<'none' | 'team' | 'people'>(
    'none',
  )
  const [shareUserIds, setShareUserIds] = useState<string[]>([])
  // Two-tab layout keeps the modal short: "Details" holds name/description/
  // subject/steps; "Share" holds the audience picker. Reset to Details on open.
  const [tab, setTab] = useState<'details' | 'share'>('details')
  const toggleShareUser = (id: string) =>
    setShareUserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  // SAV-4 — flatten is an *alternative* to the step-by-step form, never a
  // replacement. When on, we save one fused prompt instead of the kept steps.
  // OBJ-4: a flattened path is saved as `kind: 'prompt'` (single fused prompt),
  // not `kind: 'path'` — still a first-class SavedItem alongside the step form.
  const [flatten, setFlatten] = useState(false)
  useEffect(() => {
    if (visible) {
      setShareScope('none')
      setShareUserIds([])
      setTab('details')
      setFlatten(false)
      // SAV-1 / OBJ-3 — auto-suggest a subject from the prompt/path on open,
      // but only when none is set yet (don't clobber an explicit pick or an
      // edited item's existing tag). The user can still change or clear it.
      if (modal && !modal.subject) {
        const guess = suggestSubject(
          modal.steps.map((s) => s.label),
          modal.name,
        )
        if (guess) actions.updateSaveModal({ subject: guess })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  // SAV-4 — deterministic single-prompt rewrite of the kept step labels.
  // MUST stay above the early return below: hooks may not be called
  // conditionally, or the hook count changes when the modal closes on save
  // (React throws "rendered fewer hooks than expected" → white screen).
  const flattenedPrompt = useMemo(
    () => flattenStepsToPrompt(keptSteps.map((s) => s.label)),
    [keptSteps],
  )

  // The model's subject guess for the current prompt/path — drives the
  // "Suggested" hint when the chosen subject matches it. Deterministic.
  const suggestedSubject = useMemo(
    () =>
      modal
        ? suggestSubject(
            modal.steps.map((s) => s.label),
            modal.name,
          )
        : undefined,
    [modal],
  )

  if (!modal) {
    // Mount the antd Modal but pass open=false so it stays closed without
    // showing the closeIcon transitions. Returning null avoids antd's
    // backdrop linger entirely.
    return null
  }

  // A single step is a reusable prompt; multiple is an ordered path. The
  // header copy + step editor adapt to which one the user is saving.
  const isSingle = modal.steps.length === 1
  const isMultiStep = keptSteps.length > 1
  // SAV-3 — editing an existing Library item vs saving a new one.
  const isEditing = !!modal.editingItemId
  // OBJ-4 — the kind we'll actually save. Flatten collapses a multi-step path
  // down to a single fused prompt, so a flattened path saves as a prompt.
  const willBeKind = isMultiStep && !flatten ? 'path' : 'prompt'

  const handleClose = () => actions.closeSaveModal()

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    actions.updateSaveModal({ name: e.target.value })

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => actions.updateSaveModal({ description: e.target.value })

  const handleToggleEditor = () =>
    actions.updateSaveModal({ editorOpen: !modal.editorOpen })

  // SAV-1 / OBJ-3 — write the chosen subject tag onto the modal state so it
  // rides along onto the SavedItem at save time. `undefined` = no tag.
  const handleSubjectChange = (subject?: SubjectTag) =>
    actions.updateSaveModal({ subject })

  const handleStepLabelChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
      actions.updateSaveStep(index, { label: e.target.value })

  const handleToggleDropped = (index: number) => {
    actions.updateSaveStep(index, {
      dropped: !modal.steps[index].dropped,
    })
  }

  const handleMove = (index: number, direction: -1 | 1) => {
    actions.reorderSaveStep(index, direction)
  }

  // Resolve the share dropdown into a ShareTarget (undefined = keep private).
  // 'people' with nobody picked is treated as private rather than blocking save.
  const sharedWith: ShareTarget | undefined =
    shareScope === 'team'
      ? { scope: 'team' }
      : shareScope === 'people' && shareUserIds.length > 0
        ? { scope: 'people', userIds: shareUserIds }
        : undefined

  const handleSave = () => {
    if (!canSave) return
    // Flatten path: collapse the kept steps into one fused prompt step. The
    // flattened result is a *prompt* with its own description.
    const willFlatten = isMultiStep && flatten
    const kind = willFlatten || keptSteps.length === 1 ? 'prompt' : 'path'
    const steps = willFlatten
      ? [
          {
            id: makeStepId(0),
            label: flattenedPrompt,
            mode: modal.scope === 'agg' ? ('aggregate' as const) : ('row' as const),
          },
        ]
      : keptSteps.map((s, i) => ({
          id: makeStepId(i),
          label: s.label.trim() || s.label,
          ...(s.promptId ? { promptId: s.promptId } : {}),
          ...(s.mode ? { mode: s.mode } : {}),
        }))
    const description = willFlatten
      ? modal.description.trim() ||
        flattenDescription(modal.scope, keptSteps.length)
      : modal.description.trim()
    const item: SavedItem = {
      id: modal.editingItemId ?? makeItemId(),
      name: modal.name.trim(),
      description,
      steps,
      scope: modal.scope,
      // Inherit the chat's favorite when saving from a starred chat (new saves
      // only; edits keep their prior star — see the saveItem reducer).
      starred: Boolean(modal.starred),
      kind,
      ...(modal.subject ? { subject: modal.subject } : {}),
      ...(sharedWith ? { sharedWith } : {}),
    }
    actions.saveItem(item, modal.sourceMessageId)
    const toastId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? `toast-${crypto.randomUUID()}`
        : `toast-${Date.now()}`
    const kindLabel =
      kind === 'path' ? `"${item.name}" (${item.steps.length}-step path)` : `"${item.name}"`
    actions.addToast({
      id: toastId,
      kind: 'success',
      text: isEditing
        ? `Updated · ${kindLabel}`
        : sharedWith
          ? `Saved & shared · ${kindLabel}`
          : `Saved · ${kindLabel}`,
    })
  }

  const scopeBadge = modal.scope === 'agg' ? 'Whole quote book' : 'This row'

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      footer={null}
      closable={false}
      destroyOnClose
      width={520}
      wrapClassName='scout-scope scout-save-modal-wrap'
      className='scout-save-modal'
      title={null}
      maskClosable
    >
      <div className='scout-save-modal__head'>
        <div className='scout-save-modal__head-icon' aria-hidden='true'>
          {isSingle ? (
            <ScoutBookmarkIcon filled size={16} />
          ) : (
            <PlayCircleFilled />
          )}
        </div>
        <div className='scout-save-modal__head-titles'>
          <div className='scout-save-modal__head-title'>
            {isEditing
              ? isSingle
                ? 'Edit prompt'
                : 'Edit path'
              : isSingle
                ? 'Save'
                : 'Save as path'}
          </div>
          <div className='scout-save-modal__head-subtitle'>
            {isEditing
              ? 'Update the name, description, subject' +
                (isSingle ? '.' : ', and steps.')
              : isSingle
                ? 'Save this question so you can ask it again later.'
                : 'Save this path so you can run the whole thing again later.'}
          </div>
        </div>
        <button
          type='button'
          className='scout-save-modal__close'
          aria-label='Close'
          onClick={handleClose}
        >
          <CloseOutlined />
        </button>
      </div>

      <div className='scout-save-modal__tabs' role='tablist'>
        <button
          type='button'
          role='tab'
          aria-selected={tab === 'details'}
          className={`scout-save-modal__tab${
            tab === 'details' ? ' is-active' : ''
          }`}
          onClick={() => setTab('details')}
        >
          Details
        </button>
        <button
          type='button'
          role='tab'
          aria-selected={tab === 'share'}
          className={`scout-save-modal__tab${
            tab === 'share' ? ' is-active' : ''
          }`}
          onClick={() => setTab('share')}
        >
          Share
        </button>
      </div>

      <div className='scout-save-modal__body'>
       {tab === 'details' ? (
        <>
        <label className='scout-save-modal__field'>
          <span className='scout-save-modal__field-label'>Name</span>
          <Input
            value={modal.name}
            placeholder={
              isSingle
                ? 'e.g. Explain this price'
                : 'e.g. Weekly Gulf Coast margin check'
            }
            onChange={handleNameChange}
            autoFocus
          />
          <span className='scout-save-modal__field-help'>
            You'll see this name in your Library.
          </span>
        </label>

        <label className='scout-save-modal__field'>
          <span className='scout-save-modal__field-label'>Description</span>
          <Input.TextArea
            value={modal.description}
            placeholder='What this checks and when to use it (shown in your Library).'
            onChange={handleDescriptionChange}
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </label>

        <label className='scout-save-modal__field'>
          <span className='scout-save-modal__field-label'>
            Subject
            {suggestedSubject && modal.subject === suggestedSubject ? (
              <span className='scout-save-modal__suggest-badge'>
                ✨ Suggested
              </span>
            ) : null}
          </span>
          <Select
            className='scout-save-modal__subject-select'
            value={modal.subject ?? undefined}
            onChange={handleSubjectChange}
            allowClear
            placeholder='Pick a subject (optional)'
            options={(
              Object.keys(SUBJECT_TAG_LABELS) as SubjectTag[]
            ).map((tag) => ({
              value: tag,
              label: SUBJECT_TAG_LABELS[tag],
            }))}
          />
          <span className='scout-save-modal__field-help'>
            {suggestedSubject && modal.subject === suggestedSubject
              ? 'Scout guessed this from your prompt — change or clear it if it’s off.'
              : 'Groups this in your Library and powers subject filters.'}
          </span>
        </label>

        <div className='scout-save-modal__meta'>
          <span className='scout-save-modal__scope'>{scopeBadge}</span>
          <span className='scout-save-modal__meta-dot'>·</span>
          {/* OBJ-4 — make the saved object's shape explicit. */}
          <span className='scout-save-modal__kind-badge'>
            {willBeKind === 'path' ? 'Multi-step path' : 'Single prompt'}
          </span>
          <span className='scout-save-modal__meta-dot'>·</span>
          <span>
            {isSingle
              ? 'Saves as a prompt'
              : flatten
                ? `flattened from ${keptSteps.length} steps · saves as a prompt`
                : `${keptSteps.length} of ${modal.steps.length} steps kept · saves as a ${willBeKind}`}
          </span>
        </div>

        {isSingle ? (
          // Single step: show it read-only — nothing to reorder or drop.
          <ol className='scout-save-modal__steps' aria-label='Saved question'>
            <li className='scout-save-modal__step'>
              <span className='scout-save-modal__step-num'>1</span>
              <span
                className='scout-save-modal__step-label'
                title={modal.steps[0].label}
              >
                {modal.steps[0].label}
              </span>
            </li>
          </ol>
        ) : (
          <>
            <div className='scout-save-modal__steps-head'>
              <span className='scout-save-modal__field-label'>
                {flatten ? 'Flattened prompt' : 'Steps'}
              </span>
              {!flatten ? (
                <button
                  type='button'
                  className='scout-save-modal__edit-toggle'
                  onClick={handleToggleEditor}
                >
                  <EditOutlined />
                  {modal.editorOpen ? 'Done editing' : 'Edit steps'}
                </button>
              ) : null}
            </div>

            {flatten ? (
              // SAV-4 — flattened view: one fused prompt instead of the steps.
              // Deterministic rewrite; same steps always produce this string.
              <div
                className='scout-save-modal__flattened'
                aria-label='Flattened prompt'
              >
                {flattenedPrompt}
              </div>
            ) : (
            <ol className='scout-save-modal__steps' aria-label='Steps'>
              {modal.steps.map((step, i) => {
                const numberClass = `scout-save-modal__step-num${
                  step.dropped ? ' is-dropped' : ''
                }`
                return (
                  <li
                    key={step.id}
                    className={`scout-save-modal__step${
                      step.dropped ? ' is-dropped' : ''
                    }`}
                  >
                    <span className={numberClass}>
                      {step.dropped ? '–' : i + 1}
                    </span>
                    {modal.editorOpen ? (
                      <Input
                        value={step.label}
                        onChange={handleStepLabelChange(i)}
                        className='scout-save-modal__step-edit'
                        disabled={step.dropped}
                        size='small'
                      />
                    ) : (
                      <span
                        className='scout-save-modal__step-label'
                        title={step.label}
                      >
                        {step.label}
                      </span>
                    )}
                    {modal.editorOpen ? (
                      <span
                        className='scout-save-modal__step-actions'
                        role='group'
                        aria-label={`Step ${i + 1} actions`}
                      >
                        <button
                          type='button'
                          className='scout-save-modal__step-icon'
                          title='Move up'
                          aria-label='Move step up'
                          disabled={i === 0}
                          onClick={() => handleMove(i, -1)}
                        >
                          <ArrowUpOutlined />
                        </button>
                        <button
                          type='button'
                          className='scout-save-modal__step-icon'
                          title='Move down'
                          aria-label='Move step down'
                          disabled={i === modal.steps.length - 1}
                          onClick={() => handleMove(i, 1)}
                        >
                          <ArrowDownOutlined />
                        </button>
                        <button
                          type='button'
                          className='scout-save-modal__step-icon'
                          title={step.dropped ? 'Restore step' : 'Drop step'}
                          aria-label={
                            step.dropped ? 'Restore step' : 'Drop step'
                          }
                          onClick={() => handleToggleDropped(i)}
                        >
                          {step.dropped ? <UndoOutlined /> : <CloseOutlined />}
                        </button>
                      </span>
                    ) : null}
                  </li>
                )
              })}
            </ol>
            )}

            {/* SAV-4/SAV-5 — flatten is an alternative, not a replacement.
                Both forms coexist; toggling never discards the step list. */}
            <div className='scout-save-modal__flatten'>
              <button
                type='button'
                className={`scout-save-modal__flatten-toggle${
                  flatten ? ' is-on' : ''
                }`}
                onClick={() => setFlatten((v) => !v)}
                aria-pressed={flatten}
              >
                <CompressOutlined />
                {flatten ? 'Back to step-by-step' : 'Flatten to one prompt'}
              </button>
              <p className='scout-save-modal__flatten-help'>
                {flatten
                  ? 'Saving one fused prompt. Faster to run, but the model answers in a single pass — switch back if a later step depends on what an earlier step found.'
                  : 'Keep the steps when an intermediate answer can change what the next step means. Flatten when the steps are independent and you just want one quick prompt.'}
              </p>
            </div>

            <p className='scout-save-modal__hint'>
              {flatten
                ? 'Re-running asks this fused question against the current data — fresh answer, not a saved copy of the old ones.'
                : 'Re-running asks each question again against the current data — you get fresh answers, not a saved copy of the old ones.'}
            </p>
          </>
        )}
        </>
       ) : (
        <div className='scout-save-modal__field'>
          <span className='scout-save-modal__field-help'>
            Choose who gets this in their Library. You can change this later.
          </span>
          <ScoutSharePicker
            scope={shareScope}
            onScopeChange={setShareScope}
            userIds={shareUserIds}
            onToggleUser={toggleShareUser}
            includePrivate
          />
          <span className='scout-save-modal__field-help'>
            {shareScope === 'none'
              ? 'Only you can see this in your Library.'
              : "It lands in your teammates' Library, ready to run."}
          </span>
        </div>
       )}
      </div>

      <div className='scout-save-modal__footer'>
        <GraviButton
          size='small'
          className='scout-save-modal__cancel'
          buttonText='Cancel'
          onClick={handleClose}
        />
        <GraviButton
          id='itemSaveBtn'
          size='small'
          className='scout-save-modal__save'
          buttonText={isEditing ? 'Save changes' : 'Save'}
          disabled={!canSave}
          onClick={handleSave}
        />
      </div>
    </Modal>
  )
}
