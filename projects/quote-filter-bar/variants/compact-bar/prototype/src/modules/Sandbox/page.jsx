import { ForwardsGrid } from '../SellingPlatform/BuyNow/Forwards/components/Grid/components/Grid'
import { PricingInformation } from '../SellingPlatform/BuyNow/Forwards/components/Modal/components/SecondStep/components/PricingInformation'
import { availableItems } from '../SellingPlatform/BuyNow/Forwards/tests/mocks/availableItems'

export function Sandbox() {
  // return <PricingInformation price={3} />
  return (
    <ForwardsGrid
      selectedPeriodIds={[]}
      areItemsLoading={false}
      availableItems={availableItems}
      hasBadSelection={false}
      hasTasInstruments={false}
      tasMode={false}
    />
  )
}
