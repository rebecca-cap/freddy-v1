// Generic bulk cell editor: filter the selected parent rows by one of their
// attributes, then apply a chosen value. The editor emits each matched parent
// row via `onMatched`; the host's `updateEP` decides what to do with them.
//
// Renders three selects inside the GraviGrid bulk drawer:
//   Match by → Values → Set value to → (Confirm fires updateEP)

import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
// eslint-disable-next-line import/no-unresolved
import { BulkCellEditorHandle } from '@gravitate-js/excalibrr/dist/components/GraviGrid/index.types'
import { Select } from 'antd'
import React, { CSSProperties, forwardRef, useEffect, useImperativeHandle, useState } from 'react'

export type BulkFilteredChildrenEditorParams<TParent = any, TValue = any> = {
  // Injected by GraviGrid at render time; optional so consumers don't have
  // to declare it in their column defs.
  refreshBulkDrawerUI?: () => void

  // Parent-row attributes the user can filter by. `key` is the row field
  // name; `label` is the dropdown text.
  dimensions: Array<{ key: string; label: string }>

  // Multi-select options for the chosen dimension. Consumers typically
  // dedupe distinct values of row[dimension] across selectedRows.
  getValueOptions: (dimension: string) => Array<{ value: string; label: string }>

  // Options for the "new value" select.
  valueOptions: Array<{ value: TValue; label: string }>

  // Fires once per matching parent row inside getChanges with the chosen value.
  onMatched?: (parentRow: TParent, newValue: TValue) => void

  matchByLabel?: string
  matchValuesLabel?: string
  valueLabel?: string
  matchByPlaceholder?: string
  matchValuesPlaceholder?: string
  valuePlaceholder?: string

  className?: string
  style?: CSSProperties
}

// Sentinel for "no value picked" — `false` / `0` / `''` are valid picks.
const UNSET = Symbol('BulkFilteredChildrenEditor:unset')

export const BulkFilteredChildrenEditor = forwardRef<BulkCellEditorHandle<any>, BulkFilteredChildrenEditorParams>(
  (props, ref) => {
    const [matchBy, setMatchBy] = useState<string | undefined>(undefined)
    const [matchValues, setMatchValues] = useState<string[]>([])
    const [newValue, setNewValue] = useState<unknown>(UNSET)

    const dimensionOptions = props.dimensions.map((d) => ({ value: d.key, label: d.label }))
    const valueDropdownOptions = props.valueOptions.map((o) => ({ value: o.value, label: o.label }))
    const matchValueOptions = matchBy ? props.getValueOptions(matchBy) : []

    useImperativeHandle(ref, () => ({
      getChanges: (row: any) => {
        if (!matchBy || matchValues.length === 0 || newValue === UNSET) return {}
        // Stringify both sides so equality survives mixed numeric/string types.
        const rowValue = String(row?.[matchBy])
        if (matchValues.includes(rowValue)) {
          props.onMatched?.(row, newValue)
        }
        // No field changes — consumer collects matches via onMatched.
        return {}
      },
      isChangeReady: () => !!matchBy && matchValues.length > 0 && newValue !== UNSET,
    }))

    // Push isChangeReady() updates to the drawer so Confirm re-enables.
    useEffect(() => {
      props.refreshBulkDrawerUI?.()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchBy, matchValues, newValue])

    const labelStyle: CSSProperties = { fontSize: 12, color: 'var(--theme-text-secondary, #666)' }

    return (
      <Horizontal gap={12} className={props.className} style={{ alignItems: 'flex-end', ...props.style }}>
        <Vertical gap={4} style={{ minWidth: 160 }}>
          <span style={labelStyle}>{props.matchByLabel ?? 'Match by'}</span>
          <Select
            placeholder={props.matchByPlaceholder ?? 'Select dimension'}
            value={matchBy}
            onChange={(v) => {
              setMatchBy(v)
              setMatchValues([])
            }}
            options={dimensionOptions}
            style={{ width: '100%' }}
          />
        </Vertical>

        <Vertical gap={4} style={{ minWidth: 240, flex: 1 }}>
          <span style={labelStyle}>{props.matchValuesLabel ?? 'Values'}</span>
          <Select
            mode='multiple'
            disabled={!matchBy}
            placeholder={props.matchValuesPlaceholder ?? 'Select values'}
            value={matchValues}
            onChange={setMatchValues}
            options={matchValueOptions}
            showSearch
            optionFilterProp='label'
            maxTagCount='responsive'
            style={{ width: '100%' }}
          />
        </Vertical>

        <Vertical gap={4} style={{ minWidth: 160 }}>
          <span style={labelStyle}>{props.valueLabel ?? 'Set value to'}</span>
          <Select
            placeholder={props.valuePlaceholder ?? 'Select value'}
            value={newValue === UNSET ? undefined : (newValue as any)}
            onChange={(v) => setNewValue(v)}
            options={valueDropdownOptions}
            style={{ width: '100%' }}
          />
        </Vertical>
      </Horizontal>
    )
  }
)

BulkFilteredChildrenEditor.displayName = 'BulkFilteredChildrenEditor'
