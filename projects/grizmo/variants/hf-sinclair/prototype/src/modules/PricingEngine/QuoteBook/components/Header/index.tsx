import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { QuoteAnalyticsView } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView'
import { QuoteBookTabSelection } from '@modules/PricingEngine/QuoteBook/components/Header/QuoteBookTabSelection'
import React from 'react'

export function QuoteBookHeader({
  metadata,
  selectedGroupTabs,
  selectedAnalyticsRow,
  tooManySelected,
  showAnalytics,
  setSelectedGroupTabs,
}) {
  const handleTabSelect = (tabKey: string) => {
    // Disallow deselecting all tabs
    if (selectedGroupTabs?.length < 2 && selectedGroupTabs?.includes(tabKey)) return

    setSelectedGroupTabs((groups) =>
      groups.includes(tabKey) ? groups.filter((g) => g !== tabKey) : [...groups, tabKey]
    )
  }
  return (
    <>
      <Horizontal style={{ width: '100%', height: 'auto', overflowX: 'scroll', flexShrink: 0 }}>
        <QuoteBookTabSelection
          metadata={metadata}
          selectedGroupTabs={selectedGroupTabs}
          handleTabSelect={handleTabSelect}
        />
      </Horizontal>
      <Vertical
        style={{
          height: showAnalytics ? '1100px' : '0px',
          transition: '1s ease',
          padding: 0,
          zIndex: 0,
        }}
      >
        <QuoteAnalyticsView selectedRow={selectedAnalyticsRow} tooManySelected={tooManySelected} />
      </Vertical>
    </>
  )
}
