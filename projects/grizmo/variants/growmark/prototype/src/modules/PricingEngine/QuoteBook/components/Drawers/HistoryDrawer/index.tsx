import { Quote } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { useQuoteHistory } from '@modules/PricingEngine/QuoteBook/components/Drawers/HistoryDrawer/api/useQuoteHistory'
import { HistoryDrawerContent } from '@modules/PricingEngine/QuoteBook/components/Drawers/HistoryDrawer/components/HistoryDrawerContent'
import { Drawer } from 'antd'
import React from 'react'

interface QuoteBookHistoryDrawerProps {
  isQuoteHistoryDrawerOpen: boolean
  setIsQuoteHistoryDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedRowId: number | null
  quoteHistoryHeaderInfo?: Quote
}

export function QuoteBookHistoryDrawer({
  isQuoteHistoryDrawerOpen,
  setIsQuoteHistoryDrawerOpen,
  selectedRowId,
  quoteHistoryHeaderInfo,
}: QuoteBookHistoryDrawerProps) {
  const { useQuoteHistoryQuery, useQuoteBookHistoryMetaData } = useQuoteHistory()
  const { data: historyMetadata } = useQuoteBookHistoryMetaData(selectedRowId, isQuoteHistoryDrawerOpen)
  const { data: history, isFetching: isFetchingHistory } = useQuoteHistoryQuery(
    selectedRowId,
    isQuoteHistoryDrawerOpen,
    30
  )
  return (
    <Drawer
      className='quoteBook-history-drawer'
      title='Quote History'
      visible={isQuoteHistoryDrawerOpen}
      placement='bottom'
      onClose={() => setIsQuoteHistoryDrawerOpen(false)}
      width='100vw'
      height='90vh'
    >
      <HistoryDrawerContent
        history={history}
        isFetchingHistory={isFetchingHistory}
        metadata={historyMetadata}
        quoteHistoryHeaderInfo={quoteHistoryHeaderInfo}
      />
    </Drawer>
  )
}
