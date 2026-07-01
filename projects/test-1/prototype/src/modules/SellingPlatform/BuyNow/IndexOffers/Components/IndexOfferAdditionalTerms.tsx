import { useIndexOffersContext } from '@contexts/IndexOffersContext'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'

export function IndexOfferAdditionalTerms() {
  const { entryData } = useIndexOffersContext()
  const selectedIndexOffer = entryData?.SelectedIndexOffer

  return (
    <Vertical flex={3}>
      <Texto category='h6' weight={900} className='mr-2'>
        ADDITIONAL TERMS
      </Texto>
      <Horizontal className={'mt-4'}>
        <Vertical>
          <Texto>Price Validity</Texto>
          <Texto className={'mt-2'} weight={'bold'}>
            {selectedIndexOffer?.PricingEffectiveTimes ?? '-'}
          </Texto>
        </Vertical>
        <Vertical>
          <Texto>Weekend Rule</Texto>
          <Texto className={'mt-2'} weight={'bold'}>
            {selectedIndexOffer?.PricingWeekendBehavior ?? '-'}
          </Texto>
        </Vertical>
      </Horizontal>
      <Texto className={'mt-4'}>Holiday Rule</Texto>
      <Texto className={'mt-2'} weight={'bold'}>
        {selectedIndexOffer?.PricingHolidayBehavior ?? '-'}
      </Texto>
      <Texto weight={'bold'} className={'mt-4'}>
        TERMS
      </Texto>
      <Vertical className='index-offer-terms-container'>
        <Texto className='mt-2'>{selectedIndexOffer?.AdditionalFreetextTerms || 'N/A'}</Texto>
      </Vertical>
    </Vertical>
  )
}
