import { Segmented, Select } from 'antd'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react'

export type BulkMultiSelectMode = 'increment' | 'decrement' | 'replace'

type BulkCellEditorHandle<T> = {
  getChanges: (row: T) => Partial<T>
  isChangeReady: () => boolean
}

const SELECT_ALL_KEY = '__select_all__'
const DESELECT_ALL_KEY = '__deselect_all__'

const STORAGE_KEY = 'bulkMultiSelectMode'
const VALID_MODES: BulkMultiSelectMode[] = ['increment', 'decrement', 'replace']

const getStoredMode = (defaultMode: BulkMultiSelectMode): BulkMultiSelectMode => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && VALID_MODES.includes(stored as BulkMultiSelectMode)) {
    return stored as BulkMultiSelectMode
  }
  return defaultMode
}

type BulkMultiSelectEditorParams<T> = {
  propKey: keyof T
  options: { value: any; label: string }[]
  refreshBulkDrawerUI: () => void
  defaultMode?: BulkMultiSelectMode
}

export const BulkMultiSelectEditor = forwardRef<BulkCellEditorHandle<any>, BulkMultiSelectEditorParams<any>>(
  (props, ref) => {
    const [mode, setMode] = useState<BulkMultiSelectMode>(() => getStoredMode(props.defaultMode ?? 'increment'))
    const [selectedValues, setSelectedValues] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    const filteredOptions = useMemo(() => {
      if (!searchQuery) return props.options
      return props.options.filter((option) =>
        (option?.label ?? '').toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    }, [props.options, searchQuery])

    const handleChange = useCallback(
      (newSelection: any[]) => {
        if (newSelection.includes(SELECT_ALL_KEY)) {
          const allFilteredValues = filteredOptions.map((option) => option.value)
          const mergedValues = [...new Set([...selectedValues, ...allFilteredValues])]
          setSelectedValues(mergedValues)
          setSearchQuery('')
          return
        }

        if (newSelection.includes(DESELECT_ALL_KEY)) {
          const allFilteredValues = filteredOptions.map((option) => option.value)
          const filteredOut = selectedValues.filter((val) => !allFilteredValues.includes(val))
          setSelectedValues(filteredOut)
          setSearchQuery('')
          return
        }

        setSelectedValues(newSelection)
      },
      [filteredOptions, selectedValues]
    )

    useImperativeHandle(ref, () => ({
      getChanges: (row) => {
        const currentValues: any[] = row?.[props.propKey] ?? []
        let newValues: any[]

        switch (mode) {
          case 'increment':
            // Add selected to existing (deduplicated)
            newValues = [...new Set([...currentValues, ...selectedValues])]
            break
          case 'decrement':
            // Remove selected from existing
            newValues = currentValues.filter((v) => !selectedValues.includes(v))
            break
          case 'replace':
          default:
            // Replace with selected
            newValues = selectedValues
            break
        }

        return { [props.propKey]: newValues }
      },
      isChangeReady: () => selectedValues.length > 0,
    }))

    useEffect(props.refreshBulkDrawerUI, [mode, selectedValues])

    useEffect(() => {
      localStorage.setItem(STORAGE_KEY, mode)
    }, [mode])

    const getPlaceholder = () => {
      switch (mode) {
        case 'increment':
          return 'Select values to add'
        case 'decrement':
          return 'Select values to remove'
        case 'replace':
          return 'Select values to replace with'
        default:
          return 'Select values'
      }
    }

    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Select
          mode='multiple'
          placeholder={getPlaceholder()}
          value={selectedValues}
          onChange={handleChange}
          showSearch
          onSearch={setSearchQuery}
          filterOption={() => true}
          style={{ minWidth: 200, flex: 1 }}
          allowClear
        >
          {filteredOptions.length > 0 && (
            <>
              <Select.Option key={SELECT_ALL_KEY} value={SELECT_ALL_KEY}>
                <strong>Select All ({filteredOptions.length})</strong>
              </Select.Option>
              <Select.Option key={DESELECT_ALL_KEY} value={DESELECT_ALL_KEY}>
                <strong>Deselect All ({filteredOptions.length})</strong>
              </Select.Option>
            </>
          )}
          {filteredOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
        <Segmented
          options={[
            { value: 'increment', label: 'Add' },
            { value: 'decrement', label: 'Remove' },
            { value: 'replace', label: 'Replace' },
          ]}
          value={mode}
          onChange={(val) => setMode(val as BulkMultiSelectMode)}
        />
      </div>
    )
  }
)

BulkMultiSelectEditor.displayName = 'BulkMultiSelectEditor'
