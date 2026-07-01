import { FormulaBreakdownAndValuationContent } from '@components/shared/Drawers/FormulaBreakdownAndValuationDrawer/components/FormulaBreakdownAndValuationContent'
import { useMarketMoveBreakdownAndValuationTyped } from '@modules/PricingEngine/QuoteBook/Components/Drawers/MarketMoveDrawer/api/useMarketMoveBreakdownAndValuationTyped'
import { Drawer } from 'antd'
import React from 'react'

export function MarketMoveBreakdownAndValuationDrawer({
  isMarketMoveBreakdownAndValuationDrawerOpen,
  setIsMarketMoveBreakdownAndValuationDrawerOpen,
  selectedValuationRow,
  setSelectedValuationRow,
  publicationMode,
}) {
  const { getMarketMoveBreakdown } = useMarketMoveBreakdownAndValuationTyped()

  const { data, isFetching } = getMarketMoveBreakdown(selectedValuationRow, publicationMode)

  const closeAndClearSelection = () => {
    setIsMarketMoveBreakdownAndValuationDrawerOpen(false)
    setSelectedValuationRow(null)
  }
  return (
    <Drawer
      className='quoteBook-drawer'
      title='Valuation Drawer'
      placement='right'
      onClose={closeAndClearSelection}
      width='50vw'
      open={isMarketMoveBreakdownAndValuationDrawerOpen}
    >
      <FormulaBreakdownAndValuationContent isFetchingData={isFetching} data={data?.Data} />
    </Drawer>
  )
}
