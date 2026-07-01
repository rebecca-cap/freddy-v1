import { APIResponse } from '@api/globalTypes'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import PriceDiscoveryChart from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/Components/PriceDiscovery/PriceDiscoveryChart'
import { Skeleton } from 'antd'

type PriceDiscoveryProps = { specialOfferDetails?: APIResponse<SpecialOfferBreakdownResponseData> }

export function PriceDiscovery({ specialOfferDetails }: PriceDiscoveryProps) {
  if (!specialOfferDetails?.Data?.PriceDiscovery) return <Skeleton active={true} />

  return (
    <Vertical className={'mt-5'}>
      <Texto category={'h4'}>Price Discovery</Texto>
      <Vertical className={'info-container'}>
        <PriceDiscoveryChart
          priceDiscovery={specialOfferDetails?.Data?.PriceDiscovery}
          uomSymbol={specialOfferDetails?.Data?.OfferInfo?.UnitOfMeasureSymbol ?? undefined}
        />
      </Vertical>
    </Vertical>
  )
}
