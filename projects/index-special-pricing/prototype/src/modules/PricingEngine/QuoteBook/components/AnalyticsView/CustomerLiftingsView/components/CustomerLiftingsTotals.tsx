import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { CustomerLiftingTotals } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/CustomerLiftingsView/api/schema.types'
import { numberToShortString } from '@utils/index'

type CustomerLiftingsTotalsProps = {
  customerLiftingTotals: CustomerLiftingTotals | null
}

export function CustomerLiftingsTotals({ customerLiftingTotals }: CustomerLiftingsTotalsProps) {
  return (
    <Vertical className={'p-4'} justifyContent={'space-around'}>
      <Vertical className={' customer-liftings-total-card'}>
        <Texto className={'customer-liftings-total-card-text'} category={'h4'}>
          {numberToShortString(customerLiftingTotals?.TotalVolume, 2)}
        </Texto>
        <Texto>Total Volume (gal) </Texto>
      </Vertical>
      <Vertical className={' customer-liftings-total-card'}>
        <Texto className={'customer-liftings-total-card-text'} category={'h4'}>
          {fmt.currency(customerLiftingTotals?.StrategyDelta)}
        </Texto>
        <Texto>Strategy Delta </Texto>
      </Vertical>
      <Vertical className={' customer-liftings-total-card'}>
        <Texto className={'customer-liftings-total-card-text'} category={'h4'}>
          ${numberToShortString(customerLiftingTotals?.TotalDiscounted, 2, true)}
        </Texto>
        <Texto>Total Discounted $</Texto>
      </Vertical>
      <Vertical className={' customer-liftings-total-card'}>
        <Texto className={'customer-liftings-total-card-text'} category={'h4'}>
          {customerLiftingTotals?.Customers}
        </Texto>
        <Texto>Active Customers</Texto>
      </Vertical>
    </Vertical>
  )
}
