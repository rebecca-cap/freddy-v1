import { BBDTag, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { type OfferPreset, validatePresetName } from '@modules/Dashboard/SpecialOffers/utils/Constants/PresetConstants'
import { Input, Select } from 'antd'
import { useState } from 'react'

export type PresetState = 'none' | 'populated' | 'dirty' | 'updated'

interface PresetBarProps {
  presets: OfferPreset[]
  selectedPresetId?: string
  presetState: PresetState
  onSelectPreset: (id: string | undefined) => void
  onUpdatePreset: () => void
  onSaveAsNew: (name: string) => void
  existingNames: string[]
  /** From-scratch (no preset selected): show "Save as new preset" once the offer has content. */
  canSaveFromScratch?: boolean
}

const STATE_BADGE: Record<Exclude<PresetState, 'none'>, { text: string; color: string }> = {
  populated: { text: 'Populated from preset', color: 'success' },
  dirty: { text: 'Edited · unsaved', color: 'warning' },
  updated: { text: 'Preset updated', color: 'success' },
}

export function PresetBar({
  presets,
  selectedPresetId,
  presetState,
  onSelectPreset,
  onUpdatePreset,
  onSaveAsNew,
  existingNames,
  canSaveFromScratch,
}: PresetBarProps) {
  const [showNameInput, setShowNameInput] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string>()

  const resetSaveAsNew = () => {
    setShowNameInput(false)
    setName('')
    setError(undefined)
  }

  const handleSave = () => {
    const err = validatePresetName(name, existingNames)
    if (err) {
      setError(err)
      return
    }
    onSaveAsNew(name.trim())
    resetSaveAsNew()
  }

  const badge = presetState !== 'none' ? STATE_BADGE[presetState] : undefined

  return (
    <Vertical className={'qc-presetbar p-4'} style={{ gap: 12 }}>
      <Vertical style={{ gap: 8 }}>
        <Texto category={'label'} weight={'bold'}>
          Start from a preset (optional)
        </Texto>
        <Horizontal verticalCenter style={{ flexWrap: 'wrap', gap: 8 }}>
          <Select
            style={{ minWidth: 240 }}
            value={selectedPresetId ?? undefined}
            placeholder={'No preset selected'}
            allowClear
            onChange={(value) => {
              resetSaveAsNew()
              onSelectPreset(value || undefined)
            }}
            options={presets.map((p) => ({ value: p.id, label: p.name }))}
          />
          {badge && <BBDTag color={badge.color}>{badge.text}</BBDTag>}
        </Horizontal>
      </Vertical>

      {(presetState === 'dirty' || (presetState === 'none' && canSaveFromScratch)) && (
        <Vertical style={{ gap: 4 }}>
          <Horizontal verticalCenter style={{ flexWrap: 'wrap', gap: 8 }}>
            {presetState === 'dirty' && (
              <GraviButton appearance='outline' buttonText={'Update preset'} onClick={onUpdatePreset} />
            )}
            <GraviButton
              appearance='outline'
              buttonText={'Save as new preset'}
              onClick={() => setShowNameInput(true)}
            />
            {showNameInput && (
              <>
                <Input
                  autoFocus
                  status={error ? 'error' : undefined}
                  placeholder={'New preset name'}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (error) setError(undefined)
                  }}
                  onPressEnter={handleSave}
                  style={{ maxWidth: 240 }}
                />
                <GraviButton theme1 buttonText={'Save'} onClick={handleSave} />
              </>
            )}
          </Horizontal>
          {showNameInput && error && (
            <Texto appearance={'error'} className={'text-14'}>
              {error}
            </Texto>
          )}
        </Vertical>
      )}
    </Vertical>
  )
}
