import '../../../../styles.css'

import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Checkbox, Form, Input, InputNumber, Select } from 'antd'
import React, { useMemo, useState } from 'react'

export function VariableCreator({ configMeta, create, setCreate, form }) {
  const [pricePublisherId, setPricePublisherId] = useState(null)
  const [isPlaceholder, setIsPlaceholder] = useState(false)

  const PricePublisherList = configMeta?.Data?.PricePublisherList.map((option) => {
    return {
      label: option.Text,
      value: option.Value,
    }
  })
  const PriceTypeList = configMeta?.Data?.PriceTypeList.map((option) => {
    return {
      label: option.Text,
      value: option.Value,
    }
  })
  const PriceInstrumentList = useMemo(() => {
    if (pricePublisherId) {
      return configMeta?.Data?.PriceInstrumentList.filter(
        (item) => item.GroupingValue === pricePublisherId.toString()
      ).map((option) => {
        return {
          label: option.Text,
          value: option.Value,
        }
      })
    }
    return configMeta?.Data?.PriceInstrumentList.map((option) => {
      return {
        label: option.Text,
        value: option.Value,
      }
    })
  }, [pricePublisherId])

  const TradePeriodPreferenceList = configMeta?.Data?.TradeDateRuleList.map((option) => {
    return {
      label: option.Text,
      value: option.Value,
    }
  })

  const handlePlaceholderChange = (checked) => {
    setIsPlaceholder(checked)
    if (checked) {
      form.setFieldsValue({
        IsRequired: !checked,
        IsPlaceholder: checked,
        OverridePriceInstrumentId: '',
        TradeDateRuleCvId: '',
      })
    }
  }

  const handleRequiredChange = (checked) => {
    setIsPlaceholder(!checked)
    if (checked) {
      form.setFieldsValue({
        IsRequired: checked,
        IsPlaceholder: !checked,
      })
    }
  }

  if (!create) {
    return <></>
  }

  return (
    <>
      {create && (
        <Horizontal verticalCenter fullHeight height={150}>
          <Vertical className='p-4 bg-2 bordered'>
            <Texto category='heading-small'>VARIABLE CREATOR</Texto>
            <Horizontal className='mt-4' style={{ gap: 25 }}>
              <Vertical flex={2}>
                <Texto className='mb-2'>NAME</Texto>
                <Form.Item name='Name' rules={[{ required: true, message: 'Name is required' }]}>
                  <Input type='text' size='middle' style={{ minWidth: 200 }} />
                </Form.Item>
              </Vertical>
              <Vertical flex={1}>
                <Texto className='mb-2'>PERCENT</Texto>
                <Form.Item name='Percentage' rules={[{ required: true, message: 'Percentage is required' }]}>
                  <InputNumber controls={false} prefix='%' size='middle' type='number' style={{ minWidth: '100%' }} />
                </Form.Item>
              </Vertical>
              <Vertical flex={2}>
                <Texto className='mb-2'>PUBLISHER</Texto>
                <Form.Item name='PricePublisherId' rules={[{ required: true, message: 'Please select a publisher' }]}>
                  <Select
                    showSearch
                    placeholder='Select publisher'
                    onChange={(value) => {
                      setPricePublisherId(value)
                      form.setFieldsValue({ OverridePriceInstrumentId: null })
                    }}
                    options={PricePublisherList}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  />
                </Form.Item>
              </Vertical>
              <Vertical flex={1}>
                <Texto className='mb-2'>TYPE</Texto>
                <Form.Item name='PriceTypeCvId' rules={[{ required: true, message: 'Please select a price type' }]}>
                  <Select
                    showSearch
                    placeholder='Select type'
                    options={PriceTypeList}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  />
                </Form.Item>
              </Vertical>
              <Vertical flex={1}>
                <Texto className='mb-2'>TRADE PERIOD PREFERENCE</Texto>
                <Form.Item
                  name='TradeDateRuleCvId'
                  rules={[{ required: !isPlaceholder, message: 'Please select a trade period preference' }]}
                >
                  <Select
                    disabled={isPlaceholder}
                    showSearch
                    placeholder='Select contact'
                    options={TradePeriodPreferenceList}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  />
                </Form.Item>
              </Vertical>
            </Horizontal>
          </Vertical>
        </Horizontal>
      )}
      <Horizontal className='p-4 bordered bg-2 ' verticalCenter style={{ minWidth: '100%' }}>
        <Horizontal verticalCenter style={{ minWidth: '100%', justifyContent: 'space-evenly', gap: 20 }}>
          <Texto className='mb-2'>INSTRUMENT OVERRIDE</Texto>
          <Form.Item name='OverridePriceInstrumentId'>
            <Select
              allowClear
              showSearch
              placeholder='Select instrument override'
              options={PriceInstrumentList}
              style={{ minWidth: 400 }}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              disabled={isPlaceholder}
            />
          </Form.Item>
          <Form.Item name='IsCostComponent' valuePropName='checked' initialValue={false}>
            <Checkbox style={{ alignContent: 'center' }} disabled={isPlaceholder}>
              <Texto weight={600}>COST COMPONENT</Texto>
            </Checkbox>
          </Form.Item>
          <Form.Item name='IsRequired' valuePropName='checked' initialValue={false}>
            <Checkbox style={{ alignContent: 'center' }} onChange={(e) => handleRequiredChange(e.target.checked)}>
              <Texto weight={600}>REQUIRED</Texto>
            </Checkbox>
          </Form.Item>
          <Form.Item name='IsPlaceholder' valuePropName='checked' initialValue={false}>
            <Checkbox style={{ alignContent: 'center' }} onChange={(e) => handlePlaceholderChange(e.target.checked)}>
              <Texto weight={600}>PLACEHOLDER</Texto>
            </Checkbox>
          </Form.Item>
          <GraviButton
            style={{ background: 'var(--gray-200)', borderRadius: 20, minWidth: 100 }}
            appearance='outline'
            buttonText='Cancel'
            onClick={() => setCreate(false)}
          />
          <GraviButton buttonText='Save' success style={{ borderRadius: 20, minWidth: 100 }} htmlType='submit' />
        </Horizontal>
      </Horizontal>
    </>
  )
}
