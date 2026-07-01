import { useQuoteBook } from '@modules/PricingEngine/QuoteBook/api/useQuoteBook'
import {
  QuoteBookPublishConfirmContent
} from '@modules/PricingEngine/QuoteBook/components/Drawers/QuoteBookPublishConfirmDrawer/components/QuoteBookPublishConfirmContent'
import { Drawer } from 'antd'
import React from 'react'

interface QuoteBookPublishConfirmDrawerProps {
  gridTitle: string
  isConfirmDrawerOpen: boolean
  setIsConfirmDrawerOpen: (isOpen: boolean) => void
  selectedRowsToPublish: any[]
  handleGridReset: () => void
  setPublishMode: (mode: boolean) => void
  publicationMode: string
  isUsingMarketMove?: boolean
}
export function QuoteBookPublishConfirmDrawer({
  gridTitle,
  isConfirmDrawerOpen,
  setIsConfirmDrawerOpen,
  selectedRowsToPublish,
  handleGridReset,
  setPublishMode,
  publicationMode,
  isUsingMarketMove,
}: QuoteBookPublishConfirmDrawerProps) {
  const { useQuoteBookPublishMutation } = useQuoteBook()

  const publishEOD = useQuoteBookPublishMutation()

  return (
    <Drawer
      className='quoteBook-eod-drawer'
      title={`${gridTitle} Publish`}
      visible={isConfirmDrawerOpen}
      placement='bottom'
      onClose={() => setIsConfirmDrawerOpen(false)}
      width='100vw'
      height='80vh'
      destroyOnClose={true}
    >
      <QuoteBookPublishConfirmContent
        dirtyQuotes={selectedRowsToPublish}
        setIsConfirmDrawerOpen={setIsConfirmDrawerOpen}
        publishEOD={publishEOD}
        handleGridReset={handleGridReset}
        setPublishMode={setPublishMode}
        publicationMode={publicationMode}
        title={gridTitle}
        isUsingMarketMove={isUsingMarketMove}
      />
    </Drawer>
  )
}
