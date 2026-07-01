import './styles.css'

import { InfoCircleOutlined } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, Input, Tooltip } from 'antd'
import React, { useMemo, useState } from 'react'

import { AdditionalLocations } from '../../../../../../../sharedComponents/AdditionalLocations'
import { AdditionalProducts } from '../../../../../../../sharedComponents/AdditionalProducts'
import { ContactSelect } from './Components/ContactSelect'
import { DestinationStates } from './Components/DestinationStates'
import { InternalCounterparty } from './Components/InternalCounterparty'
import { LiftingDays } from './Components/LiftingDays'
import { LoadingNumbers } from './Components/LoadingNumbers'
import { PreferredTerminals } from './Components/PreferredTerminals'

const { TextArea } = Input

export function AdditionalOptions({
  orderEntryInfo,
  form,
  constraints,
  currentCounterParty,
  selectedSubtype,
  deliveryPeriods,
}) {
  const [allowedPriceAdjustments, setAllowedPriceAdjustments] = useState([])
  const showDestinationStates =
    !!orderEntryInfo?.Data?.SelectedItems[0]?.DestinationLocations.length && !orderEntryInfo?.Data?.IsInternalUser

  const showAdditionalProductsToolTip = selectedSubtype.ContractPricingMethodMeaning === 'DeliveryPeriod'

  // when do we need to run this? on volume change? maybe when the grid volume is edited
  const adjustPriceAdjustments = (quantity) => {
    // get updated list that the user can select from based on quantity
    const updatedList = orderEntryInfo?.Data?.SelectedItems[0].PriceAdjustmentDetails.filter(
      (price) => price.QuantityFrom <= quantity && price.QuantityTo >= quantity
    )

    // get the current selection user had
    const prevSelectedId = form.getFieldValue('PriceAdjustmentId')

    // if the item is still in the list, we dont need to do anything, since the form value still has it

    // but if its not in the list, we need to deselect / reset the form
    const resetSelection =
      prevSelectedId && updatedList.findIndex((a) => a.MarketPlatformPriceAdjustmentDetailId === prevSelectedId) < 0
    if (resetSelection) {
      form.setFieldsValue({ PriceAdjustmentId: null })
    }

    // if have only one, then go ahead and select it as default
    if (updatedList.length === 1 && form.getFieldValue('PricingStrategy') !== 'Bid') {
      const itemKey = updatedList[0].key
      form.setFieldsValue({ PriceAdjustmentId: itemKey })
    }

    if (updatedList.length > 1) {
      const bestPriceAdjustment = updatedList.find((item) => item.AdjustmentPrice === 0)
      if (bestPriceAdjustment) {
        const itemKey = bestPriceAdjustment.key
        form.setFieldsValue({ PriceAdjustmentId: itemKey })
      }
    }

    setAllowedPriceAdjustments(updatedList)
    form.setFieldsValue({ Quantity: quantity })
  }

  const [textLength, setTextLength] = useState(0)

  const handleTextChange = (e) => {
    const text = e.target.value
    setTextLength(text.length)
  }

  const selectedItemMeta = useMemo(() => {
    const firstSelectedItem = orderEntryInfo?.Data?.SelectedItems[0]
    const AdditionalItems = firstSelectedItem?.AdditionalItems?.map((item) => ({
      ...item,
      selected: false,
      key: item.ItemKey.TradeEntrySetupId.toString(),
    }))

    return { AdditionalItems, Price: form.getFieldValue('Price'), selectedSubtype }
  }, [orderEntryInfo?.Data])

  const selectedAdditionalProducts = !!orderEntryInfo?.Data?.SelectedItems[0]?.AdditionalItems?.filter(
    (item) => item.ItemType === 'AdditionalProduct'
  )?.length
  const selectedAdditionalLocations = !!orderEntryInfo?.Data?.SelectedItems[0]?.AdditionalItems?.filter(
    (item) => item.ItemType === 'AdditionalLocation'
  )?.length

  return (
    <Vertical>
      {selectedAdditionalProducts && (
        <div>
          <Horizontal className='justify-sb ' verticalCenter>
            <Texto category='h5' className='mb-1' style={{ color: 'var(--theme-color-1)' }}>
              Additional Products
              {showAdditionalProductsToolTip && (
                <Tooltip title='* Additional product pricing is an average across the period. Detailed monthly pricing provided in email confirmation.'>
                  <InfoCircleOutlined className='ml-2' style={{ color: 'var(--theme-warning)' }} />
                </Tooltip>
              )}
            </Texto>
            <Texto category='p1' appearance='medium'>
              *Checked products can be optionally lifted
            </Texto>
          </Horizontal>
          <AdditionalProducts
            deliveryPeriods={deliveryPeriods}
            orderEntryInfo={orderEntryInfo}
            form={form}
            selectedItemMeta={selectedItemMeta}
            isPriceExpired={false}
            formField='OverridePrice'
          />
        </div>
      )}
      {selectedAdditionalLocations && (
        <div>
          <Horizontal className='justify-sb ' verticalCenter>
            <Texto category='h5' className='mb-1' style={{ color: 'var(--theme-color-1)' }}>
              Additional Locations
              <Tooltip
                title={
                  '*If additional lifting terminals may be required, select here. Pricing details for additional terminals\n' +
                  'will be provided in email confirmation.'
                }
              >
                <InfoCircleOutlined className='ml-2' style={{ color: 'var(--theme-warning)' }} />
              </Tooltip>
            </Texto>
          </Horizontal>
          <AdditionalLocations form={form} selectedItemMeta={selectedItemMeta} />
        </div>
      )}
      <Horizontal>
        <Texto category='h5' className='mb-2' style={{ color: 'var(--theme-color-1)' }}>
          Additional Options
        </Texto>
      </Horizontal>
      <Vertical className='border-bottom'>
        {showDestinationStates && <DestinationStates orderEntryInfo={orderEntryInfo} />}
        {!showDestinationStates && !!orderEntryInfo?.Data?.SelectedItems[0]?.LoadingNumbersList?.length && (
          <LoadingNumbers orderEntryInfo={orderEntryInfo} />
        )}
        {!!orderEntryInfo?.Data?.SelectedItems[0]?.LiftingLocations?.length && (
          <PreferredTerminals orderEntryInfo={orderEntryInfo} />
        )}
        {form.getFieldValue('Type') !== 'bid' && !!allowedPriceAdjustments?.length && (
          <LiftingDays allowedPriceAdjustments={allowedPriceAdjustments} />
        )}
        <Horizontal className='my-3'>
          <Vertical gap={5} style={{ maxWidth: 200 }}>
            <Texto>ORDER NOTE</Texto>
            <Texto appearance='hint'>{textLength}/255</Texto>
          </Vertical>
          {constraints.AllowNoteEntry && (
            <Vertical flex={1}>
              <Form.Item name='Notes' style={{ flex: 1 }}>
                <TextArea
                  className='form-text-area'
                  placeholder='Enter notes'
                  maxLength={255}
                  autoSize={{ minRows: 2, maxRows: 2 }}
                  allowClear
                  onChange={handleTextChange}
                />
              </Form.Item>
            </Vertical>
          )}
        </Horizontal>
      </Vertical>
      <Texto category='h5' className='my-3' style={{ color: 'var(--theme-color-1)' }}>
        Counterparty Info
      </Texto>
      <Horizontal gap={20}>
        {currentCounterParty && (
          <Vertical style={{ width: 100 }}>
            <Texto category='p2'>COUNTERPARTY</Texto>
            <Texto category='h5' className='mt-3' weight={600} style={{ whiteSpace: 'pre-wrap' }}>
              {currentCounterParty}
            </Texto>
          </Vertical>
        )}
        {orderEntryInfo?.Data?.IsInternalUser && (
          <>
            <Vertical>
              <ContactSelect orderEntryInfo={orderEntryInfo} />
            </Vertical>
            <Vertical>
              <InternalCounterparty orderEntryInfo={orderEntryInfo} />
            </Vertical>
          </>
        )}
      </Horizontal>
    </Vertical>
  )
}
