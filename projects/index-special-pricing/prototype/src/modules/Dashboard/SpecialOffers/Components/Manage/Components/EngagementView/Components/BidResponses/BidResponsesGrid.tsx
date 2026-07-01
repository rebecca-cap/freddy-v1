import { GraviGrid, NotificationMessage } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { SpecialOfferBreakdownSubmittedOrder } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import {
  ApproveSpecialOfferOrderRequest,
  RejectSpecialOfferOrderRequest,
  useSpecialOffersTyped,
} from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffersTyped'
import { BidResponsesColumns } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/Components/BidResponses/BidResponsesColumnDef'
import React, { useMemo } from 'react'

type BidResponsesGridProps = {
  rowData?: SpecialOfferBreakdownSubmittedOrder[]
  loading?: boolean
  reservePrice?: number
  uomSymbol?: string
}

export function BidResponsesGrid({ rowData, loading, reservePrice, uomSymbol }: BidResponsesGridProps) {
  const storageKey = 'BidResponsesGrid'
  const gridViewManager = useGridViewManager(storageKey)

  const { approveSpecialOfferOrder, rejectSpecialOfferOrder } = useSpecialOffersTyped()
  const approveSpecialOfferOrderMutation = approveSpecialOfferOrder()
  const rejectSpecialOfferOrderMutation = rejectSpecialOfferOrder()

  const isGridLoading = useMemo(
    () => loading || approveSpecialOfferOrderMutation.isPending,
    [loading, approveSpecialOfferOrderMutation.isPending]
  )

  const controlBarProps = useMemo(
    () => ({
      title: '',
      hideActiveFilters: false,
    }),
    []
  )
  const agPropOverrides = useMemo(
    () => ({
      rowGroupPanelShow: 'never' as const,
      getRowId: (row) => row.data.TradeEntryId?.toString(),
    }),
    []
  )

  const handleApprove = async (row: SpecialOfferBreakdownSubmittedOrder) => {
    const selectedTradeEntryId = row.TradeEntryId
    const payload: ApproveSpecialOfferOrderRequest = { TradeEntryId: selectedTradeEntryId, VersionIdentifier: row.VersionIdentifier }
    try {
      const response = await approveSpecialOfferOrderMutation.mutateAsync(payload)
      if (!response?.Validations) {
        NotificationMessage('Bid Accepted', `The bid from ${row.CustomerName} has been accepted`, false)
      } else {
        NotificationMessage(
          'Unable to accept',
          `The bid from ${row.CustomerName} could not be accepted. ${response.Validations[0]?.Message ?? ''}.`,
          true
        )
      }
    } catch (error: any) {
      const validations = error?.Validations ?? error?.json?.Validations
      const errorCategory = (validations?.[0]?.Category ?? '').replace(/([a-z])([A-Z])/g, '$1 $2')
      const errorMessage = validations?.[0]?.Message ?? ''
      NotificationMessage(
        `Unable to accept - ${errorCategory}`,
        `The bid from ${row.CustomerName} could not be accepted. ${errorMessage}`,
        true
      )
    }
  }

  const handleReject = async (row: SpecialOfferBreakdownSubmittedOrder) => {
    const selectedTradeEntryId = row.TradeEntryId
    const payload: RejectSpecialOfferOrderRequest = { TradeEntryId: selectedTradeEntryId }
    try {
      const response = await rejectSpecialOfferOrderMutation.mutateAsync(payload)

      if (!response?.Validations) {
        NotificationMessage('Bid Rejected', `The bid from ${row.CustomerName} has been rejected`, false)
      } else {
        NotificationMessage(
          'Unable to reject',
          `The bid from ${row.CustomerName} could not be rejected. ${response.Validations[0]?.Message ?? ''}.`,
          true
        )
      }
    } catch (error: any) {
      const validations = error?.Validations ?? error?.json?.Validations
      const errorCategory = (validations?.[0]?.Category ?? '').replace(/([a-z])([A-Z])/g, '$1 $2')
      const errorMessage = validations?.[0]?.Message ?? ''
      NotificationMessage(
        `Unable to reject - ${errorCategory}`,
        `The bid from ${row.CustomerName} could not be rejected. ${errorMessage}`,
        true
      )
    }
  }

  const getColumnDefs = useMemo(() => {
    return BidResponsesColumns({
      onApprove: handleApprove,
      onReject: handleReject,
      reservePrice,
      uomSymbol,
    })
  }, [rowData, reservePrice, uomSymbol])

  return (
    <div style={{ height: '400px' }}>
      <GraviGrid
        enableFilterContextMenu
        storageKey={storageKey}
        gridViewManager={gridViewManager}
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        columnDefs={getColumnDefs}
        rowData={rowData}
        loading={isGridLoading}
      />
    </div>
  )
}
