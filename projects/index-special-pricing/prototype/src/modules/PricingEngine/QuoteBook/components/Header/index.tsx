import '../../styles.css'

import { Vertical } from '@gravitate-js/excalibrr'
import { QuoteAnalyticsView } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView'
import { QuoteBookTabSelection } from '@modules/PricingEngine/QuoteBook/Components/Header/QuoteBookTabSelection'
import React from 'react'

export function QuoteBookHeader({
  metadata,
  selectedGroupTabs,
  selectedAnalyticsRow,
  tooManySelected,
  showAnalytics,
  setSelectedGroupTabs,
  tabOrder,
  setTabOrder,
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
      <div className='quoteBook-tab-container'>
        <QuoteBookTabSelection
          metadata={metadata}
          selectedGroupTabs={selectedGroupTabs}
          handleTabSelect={handleTabSelect}
          tabOrder={tabOrder}
          setTabOrder={setTabOrder}
        />
      </div>
      <Vertical className='quoteBook-analytics-panel' style={{ height: showAnalytics ? '1100px' : '0px' }}>
        <QuoteAnalyticsView selectedRow={selectedAnalyticsRow} tooManySelected={tooManySelected} />
      </Vertical>
    </>
  )
}
