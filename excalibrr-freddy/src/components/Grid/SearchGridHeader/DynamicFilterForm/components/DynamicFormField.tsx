import { FormInstance } from 'antd'
import { type Filter, BaseFieldProps } from '../types'
import { BoolField } from './fields/BoolField'
import { DateField } from './fields/DateField'
import { DateRangeField } from './fields/DateRangeField'
import { DropdownField, DropdownFieldProps } from './fields/DropdownField'
import {
  DropdownGroupField,
  DropdownGroupFieldProps,
} from './fields/DropdownGroupField'
import {
  GroupMultiSelectDropdown,
  GroupMultiSelectDropdownProps,
} from './fields/GroupMultiSelectDropdown'
import {
  MultiSelectDropdownField,
  MultiSelectDropdownFieldProps,
} from './fields/MultiSelectField'
import { NumberRangeField } from './fields/NumberRangeField'
import { PercentRangeField } from './fields/PercentRangeField'
import { TextField } from './fields/TextField'

export type DynamicFieldProps<F extends Filter> = {
  param: BaseFieldProps<F>
  form: FormInstance
  filters: F
  setFilters?: (filters: F) => void
}

export function DynamicFormField<F extends Filter>({
  param,
  form,
  filters,
  setFilters,
}: DynamicFieldProps<F>) {
  switch (param.datatype) {
    case 'bool':
      return BoolField(param)
    case 'int_range':
      return NumberRangeField(param)
    case 'percent_range':
      return PercentRangeField({ ...param, form, filters, setFilters })
    case 'datetime':
      return DateField(param)
    case 'dropdown':
      return DropdownField(param as DropdownFieldProps<F>)
    case 'group_dropdown':
      return DropdownGroupField(param as DropdownGroupFieldProps<F>)
    case 'multiselect':
      return MultiSelectDropdownField({
        ...param,
        filters,
      } as MultiSelectDropdownFieldProps<F>)
    case 'group_multiselect_dropdown':
      return GroupMultiSelectDropdown({
        ...(param as GroupMultiSelectDropdownProps<F>),
        filters,
      })
    case 'daterangeslider':
      return DateRangeField({ ...param, filters, setFilters })
    default:
      return TextField(param)
  }
}
