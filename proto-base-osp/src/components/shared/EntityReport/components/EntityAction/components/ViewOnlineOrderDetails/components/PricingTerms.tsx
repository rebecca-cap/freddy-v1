import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Model } from '@hooks/useOnlineOrderViewTypes'
import { linkifyText } from '@utils/linkify'

interface PricingTermsProps {
  orderDetails: Model
}

export function PricingTerms({ orderDetails }: PricingTermsProps) {
  const indexOfferDisplay = orderDetails?.IndexOfferDisplay
  const timeZoneAlias = orderDetails?.TimeZoneAlias || serverTimeZoneAlias

  if (!orderDetails?.SourceIndexOfferId) return null
  const isVertical =
    indexOfferDisplay?.AdditionalFreetextTerms && indexOfferDisplay.AdditionalFreetextTerms?.length > 50
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
              <Horizontal className='justify-sb bg-1 mr-2' style={{ minHeight: 'fit-content' }}>
                <Texto appearance='medium' weight={600}>
                  Effective Times
                </Texto>
                <Texto appearance='medium'>
                  {indexOfferDisplay.PricingEffectiveTimes}
                  {timeZoneAlias ? ` ${timeZoneAlias}` : ''}
                </Texto>
              </Horizontal>
            )}
            {indexOfferDisplay?.PricingWeekendBehavior && (
              <Horizontal className='mt-2 justify-sb bg-1 mr-2' style={{ minHeight: 'fit-content' }}>
                <Texto appearance='medium' weight={600}>
                  Weekend Behavior
                </Texto>
                <Texto appearance='medium'>{indexOfferDisplay.PricingWeekendBehavior}</Texto>
              </Horizontal>
            )}
            {indexOfferDisplay?.PricingHolidayBehavior && (
              <Horizontal className='mt-2 justify-sb bg-1 mr-2' style={{ minHeight: 'fit-content' }}>
                <Texto appearance='medium' weight={600}>
                  Holiday Behavior
                </Texto>
                <Texto appearance='medium'>{indexOfferDisplay.PricingHolidayBehavior}</Texto>
              </Horizontal>
            )}
            {isVertical ? (
              <Vertical className='mt-2 justify-sb bg-1 mr-2'>
                <Texto appearance='medium' weight={600}>
                  Terms
                </Texto>
                <Texto
                  appearance='medium'
                  className={'px-2'}
                  style={{
                    maxHeight: 150,
                    overflowY: 'auto',
                    textAlign: 'justify',
                  }}
                >
                  {linkifyText(orderDetails?.IndexOfferDisplay?.AdditionalFreetextTerms, '')}
                </Texto>
              </Vertical>
            ) : (
              <Horizontal className='mt-2 justify-sb bg-1 mr-2' style={{ minHeight: 'fit-content' }}>
                <Texto appearance='medium' weight={600}>
                  Terms
                </Texto>
                <Texto appearance='medium'>{linkifyText(indexOfferDisplay?.AdditionalFreetextTerms, 'N/A')}</Texto>
              </Horizontal>
            )}
          </Vertical>
        </Horizontal>
      </Vertical>
    </div>
  )
}
