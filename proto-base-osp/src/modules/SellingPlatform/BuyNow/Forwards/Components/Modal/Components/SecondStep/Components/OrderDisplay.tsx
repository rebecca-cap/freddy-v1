import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import dayjs from '@utils/dayjs'
import { Button, Checkbox, Form } from 'antd'
import React from 'react'

export function OrderDisplay({ form, orderEntryInfo, deliveryPeriods, totalVolume, setTotalVolume }) {
  const orderMeta = orderEntryInfo?.Data

  const handleExternalNotification = () => {
    const currValue = form.getFieldValue('SendExternalNotification')
    form.setFieldsValue({ SendExternalNotification: !currValue })
  }

  const firstPeriod = deliveryPeriods[0]
  const lastPeriod = deliveryPeriods[deliveryPeriods.length - 1]
  const firstDate = dayjs(firstPeriod.DeliveryPeriodFromDateTime)
  const lastDate = dayjs(lastPeriod.DeliveryPeriodToDateTime)

  const formattedFirstDate = firstDate.startOf('month').format('M/D/YY')
  const formattedLastDate = lastDate.endOf('month').format('M/D/YY')

  return (
    <Vertical className='mt-4 mx-4'>
      <Vertical flex='auto' height='auto' className='mr-4'>
        <Horizontal className='justify-sb' verticalCenter>
          <Texto category='p2' appearance='white' style={{ minWidth: 'fit-content' }}>
            Ordering:
          </Texto>
          <Texto align='right' appearance='primary' category='h4'>
            {orderMeta.SelectedItems[0].ProductName}
          </Texto>
        </Horizontal>
        <Horizontal className='justify-end'>
          <Texto align='right' appearance='white' category='h5'>
            @ {orderMeta.SelectedItems[0].LocationName}
          </Texto>
        </Horizontal>
        <Vertical className='m-5' style={{ maxHeight: 1, background: 'var(--gray-500)' }} />
        <Horizontal className='justify-sb' verticalCenter>
          <Texto appearance='white'>Total Volume:</Texto>
          <Vertical>
            <Texto align='right' appearance='white' category='h1' style={{ whiteSpace: 'nowrap', fontSize: '2.5em' }}>
              {fmt.decimal(totalVolume, 0)}
            </Texto>
            <Texto align='right' appearance='white' category='h5'>
              {orderMeta.SelectedItems[0]?.UnitOfMeasureSymbol ?? defaultUnitOfMeasureSymbol}(s)
            </Texto>
          </Vertical>
        </Horizontal>
        <Horizontal className='mt-4' verticalCenter>
          <Texto style={{ flex: 1 }} appearance='white'>
            Trade Effective
          </Texto>
          <Texto className='pt-2' category='h5' appearance='white' style={{ flex: 2 }} align='right'>
            {formattedFirstDate} - {formattedLastDate}
          </Texto>
        </Horizontal>
        <Vertical height='auto' style={{ maxHeight: 1, background: 'var(--gray-400)', position: 'relative' }} />
      </Vertical>
      <Vertical flex='none' height='auto' className='border-top py-3' style={{ borderColor: 'var(--gray-200)' }}>
        {orderEntryInfo?.Data?.IsInternalUser && (
          <Horizontal>
            <Button
              onClick={() => handleExternalNotification()}
              ghost
              style={{ border: 'none', minWidth: '100%', minHeight: '100%' }}
            >
              <Horizontal gap={10} verticalCenter>
                <Texto appearance='white' category='h5' weight={600}>
                  Send External Notification
                </Texto>
                <Form.Item name='SendExternalNotification' noStyle valuePropName='checked' initialValue>
                  <Checkbox defaultChecked />
                </Form.Item>
              </Horizontal>
            </Button>
          </Horizontal>
        )}
      </Vertical>
    </Vertical>
  )
}
