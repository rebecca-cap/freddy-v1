import { useContractManagementContext } from '@contexts/ContractManagement'
import { GraviButton, GraviGrid, Horizontal } from '@gravitate-js/excalibrr'
import { Detail, Price } from '@modules/ContractManagement/api/types.schema'
import { PriceProvisionDisplay } from '@modules/ContractManagement/components/DetailManager/PriceManagement/PriceProvisionDisplay'
import { ProvisionTypes } from '@modules/ContractManagement/utils'
import { Tooltip } from 'antd'
import React, { useCallback, useEffect, useMemo } from 'react'

import { AllDetailsGridMasterDetailColumnDefs } from './AllDetailsGridMasterDetailColumnDefs'

export interface AllDetailsGridMasterDetailProps {
  data: Detail
}
export function AllDetailsGridMasterDetail({ data }: AllDetailsGridMasterDetailProps) {
  const {
    canWrite,
    hasDetailEdits,
    isFetchingDetailValuation,
    refetchValuation,
    detailValuationPayload,
    isFetchingContractValuation,
    retrieveValuationData,
    header,
  } = useContractManagementContext()
  const isFetchingValuation = useMemo(
    () =>
      !!(isFetchingDetailValuation && detailValuationPayload?.includes(data?.TradeEntryDetailId)) ||
      isFetchingContractValuation,
    [isFetchingDetailValuation, detailValuationPayload, isFetchingContractValuation, data]
  )
  const columnDefsMemo = useMemo(
    () => AllDetailsGridMasterDetailColumnDefs({ detailId: data?.TradeEntryDetailId }),
    [data]
  )

  const controlBarProps = useMemo(() => {
    return {
      title: 'Prices',
      actionButtons: canWrite && (
        <Horizontal verticalCenter>
          <Tooltip
            title={
              hasDetailEdits || !data?.TradeEntryDetailId ? 'Please save changes to enable valuation refresh.' : ''
            }
          >
            <GraviButton
              buttonText='Refresh Values'
              onClick={() => {
                if (isFetchingDetailValuation || hasDetailEdits || !data?.TradeEntryDetailId) {
                  return
                }
                refetchValuation(data?.TradeEntryDetailId)
              }}
              loading={hasDetailEdits ? false : isFetchingValuation}
              className={hasDetailEdits || !data?.TradeEntryDetailId ? 'disabled-gravi-button' : ''}
            />
          </Tooltip>
        </Horizontal>
      ),
    }
  }, [canWrite, hasDetailEdits, isFetchingDetailValuation, data, isFetchingValuation])
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data.TradeEntryPriceId || row.data.LocalTradeEntryPriceId,
      domLayout: 'autoHeight' as const,
      rowGroupPanelShow: 'never' as const,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
    }),
    []
  )
  const detailCellRendererParams = useMemo(
    () => ({
      detailId: data?.TradeEntryDetailId,
      isExtracted: header?.IsExtracted,
    }),
    [data]
  )
  const rowData = useMemo(() => data?.Prices, [data])
  const isRowMaster = useCallback((row: Price) => row.ProvisionType !== ProvisionTypes.FIXED, [data])
  useEffect(() => {
    retrieveValuationData(data.TradeEntryDetailId)
  }, [data.TradeEntryDetailId])
  return (
    <div className='p-3 bg-2'>
      <GraviGrid
        controlBarProps={controlBarProps}
        agPropOverrides={agPropOverrides}
        columnDefs={columnDefsMemo}
        rowData={rowData}
        isRowMaster={isRowMaster}
        masterDetail
        detailRowAutoHeight
        detailCellRenderer={PriceProvisionDisplay}
        detailCellRendererParams={detailCellRendererParams}
        storageKey='contracts::all-details-inner-grid'
      />
    </div>
  )
}
