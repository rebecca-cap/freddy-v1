import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

import { AdditionalOptions } from './components/AdditionalInfo'
import { OrderDisplay } from './components/OrderDisplay'
import { PricingInformation } from './components/PricingInformation'
import { VolumeAllocation } from './components/VolumeAllocation'

export function SecondStep({
  selectedSubtype,
  form,
  deliveryPeriods,
  setDeliveryPeriods,
  orderEntryInfo,
  constraints,
  totalVolume,
  setTotalVolume,
  currentCounterParty,
}) {
  return (
    <Horizontal fullHeight>
      <Vertical className='mx-4' flex={5.5}>
        <div style={{ overflowY: 'auto' }}>
          <Horizontal className='mx-4 pb-2' style={{ gap: 20 }}>
            <PricingInformation form={form} selectedSubtype={selectedSubtype} orderEntryInfo={orderEntryInfo} />
            <VolumeAllocation
              form={form}
              deliveryPeriods={deliveryPeriods}
              setDeliveryPeriods={setDeliveryPeriods}
              constraints={constraints}
              selectedSubtype={selectedSubtype}
              orderEntryInfo={orderEntryInfo}
              totalVolume={totalVolume}
              setTotalVolume={setTotalVolume}
            />
          </Horizontal>
          <Horizontal className='mx-4 mb-2 pt-4 border-top'>
            <AdditionalOptions
              currentCounterParty={currentCounterParty}
              orderEntryInfo={orderEntryInfo}
              form={form}
              constraints={constraints}
              selectedSubtype={selectedSubtype}
              deliveryPeriods={deliveryPeriods}
            />
          </Horizontal>
        </div>
      </Vertical>
      <Vertical style={{ backgroundColor: 'var(--gray-800)', flex: 2 }}>
        <OrderDisplay
          form={form}
          orderEntryInfo={orderEntryInfo}
          deliveryPeriods={deliveryPeriods}
          totalVolume={totalVolume}
          setTotalVolume={setTotalVolume}
        />
      </Vertical>
    </Horizontal>
  )
}
