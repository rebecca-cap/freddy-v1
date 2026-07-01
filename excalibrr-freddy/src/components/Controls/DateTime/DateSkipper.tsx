import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, DatePicker } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'

import { Texto } from '../../DataDisplay/Texto/Texto'

type Props = {
  startDate: string
  onChange: (date: moment.Moment, dateString: string) => void
  daysToSkip: number
  format?: (date: moment.Moment) => string
}

export const DateSkipper: React.FC<Props> = ({
  startDate,
  onChange,
  daysToSkip,
  format,
}) => {
  const [selectedDate, setSelectedDate] = useState(moment(startDate))

  useEffect(() => {
    setSelectedDate(moment(startDate))
  }, [startDate])
  const increment = () => {
    const newDate = moment(startDate).add(daysToSkip, 'd')
    setSelectedDate(newDate)
    onChange(newDate, newDate.format('YYYY-MM-DD'))
  }
  const decrement = () => {
    const newDate = moment(startDate).subtract(daysToSkip, 'd')
    setSelectedDate(newDate)
    onChange(newDate, newDate.format('YYYY-MM-DD'))
  }
  const onDateChange = (date: moment.Moment | null, dateString: string) => {
    if (!date) return
    setSelectedDate(date)
    onChange(date, dateString)
  }

  const dateFormat = 'MM/DD/YYYY'
  return (
    <>
      <Button icon={<LeftOutlined onClick={() => decrement()} />} />
      {daysToSkip === 1 ? (
        <DatePicker
          value={selectedDate}
          format={format || dateFormat}
          disabled={daysToSkip !== 1}
          onChange={onDateChange}
          className='ml-2 mr-2'
          allowClear={false}
          style={{
            width: '105px',
          }}
        />
      ) : (
        <Texto
          category='h6'
          className='pt-1'
          align='center'
          style={{ width: 105 }}
          weight='bold'
        >
          {format
            ? format(moment(selectedDate))
            : moment(selectedDate).format(dateFormat)}
        </Texto>
      )}

      <Button icon={<RightOutlined onClick={() => increment()} />} />
    </>
  )
}
