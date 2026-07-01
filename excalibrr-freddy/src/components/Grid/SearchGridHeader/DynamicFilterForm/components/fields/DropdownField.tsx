import { DataItem } from '@components/DataDisplay/DataItem'
import { Form, Select } from 'antd'
import type { BaseFieldProps, Filter } from '../../types'
import { isKeyValueArray, kvArrSearch, stringArrSearch } from '../../util'

export type DropdownOptionObject = { value: string; text: string }

export type DropdownFieldProps<F extends Filter> = BaseFieldProps<F> & {
  options: string[] | DropdownOptionObject[]
  customFilterOption?: (input: string, option: any) => boolean
}

export function DropdownField<F extends Filter>({
  title,
  options,
  filter_column,
  customFilterOption,
}: DropdownFieldProps<F>) {
  const noDupes = isKeyValueArray(options)
    ? Array.from(new Set(options.filter((option) => !!option)))
    : Array.from(new Set(options.filter((option) => !!option)))

  const filterOption =
    customFilterOption ||
    (isKeyValueArray(noDupes) ? stringArrSearch : kvArrSearch)

  return (
    <DataItem key={title} label={title} extraClass='mr-4'>
      <Form.Item key={title} name={filter_column as string}>
        <Select
          allowClear
          showSearch
          style={{ width: 200 }}
          // TODO: Try and get filterOption typing to work correctly.
          // @ts-ignore
          filterOption={filterOption}
        >
          {isKeyValueArray(noDupes)
            ? noDupes.map((option, i) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.text}
                </Select.Option>
              ))
            : noDupes.map((optionString, i) => (
                <Select.Option key={optionString} value={optionString}>
                  {optionString}
                </Select.Option>
              ))}
        </Select>
      </Form.Item>
    </DataItem>
  )
}
