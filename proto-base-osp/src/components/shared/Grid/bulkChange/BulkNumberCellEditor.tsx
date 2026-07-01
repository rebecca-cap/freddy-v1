import { Horizontal } from '@gravitate-js/excalibrr'
// eslint-disable-next-line import/no-unresolved
import { BulkCellEditorHandle } from '@gravitate-js/excalibrr/dist/components/GraviGrid/index.types'
import { InputNumber } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

export type BulkNumberCellEditorProps<T = any> = {
  field: keyof T | string
  selectedRows: T[]
  refreshBulkDrawerUI: () => void

  min?: number
  max?: number
  step?: number
  precision?: number
  allowZero?: boolean

  className?: string
  style?: React.CSSProperties
  inputClassName?: string
  inputStyle?: React.CSSProperties
  placeholder?: string

  canEditRow?: (row: T) => boolean
  showControls?: boolean
  size?: 'small' | 'middle' | 'large'

  getChanges?: (val: number | null, row: T) => Partial<T>
}

export const BulkNumberCellEditor = forwardRef<BulkCellEditorHandle<any>, BulkNumberCellEditorProps<any>>(
  (props, ref) => {
    const [val, setVal] = useState<number | null>(null)

    useImperativeHandle(ref, () => ({
      getChanges: (row: any) => {
        if (props.getChanges) return props.getChanges(val, row)
        if (val === null) return {}
        return { [props.field as string]: val }
      },
      isChangeReady: () => props.getChanges ? true : val !== null,
    }))

    useEffect(props.refreshBulkDrawerUI, [val])

    const clamp = (n: number) => {
      let v = n
      if (typeof props.min === 'number') v = Math.max(props.min, v)
      if (typeof props.max === 'number') v = Math.min(props.max, v)
      return v
    }

    const handleChange = (n: number | null) => {
      if (n == null) {
        setVal(null)
        return
      }
      setVal(clamp(n))
    }

    return (
      <Horizontal verticalCenter className={props.className} style={props.style}>
        <InputNumber
          value={val}
          min={props.min}
          max={props.max}
          step={props.step || 1}
          precision={props.precision}
          placeholder={props.placeholder || 'Enter value'}
          size={props.size || 'middle'}
          controls={props.showControls}
          className={props.inputClassName}
          style={{ width: '260px', ...(props.inputStyle ?? {}) }}
          onChange={handleChange}
        />
      </Horizontal>
    )
  }
)

BulkNumberCellEditor.displayName = 'BulkNumberCellEditor'
