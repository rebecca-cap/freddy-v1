/* eslint-disable react/display-name */
import { PlusOutlined } from '@ant-design/icons'
import { ICellEditorParams } from 'ag-grid-community'
import { Button, Divider, Form, Input, Select, Tag } from 'antd'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

const { Option } = Select

export const CustValSelectEditor = forwardRef<any, ICellEditorParams>(
  (props, ref) => {
    const [value, setValue] = useState(props.value)

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
      <CustomValueSelect
        name='emails'
        width={300}
        options={value}
        placeholder='Add An Email For Counterparty'
        setValue={setValue}
        initialValue={value}
      />
    )
  }
)

type CustomValueSelectProps = {
  name: string
  initialValue: any
  width: number
  options: string[]
  placeholder: string
  setValue: (value: any) => void
}

export const CustomValueSelect: React.FC<CustomValueSelectProps> = ({
  name,
  initialValue,
  width,
  options = [],
  placeholder,
  setValue,
}) => {
  const [itemToAdd, setItemToAdd] = useState<string>()
  const [managedOptions, setManagedOptions] = useState([...options])
  const [emailValid, setEmailValid] = useState(false)
  const refInput = useRef(null)
  const createNewItem = (value: any) => {
    if (value === '') return null
    const optionsCopy = [...managedOptions]
    setItemToAdd(undefined)
    optionsCopy.push(itemToAdd!)
    setManagedOptions(optionsCopy)
    setValue(optionsCopy)
    return setEmailValid(false)
  }
  const checkAndChange = (value: string, fromEnter = false) => {
    function validateEmail(email: string) {
      const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/
      console.log('test', re.test(email))
      return re.test(email)
    }
    if (!validateEmail(value)) {
      return setItemToAdd(value)
    } else {
      setEmailValid(validateEmail(value))
      setItemToAdd(value)
      setValue(value)
    }
    if (fromEnter) {
      return createNewItem(value)
    } else return null
  }
  return (
    <Form.Item key={name} name={name} className='mb-0'>
      <Select
        placeholder={placeholder}
        mode='multiple'
        tagRender={({ label, ...others }) => <Tag {...others}>{label}</Tag>}
        onChange={(v) => setValue(v)}
        style={{ width: width }}
        defaultValue={initialValue}
        size='middle'
        allowClear
        onClear={() => {
          setManagedOptions([])
          setValue([])
        }}
        defaultOpen
        ref={refInput}
        dropdownRender={(menu) => (
          <div>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div>
              <Input
                style={{ width: '100%' }}
                value={itemToAdd}
                onChange={(event) => checkAndChange(event.target.value)}
                // @ts-ignore - onPressEnter event doesn't have a target / value
                onPressEnter={(e) => checkAndChange(e.target.value, true)}
              />
              <Button
                type='link'
                style={{ textTransform: 'capitalize' }}
                onClick={createNewItem}
                disabled={!emailValid}
              >
                <PlusOutlined /> Add {name.substring(0, name.length - 1)}
              </Button>
            </div>
          </div>
        )}
      >
        {managedOptions.map((v) => (
          <Option key={v} value={v}>
            {v}
          </Option>
        ))}
      </Select>
    </Form.Item>
  )
}
