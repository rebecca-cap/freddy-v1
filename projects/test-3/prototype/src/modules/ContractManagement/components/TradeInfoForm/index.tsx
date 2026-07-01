import { InfoCircleOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { ContractManagementMetadata } from '@modules/ContractManagement/api/types.schema'
import { Checkbox, DatePicker, Form, Select, Switch, Tooltip } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import moment from 'moment'
import React, { useEffect, useRef } from 'react'

const { RangePicker } = DatePicker

export function TradeInfoForm({
  showSetAllDateItems,
  form,
  metadata,
}: {
  showSetAllDateItems: boolean
  form: FormInstance
  metadata: ContractManagementMetadata
}) {
  const rangePickerRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!['t', 'T'].includes(e.key)) return // Exit early for all other keys

      const userPressedT = e.key.toLowerCase() === 't' || e.key.toLowerCase() === 'T'
      if (userPressedT) {
        const activeElement = document.activeElement as HTMLElement

        const isDateInput =
          activeElement?.tagName === 'INPUT' &&
          ((activeElement as HTMLInputElement).closest('.ant-picker-range') ||
            (activeElement as HTMLInputElement).closest('.ant-picker'))

        if (isDateInput) {
          e.preventDefault()

          const placeholder = activeElement.getAttribute('placeholder')
          const id = activeElement.getAttribute('id')
          const today = moment()

          if (placeholder === 'Start date' || placeholder === 'End date') {
            const existingRange = form.getFieldValue('EffectiveDates') || []
            const start = existingRange?.[0] || null
            const end = existingRange?.[1] || null

            form.setFieldsValue({
              EffectiveDates: placeholder === 'Start date' ? [today, end] : [start, today],
            })
          } else if (id === 'TradeEntryDateTime') {
            form.setFieldsValue({ TradeEntryDateTime: today })
          }

          activeElement.blur()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [form])

  return (
    <Vertical className='bg-1 bordered pb-4' style={{ borderRadius: 8, overflow: 'hidden' }} flex='none' height='auto'>
      <Horizontal className='p-4 bg-2 border-bottom '>
        <Texto category='h6' className='ml-3 font-weight-normal'>
          Trade Info
        </Texto>
      </Horizontal>
      <Horizontal className='px-4 py-2'>
        <Vertical flex={0.25} className='my-2 mx-4'>
          <Texto category='heading-small' appearance='medium'>
            TRADE DATES
          </Texto>
        </Vertical>
        <Vertical flex={0.25} className='my-2 mx-4' />
        {showSetAllDateItems && <Horizontal flex={0.25} className='my-2 mx-4' />}
        <Vertical flex={0.25} className='my-2 mx-4'>
          <Texto category='heading-small' appearance='medium'>
            Quantities
          </Texto>
        </Vertical>
      </Horizontal>
      <Horizontal className='px-4 py-2'>
        <Vertical flex={0.25} className='my-2 mx-4'>
          <Texto className='py-2'>Contract Calendar</Texto>
          <Form.Item
            hasFeedback
            name='ValuationCalendarId'
            rules={[{ required: true, message: 'Please select contract calendar' }]}
          >
            <Select
              allowClear
              placeholder={'Select a contract calendar'}
              showSearch
              filterOption={(input, option) =>
                (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {metadata?.PricingCalendars?.map((item) => (
                <Select.Option key={item.Value} value={Number(item.Value)}>
                  {item.Text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Vertical>
        <Vertical flex={0.25} className='my-2 mx-4'>
          <Texto className='py-2'>Contract Date</Texto>
          <Form.Item hasFeedback name='TradeEntryDateTime' rules={[{ required: true, message: 'Please select date' }]}>
            <DatePicker style={{ width: '100%' }} format='MM/DD/YYYY' />
          </Form.Item>
        </Vertical>
        <Horizontal flex={0.25} className='my-2' />
        <Vertical flex={0.25} className='my-2 '>
          <Texto className='py-2'>Require Quantities</Texto>
          <Form.Item name='ContractManagementRequiresQuantities' valuePropName='checked'>
            <Switch unCheckedChildren='Disabled' checkedChildren='Required' style={{ width: 100 }} />
          </Form.Item>
        </Vertical>
      </Horizontal>
      <Horizontal className='px-4'>
        <Vertical flex={0.25} className='my-2 mx-4 '>
          <Texto className='py-2'>Effective Dates</Texto>
          <Form.Item hasFeedback name='EffectiveDates' rules={[{ required: true, message: 'Please select dates' }]}>
            <RangePicker ref={rangePickerRef} style={{ minWidth: '100%' }} format='MM/DD/YYYY' />
          </Form.Item>
        </Vertical>
        {showSetAllDateItems && (
          <Vertical flex={0.25} className='my-2 mx-4'>
            <Horizontal verticalCenter>
              <Texto className='py-2'>Set Dates</Texto>
              <Tooltip
                trigger='hover'
                title='If checked, these effective dates will cascade down to the selected level: either all details or all details and prices. Any current effective dates may be overridden.'
              >
                <GraviButton icon={<InfoCircleOutlined />} className='m-0 ghost-gravi-button' size='small' />
              </Tooltip>
            </Horizontal>
            <Horizontal verticalCenter>
              <Texto className='mr-2'>Details</Texto>
              <Form.Item name='CascadeHeaderDatesToDetails' valuePropName='checked' className='mr-4'>
                <Checkbox />
              </Form.Item>
              <Texto className='mr-2'>Prices</Texto>
              <Form.Item name='CascadeHeaderDatesToPrices' valuePropName='checked'>
                <Checkbox />
              </Form.Item>
            </Horizontal>
          </Vertical>
        )}
        {showSetAllDateItems && <Horizontal flex={0.25} className='my-2' />}
      </Horizontal>
    </Vertical>
  )
}
