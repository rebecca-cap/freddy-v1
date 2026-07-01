import { InputNumber } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

export const NumberEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(parseFloat(props.value))
  const refInput = useRef(null)

  useEffect(() => {
    // focus on the input
    refInput.current.focus()
  }, [])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        return refInput?.current?.valueAsNumber
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false
      },

      // Gets called once when editing is finished (eg if Enter is pressed).
      // If you return true, then the result of the edit will be ignored.
      isCancelAfterEnd() {
        return (
          refInput?.current?.valueAsNumber > props?.max ||
          refInput?.current?.valueAsNumber < 0 ||
          !refInput?.current?.value
        )
      },
    }
  })

  return (
    <InputNumber
      type='number'
      ref={refInput}
      value={value}
      onChange={setValue}
      style={{ width: '100%', border: 'none' }}
      size='small'
      controls={false}
    />
  )
})
