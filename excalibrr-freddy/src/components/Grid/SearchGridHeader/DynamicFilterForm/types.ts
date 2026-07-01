export type FieldType =
  | 'bool'
  | 'datetime'
  | 'int_range'
  | 'percent_range'
  | 'dropdown'
  | 'group_dropdown'
  | 'multiselect'
  | 'daterangeslider'
  | 'group_multiselect_dropdown'

export type BaseFieldProps<F extends Filter> = {
  title: string
  filter_column: keyof F
  datatype: FieldType
}

export type Filter = Record<string, any>
