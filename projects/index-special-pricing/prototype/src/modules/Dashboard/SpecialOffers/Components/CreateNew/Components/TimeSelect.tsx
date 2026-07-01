import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import dayjs from '@utils/dayjs'
import type { Dayjs } from '@utils/dayjs'
import { Select } from 'antd'
import { useState } from 'react'

/** All times of day in 15-minute steps: value 'HH:mm', label 12h e.g. '6:15 PM'. */
const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const h = Math.floor(i / 4)
  const m = (i % 4) * 15
  const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  return { value, label: dayjs().hour(h).minute(m).format('h:mm A') }
})

interface TimeSelectProps {
  /** Injected by Form.Item — the time-of-day as a Dayjs. */
  value?: Dayjs
  onChange?: (value: Dayjs) => void
  disabled?: boolean
  popupClassName?: string
  /** Sticky quick-select buttons shown atop the list (Now / +1h / 6:00 PM …). */
  quickStarts?: { label: string; value: () => Dayjs }[]
}

/**
 * Replaces antd's hour/minute/AM-PM column TimePicker with a single dropdown: quick-selects on top
 * + a flat 15-minute list (per the round-3 wireframe). Selecting a list item keeps the field's
 * existing date and just sets the time-of-day.
 */
export function TimeSelect({ value, onChange, disabled, popupClassName, quickStarts }: TimeSelectProps) {
  const [open, setOpen] = useState(false)

  const handlePick = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number)
    const base = value ?? dayjs()
    onChange?.(base.hour(h).minute(m).second(0).millisecond(0))
    setOpen(false)
  }

  return (
    <Select
      style={{ minWidth: 140 }}
      placeholder={'Select time'}
      disabled={disabled}
      showSearch
      optionFilterProp={'label'}
      value={value ? value.format('HH:mm') : undefined}
      open={open}
      onDropdownVisibleChange={setOpen}
      onChange={handlePick}
      options={TIME_OPTIONS}
      listHeight={280}
      popupClassName={popupClassName}
      dropdownRender={(menu) => (
        <>
          {quickStarts && quickStarts.length > 0 && (
            <Horizontal
              verticalCenter
              style={{ gap: 6, flexWrap: 'wrap', padding: '6px 8px', borderBottom: '1px solid var(--bg-3)' }}
            >
              {quickStarts.map((q) => (
                <GraviButton
                  key={q.label}
                  size={'small'}
                  buttonText={q.label}
                  onClick={() => {
                    onChange?.(q.value())
                    setOpen(false)
                  }}
                />
              ))}
            </Horizontal>
          )}
          {menu}
        </>
      )}
    />
  )
}
