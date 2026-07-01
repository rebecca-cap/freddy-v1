import { Select } from 'antd'
import React, { useEffect, useMemo } from 'react'

export interface HierarchySelectorProps {
  value: number | null
  onChange: (value: number) => void
  hierarchies?: { Key: number; Name: string }[]
}

interface HierarchyOption {
  Key: number
  Name: string
}

export function HierarchySelector({ value, onChange, hierarchies }: HierarchySelectorProps) {
  const options = useMemo(() => {
    if (!hierarchies) return []
    return hierarchies
      .map((h: HierarchyOption) => ({
        value: h.Key,
        label: h.Name,
      }))
      .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
  }, [hierarchies])

  useEffect(() => {
    if (!value && options && options.length > 0) {
      onChange(options[0].value)
    }
  }, [options])
  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      placeholder='Select Hierarchy'
      value={value}
      onChange={onChange}
      options={options}
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
    />
  )
}
