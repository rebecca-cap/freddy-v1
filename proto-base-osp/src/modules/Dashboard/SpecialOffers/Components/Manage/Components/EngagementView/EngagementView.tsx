import { APIResponse } from '@api/globalTypes'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { BidResponses } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/Components/BidResponses/BidResponses'
import { CustomerEngagementFunnel } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/Components/CustomerEngagementFunnel/CustomerEngagementFunnel'
import { PriceDiscovery } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/Components/PriceDiscovery/PriceDiscovery'
import { VolumeAnalysis } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/Components/VolumeAnalysis/VolumeAnalysis'

type EngagementViewProps = {
  loading: boolean
  specialOfferDetails?: APIResponse<SpecialOfferBreakdownResponseData>
}

export function EngagementView({ specialOfferDetails, loading }: EngagementViewProps) {
  return (
    <div className={'mt-4 pb-5'}>
      <CustomerEngagementFunnel specialOfferDetails={specialOfferDetails} />
      <PriceDiscovery specialOfferDetails={specialOfferDetails} />
      <VolumeAnalysis specialOfferDetails={specialOfferDetails} />
      <BidResponses specialOfferDetails={specialOfferDetails} loading={loading} />
    </div>
  )
}
