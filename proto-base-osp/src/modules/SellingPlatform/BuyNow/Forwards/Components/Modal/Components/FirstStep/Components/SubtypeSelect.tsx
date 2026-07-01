import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, Radio, Skeleton } from 'antd'
import React, { useEffect } from 'react'

export function SubTypeSelect({ subTypes, form, selectedSubtype, setSelectedSubtype }) {
  useEffect(() => {
    if (!selectedSubtype) {
      form.setFieldsValue({ SelectedSubtype: subTypes[0]?.MarketPlatformInstrumentSubtypeId })
      setSelectedSubtype(subTypes[0])
    } else {
      const selectedOption = subTypes.find(
        (option) => option.MarketPlatformInstrumentSubtypeId === form.getFieldValue('SelectedSubtype')
      )
      form.setFieldsValue({ SelectedSubtype: selectedOption?.MarketPlatformInstrumentSubtypeId })

      setSelectedSubtype(selectedOption)
    }
  }, [])

  const onChange = (event) => {
    const selectedValue = event.target.value
    const selectedOption = subTypes.find((option) => option.MarketPlatformInstrumentSubtypeId === selectedValue)
    setSelectedSubtype(selectedOption)
  }

  if (!subTypes) {
    return <Skeleton active />
  }

  return (
    <Vertical flex={2} gap={16}>
      <Texto
        className='pb-1'
        category='h5'
        style={{ borderBottom: 'solid 1px var(--gray-500)', color: 'var(--theme-option)' }}
      >
        DEAL TYPE
      </Texto>
      <Form.Item
        name='SelectedSubtype'
        rules={[{ required: true, message: 'Deal Type is required' }]}
        initialValue={subTypes[0]?.MarketPlatformInstrumentSubtypeId}
      >
        <Radio.Group onChange={onChange}>
          {subTypes?.map((option, i) => {
            return (
              <Radio
                className='mb-4'
                key={option.MarketPlatformInstrumentSubtypeId}
                value={option?.MarketPlatformInstrumentSubtypeId}
              >
                <Texto
                  appearance={
                    selectedSubtype?.MarketPlatformInstrumentSubtypeId === option?.MarketPlatformInstrumentSubtypeId
                      ? 'secondary'
                      : 'default'
                  }
                  category='h4'
                >
                  {option.Name}
                </Texto>
                <Texto
                  weight={
                    selectedSubtype?.MarketPlatformInstrumentSubtypeId === option?.MarketPlatformInstrumentSubtypeId
                      ? 800
                      : 500
                  }
                  category='p1'
                >
                  {option.Description}
                </Texto>
              </Radio>
            )
          })}
        </Radio.Group>
      </Form.Item>
    </Vertical>
  )
}
