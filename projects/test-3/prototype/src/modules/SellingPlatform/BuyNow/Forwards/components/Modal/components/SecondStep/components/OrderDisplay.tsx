import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Button, Checkbox, Form } from 'antd'
import moment from 'moment'
import React from 'react'

export function OrderDisplay({ form, orderEntryInfo, deliveryPeriods, totalVolume, setTotalVolume }) {
  const orderMeta = orderEntryInfo?.Data

  const handleExternalNotification = () => {
    const currValue = form.getFieldValue('SendExternalNotification')
    form.setFieldsValue({ SendExternalNotification: !currValue })
  }

  const firstPeriod = deliveryPeriods[0]
  const lastPeriod = deliveryPeriods[deliveryPeriods.length - 1]
  const firstDate = moment(firstPeriod.DeliveryPeriodFromDateTime)
  const lastDate = moment(lastPeriod.DeliveryPeriodToDateTime)

  const formattedFirstDate = firstDate.startOf('month').format('M/D/YY')
  const formattedLastDate = lastDate.endOf('month').format('M/D/YY')

  return (
    <Vertical className='mt-4 mx-4'>
      <Vertical flex='auto' height='auto' className='px-3'>
        <Horizontal className='justify-sb' verticalCenter>
          <Texto category='p2' appearance='hint'>
            Ordering:
          </Texto>
          <Texto align='right' appearance='secondary' category='h3'>
            {orderMeta.SelectedItems[0].ProductName}
          </Texto>
        </Horizontal>
        <Horizontal className='justify-end'>
          <Texto align='right' appearance='hint' category='h5'>
            @ {orderMeta.SelectedItems[0].LocationName}
          </Texto>
        </Horizontal>
        <Vertical className='m-5' style={{ maxHeight: 1, background: 'var(--gray-500)' }} />
        <Horizontal className='justify-sb' verticalCenter>
          <Texto appearance='hint'>Total Volume:</Texto>
          <Vertical>
            <Texto align='right' appearance='white' category='h1' style={{ whiteSpace: 'nowrap', fontSize: '2.5em' }}>
              {fmt.decimal(totalVolume, 0)}
            </Texto>
            <Texto align='right' appearance='hint' category='h5'>
              gal(s)
            </Texto>
          </Vertical>
        </Horizontal>
        <Horizontal className='mt-4' verticalCenter>
          <Texto style={{ flex: 1 }} appearance='hint'>
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
              <Horizontal justifyContent='space-between'>
                <Texto appearance='hint' category='h5' weight={600}>
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
