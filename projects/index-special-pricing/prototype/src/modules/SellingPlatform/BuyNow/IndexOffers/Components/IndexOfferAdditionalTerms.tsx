import { useIndexOffersContext } from '@contexts/IndexOffersContext'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { TitleText } from '@modules/SellingPlatform/BuyNow/IndexOffers/Components/TitleText'
import { linkifyText } from '@utils/linkify'
import { formatTimeRange } from '@utils/timezone'
import styles from '../styles.module.css'

export function IndexOfferAdditionalTerms() {
  const { entryData } = useIndexOffersContext()
  const selectedIndexOffer = entryData?.SelectedIndexOffer
  const timeZoneAlias = entryData?.SpecialOfferData?.LocationTimeZoneAlias || serverTimeZoneAlias
  const priceValidity = selectedIndexOffer?.PricingEffectiveTimes
    ? `${formatTimeRange(selectedIndexOffer.PricingEffectiveTimes)}${timeZoneAlias ? ` ${timeZoneAlias}` : ''}`
    : '-'
  return (
    <Vertical flex={3} className={styles.columnDivider}>
      <TitleText title={'additional terms'} />
      <div className={`mt-4 ${styles.additionalTermsGrid}`}>
        <div>
          <Texto category={'p2'}>Price Validity </Texto>
          <Texto className={'mt-1'} weight={'bold'}>
            {priceValidity}
          </Texto>
        </div>
        <div>
          <Texto category={'p2'}>Weekend Rule</Texto>
          <Texto className={'mt-1'} weight={'bold'}>
            {selectedIndexOffer?.PricingWeekendBehavior ?? '-'}
          </Texto>
        </div>
        <div>
          <Texto category={'p2'}>Holiday Rule</Texto>
          <Texto className={'mt-1'} weight={'bold'}>
            {selectedIndexOffer?.PricingHolidayBehavior ?? '-'}
          </Texto>
        </div>
      </div>
      <Texto weight={'bold'} category={'p2'} className={`mt-4`}>
        TERMS
      </Texto>
      <div className={styles.termsContainer}>
        <Texto>{linkifyText(selectedIndexOffer?.AdditionalFreetextTerms, 'N/A')}</Texto>
      </div>
    </Vertical>
  )
}
