// @ts-nocheck
import { Fragment, useState } from 'react'
import { Button, Spin } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import moment from 'moment'

const fixDate = (date: any, days: number) => {
  const myDate = moment(date).utc()
  myDate.add(days, 'd')
  return myDate
}

type Props = {
  startDate: string
  weekCount: number
  onChange: (date: moment.Moment | null, dateString: string) => void
}

/**
 * @deprecated
 * Do not use this component. It has been flagged as 'unused' and will be removed in the future.
 */
export const PayrollPickerControl: React.FC<Props> = ({
  startDate,
  weekCount,
  onChange,
}) => {
  const [showingSpin, setShowingSpin] = useState(true)
  const days = 7 * weekCount

  window.setTimeout(() => {
    setShowingSpin(false)
  }, 500)

  const nextWeek = () => {
    const myDate = fixDate(startDate, days)
    onChange(null, myDate.toISOString())
  }

  const prevWeek = () => {
    const myDate = fixDate(startDate, days * -1)
    onChange(null, myDate.toISOString())
  }

  return (
    <Fragment>
      <Button icon={<LeftOutlined onClick={() => prevWeek()} />} />
      <b className='payroll-start-date flex justify-center'>
        {showingSpin || !startDate ? (
          <Spin />
        ) : (
          moment.utc(startDate).format('MM/DD/YYYY')
        )}
      </b>
      <Button icon={<RightOutlined onClick={() => nextWeek()} />} />
    </Fragment>
  )
}
