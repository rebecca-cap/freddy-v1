import { DataItem } from '@components/DataDisplay/DataItem'
import { Form, DatePicker } from 'antd'
import type { BaseFieldProps, Filter } from '../../types'

export function DateField<F extends Filter>({
  title,
  filter_column,
}: BaseFieldProps<F>) {
  const formatter = (date?: number | Date | undefined) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }).format(date)
    } catch (e) {
      console.error('Invalid Date')
    }
  }
  return (
    <DataItem key={title} label={title} extraClass='mr-4'>
      <Form.Item key={title} name={filter_column as string}>
        {/* @ts-ignore TODO: Need to see if this is formatting dates correctly since the callback is returning a moment, not a date */}
        <DatePicker format={formatter} style={{ width: 200 }} />
      </Form.Item>
    </DataItem>
  )
}
