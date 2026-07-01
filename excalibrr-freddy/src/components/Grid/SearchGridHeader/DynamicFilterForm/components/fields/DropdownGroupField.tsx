import { DataItem } from '@components/DataDisplay/DataItem'
import { Form, Select } from 'antd'
import type { Filter, BaseFieldProps } from '../../types'
import { DropdownOptionObject } from './DropdownField'

export type DropdownGroupFieldProps<F extends Filter> = BaseFieldProps<F> & {
  options: (string | DropdownOptionObject)[]
}

export function DropdownGroupField<F extends Filter>({
  title,
  options,
  filter_column,
}: DropdownGroupFieldProps<F>) {
  const noDupes = Array.from(new Set(options))
  return (
    <DataItem key={title} label={title} extraClass='mr-4'>
      <Form.Item key={title} name={filter_column as string}>
        <Select allowClear showSearch style={{ width: 200 }}>
          {noDupes.map((g: any) => {
            const formattedName = g.name.toString().toUpperCase()
            const groupOptions = Array.from(new Set(g.options))
            return (
              <Select.OptGroup key={g.name} label={formattedName}>
                {groupOptions.map((o: any) => {
                  const formattedValue = o.toString().toUpperCase()
                  return (
                    <Select.Option key={o} value={formattedValue}>
                      {formattedValue}
                    </Select.Option>
                  )
                })}
              </Select.OptGroup>
            )
          })}
        </Select>
      </Form.Item>
    </DataItem>
  )
}
