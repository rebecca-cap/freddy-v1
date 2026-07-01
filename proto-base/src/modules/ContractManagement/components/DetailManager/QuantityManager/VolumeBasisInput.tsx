import GrossIcon from '@assets/icons/GrossIcon'
import GrossIconFilled from '@assets/icons/GrossIconFilled'
import NetIcon from '@assets/icons/NetIcon'
import NetIconFilled from '@assets/icons/NetIconFilled'
import { Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import { useMemo } from 'react'

export function VolumeBasisInput({
  managedDetail,
  setManagedDetail,
  metadata,
  canWrite,
  defaultNetGrossValue,
  isNetGrossDefaultsFetching,
  isDisabled,
}) {
  const handleBasisChange = (value) => {
    setManagedDetail((prev) => {
      return {
        ...prev,
        NetOrGrossCvId: value,
        NetOrGross: metadata?.NetOrGrossTypeList.find((item) => item.Value === value).Text,
      }
    })
  }

  const validateNetOrGrossCvId = (rule, value, callback) => {
    if (defaultNetGrossValue?.NetOrGrossCvId && value !== defaultNetGrossValue?.NetOrGrossCvId.toString()) {
      callback('Does not match Default')
    } else {
      callback()
    }
  }

  const getIcon = (value, label) => {
    switch (label) {
      case 'Net':
        if (
          value.toString() === defaultNetGrossValue?.NetOrGrossCvId?.toString() ||
          !defaultNetGrossValue?.NetOrGrossCvId
        ) {
          return <NetIconFilled />
        }
        return <NetIcon />

      case 'Gross':
        if (
          value.toString() === defaultNetGrossValue?.NetOrGrossCvId?.toString() ||
          !defaultNetGrossValue?.NetOrGrossCvId
        ) {
          return <GrossIconFilled />
        }
        return <GrossIcon />
      default:
        return null
    }
  }

  const disabled = useMemo(
    () => !canWrite || isNetGrossDefaultsFetching || isDisabled,
    [canWrite, isNetGrossDefaultsFetching, isDisabled]
  )
  return (
    <div className='flex-1'>
      <Texto appearance='primary' category='label'>
        Volume Basis
      </Texto>
      <Form.Item
        style={{ flex: 1, marginBottom: 0, maxWidth: 300 }}
        name='NetOrGrossCvId'
        rules={[{ required: true, message: 'Volume basis is required' }, { validator: validateNetOrGrossCvId }]}
      >
        <Select
          disabled={disabled}
          style={{ width: '100%' }}
          size='large'
          placeholder='Select Volume Basis'
          onChange={(value) => {
            handleBasisChange(value)
          }}
          value={managedDetail?.NetOrGrossCvId}
          placement='topRight'
        >
          {metadata?.NetOrGrossTypeList.map((option) => (
            <Select.Option key={option.Value} value={option.Value} label={option.Text}>
              <div style={{ display: 'flex', gap: 10, verticalAlign: 'center', width: '100%', fontSize: 12 }}>
                <Texto className='pt-1'>{getIcon(option.Value.toString(), option.Text)}</Texto>
                <Texto category='p2'>
                  {option.Text}
                  {defaultNetGrossValue?.NetOrGrossCvId?.toString() === option.Value?.toString() ? ' (Default)' : ''}
                </Texto>
              </div>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  )
}
