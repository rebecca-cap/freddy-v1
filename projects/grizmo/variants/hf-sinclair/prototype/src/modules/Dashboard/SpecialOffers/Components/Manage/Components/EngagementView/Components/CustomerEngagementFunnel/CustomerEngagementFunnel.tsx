import { APIResponse } from '@api/globalTypes'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { StageStatCard } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/Components/CustomerEngagementFunnel/StageStatCard'
import { ViewCustomers } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/Components/CustomerEngagementFunnel/ViewCustomers'
import {
  buildEngagementStages,
  EngagementStage,
} from '@modules/Dashboard/SpecialOffers/utils/Utils/CustomerEngagementHelpers'
import { Skeleton } from 'antd'
import { useState } from 'react'

type CustomerEngagementFunnelProps = {
  specialOfferDetails?: APIResponse<SpecialOfferBreakdownResponseData>
}

export function CustomerEngagementFunnel({ specialOfferDetails }: CustomerEngagementFunnelProps) {
  const engagement = specialOfferDetails?.Data?.CustomerEngagement
  const stages = buildEngagementStages(engagement)

  const [viewCustomersModalOpen, setViewCustomersModalOpen] = useState(false)
  const [selectedStage, setSelectedStage] = useState<EngagementStage | null>(null)

  if (!engagement) return <Skeleton active={true} />

  return (
    <Vertical>
      <Texto category={'h4'}>Customer Engagement Funnel</Texto>
      <Vertical className={'info-container'}>
        <Texto category={'h5'}>Stage Details</Texto>
        <Horizontal className={'mt-2 '} flex={1} verticalCenter justifyContent='space-between'>
          {stages.map((s) => (
            <StageStatCard
              key={s.key}
              step={s.step}
              title={s.title}
              count={s.count}
              percent={s.percent}
              lostText={s.lostText}
              onViewCustomers={() => {
                setSelectedStage(s)
                setViewCustomersModalOpen(true)
              }}
            />
          ))}
        </Horizontal>
        <ViewCustomers
          viewCustomersModalOpen={viewCustomersModalOpen}
          setViewCustomersModalOpen={setViewCustomersModalOpen}
          stage={selectedStage}
        />
      </Vertical>
    </Vertical>
  )
}
