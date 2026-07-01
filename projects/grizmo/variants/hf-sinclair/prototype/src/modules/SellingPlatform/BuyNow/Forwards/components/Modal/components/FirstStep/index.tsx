import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

import { OrderVolume } from './components/OrderVolume'
import { SubTypeSelect } from './components/SubtypeSelect'

export function FirstStep({
  subTypes,
  setVolumePeriod,
  volumePeriod,
  selectedPeriodIds,
  selectedSubtype,
  setSelectedSubtype,
  constraints,
  form,
  error,
  setError,
  deliveryPeriods,
  setDeliveryPeriods,
  totalVolume,
  setTotalVolume,
}) {
  return (
    <Horizontal>
      <Vertical className='mx-4'>
        <Horizontal>
          <Texto category='h4' className='mb-3' appearance='secondary'>
            Order Information
          </Texto>
        </Horizontal>
        <Horizontal className='m-4' style={{ gap: 30 }}>
          <SubTypeSelect
            subTypes={subTypes}
            form={form}
            selectedSubtype={selectedSubtype}
            setSelectedSubtype={setSelectedSubtype}
          />
          <OrderVolume
            form={form}
            periodCount={deliveryPeriods?.length}
            selectedSubtype={selectedSubtype}
            volumePeriod={volumePeriod}
            setVolumePeriod={setVolumePeriod}
            constraints={constraints}
            deliveryPeriods={deliveryPeriods}
            setDeliveryPeriods={setDeliveryPeriods}
            totalVolume={totalVolume}
            setTotalVolume={setTotalVolume}
          />
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}
