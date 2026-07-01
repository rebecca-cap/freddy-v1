import { Form, Select } from 'antd'
import { DataItem } from '@components/DataDisplay/DataItem'
import type { BaseFieldProps, Filter } from '../../types'

export function BoolField<F extends Filter>({
  title,
  filter_column,
}: BaseFieldProps<F>) {
  return (
    <DataItem key={title} label={title} extraClass='mr-4'>
      <Form.Item key={title} name={filter_column as string}>
        <Select allowClear style={{ width: 200 }}>
          <Select.Option value>Yes</Select.Option>
          <Select.Option value={false}>No</Select.Option>
        </Select>
      </Form.Item>
    </DataItem>
  )
}
