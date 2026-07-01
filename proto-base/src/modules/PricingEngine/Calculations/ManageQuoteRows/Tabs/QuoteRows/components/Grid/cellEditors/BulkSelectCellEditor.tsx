import { Horizontal } from '@gravitate-js/excalibrr'
import { ICellEditorParams } from 'ag-grid-community'
import { type SelectProps, Select } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

type AntOption = NonNullable<SelectProps['options']>[number]

export type SelectEditorParams = ICellEditorParams &
  SelectProps & {
    accessor: string
    placeholder: string
    options?: SelectProps['options']
    getChanges?: (value: string | undefined) => object
    refreshBulkDrawerUI: () => void
    allowNullValue?: boolean
    dedupeByValue?: boolean
  }

export const BulkSelectEditor: React.FC<SelectEditorParams> = forwardRef((props, ref) => {
  const [selectedValue, setSelectedValue] = useState<any>()
  const inputRef = useRef<any>(null)

  useImperativeHandle(ref, () => ({
    getChanges: props.getChanges ? () => props.getChanges(selectedValue) : () => ({ [props.accessor]: selectedValue }),
    isChangeReady: () =>
      props.allowNullValue ||
      !!selectedValue ||
      selectedValue === 0 ||
      (typeof selectedValue === 'boolean' && !selectedValue),
  }))

  useEffect(() => setSelectedValue(undefined), [props.accessor])
  useEffect(props.refreshBulkDrawerUI, [selectedValue])

  const finalOptions = useMemo(() => {
    const opts = (props.options ?? []) as AntOption[]
    if (!props.dedupeByValue) return opts

    const seen = new Set<string>()
    const out: AntOption[] = []
    for (const opt of opts) {
      const key = String((opt as any)?.value ?? '')
      // keep empty-key options too (don’t accidentally drop them)
      const dedupeKey = key === '' ? `__empty__${out.length}` : key
      if (seen.has(dedupeKey)) continue
      seen.add(dedupeKey)
      out.push(opt)
    }
    return out
  }, [props.options, props.dedupeByValue])

  return (
    <Horizontal flex={1} gap='1rem' verticalCenter justifyContent='flex-start'>
      <Select
        ref={inputRef}
        placeholder={props.placeholder}
        size='large'
        showSearch
        style={{ width: 200 }}
        value={selectedValue}
        onChange={(value) => setSelectedValue(value)}
        options={finalOptions}
        allowClear
        optionFilterProp='label'
      />
    </Horizontal>
  )
})
