import '../../styles.css'

import { usePromptContext } from '@contexts/PromptContext'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { OrderDates } from '@modules/SellingPlatform/BuyNow/Prompt/components/CreateOrder/components/OrderDates'
import { isDefinedAndNotNull } from '@utils/index'
import { Collapse, Form } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import React, { useMemo } from 'react'

import { AdditionalLocations } from '../../../sharedComponents/AdditionalLocations'
import { AdditionalProducts } from '../../../sharedComponents/AdditionalProducts'
import { BidExpiration } from './components/BidExpiration'
import { ContactSelect } from './components/ContactSelect'
import { DestinationStates } from './components/DestinationStates'
import { ExternalCounterpartyDisplay } from './components/ExternalCounterpartyDisplay'
import { FuturesMonth } from './components/FuturesMonth'
import { IndexOverride } from './components/IndexOverride'
import { InternalCounterparty } from './components/InternalCounterparty'
import { LiftingDays } from './components/LiftingDays'
import { LoadingNumbers } from './components/LoadingNumbers'
import { MarginDisplay } from './components/MarginDisplay'
import { Notes } from './components/Notes'
import { PreferredTerminals } from './components/PreferredTerminals'
import { PriceOverride } from './components/PriceOverride'
import { PurchaseType } from './components/PurchaseType'
import { QuantityInput } from './components/QuantityInput'

const { Panel } = Collapse

