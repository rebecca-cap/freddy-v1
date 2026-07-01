import { Select } from 'antd'
import moment from 'moment/moment'
import React from 'react'

const dateSelectOptions = [
  {
    value: 0,
    text: 'Previous Day',
    FromDate: moment().subtract('1', 'day').startOf('day').toDate(),
    ToDate: moment().subtract('1', 'day').startOf('day').toDate(),
  },
  {
    value: 7,
    text: 'Past 1 Week',
    FromDate: moment().subtract('7', 'days').endOf('day').toDate(),
    ToDate: moment().subtract('1', 'day').startOf('day').toDate(),
  },
  {
    value: 14,
    text: 'Past 2 Weeks',
    FromDate: moment().subtract('14', 'days').endOf('day').toDate(),
    ToDate: moment().subtract('1', 'day').startOf('day').toDate(),
  },
  {
    value: 21,
    text: 'Past 3 Weeks',
    FromDate: moment().subtract('21', 'days').endOf('day').toDate(),
    ToDate: moment().subtract('1', 'day').startOf('day').toDate(),
  },
]

interface DateFilterSelectionProps {
  analyticWeekFilter: any
  setAnalyticWeekFilter: (value: any) => void
}

export const DateFilterDropdown: React.FC<DateFilterSelectionProps> = ({
  analyticWeekFilter,
  setAnalyticWeekFilter,
}) => (
  <Select
    style={{ width: 200 }}
    defaultValue={analyticWeekFilter?.value}
    onChange={(value) => {
      const selectedOption = dateSelectOptions.find((o) => o.value === value)
      if (selectedOption) setAnalyticWeekFilter(selectedOption)
    }}
  >
    {dateSelectOptions.map((option) => (
      <Select.Option key={option.value} value={option.value}>
        {option.text}
      </Select.Option>
    ))}
  </Select>
)
