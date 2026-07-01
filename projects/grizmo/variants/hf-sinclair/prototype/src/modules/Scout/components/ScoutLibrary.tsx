// ScoutLibrary — saved items surface (save-model consolidation).
//
// Renders the shared ScoutViewSearch (search + starred-only filter) on top,
// then a single scrolling list of cards filtered by search + starred state.
//
// State sources (all from `useScout`):
//   - state.library.items — seeded SavedItem[] (prompts + paths)
//   - state.search.library — current query (case-insensitive, matches name +
//     description)
//   - state.starredOnly.library — when true, only show starred items
//
// Actions dispatched:
//   - toggleItemStar(id)
//   - setSearch('library', '') + setStarredOnly(false) — used by the
//     "Clear filters" link in the no-matches empty state
//
// The Run / Open CTA replays the item through the chat ask / path-run flows.

import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  StarFilled,
  StarOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import { GraviButton, Texto } from '@gravitate-js/excalibrr'
import { Dropdown, Menu } from 'antd'
import { useMemo, useState, type ReactNode } from 'react'

import { buildSaveModalStateForItem } from '../state/detectPathCandidate'
import { summarizeShareBadge } from '../services/team'
import { useScout } from '../state/ScoutContext'
import { useScoutAsk } from '../state/useScoutAsk'
import { useScoutRunPath } from '../state/useScoutRunPath'
import {
  SUBJECT_TAG_LABELS,
  type LibraryFilter,
  type SavedItem,
  type SubjectTag,
} from '../types'

import { ScoutViewSearch } from './ScoutViewSearch'

import './ScoutLibrary.css'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const matchesQuery = (query: string, ...fields: string[]) => {
  if (!query) return true
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return fields.some((field) => field.toLowerCase().includes(needle))
}

// ---------------------------------------------------------------------------
// Item card
// ---------------------------------------------------------------------------

interface ItemCardProps {
  item: SavedItem
  onToggleStar: (id: string) => void
  onShare: (id: string) => void
  onEdit: (item: SavedItem) => void
  onRun: (item: SavedItem) => void
  onOpen: (item: SavedItem) => void
  running: boolean
}

