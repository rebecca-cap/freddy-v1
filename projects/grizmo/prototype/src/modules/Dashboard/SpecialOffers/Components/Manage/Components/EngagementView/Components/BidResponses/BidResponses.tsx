import { APIResponse } from '@api/globalTypes'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { BidResponsesGrid } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/Components/BidResponses/BidResponsesGrid'
import { Skeleton } from 'antd'

type PriceDiscoveryProps = { specialOfferDetails?: APIResponse<SpecialOfferBreakdownResponseData>; loading: boolean }

export function BidResponses({ specialOfferDetails, loading }: PriceDiscoveryProps) {
  if (!specialOfferDetails?.Data?.SubmittedOrders) return <Skeleton active={true} />

  return (
    <Vertical className={'mt-5'}>
      <Texto category={'h4'}>Bid Responses</Texto>
      <Vertical className={'mt-3'}>
        <BidResponsesGrid
          rowData={specialOfferDetails?.Data?.SubmittedOrders}
          loading={loading}
          reservePrice={specialOfferDetails?.Data?.OfferInfo?.ReservePrice}
        />
      </Vertical>
    </Vertical>
  )
}
