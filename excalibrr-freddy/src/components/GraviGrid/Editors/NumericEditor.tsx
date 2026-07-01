import { ICellEditorParams } from 'ag-grid-community'
import { InputNumber } from 'antd'
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from 'react'

export const NumericEditor = forwardRef(
  (
    props: ICellEditorParams & {
      min?: number
      max?: number
      precision?: number
      step?: number
    },
    ref
  ) => {
    const [value, setValue] = useState(parseFloat(props.value))
    const refInput = useRef<HTMLInputElement>(null)
    const { min, max, precision, step } = props

    useEffect(() => {
      refInput?.current?.focus()
    }, [])

    useImperativeHandle(ref, () => {
      return {
        getValue() {
          return value
        },
        isPopup() {
          return true
        },

        isCancelBeforeStart() {
          return false
        },

        isCancelAfterEnd() {
          return false
        },
      }
    })

    return (
      <InputNumber
        min={min}
        max={max}
        precision={precision}
        step={step}
        ref={refInput}
        value={value}
        defaultValue={value}
        style={{ width: '100%' }}
        autoFocus
        onPressEnter={(e) => {
          // @ts-ignore - this probably doesn't work. The enter press event doesn't have a value
          setValue(e.target.value)
        }}
      />
    )
  }
)
