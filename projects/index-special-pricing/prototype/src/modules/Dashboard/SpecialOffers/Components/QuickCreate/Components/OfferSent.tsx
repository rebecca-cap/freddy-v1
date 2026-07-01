import { CheckCircleFilled } from '@ant-design/icons'
import { BBDTag, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { validatePresetName } from '@modules/Dashboard/SpecialOffers/utils/Constants/PresetConstants'
import { Input } from 'antd'
import { useState } from 'react'

export interface OfferSummaryRow {
  label: string
  value: string
}

interface OfferSentProps {
  summaryRows: OfferSummaryRow[]
  presetExistingNames: string[]
  /** Whether the offer was started from a preset (hides the save-as-preset nudge if so). */
  startedFromPreset: boolean
  onSaveAsPreset: (name: string) => void
  onNewOffer: () => void
  onViewOffers: () => void
}

export function OfferSent({
  summaryRows,
  presetExistingNames,
  startedFromPreset,
  onSaveAsPreset,
  onNewOffer,
  onViewOffers,
}: OfferSentProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string>()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    const err = validatePresetName(name, presetExistingNames)
    if (err) {
      setError(err)
      return
    }
    onSaveAsPreset(name.trim())
    setSaved(true)
  }

  return (
    <Vertical style={{ maxWidth: 640, margin: '0 auto', width: '100%', gap: 24 }}>
      <Vertical horizontalCenter className={'pt-4'} style={{ gap: 8 }}>
        <Texto style={{ fontSize: 44, color: 'var(--theme-success)' }}>
          <CheckCircleFilled />
        </Texto>
        <Texto category={'h4'} className={'text-24'}>
          Offer sent
        </Texto>
        <Texto className={'text-14'} appearance={'medium'} align={'center'}>
          Your offer is on its way to the selected customers.
        </Texto>
      </Vertical>

      <Vertical className={'qc-offer-tile bg-1 border-radius-10 bordered p-4'} style={{ gap: 4 }}>
        <Texto category={'h5'} className={'mb-2'}>
          Offer summary
        </Texto>
        {summaryRows.map((row) => (
          <Horizontal key={row.label} justifyContent='space-between' verticalCenter className={'py-1'}>
            <Texto className={'text-14'} appearance={'medium'}>
              {row.label}
            </Texto>
            <Texto className={'text-14'} weight={'bold'} align={'right'}>
              {row.value}
            </Texto>
          </Horizontal>
        ))}
      </Vertical>

      {!startedFromPreset && (
        <Vertical className={'bg-1 border-radius-10 bordered p-4'} style={{ gap: 8 }}>
          <Texto category={'h5'}>Reuse this</Texto>
          <Texto className={'text-14'} appearance={'medium'}>
            Save this configuration as a preset so next time is one tap.
          </Texto>
          {saved ? (
            <BBDTag color={'success'}>Saved as preset</BBDTag>
          ) : (
            <Vertical style={{ maxWidth: 380, gap: 4 }}>
              <Horizontal verticalCenter style={{ gap: 8 }}>
                <Input
                  placeholder={'Preset name'}
                  status={error ? 'error' : undefined}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (error) setError(undefined)
                  }}
                  onPressEnter={handleSave}
                  style={{ maxWidth: 260 }}
                />
                <GraviButton appearance='outline' buttonText={'Save as preset'} onClick={handleSave} />
              </Horizontal>
              {error && (
                <Texto appearance={'error'} className={'text-14'}>
                  {error}
                </Texto>
              )}
            </Vertical>
          )}
        </Vertical>
      )}

      <Horizontal justifyContent='center' className={'pb-4'} style={{ gap: 8 }}>
        <GraviButton appearance='outline' buttonText={'View offers'} onClick={onViewOffers} />
        <GraviButton theme1 buttonText={'New offer'} onClick={onNewOffer} />
      </Horizontal>
    </Vertical>
  )
}
