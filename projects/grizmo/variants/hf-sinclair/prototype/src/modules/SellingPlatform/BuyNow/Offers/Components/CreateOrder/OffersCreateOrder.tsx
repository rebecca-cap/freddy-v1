import '../../styles.css'

import { useOffersContext } from '@contexts/OffersContext'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { ContactSelect } from '@modules/SellingPlatform/BuyNow/Prompt/components/CreateOrder/components/ContactSelect'
import { ExternalCounterpartyDisplay } from '@modules/SellingPlatform/BuyNow/Prompt/components/CreateOrder/components/ExternalCounterpartyDisplay'
import { InternalCounterparty } from '@modules/SellingPlatform/BuyNow/Prompt/components/CreateOrder/components/InternalCounterparty'
import { BidExpiration } from '@modules/SellingPlatform/BuyNow/sharedComponents/BidExpiration'
import { DestinationStates } from '@modules/SellingPlatform/BuyNow/sharedComponents/DestinationStates'
import { FuturesMonth } from '@modules/SellingPlatform/BuyNow/sharedComponents/FuturesMonth'
import { LiftingDays } from '@modules/SellingPlatform/BuyNow/sharedComponents/LiftingDays'
import { LoadingNumbers } from '@modules/SellingPlatform/BuyNow/sharedComponents/LoadingNumbers'
import { MarginDisplay } from '@modules/SellingPlatform/BuyNow/sharedComponents/MarginDisplay'
import { Notes } from '@modules/SellingPlatform/BuyNow/sharedComponents/Notes'
import { OrderDates } from '@modules/SellingPlatform/BuyNow/sharedComponents/OrderDates'
import { PreferredTerminals } from '@modules/SellingPlatform/BuyNow/sharedComponents/PreferredTerminals'
import { PriceOverride } from '@modules/SellingPlatform/BuyNow/sharedComponents/PriceOverride'
import { QuantityInput } from '@modules/SellingPlatform/BuyNow/sharedComponents/QuantityInput'
import { isDefinedAndNotNull } from '@utils/index'
import { Collapse, Form } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import React, { useMemo } from 'react'

import { AdditionalLocations } from '../../../sharedComponents/AdditionalLocations'
import { AdditionalProducts } from '../../../sharedComponents/AdditionalProducts'

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
    currentFromDate,
    currentToDate,
    isDateOverrideActive,
    setIsDateOverrideActive,
    currentCounterParty,
  } = useOffersContext()

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
    const diff = (selectedItemMeta?.Margin ?? 0) + (enteredPrice - (selectedItemMeta?.Price ?? 0))
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
        <div style={{ overflowY: 'scroll' }}>
          <Horizontal className='border-bottom' />
          {selectedItemMeta?.IsInternalUser && <MarginDisplay margin={marginDiff} />}
          {selectedItemMeta && <PriceOverride form={form} tasMode={tasMode} selectedItemMeta={selectedItemMeta} />}
          {form.getFieldValue('Type') === 'bid' && !tasMode && (
            <BidExpiration selectedItemMeta={selectedItemMeta} form={form} />
          )}
          {tasMode && <FuturesMonth />}
          {form.getFieldValue('Type') !== 'bid' && !!allowedPriceAdjustments?.length && (
            <LiftingDays
              allowedPriceAdjustments={allowedPriceAdjustments}
              isPriceExpired={isPriceExpired}
              isDateOverrideActive={isDateOverrideActive}
            />
          )}
          {(selectedItemMeta?.IsInternalUser || selectedItemMeta?.SpecialOfferData) && (
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
          <Horizontal className='mt-3'>
            <Collapse className={'additional-options-collapse'} ghost style={{ minWidth: '100%' }} defaultActiveKey='1'>
              <Panel
                className={'p-2 additional-options-collapse-panel-container'}
                header={<Texto category='h6'>Additional Options</Texto>}
                key='1'
              >
                <div>
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
          <Horizontal className='border-bottom my-3' />{' '}
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
