import { GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import {
  CustomerLiftingRow,
  CustomerLiftingTotals,
} from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/CustomerLiftingsView/api/schema.types'
import { useQuoteAnalyticsCustomerLiftingsTyped } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/CustomerLiftingsView/api/useQuoteAnalyticsCustomerLiftingsTyped'
import { CustomerLiftingsColumns } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/CustomerLiftingsView/components/colDefs'
import { CustomerLiftingsTotals } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/CustomerLiftingsView/components/CustomerLiftingsTotals'
import { GridApi } from 'ag-grid-community'
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'

import { Loading, NoData } from '../common/messageAskingUserToSelectAQuoteRow'

interface CustomerLiftingsViewProps {
  quoteRowId: number
  fromDate: Date
  toDate: Date
}
export interface MappedColors {
  color: string
  name: string
}
export function CustomerLiftingsView({ quoteRowId, fromDate, toDate }: CustomerLiftingsViewProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null)

  const storageKey = `QuoteAnalytics::CustomerLiftingsView-${quoteRowId}`
  const gridAPIRef = useRef() as MutableRefObject<GridApi>
  const gridViewManager = useGridViewManager(storageKey)

  const { useQuoteAnalyticsLiftings } = useQuoteAnalyticsCustomerLiftingsTyped()

  const { data: customerLiftingsData, isLoading: isCustomerLiftingsLoading } = useQuoteAnalyticsLiftings(
    quoteRowId,
    fromDate,
    toDate
  )

  const customerLiftingRows = useMemo((): CustomerLiftingRow[] | null => {
    if (customerLiftingsData) {
      return customerLiftingsData?.Rows
    }
    return null
  }, [customerLiftingsData])

  const customerLiftingTotals = useMemo((): CustomerLiftingTotals | null => {
    if (customerLiftingsData) {
      return customerLiftingsData?.Totals
    }
    return null
  }, [customerLiftingsData])

  const columnDefs = useMemo(() => {
    return CustomerLiftingsColumns()
  }, [customerLiftingRows, selectedCustomer])

  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (row) => row?.data?.CounterPartyId?.toString() || '',
    }
  }, [])

  useEffect(() => {
    if (gridAPIRef?.current) {
      if (selectedCustomer) {
        gridAPIRef.current.deselectAll()
        const node = gridAPIRef.current.getRowNode(selectedCustomer?.toString())
        node?.setSelected(true)
        gridAPIRef.current.ensureNodeVisible(node)
      } else {
        gridAPIRef.current.deselectAll()
      }
    }
  }, [selectedCustomer, gridAPIRef?.current])

  if (isCustomerLiftingsLoading) return <Loading />
  if (!customerLiftingRows?.length) return <NoData />

  return (
    <Horizontal style={{ height: '100vh' }}>
      <Vertical flex={1}>
        <CustomerLiftingsTotals customerLiftingTotals={customerLiftingTotals} />
      </Vertical>
      <Vertical flex={8}>
        <GraviGrid
          enableFilterContextMenu
          externalRef={gridAPIRef}
          storageKey={storageKey}
          gridViewManager={gridViewManager}
          rowData={customerLiftingRows}
          agPropOverrides={agPropOverrides}
          loading={isCustomerLiftingsLoading}
          columnDefs={columnDefs}
        />
      </Vertical>
    </Horizontal>
  )
}
