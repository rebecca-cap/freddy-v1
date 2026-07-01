import { useQuoteBookAnalyticsTyped } from '@api/useQuoteBookAnalytics/useQuoteBookAnalyticsTyped'
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

import { Loading, NoData } from '../common/messageAskingUserToSelectAQuoteRow'
import { LiftingVsMarginDetails } from './components/Details'
import { LiftingVsMarginGraph } from './components/Graph'

interface LiftingVsBenchmarkViewProps {
  quoteRowId: number
  fromDate: Date
  toDate: Date
}

function LiftingVsMarginView({ quoteRowId, fromDate, toDate }: LiftingVsBenchmarkViewProps) {
  const [selectedDetailDate, setSelectedDetailDate] = React.useState<string | null>(null)
  const { useQuoteAnalyticsLiftingVsMargin } = useQuoteBookAnalyticsTyped()
  const { data, isLoading } = useQuoteAnalyticsLiftingVsMargin(quoteRowId, fromDate, toDate)
  const sortedDetails = useMemo(() => {
    if (!data?.Details) return []
    const detailCopy = [...data.Details]
    detailCopy.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
    return detailCopy
  }, [data?.Details])

  if (isLoading) {
    return <Loading />
  }

  if (data?.HasData === false || !data?.GraphData?.length || !data?.Details?.length) {
    return <NoData />
  }
  return (
    <Horizontal fullHeight>
      <Vertical flex={1} style={{ maxWidth: '350px', minWidth: '300px' }}>
        <LiftingVsMarginDetails
          details={sortedDetails}
          selected={selectedDetailDate}
          onSelect={setSelectedDetailDate}
        />
      </Vertical>
      <Vertical flex={3}>
        <LiftingVsMarginGraph graphData={data.GraphData} selectedDate={selectedDetailDate} />
      </Vertical>
    </Horizontal>
  )
}

export { LiftingVsMarginView }
