/* eslint-disable react/display-name */
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Switch } from 'antd'
import { Horizontal } from '../../Layout/Horizontal'
import { ICellEditorParams } from 'ag-grid-community'

export const SwitchEditor = forwardRef(
  (props: ICellEditorParams & { placeholder?: string }, ref) => {
    const [value, setValue] = useState<boolean>(props.value)

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
      <Horizontal justifyContent='center'>
        <Switch
          // @ts-ignore - placeholder isn't a prop and this is unused
          placeholder={props.placeholder}
          onChange={(value) => setValue(value)}
          defaultChecked={value}
        />
      </Horizontal>
    )
  }
)
