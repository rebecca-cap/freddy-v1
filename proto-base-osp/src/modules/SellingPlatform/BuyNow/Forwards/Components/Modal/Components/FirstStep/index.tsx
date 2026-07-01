import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

import { OrderVolume } from './Components/OrderVolume'
import { SubTypeSelect } from './Components/SubtypeSelect'

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
          <Texto category='h4' className='mb-3' style={{ color: 'var(--theme-color-1)' }}>
            Order Information
          </Texto>
        </Horizontal>
        <Horizontal className='m-4' gap={30}>
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
