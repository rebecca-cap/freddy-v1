import { APIResponse } from '@api/globalTypes'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import VolumeAnalysisChart from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/Components/VolumeAnalysis/VolumeAnalysisChart'
import { VolumeAnalysisStatusBanner } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/Components/VolumeAnalysis/VolumeAnalysisStatusBanner'
import { Skeleton } from 'antd'

export type VolumeAnalysisProps = { specialOfferDetails?: APIResponse<SpecialOfferBreakdownResponseData> }

export function VolumeAnalysis({ specialOfferDetails }: VolumeAnalysisProps) {
  if (!specialOfferDetails?.Data?.VolumeAnalysis) return <Skeleton active={true} />

  return (
    <Vertical className={'mt-5'}>
      <Texto category={'h4'}>Volume Analysis</Texto>
      <Vertical className={'info-container'}>
        <VolumeAnalysisChart volumeAnalysis={specialOfferDetails?.Data?.VolumeAnalysis} />
        <VolumeAnalysisStatusBanner specialOfferDetails={specialOfferDetails} />
      </Vertical>
    </Vertical>
  )
}
