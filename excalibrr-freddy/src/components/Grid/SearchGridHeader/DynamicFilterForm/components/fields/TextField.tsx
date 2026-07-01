import { DataItem } from '@components/DataDisplay/DataItem'
import { Form, Input } from 'antd'
import type { BaseFieldProps, Filter } from '../../types'

export function TextField<F extends Filter>({
  title,
  filter_column,
}: BaseFieldProps<F>) {
  return (
    <DataItem key={title} label={title} extraClass='mr-4'>
      <Form.Item key={title} name={filter_column as string}>
        <Input style={{ width: 200 }} />
      </Form.Item>
    </DataItem>
  )
}
