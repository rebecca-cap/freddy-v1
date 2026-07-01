import { RangePicker } from '@components/Controls/DateTime/DateRangePicker'
import { DataItem } from '@components/DataDisplay/DataItem'
import { Form } from 'antd'
import { Moment } from 'moment'
import type { Filter, BaseFieldProps } from '../../types'

export type DateRangeFieldProps<F extends Filter> = BaseFieldProps<F> & {
  filters: F
  setFilters?: (filters: F) => void
}

export function DateRangeField<F extends Filter>({
  title,
  filter_column,
  filters,
  setFilters,
}: DateRangeFieldProps<F>) {
  const handleChange = (newDates: [Date | undefined, Date | undefined]) => {
    if (setFilters) {
      setFilters({ ...filters, [filter_column]: newDates })
    }
  }

  return (
    <DataItem key={title} label={title} extraClass='mr-4'>
      <Form.Item key={title} name={filter_column as string}>
        <RangePicker
          dates={filters?.[filter_column] as Moment[] | Date[] | undefined}
          inputKey={filter_column as string}
          onChange={handleChange}
        />
      </Form.Item>
    </DataItem>
  )
}
