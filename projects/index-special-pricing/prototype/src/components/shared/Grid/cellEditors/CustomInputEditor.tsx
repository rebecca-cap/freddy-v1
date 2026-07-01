import { ICellEditorParams } from 'ag-grid-community'
import { Input } from 'antd'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
type CustomInputEditorProps = ICellEditorParams & {
  initialValue?: string
  maxLength?: number
}
export const CustomInputEditor = forwardRef<any, CustomInputEditorProps>((props, ref) => {
  const [value, setValue] = useState<string | undefined>(
    props.initialValue ? props?.initialValue : props.value || undefined
  )
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
    <Input
      ref={refInput}
      value={value}
      onChange={(e) => {
        setValue(e?.target?.value)
      }}
      style={{ width: '100%', border: 'none' }}
      size='small'
      onBlur={handleBlur}
      autoFocus
      maxLength={props.maxLength}
      showCount
      allowClear
    />
  )
})
