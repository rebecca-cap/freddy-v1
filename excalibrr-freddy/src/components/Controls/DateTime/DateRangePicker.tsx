import { CalendarFilled } from '@ant-design/icons'
import type { DropdownProps } from 'antd'
import { Dropdown } from 'antd'
import classNames from 'classnames'
import moment, { Moment } from 'moment'
import { useMemo, useState } from 'react'
import {
  DateRangePicker,
  StaticRange,
  defaultStaticRanges,
} from 'react-date-range'

interface IProps {
  inputKey: string
  dates?: Moment[] | Date[]
  onChange: (dates: [Date | undefined, Date | undefined]) => void
  placement?: DropdownProps['placement']
  staticRanges?: StaticRange[]
}

export const RangePicker: React.FC<IProps> = ({
  dates,
  inputKey,
  onChange,
  placement,
  staticRanges,
}) => {
  const [open, setIsOpen] = useState(false)

  const isMomentArr = (arr: IProps['dates']): arr is Moment[] =>
    (arr as unknown[])?.every((m) => moment.isMoment(m))

  const normalizedDates = useMemo(
    () => (isMomentArr(dates) ? dates.map((d) => d.toDate()) : dates),
    [dates]
  )

  const isSet = useMemo(
    () =>
      normalizedDates?.length === 2 &&
      normalizedDates.every((d) => d instanceof Date),
    [normalizedDates]
  )

  const handleOpen = (flag: boolean) => setIsOpen(flag)

  const menu = useMemo(
    () => (
      <DateRangePicker
        onChange={(payload) =>
          onChange([payload[inputKey]?.startDate, payload[inputKey]?.endDate])
        }
        // @ts-ignore
        showSelectionPreview
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={[
          {
            startDate: isSet ? normalizedDates?.[0] : new Date(),
            endDate: isSet ? normalizedDates?.[1] : new Date(),
            key: inputKey,
          },
        ]}
        direction='horizontal'
        staticRanges={staticRanges || defaultStaticRanges}
      />
    ),
    [normalizedDates]
  )

  return (
    <Dropdown
      placement={placement ?? 'bottomLeft'}
      overlay={menu}
      onOpenChange={handleOpen}
      open={open}
    >
      <div
        className={classNames('date-range-select', { 'not-set': !isSet })}
        onClick={(e) => e.preventDefault()}
      >
        <CalendarFilled className='pr-3' />
        {isSet
          ? `${normalizedDates?.[0]?.toLocaleDateString()} - ${normalizedDates?.[1]?.toLocaleDateString()}`
          : 'Filter By Date'}
      </div>
    </Dropdown>
  )
}

export { defaultStaticRanges }
