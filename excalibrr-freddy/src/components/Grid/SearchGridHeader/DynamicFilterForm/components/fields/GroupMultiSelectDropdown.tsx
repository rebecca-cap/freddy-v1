import { DataItem } from '@components/DataDisplay/DataItem'
import { Form, TreeSelect } from 'antd'
import { useState } from 'react'

import { BaseFieldProps, Filter } from '../../types'

type GroupMultiSelectOptionObject = {
  title: string
  value: string
  key: string
}

export type GroupMultiSelectDropdownProps<F extends Filter> =
  BaseFieldProps<F> & {
    options: {
      title: string
      options: GroupMultiSelectOptionObject[] | string[]
    }[]
    filter_column: string
    filters: F
  }

export function GroupMultiSelectDropdown<F extends Filter>({
  title,
  options,
  filter_column,
  filters,
}: GroupMultiSelectDropdownProps<F>) {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    filters?.[filter_column] || []
  )

  const handleChange = (values: string[]) => {
    setSelectedValues(values)
  }

  return (
    <DataItem key={title} label={title} extraClass='mr-4'>
      <Form.Item key={title} name={filter_column}>
        <TreeSelect
          allowClear
          treeDefaultExpandAll
          placeholder={`Choose ${title}`}
          style={{ width: 200 }}
          treeCheckable
          onChange={handleChange}
          maxTagCount={1}
          maxTagPlaceholder={() => `${selectedValues.length} selected`}
          tagRender={selectedValues.length > 1 ? () => null as any : undefined}
          treeData={options.map((option) => ({
            title: option.title,
            value: option.title,
            key: option.title,
            children: option.options.map((o) => ({
              title: typeof o === 'string' ? o : o.title,
              value: typeof o === 'string' ? o : o.value,
              key: typeof o === 'string' ? o : o.key,
            })),
          }))}
        />
      </Form.Item>
    </DataItem>
  )
}

export function isGroupMultiSelectDropdownField<F extends Filter>(
  schema: BaseFieldProps<F>
): schema is BaseFieldProps<F> & GroupMultiSelectDropdownProps<F> {
  return schema.datatype === 'group_multiselect_dropdown'
}