export function CreateOrder({
  form,
  setDateTimeOverrideToLiftingDaysSelection,
}: {
  form: FormInstance
  setDateTimeOverrideToLiftingDaysSelection: (id: number) => void
}) {
  const {
    selectedItemMeta,
    adjustPriceAdjustments,
    allowedPriceAdjustments,
    tasMode,
    isPriceExpired,
    currentCounterParty,
    currentFromDate,
    currentToDate,
    isDateOverrideActive,
    setIsDateOverrideActive,
  } = usePromptContext()
  const enteredPrice = Form.useWatch('Price', form)
  const enteredFromDate = Form.useWatch('OverrideStartDate', form)
  const enteredToDate = Form.useWatch('OverrideEndDate', form)

  const showDestinationStates = !!selectedItemMeta?.DestinationStates?.length && !selectedItemMeta?.IsInternalUser

  const selectedAdditionalProducts = !!selectedItemMeta?.AdditionalItems?.filter(
    (item) => item.ItemType === 'AdditionalProduct'
  )?.length
  const selectedAdditionalLocations = !!selectedItemMeta?.AdditionalItems?.filter(
    (item) => item.ItemType === 'AdditionalLocation'
  )?.length

  const marginDiff = useMemo(() => {
    if (!isDefinedAndNotNull(selectedItemMeta)) return 0
    const diff = selectedItemMeta.Margin + (enteredPrice - selectedItemMeta.Price)
    if (Number.isNaN(diff)) return selectedItemMeta?.Margin
    return diff
  }, [enteredPrice, selectedItemMeta])

  return (
    <Horizontal className='order-quantity'>
      <Vertical>
        <QuantityInput
          form={form}
          selectedItemMeta={selectedItemMeta}
          adjustPriceAdjustments={adjustPriceAdjustments}
          isPriceExpired={isPriceExpired}
          setDateTimeOverrideToLiftingDaysSelection={setDateTimeOverrideToLiftingDaysSelection}
        />
        {!tasMode && <PurchaseType />}
        <div style={{ overflowY: 'scroll' }}>
          <Horizontal className='border-bottom' />
          {selectedItemMeta?.IsInternalUser && <MarginDisplay margin={marginDiff} />}
          <PriceOverride form={form} tasMode={tasMode} selectedItemMeta={selectedItemMeta} />
          {selectedItemMeta?.IsInternalUser && !tasMode && form.getFieldValue('Type') !== 'bid' && <IndexOverride />}
          {form.getFieldValue('Type') === 'bid' && !tasMode && <BidExpiration form={form} />}
          {tasMode && <FuturesMonth form={form} />}
          {form.getFieldValue('Type') !== 'bid' && !!allowedPriceAdjustments?.length && (
            <LiftingDays
              allowedPriceAdjustments={allowedPriceAdjustments}
              isPriceExpired={isPriceExpired}
              isDateOverrideActive={isDateOverrideActive}
            />
          )}
          {selectedItemMeta?.IsInternalUser && (
            <OrderDates
              form={form}
              dateOverrideMaxDate={selectedItemMeta?.DateOverrideMaxDate}
              dateOverrideMinDate={selectedItemMeta?.DateOverrideMinDate}
              isDateOverrideActive={isDateOverrideActive}
              currentFromDate={currentFromDate}
              currentToDate={currentToDate}
              enteredFromDate={enteredFromDate}
              enteredToDate={enteredToDate}
              setIsDateOverrideActive={setIsDateOverrideActive}
              showDateOverrideFields={selectedItemMeta?.ShowDateOverrideFields}
              defaultEndDate={selectedItemMeta?.PromptDefaultDates?.DefaultEndDate}
            />
          )}
          {selectedAdditionalProducts && (
            <div>
              <Horizontal className='mt-3 mx-4 pb-2 justify-sb border-bottom' verticalCenter>
                <Texto category='h6' appearance='default' weight={900}>
                  Additional Products
                </Texto>
                <Texto category='p1' appearance='medium'>
                  *Checked products can be optionally lifted
                </Texto>
              </Horizontal>
              <AdditionalProducts
                form={form}
                selectedItemMeta={selectedItemMeta}
                isPriceExpired={isPriceExpired}
                formField='Price'
              />
            </div>
          )}
          {selectedAdditionalLocations && (
            <div>
              <Horizontal className='mt-3 mx-4 pb-2 justify-sb border-bottom' verticalCenter>
                <Texto category='h6' appearance='default' weight={900}>
                  Additional Locations
                </Texto>
                <Texto category='p1' appearance='medium'>
                  *Checked products can be optionally lifted
                </Texto>
              </Horizontal>
              <AdditionalLocations form={form} selectedItemMeta={selectedItemMeta} />
            </div>
          )}
          <Horizontal className='test-AdditionalOptions mt-4'>
            <Collapse ghost style={{ minWidth: '100%' }} defaultActiveKey='1'>
              <Panel className=' bg-3 mx-3' header={<Texto category='h6'>Additional Options</Texto>} key='1'>
                <div className='mx-3'>
                  {!!selectedItemMeta?.LiftingLocationsList?.length && (
                    <PreferredTerminals selectedItemMeta={selectedItemMeta} />
                  )}
                  {showDestinationStates && <DestinationStates selectedItemMeta={selectedItemMeta} />}
                  {!!selectedItemMeta?.LoadingNumbersList?.length && !showDestinationStates && (
                    <LoadingNumbers selectedItemMeta={selectedItemMeta} />
                  )}
                  {selectedItemMeta?.Constraints?.AllowNoteEntry && (
                    <Notes isPriceExpired={isPriceExpired} form={form} />
                  )}
                </div>
              </Panel>
            </Collapse>
          </Horizontal>
          <Horizontal className='border-bottom my-3' />
          {selectedItemMeta?.IsInternalUser && (
            <Horizontal className='mt-1 mx-4'>
              <Vertical>
                <Horizontal>
                  <Texto category='p1' appearance='primary' weight={900}>
                    Choose Counterparty & User
                  </Texto>
                </Horizontal>
                <Horizontal className='border-bottom mt-2' />
                {currentCounterParty && <ExternalCounterpartyDisplay currentCounterParty={currentCounterParty} />}
                {selectedItemMeta?.IsInternalUser && (
                  <>
                    <ContactSelect selectedItemMeta={selectedItemMeta} />
                    <InternalCounterparty selectedItemMeta={selectedItemMeta} />
                  </>
                )}
                <Horizontal className='mt-2' />
              </Vertical>
            </Horizontal>
          )}
        </div>
      </Vertical>
    </Horizontal>
  )
}
