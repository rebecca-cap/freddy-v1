import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Model } from '@hooks/useOnlineOrderViewTypes'
import React from 'react'

interface PricingTermsProps {
  orderDetails: Model
}

export function PricingTerms({ orderDetails }: PricingTermsProps) {
  const indexOfferDisplay = orderDetails?.IndexOfferDisplay

  if (!orderDetails?.SourceIndexOfferId) return null

  return (
    <div className='flex-half'>
      <Vertical className='mx-4 mb-4'>
        <Horizontal className='border-bottom'>
          <Texto category='h5' appearance='medium'>
            PRICING TERMS
          </Texto>
        </Horizontal>
        <Horizontal
          className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
          style={{ borderRadius: 5, fontSize: 12 }}
        >
          <Vertical>
            {indexOfferDisplay?.PricingEffectiveTimes && (
              <Horizontal className='justify-sb bg-1 mr-2' style={{ borderRadius: 5 }}>
                <Texto appearance='medium' weight={600}>
                  Effective Times
                </Texto>
                <Texto appearance='medium'>{indexOfferDisplay.PricingEffectiveTimes}</Texto>
              </Horizontal>
            )}
            {indexOfferDisplay?.PricingWeekendBehavior && (
              <Horizontal className='mt-2 justify-sb bg-1 mr-2' style={{ borderRadius: 5 }}>
                <Texto appearance='medium' weight={600}>
                  Weekend Behavior
                </Texto>
                <Texto appearance='medium'>{indexOfferDisplay.PricingWeekendBehavior}</Texto>
              </Horizontal>
            )}
            {indexOfferDisplay?.PricingHolidayBehavior && (
              <Horizontal className='mt-2 justify-sb bg-1 mr-2' style={{ borderRadius: 5 }}>
                <Texto appearance='medium' weight={600}>
                  Holiday Behavior
                </Texto>
                <Texto appearance='medium'>{indexOfferDisplay.PricingHolidayBehavior}</Texto>
              </Horizontal>
            )}
            <Horizontal className='mt-2 justify-sb bg-1' style={{ borderRadius: 5 }}>
              <Texto appearance='medium' weight={600} style={{ flexShrink: 0 }}>
                Terms
              </Texto>
              <Texto
                appearance='medium'
                style={{
                  maxWidth: 400,
                  maxHeight: 90,
                  overflowY: 'auto',
                  textAlign: 'justify',
                  paddingRight: 8,
                }}
              >
                {orderDetails?.IndexOfferDisplay?.AdditionalFreetextTerms || 'N/A'}
              </Texto>
            </Horizontal>
          </Vertical>
        </Horizontal>
      </Vertical>
    </div>
  )
}
