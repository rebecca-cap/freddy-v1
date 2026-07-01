import type { MetadataListResponseItem } from '@api/globalTypes'
import { Vertical } from '@gravitate-js/excalibrr'
import { SectionHeader } from '@modules/Dashboard/SpecialOffers/Components/QuickCreate/Components/SectionHeader'
import { getDefaultStartTime } from '@modules/Dashboard/SpecialOffers/utils/Constants/TimingWindowConstants'
import { getTimezoneIana } from '@modules/Dashboard/SpecialOffers/utils/Utils/TimingWindowHelpers'
import dayjs from '@utils/dayjs'
import { Form, Select } from 'antd'
import type { FormInstance } from 'antd'

interface TimeframeQuickPickerProps {
  form: FormInstance
  validTimeZones?: MetadataListResponseItem[]
}

type QuickOption = { value: string; label: string; days?: number }

const QUICK_OPTIONS: QuickOption[] = [
  { value: 'now-1d', label: 'Visible now · ends in 24 hours', days: 1 },
  { value: 'now-3d', label: 'Visible now · ends in 3 days', days: 3 },
  { value: 'now-7d', label: 'Visible now · ends in 7 days', days: 7 },
  { value: 'custom', label: 'Custom — set windows below' },
]

/**
 * The "new dropdown" for Step 2: a one-tap timeframe that fills both reused windows
 * (visibility + pickup) so common cases skip the date pickers. "Custom" leaves the
 * windows below in control. Everything else in Step 2 is the existing timing UI.
 */
export function TimeframeQuickPicker({ form, validTimeZones }: TimeframeQuickPickerProps) {
  const choice = Form.useWatch('__TimeframeQuick', form) as string | undefined

  const applyChoice = (value: string) => {
    form.setFieldsValue({ __TimeframeQuick: value })
    const option = QUICK_OPTIONS.find((o) => o.value === value)
    if (!option || option.days == null) return

    const timezone = getTimezoneIana(form.getFieldValue('TimeZoneId'), validTimeZones)
    const start = getDefaultStartTime(timezone)
    const end = start.add(option.days, 'day')

    form.setFieldsValue({
      VisibilityStartNow: true,
      PickupStartNow: true,
      VisibilityWindowStartDate: start,
      VisibilityWindowStartTime: start,
      PickupWindowStartDate: start,
      PickupWindowStartTime: start,
      VisibilityWindowEndDate: end,
      VisibilityWindowEndTime: end,
      PickupWindowEndDate: dayjs(end),
      PickupWindowEndTime: dayjs(end),
    })
  }

  return (
    <Vertical className={'qc-section p-4'} style={{ gap: 16 }}>
      <SectionHeader
        title={'Quick timeframe'}
        subtitle={'Pick a common timeframe to set both windows in one tap, or choose Custom to set them yourself.'}
      />
      <Select
        style={{ maxWidth: 360 }}
        placeholder={'Choose a common timeframe…'}
        value={choice ?? undefined}
        onChange={applyChoice}
        options={QUICK_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        popupClassName={'qc-pop'}
      />
      <Form.Item name='__TimeframeQuick' hidden>
        <div />
      </Form.Item>
    </Vertical>
  )
}
