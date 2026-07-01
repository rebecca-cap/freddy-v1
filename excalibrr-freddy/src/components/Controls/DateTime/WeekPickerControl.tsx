// ts-nocheck

import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, DatePicker } from 'antd'
import moment, { Moment } from 'moment'
import { Fragment } from 'react'

type Props = {
  filters: any
  setFilters: (filters: any) => void
}

/**
 * @deprecated
 * Do not use this component. It has been flagged as 'unused' and will be removed in the future.
 */
export const WeekPickerControl: React.FC<Props> = ({ filters, setFilters }) => {
  const nextWeek = () => {
    onWeekChange(
      null,
      moment(filters.start_date).add(1, 'w').format('YYYY-MM-DD')
    )
  }
  const prevWeek = () => {
    onWeekChange(
      null,
      moment(filters.start_date).subtract(1, 'w').format('YYYY-MM-DD')
    )
  }
  const onWeekChange = (date: Moment | null, dateString: string) => {
    var copy = { ...filters }
    var weekSpan = SetDriverResourceWeekSpan(dateString)
    copy.start_date = weekSpan.start_date
    copy.end_date = weekSpan.end_date
    setFilters(copy)
  }

  const dateFormat = 'MM/DD/YYYY'

  return (
    <Fragment>
      <Button icon={<LeftOutlined onClick={() => prevWeek()} />} />
      <DatePicker
        value={moment(filters.start_date)}
        format={dateFormat}
        onChange={onWeekChange}
        className='ml-2 mr-2'
        picker='week'
        allowClear={false}
      />
      <Button icon={<RightOutlined onClick={() => nextWeek()} />} />
    </Fragment>
  )
}

function SetDriverResourceWeekSpan(dateString: string) {
  let weekSpan = {
    start_date: null,
    end_date: null,
  } as {
    start_date: string | null
    end_date: string | null
  }

  const startDate = moment.utc(dateString)

  weekSpan.start_date = startDate
    .startOf('week')
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .format('YYYY-MM-DDTHH:mm:ss')

  weekSpan.end_date = startDate
    .endOf('week')
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .format('YYYY-MM-DDTHH:mm:ss')

  return weekSpan
}
