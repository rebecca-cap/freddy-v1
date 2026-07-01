import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { DatePicker, Form, InputNumber, Radio } from 'antd'
import dayjs from '@utils/dayjs'
import React, { useEffect, useMemo, useState } from 'react'

export function PricingInformation({ selectedSubtype, form, orderEntryInfo }) {
  const [pricingStrategy, setPricingStrategy] = useState('Market')

  const [bidPrice, setBidPrice] = useState(form.getFieldValue('Price'))
  const [expirationDate, setExpirationDate] = useState(dayjs())

  useEffect(() => {
    if (!selectedSubtype?.AllowBid) {
      form.setFieldsValue({ PricingStrategy: 'Market' })
    }
  }, [selectedSubtype])
  const options = useMemo(() => {
    return [
      { label: 'Market', value: 'Market' },
      { label: 'Bid', value: 'Bid', disabled: !selectedSubtype?.AllowBid },
    ]
  }, [selectedSubtype])

  const showOverridePrice =
    orderEntryInfo?.Data?.IsInternalUser &&
    selectedSubtype.ContractPricingMethodMeaning !== 'DeliveryPeriod' &&
    (selectedSubtype.ContractPricingMethodMeaning === 'WeightedAverage' ||
      selectedSubtype.ContractPricingMethodMeaning === 'HighPrice') &&
    form.getFieldValue('PricingStrategy') !== 'Bid'

  return (
    <Vertical flex={1} className='pricing-information'>
      <Texto category='h5' className='mt-3 mb-3' style={{ color: 'var(--theme-color-1)' }}>
        Pricing Information
      </Texto>
      <Horizontal className='px-3 py-3' verticalCenter>
        <Texto style={{ flex: 1 }}> PRICING STRATEGY: </Texto>
        <Form.Item name='PricingStrategy' noStyle initialValue='Market'>
          <Radio.Group
            optionType='button'
            buttonStyle='solid'
            data-testid='pricing-strategy'
            style={{ flex: 1 }}
            size='middle'
            onChange={(event) => {
              setPricingStrategy(event.target.value)
            }}
          >
            {options.map((option) => (
              <Radio.Button
                data-testid={option.label}
                style={{ minWidth: '50%', textAlign: 'center' }}
                value={option.value}
                key={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
      </Horizontal>
      {selectedSubtype.ContractPricingMethodMeaning !== 'DeliveryPeriod' && (
        <Horizontal className='px-3 py-2' verticalCenter fullHeight>
          <Texto style={{ flex: 1 }}>
            {form.getFieldValue('PricingStrategy') === 'Bid' ? ' CURRENT PRICE:' : 'PRICE:'}
          </Texto>
          <Texto category='h4'>{fmt.currency(form.getFieldValue('Price'))}</Texto>
        </Horizontal>
      )}
      {showOverridePrice && (
        <Horizontal className='px-3 py-2' verticalCenter fullHeight>
          <Texto style={{ flex: 1 }}> SALE PRICE: </Texto>
          <Form.Item
            name='OverridePrice'
            style={{ flex: 2, textAlign: 'right' }}
            rules={[{ required: true, message: 'Price is required' }]}
            initialValue={form.getFieldValue('Price')}
          >
            <InputNumber
              prefix={defaultCurrencySymbol}
              size='middle'
              min={0}
              precision={fmt.currentPrecision}
              style={{ width: '80%' }}
              step={`.${`${'0'.repeat((fmt.currentPrecision || 4) - 1)}1`}`}
            />
          </Form.Item>
        </Horizontal>
      )}
      {form.getFieldValue('PricingStrategy') === 'Bid' && selectedSubtype.AllowBid && (
        <>
          <Horizontal className='bid-price px-3 py-2' verticalCenter>
            <Texto style={{ flex: 1 }}> BID PRICE: </Texto>
            <Form.Item
              name='BidPrice'
              style={{ flex: 2, textAlign: 'right' }}
              rules={[{ required: true, message: 'Bid price is required' }]}
              initialValue={bidPrice}
            >
              <InputNumber
                prefix={defaultCurrencySymbol}
                size='middle'
                min={0}
                max={999999999}
                precision={fmt.currentPrecision}
                style={{ width: '80%' }}
                defaultValue={bidPrice}
                onChange={(value) => {
                  setBidPrice(value)
                }}
                step={`.${`${'0'.repeat((fmt.currentPrecision || 4) - 1)}1`}`}
              />
            </Form.Item>
          </Horizontal>
          <Horizontal className='px-3 py-2' verticalCenter>
            <Texto style={{ flex: 1 }}> EXPIRATION DATE ({serverTimeZoneAlias}): </Texto>
            <Form.Item
              name='BidExpiration'
              style={{ flex: 2, textAlign: 'right' }}
              rules={[{ required: true, message: 'Date selection is required' }]}
              initialValue={dayjs(orderEntryInfo?.Data?.SelectedItems[0].Defaults.DefaultBidExpiryDateTime)}
            >
              <DatePicker
                size='middle'
                format='MM/DD/YYYY: hh:mm a'
                style={{ width: '80%' }}
                showTime={{ format: 'HH:mm' }}
                use12Hours
                value={expirationDate}
                disabledDate={(date) =>
                  date.isAfter(dayjs(orderEntryInfo?.Data?.SelectedItems[0].Constraints.MaximumBidExpiration))
                }
                onChange={setExpirationDate}
                onSelect={(value) => {
                  form.setFieldsValue({ ExpirationDate: dayjs(value, 'MM/DD/YYYY: hh:mm a') })
                }}
                placeholder='Select Date and Time'
              />
            </Form.Item>
          </Horizontal>
        </>
      )}
    </Vertical>
  )
}
