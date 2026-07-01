import type { ICellEditorParams } from 'ag-grid-community'
import { InputNumber } from 'antd'
import type React from 'react'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

type NumberCellEditorProps = ICellEditorParams & {
  accessor?: string
  data: any
  min?: number
  max?: number
  allowZero?: boolean
  precision?: number
  onChange?: (value: number) => void
}
export const NumberCellEditor: React.FC<NumberCellEditorProps> = forwardRef((props, ref) => {
  const [value, setValue] = useState<number | undefined>(props.value ? parseFloat(props?.value) : undefined)
  const refInput = useRef(null)

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value
      },

      isCancelBeforeStart() {
        return false
      },

      isCancelAfterEnd() {
        return false
      },
    }
  })

  const handleBlur = () => {
    props?.api?.stopEditing()
  }

  return (
    <InputNumber
      ref={refInput}
      value={value}
      onChange={(newValue) => {
        const formattedValue = parseFloat(newValue)
        if (props.allowZero) {
          setValue(formattedValue ?? undefined)
        } else {
          setValue(formattedValue || undefined)
        }
      }}
      style={{ width: '100%', border: 'none' }}
      min={props.min}
      max={props.max}
      size='small'
      controls={false}
      onBlur={handleBlur}
      autoFocus
      precision={props.precision}
    />
  )
})

NumberCellEditor.displayName = 'NumberCellEditor'
