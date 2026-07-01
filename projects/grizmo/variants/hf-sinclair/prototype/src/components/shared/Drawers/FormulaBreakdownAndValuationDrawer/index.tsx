import { useFormulaBreakdownAndValuation } from '@components/shared/Drawers/FormulaBreakdownAndValuationDrawer/api/useFormulaBreakdownAndValuation'
import { FormulaBreakdownAndValuationContent } from '@components/shared/Drawers/FormulaBreakdownAndValuationDrawer/components/FormulaBreakdownAndValuationContent'
import { Drawer } from 'antd'
import React from 'react'

interface FormulaBreakdownAndValuationDrawerProps {
  setIsFormulaBreakdownAndValuationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  isFormulaBreakdownAndValuationDrawerOpen: boolean
  selectedValuationId: number | null
  setSelectedValuationId?: React.Dispatch<React.SetStateAction<number | null>>
}
export function FormulaBreakdownAndValuationDrawer({
  setIsFormulaBreakdownAndValuationDrawerOpen,
  isFormulaBreakdownAndValuationDrawerOpen,
  selectedValuationId,
  setSelectedValuationId,
}: FormulaBreakdownAndValuationDrawerProps) {
  const { getFormulaBreakdownAndValuationById } = useFormulaBreakdownAndValuation()
  const { data, isFetching } = getFormulaBreakdownAndValuationById(selectedValuationId)

  const closeAndClearSelection = () => {
    setIsFormulaBreakdownAndValuationDrawerOpen(false)
    setSelectedValuationId && setSelectedValuationId(null)
  }
  return (
    <Drawer
      className='quoteBook-drawer'
      title='Valuation Drawer'
      placement='right'
      onClose={closeAndClearSelection}
      width='50vw'
      visible={isFormulaBreakdownAndValuationDrawerOpen}
    >
      <FormulaBreakdownAndValuationContent isFetchingData={isFetching} data={data?.Data} />
    </Drawer>
  )
}
