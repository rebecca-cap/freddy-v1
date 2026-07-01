import { useQuoteBookTyped } from '@modules/PricingEngine/QuoteBook/Api/useQuoteBookTyped'
import { QuoteBookPublishConfirmContent } from '@modules/PricingEngine/QuoteBook/Components/Drawers/QuoteBookPublishConfirmDrawer/components/QuoteBookPublishConfirmContent'
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
  showOriginDestinationColumns?: boolean
  showLocationColumn?: boolean
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
  showOriginDestinationColumns,
  showLocationColumn,
}: QuoteBookPublishConfirmDrawerProps) {
  const { useQuoteBookPublishMutation } = useQuoteBookTyped()

  const publishEOD = useQuoteBookPublishMutation()

  return (
    <Drawer
      className='quoteBook-eod-drawer'
      title={`${gridTitle} Publish`}
      open={isConfirmDrawerOpen}
      placement='bottom'
      onClose={() => setIsConfirmDrawerOpen(false)}
      width='100vw'
      height='80vh'
      destroyOnHidden
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
        showOriginDestinationColumns={showOriginDestinationColumns}
        showLocationColumn={showLocationColumn}
      />
    </Drawer>
  )
}