const ItemCard = ({
  item,
  onToggleStar,
  onShare,
  onEdit,
  onRun,
  onOpen,
  running,
}: ItemCardProps) => {
  const isPath = item.kind === 'path'
  const scopeLabel = item.scope === 'row' ? 'This row' : 'Whole quote book'
  const stepCount = item.steps.length
  // OBJ-4 — make the run shape unmistakable: a path fires several steps in
  // sequence, a prompt is a single ask. This is the one brand-tinted facet.
  const kindLabel = isPath
    ? `Path · ${stepCount} step${stepCount === 1 ? '' : 's'}`
    : 'Prompt'
  const subjectLabel = item.subject ? SUBJECT_TAG_LABELS[item.subject] : null
  // Provenance reads in one place: a received item shows who sent it; an item
  // you've shared out shows the audience badge; a private item shows nothing.
  const provenance = item.sharedBy
    ? `Shared by ${item.sharedBy}`
    : item.sharedWith
      ? summarizeShareBadge(item.sharedWith)
      : null
  return (
    <article className='scout-library-card'>
      <div className='scout-library-card__header'>
        <div className='scout-library-card__title'>{item.name}</div>
        <div className='scout-library-card__actions'>
          <button
            type='button'
            className='scout-library-card__action scout-library-card__action--reveal'
            onClick={() => onEdit(item)}
            aria-label={isPath ? 'Edit path' : 'Edit prompt'}
            title='Edit'
          >
            <EditOutlined />
          </button>
          <button
            type='button'
            className='scout-library-card__action scout-library-card__action--reveal'
            onClick={() => onShare(item.id)}
            aria-label='Share'
            title='Share'
          >
            <UsergroupAddOutlined />
          </button>
          <button
            type='button'
            className={`scout-library-card__action scout-library-card__star${
              item.starred ? ' is-filled' : ''
            }`}
            onClick={() => onToggleStar(item.id)}
            aria-pressed={item.starred}
            aria-label={item.starred ? 'Unstar' : 'Star'}
            title={item.starred ? 'Starred' : 'Star'}
          >
            {item.starred ? <StarFilled /> : <StarOutlined />}
          </button>
        </div>
      </div>

      <div className='scout-library-card__tags'>
        <span className='scout-library-card__tag scout-library-card__tag--kind'>
          {kindLabel}
        </span>
        <span className='scout-library-card__tag'>{scopeLabel}</span>
        {subjectLabel ? (
          <span className='scout-library-card__tag'>{subjectLabel}</span>
        ) : null}
      </div>

      <p className='scout-library-card__description'>{item.description}</p>

      <div className='scout-library-card__footer'>
        {provenance ? (
          <span
            className={`scout-library-card__provenance${
              item.sharedBy ? ' is-received' : ''
            }`}
          >
            {provenance}
          </span>
        ) : null}
        {isPath ? (
          <GraviButton
            size='small'
            className='scout-library-card__cta'
            buttonText={running ? 'Running…' : 'Run'}
            disabled={running}
            onClick={() => onRun(item)}
          />
        ) : (
          <GraviButton
            size='small'
            className='scout-library-card__cta'
            buttonText='Ask'
            onClick={() => onOpen(item)}
          />
        )}
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Empty states
// ---------------------------------------------------------------------------

interface EmptyProps {
  icon: ReactNode
  title: string
  body: string
  action?: { label: string; onClick: () => void }
}

const Empty = ({ icon, title, body, action }: EmptyProps) => (
  <div className='scout-library__empty'>
    <div className='scout-library__empty-icon' aria-hidden='true'>
      {icon}
    </div>
    <div className='scout-library__empty-title'>{title}</div>
    <div className='scout-library__empty-body'>{body}</div>
    {action ? (
      <button
        type='button'
        className='scout-library__empty-action'
        onClick={action.onClick}
      >
        {action.label}
      </button>
    ) : null}
  </div>
)

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

// Quick-filter chip state — local UI only, composes on top of the persisted
// search + ownership + starred filters. `'all'` = chip inactive.
type TypeChip = 'all' | 'prompt' | 'path'
type ScopeChip = 'all' | 'row' | 'agg'
type SubjectChip = 'all' | SubjectTag

interface ChipDef<T extends string> {
  label: string
  value: T
}

const TYPE_CHIPS: ChipDef<TypeChip>[] = [
  { label: 'Prompt', value: 'prompt' },
  { label: 'Path', value: 'path' },
]

const SCOPE_CHIPS: ChipDef<ScopeChip>[] = [
  { label: 'Single-row', value: 'row' },
  { label: 'Many-rows', value: 'agg' },
]

const SUBJECT_CHIPS: ChipDef<SubjectChip>[] = (
  Object.keys(SUBJECT_TAG_LABELS) as SubjectTag[]
).map((tag) => ({ label: SUBJECT_TAG_LABELS[tag], value: tag }))

// Ownership values that produce a chip ('all' = default, no chip).
const OWNERSHIP_CHIPS: ChipDef<Exclude<LibraryFilter, 'all'>>[] = [
  { label: 'Yours', value: 'yours' },
  { label: 'Shared with you', value: 'shared' },
]

// An active-filter token: the chosen value + an × that clears that dimension.
interface RemovableTokenProps {
  label: string
  onRemove: () => void
}

const RemovableToken = ({ label, onRemove }: RemovableTokenProps) => (
  <span className='scout-library__token'>
    <span className='scout-library__token-label'>{label}</span>
    <button
      type='button'
      className='scout-library__token-x'
      aria-label={`Remove filter: ${label}`}
      onClick={onRemove}
    >
      <CloseOutlined />
    </button>
  </span>
)

// A check that reserves its slot even when hidden, so menu rows align.
const MenuValue = ({ label, active }: { label: string; active: boolean }) => (
  <span className='scout-library__menu-row'>
    <CheckOutlined
      className={`scout-library__menu-check${active ? '' : ' is-hidden'}`}
    />
    {label}
  </span>
)

export const ScoutLibrary = () => {
  const { state, actions } = useScout()
  const runPath = useScoutRunPath()
  const ask = useScoutAsk()
  const query = state.search.library
  const starredOnly = state.starredOnly.library
  const ownership = state.libraryFilter

  // LIB-2 — quick filter chips (local UI state).
  const [typeChip, setTypeChip] = useState<TypeChip>('all')
  const [scopeChip, setScopeChip] = useState<ScopeChip>('all')
  const [subjectChip, setSubjectChip] = useState<SubjectChip>('all')

  const allItems = state.library.items

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (starredOnly && !item.starred) return false
      if (ownership === 'yours' && item.sharedBy) return false
      if (ownership === 'shared' && !item.sharedBy) return false
      if (typeChip !== 'all' && item.kind !== typeChip) return false
      if (scopeChip !== 'all' && item.scope !== scopeChip) return false
      if (subjectChip !== 'all' && item.subject !== subjectChip) return false
      return matchesQuery(query, item.name, item.description)
    })
  }, [
    allItems,
    query,
    starredOnly,
    ownership,
    typeChip,
    scopeChip,
    subjectChip,
  ])

  const handleClearFilters = () => {
    actions.setSearch('library', '')
    actions.setStarredOnly(false)
    actions.setLibraryFilter('all')
    setTypeChip('all')
    setScopeChip('all')
    setSubjectChip('all')
  }

  const handleRun = (item: SavedItem) => {
    void runPath(item)
  }

  // SAV-3 — reopen an existing item in the Save modal as an edit (rename,
  // re-describe, retag; drop/reorder/relabel steps for paths). Saving replaces
  // it in place rather than creating a duplicate.
  const handleEdit = (item: SavedItem) => {
    actions.openSaveModal(buildSaveModalStateForItem(item))
  }

  const handleOpen = (item: SavedItem) => {
    // Prompts run as a single ask through the same fake-LLM as the composer.
    actions.setView('chat')
    const step = item.steps[0]
    if (step?.promptId) {
      void ask({ promptId: step.promptId, label: step.label })
    } else {
      void ask({ freeText: step?.label, label: step?.label })
    }
  }

  const hasItemsAtAll = allItems.length > 0
  const hasMatches = filteredItems.length > 0
  const filtersActive =
    Boolean(query) ||
    starredOnly ||
    ownership !== 'all' ||
    typeChip !== 'all' ||
    scopeChip !== 'all' ||
    subjectChip !== 'all'

  // --- Filter builder ("+ Filters" dropdown + removable tokens) -------------
  const labelFor = <T extends string>(chips: ChipDef<T>[], v: T) =>
    chips.find((c) => c.value === v)?.label ?? v

  // Active dimension filters (excludes Favorites — it has its own toggle).
  const activeFilters: { id: string; label: string; onRemove: () => void }[] = []
  if (ownership !== 'all') {
    activeFilters.push({
      id: 'own',
      label: labelFor(OWNERSHIP_CHIPS, ownership as Exclude<LibraryFilter, 'all'>),
      onRemove: () => actions.setLibraryFilter('all'),
    })
  }
  if (typeChip !== 'all') {
    activeFilters.push({
      id: 'type',
      label: `Type: ${labelFor(TYPE_CHIPS, typeChip)}`,
      onRemove: () => setTypeChip('all'),
    })
  }
  if (scopeChip !== 'all') {
    activeFilters.push({
      id: 'scope',
      label: `Scope: ${labelFor(SCOPE_CHIPS, scopeChip)}`,
      onRemove: () => setScopeChip('all'),
    })
  }
  if (subjectChip !== 'all') {
    activeFilters.push({
      id: 'subject',
      label: `Subject: ${labelFor(SUBJECT_CHIPS, subjectChip)}`,
      onRemove: () => setSubjectChip('all'),
    })
  }
  const hasBuilderFilters = activeFilters.length > 0

  const handleFilterPick = (key: string) => {
    const [dim, value] = key.split(':')
    if (dim === 'own') {
      actions.setLibraryFilter(
        ownership === value ? 'all' : (value as LibraryFilter),
      )
    } else if (dim === 'type') {
      setTypeChip((p) => (p === value ? 'all' : (value as TypeChip)))
    } else if (dim === 'scope') {
      setScopeChip((p) => (p === value ? 'all' : (value as ScopeChip)))
    } else if (dim === 'subject') {
      setSubjectChip((p) => (p === value ? 'all' : (value as SubjectChip)))
    }
  }

  // Reset only the builder dimensions (Favorites + search stay independent).
  const clearBuilderFilters = () => {
    actions.setLibraryFilter('all')
    setTypeChip('all')
    setScopeChip('all')
    setSubjectChip('all')
  }

  const filterMenu = (
    <Menu
      onClick={({ key }) => handleFilterPick(String(key))}
      items={[
        {
          key: 'own',
          label: 'Ownership',
          children: OWNERSHIP_CHIPS.map((c) => ({
            key: `own:${c.value}`,
            label: <MenuValue label={c.label} active={ownership === c.value} />,
          })),
        },
        {
          key: 'type',
          label: 'Type',
          children: TYPE_CHIPS.map((c) => ({
            key: `type:${c.value}`,
            label: <MenuValue label={c.label} active={typeChip === c.value} />,
          })),
        },
        {
          key: 'scope',
          label: 'Scope',
          children: SCOPE_CHIPS.map((c) => ({
            key: `scope:${c.value}`,
            label: <MenuValue label={c.label} active={scopeChip === c.value} />,
          })),
        },
        {
          key: 'subject',
          label: 'Subject',
          children: SUBJECT_CHIPS.map((c) => ({
            key: `subject:${c.value}`,
            label: (
              <MenuValue label={c.label} active={subjectChip === c.value} />
            ),
          })),
        },
      ]}
    />
  )

  return (
    <div className='scout-library'>
      {/* Title row mirrors the Chats inbox "All Chats" header for consistency. */}
      <div className='scout-library__toolbar'>
        <Texto category='label' className='scout-library__heading'>
          Library
        </Texto>
      </div>
      <ScoutViewSearch view='library' placeholder='Search library…' />

      {hasItemsAtAll ? (
        <div className='scout-library__filter'>
          {/* Favorites — standalone toggle, independent of the filter builder. */}
          <button
            type='button'
            className={`scout-library-chip scout-library-chip--favorites${
              starredOnly ? ' is-active' : ''
            }`}
            aria-pressed={starredOnly}
            onClick={() => actions.setStarredOnly('library', !starredOnly)}
          >
            <span aria-hidden='true'>★</span> Favorites
          </button>

          {/* Filter builder: removable tokens + a persistent add affordance. */}
          <div className='scout-library__builder'>
            {activeFilters.map((f) => (
              <RemovableToken key={f.id} label={f.label} onRemove={f.onRemove} />
            ))}

            <Dropdown
              overlay={filterMenu}
              trigger={['click']}
              placement='bottomLeft'
            >
              <button
                type='button'
                className={`scout-library__addfilter${
                  hasBuilderFilters ? ' is-compact' : ''
                }`}
                aria-label='Add filter'
                title='Add filter'
              >
                <PlusOutlined />
                {hasBuilderFilters ? null : (
                  <span className='scout-library__addfilter-label'>Filters</span>
                )}
              </button>
            </Dropdown>

            {activeFilters.length >= 2 ? (
              <button
                type='button'
                className='scout-library__clearall'
                onClick={clearBuilderFilters}
              >
                Clear all
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className='scout-library__body'>
        {!hasItemsAtAll ? (
          <Empty
            icon={<StarOutlined />}
            title='No saved items yet'
            body='Save a question — or a path of questions — and it shows up here, ready to reuse. Look for Save after Scout answers.'
          />
        ) : !hasMatches ? (
          <Empty
            icon={<SearchOutlined />}
            title='No matches'
            body='Try a different search or clear the filters to see everything.'
            action={
              filtersActive
                ? { label: 'Clear filters', onClick: handleClearFilters }
                : undefined
            }
          />
        ) : (
          filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onToggleStar={actions.toggleItemStar}
              onShare={actions.openShareModal}
              onEdit={handleEdit}
              onRun={handleRun}
              onOpen={handleOpen}
              running={state.isPathRunning}
            />
          ))
        )}
      </div>
    </div>
  )
}
