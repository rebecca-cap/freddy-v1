import { Select } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

interface IProps {
  value: any
  options: any[]
}

export const MultiSelectEditor: React.FC<IProps> = forwardRef((props, ref) => {
  const refInput = useRef(null)
  const [selected, setSelected] = useState([])

  useEffect(() => {
    // focus on the input
    refInput.current.focus()
  }, [])

  const handleSelectChange = (selected) => setSelected(selected)

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        return selected
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false
      },

      // Gets called once when editing is finished (eg if Enter is pressed).
      // If you return true, then the result of the edit will be ignored.
      isCancelAfterEnd() {
        return false
      },
    }
  })

  return (
    <Select
      ref={refInput}
      mode='multiple'
      style={{ width: '100%' }}
      placeholder='Please select'
      defaultValue={props.value?.map((v) => v.PriceTypeCvId)}
      onChange={handleSelectChange}
      options={props.options}
    />
  )
})
