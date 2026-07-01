import { InfoCircleOutlined } from '@ant-design/icons'
import { APIResponse } from '@api/globalTypes'
import { addCommasToNumber, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'

type VolumeAnalysisStatusBannerProps = {
  specialOfferDetails: APIResponse<SpecialOfferBreakdownResponseData>
}

export function VolumeAnalysisStatusBanner({ specialOfferDetails }: VolumeAnalysisStatusBannerProps) {
  const totalBidAmount = specialOfferDetails.Data?.SubmittedOrders.filter((o) => o.OrderStatus === 'Pending').reduce(
    (a, b) => a + b.OrderVolume,
    0
  )
  const acceptedVolumeAmount = specialOfferDetails.Data?.SubmittedOrders.filter(
    (o) => o.OrderStatus === 'Accepted'
  ).reduce((a, b) => a + b.OrderVolume, 0)

  const remainingCapacity = specialOfferDetails?.Data?.VolumeAnalysis?.RemainingVolume
  const totalAvailable = specialOfferDetails?.Data?.VolumeAnalysis?.TotalVolume

  const pendingOrdersAvailable = specialOfferDetails?.Data?.SubmittedOrders.some((o) => o.OrderStatus === 'Pending')
  const showBanner = acceptedVolumeAmount + totalBidAmount > totalAvailable && pendingOrdersAvailable

  const exceedAmount = showBanner ? Math.abs(totalAvailable - (acceptedVolumeAmount + totalBidAmount)) : 0

  if (!showBanner) {
    return null
  }

  return (
    <Horizontal className={'volume-analysis-status-banner-container'} verticalCenter>
      <Texto className={'mr-2'}>
        <InfoCircleOutlined />
      </Texto>
      <Texto>
        Accepting all pending bids would exceed capacity by {addCommasToNumber(exceedAmount)} gal(s). You can accept up
        to {addCommasToNumber(remainingCapacity)} gal(s) more.
      </Texto>
    </Horizontal>
  )
}
