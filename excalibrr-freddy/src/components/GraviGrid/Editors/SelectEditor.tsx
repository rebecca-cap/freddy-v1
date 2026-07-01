/* eslint-disable react/display-name */
import { Select, Tag } from 'antd'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Horizontal } from '../../Layout/Horizontal'

const { Option } = Select

interface IProps {
  defaultValueFormatter?: (value: any) => string[]
  options: string[]
  placeholder?: string
  mode: 'tags' | 'multiple'
  value: any
}

export const SelectEditor: React.FC<IProps> = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)
  const refInput = useRef(null)

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

  const handleChange = (value: 'yes' | 'no' | unknown) => {
    if (value === 'yes') {
      value = true
    } else if (value === 'no') {
      value = false
    } else {
      setValue(value)
    }
  }

  return (
    <Horizontal alignItems='center'>
      <Select
        style={{ minWidth: 220, maxWidth: 440 }}
        placeholder={props.placeholder}
        mode={props.mode}
        allowClear
        onChange={(value) => handleChange(value)}
        defaultOpen
        // @ts-ignore tagRender is expecting `() => <Tag />` not `<Tag />`
        tagRender={<Tag closable />}
        ref={refInput}
        defaultValue={
          props.defaultValueFormatter &&
          typeof props.defaultValueFormatter === 'function'
            ? props.defaultValueFormatter(value)
            : value
        }
        autoFocus
        onClear={() => setValue([])}
        placement='bottomRight'
      >
        {props.options &&
          props.options.map((v) => (
            <Option key={v} value={v}>
              {v}
            </Option>
          ))}
      </Select>
    </Horizontal>
  )
})
