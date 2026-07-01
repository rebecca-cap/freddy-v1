import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, DatePicker } from 'antd'
import type { Moment } from 'moment'
import moment from 'moment'

const fixDate = (date: Date, days: number) => {
  const myDate = moment(date)
  myDate.add(days, 'd')
  return myDate
}

type DayPickerControlProps = {
  startDate: Date
  onChange: (date: Moment | null, dateString: string) => void
}

/**
 *
 * @deprecated
 * Do not use this component. It has been flagged as 'unused' and will be removed in the future.
 */
export const DayPickerControl: React.FC<DayPickerControlProps> = ({
  startDate,
  onChange,
}) => {
  const nextWeek = () => {
    const myDate = fixDate(startDate, 1)
    onChange(null, myDate.toISOString())
  }

  const prevWeek = () => {
    const myDate = fixDate(startDate, -1)
    onChange(null, myDate.toISOString())
  }

  return (
    <>
      <Button icon={<LeftOutlined onClick={() => prevWeek()} />} />
      <DatePicker
        defaultValue={moment(startDate)}
        format='MM/DD/YYYY'
        onChange={onChange}
        className='ml-2 mr-2'
        allowClear={false}
      />
      <Button icon={<RightOutlined onClick={() => nextWeek()} />} />
    </>
  )
}
