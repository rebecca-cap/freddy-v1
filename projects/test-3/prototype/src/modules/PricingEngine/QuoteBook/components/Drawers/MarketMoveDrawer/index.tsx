import { FormulaBreakdownAndValuationContent } from '@components/shared/Drawers/FormulaBreakdownAndValuationDrawer/components/FormulaBreakdownAndValuationContent'
import { useMarketMoveBreakdownAndValuation } from '@modules/PricingEngine/QuoteBook/components/Drawers/MarketMoveDrawer/api/useMarketMoveBreakdownAndValuation'
import { Drawer } from 'antd'
import React from 'react'

export function MarketMoveBreakdownAndValuationDrawer({
  isMarketMoveBreakdownAndValuationDrawerOpen,
  setIsMarketMoveBreakdownAndValuationDrawerOpen,
  selectedValuationRow,
  setSelectedValuationRow,
  publicationMode,
}) {
  const { getMarketMoveBreakdown } = useMarketMoveBreakdownAndValuation()

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
      visible={isMarketMoveBreakdownAndValuationDrawerOpen}
    >
      <FormulaBreakdownAndValuationContent isFetchingData={isFetching} data={data?.Data} />
    </Drawer>
  )
}
