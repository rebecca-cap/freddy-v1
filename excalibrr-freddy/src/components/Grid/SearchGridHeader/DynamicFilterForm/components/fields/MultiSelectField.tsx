import { DataItem } from '@components/DataDisplay/DataItem'
import { Form, Select } from 'antd'
import { useMemo, useState } from 'react'
import type { BaseFieldProps, Filter } from '../../types'

export type MultiSelectOptionObject = {
  value: string
  label: string
  default?: boolean
}

type MultiSelectFilterOptions = {
  searchable?: boolean
  hide_selected?: boolean
}

const multiSelectFilterDefaults = {
  searchable: true,
  hide_selected: true,
}

export type MultiSelectDropdownFieldProps<F extends Filter> =
  BaseFieldProps<F> & {
    options: MultiSelectOptionObject[]
    filter_options: MultiSelectFilterOptions
    filters: F
  }

export function MultiSelectDropdownField<F extends Filter>({
  title,
  options,
  filter_options,
  filter_column,
  filters,
}: MultiSelectDropdownFieldProps<F>) {
  const filterOptions = { ...multiSelectFilterDefaults, ...filter_options }
  const [searchTerm, setSearchTerm] = useState('')
  const noDupes = Array.from(new Set(options.filter((option) => !!option)))

  const [selectedValues, setSelectedValues] = useState<string[]>(
    filters?.[filter_column] || []
  )

  const handleChange = (values: string[]) => {
    setSelectedValues(values)
  }

  // Only filter options when searchable is true
  const filteredOptions = useMemo(() => {
    return noDupes.filter((option) =>
      option.label?.toLowerCase().includes(searchTerm?.toLowerCase())
    )
  }, [searchTerm, noDupes])

  return (
    <DataItem key={title} label={title} extraClass='mr-4'>
      <Form.Item key={title} name={filter_column as string}>
        <Select
          mode='multiple'
          style={{ width: 200 }}
          showSearch={filterOptions.searchable}
          placeholder={`Choose ${title}`}
          onSearch={filterOptions.searchable ? setSearchTerm : undefined}
          tagRender={selectedValues.length > 1 ? () => null as any : undefined}
          maxTagCount={1}
          maxTagPlaceholder={() => `${selectedValues.length} selected`}
          allowClear
          virtual={true}
          options={filteredOptions}
          onChange={handleChange}
        />
      </Form.Item>
    </DataItem>
  )
}
