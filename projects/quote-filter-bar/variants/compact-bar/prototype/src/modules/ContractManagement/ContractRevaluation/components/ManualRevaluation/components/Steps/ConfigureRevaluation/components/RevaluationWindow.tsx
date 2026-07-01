import { dateFormat } from '@components/TheArmory/helpers'
import { Horizontal, NotificationMessage, Texto } from '@gravitate-js/excalibrr'
import { DatePicker, Form, FormInstance } from 'antd'
import moment, { Moment } from 'moment'

const { RangePicker } = DatePicker

interface RevaluationWindowProps {
  form: FormInstance
  contractsDateFilter: [moment.Moment, moment.Moment] | null
}

export function RevaluationWindow({ form }: RevaluationWindowProps) {
  const onRangeChange = (dates: [Moment | null, Moment | null] | null, dateStrings: [string, string]) => {
    if (!dates || dates.length !== 2) return

    const [start, end] = dates

    const from = moment.isMoment(start) ? start : moment(start)
    const to = moment.isMoment(end) ? end : moment(end)

    if (to.diff(from, 'days') > 6) {
      NotificationMessage('Error', 'You can only select up to 7 days.')

      const fallback: [moment.Moment, moment.Moment] = [
        moment().subtract(6, 'days').startOf('day'),
        moment().endOf('day'),
      ]
      form.setFieldsValue({ EffectiveDates: fallback })
      return
    }

    form.setFieldsValue({ EffectiveDates: [from.startOf('day'), to.endOf('day')] })
  }

  return (
    <>
      <Texto category='h4'>Revaluation Window</Texto>
      <Texto category='p2' className='mb-2'>
        Select the date range for the revaluation
      </Texto>
      <Horizontal className={'mb-4'} style={{ gap: 25, width: '50%' }}>
        <Form.Item name='EffectiveDates' hasFeedback rules={[{ required: true, message: 'Please select dates' }]}>
          <RangePicker
            onChange={onRangeChange}
            disabledDate={(current) => current && current > moment().endOf('day')}
            format={dateFormat.DATE_SLASH}
          />
        </Form.Item>
      </Horizontal>
    </>
  )
}
