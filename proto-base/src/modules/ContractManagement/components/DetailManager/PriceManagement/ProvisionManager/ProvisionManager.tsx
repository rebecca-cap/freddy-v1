import { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { useContractManagementContext } from '@contexts/ContractManagement'
import { GraviButton, GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Detail, Price } from '@modules/ContractManagement/api/types.schema'
import { ProvisionEditorDrawer } from '@modules/ContractManagement/components/DetailManager/PriceManagement/ProvisionManager/Components/ProvisionEditorDrawer'
import { GridApi } from 'ag-grid-community'
import { Tooltip } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { checkDetailForInvalidPriceDates, getPriceStatus, ProvisionTypes } from '../../../../utils'
import { blankFixedProvision } from '../../../../utils/blankItems'
import { columnDefs } from '../priceColDefs'
import { PriceProvisionDisplay } from '../PriceProvisionDisplay'

export interface ProvisionManagerProps {
  managedDetail: Detail
  setManagedDetail: React.Dispatch<React.SetStateAction<Detail>>
}
export function ProvisionManager({ managedDetail, setManagedDetail }: ProvisionManagerProps) {
  const {
    metadata,
    setHasDetailEdits,
    header,
    activeTabId,
    canWrite,
    retrieveValuationData,
    hasDetailEdits,
    isFetchingDetailValuation,
    refetchValuation,
  } = useContractManagementContext()
  const [provisionToEdit, setProvisionToEdit] = useState<Price>()
  const gridAPIRef = useRef<GridApi>() as React.MutableRefObject<GridApi>

  useEffect(() => {
    setManagedDetail((prev) => {
      const updatedPrices = prev?.Prices?.map((price) => {
        return {
          ...price,
          Status: getPriceStatus(
            price,
            price.ProvisionType,
            null,
            managedDetail?.FromDateTime,
            managedDetail?.ToDateTime
          ),
        }
      })
      return {
        ...prev,
        Prices: [...updatedPrices],
      }
    })
  }, [])

  useEffect(() => {
    checkDetailForInvalidPriceDates(managedDetail)
  }, [managedDetail?.FromDateTime, managedDetail?.ToDateTime, managedDetail?.Prices])

  const updateManagedDetail = async (newProvision) => {
    setHasDetailEdits(true)
    // edit a variable row
    const newPrices = managedDetail.Prices.map((price) => {
      if (
        (!!price.TradeEntryPriceId && price.TradeEntryPriceId === newProvision.TradeEntryPriceId) ||
        (!!price.LocalTradeEntryPriceId && price.LocalTradeEntryPriceId === newProvision.LocalTradeEntryPriceId)
      ) {
        return {
          ...newProvision,
          Status: getPriceStatus(
            newProvision,
            newProvision.ProvisionType,
            null,
            managedDetail?.FromDateTime,
            managedDetail?.ToDateTime
          ),
        }
      }
      return price
    })
    setManagedDetail((oldDetail) => ({ ...oldDetail, Prices: newPrices }))
  }

  const deleteProvision = (provision: Price) => {
    const id = provision.TradeEntryPriceId || provision.LocalTradeEntryPriceId
    const unaffectedPrices = managedDetail?.Prices?.filter(
      (price) => price.TradeEntryPriceId !== id && price.LocalTradeEntryPriceId !== id
    )
    setManagedDetail((oldDetail) => ({ ...oldDetail, Prices: unaffectedPrices }))
    setHasDetailEdits(true)
  }
  const createProvision = () => {
    gridAPIRef.current?.forEachNode((node) => node.setExpanded(false))
    const newProvision = blankFixedProvision(managedDetail, metadata)

    setManagedDetail((oldDetail) => ({
      ...oldDetail,
      Prices: [
        ...oldDetail.Prices,
        {
          ...newProvision,
        },
      ],
    }))
    setHasDetailEdits(true)
  }

  const columnDefsMemo = useMemo(
    () => columnDefs({ metadata, setProvisionToEdit, deleteProvision, header, canWrite, managedDetail }),
    [metadata, setProvisionToEdit, deleteProvision, header, canWrite]
  )

  useEffect(() => {
    if (activeTabId) {
      retrieveValuationData(activeTabId)
    }
  }, [])

  const controlBarProps = useMemo(
    () => ({
      title: 'Prices',
      hideActiveFilters: true,
      actionButtons: canWrite && (
        <Horizontal verticalCenter>
          <Tooltip
            title={
              hasDetailEdits || !managedDetail?.TradeEntryDetailId
                ? 'Please save changes to enable valuation refresh.'
                : ''
            }
          >
            <GraviButton
              buttonText='Refresh Values'
              onClick={() => {
                if (isFetchingDetailValuation || hasDetailEdits || !managedDetail?.TradeEntryDetailId) {
                  return
                }
                refetchValuation(managedDetail?.TradeEntryDetailId)
              }}
              loading={hasDetailEdits ? false : isFetchingDetailValuation}
              className={hasDetailEdits || !managedDetail?.TradeEntryDetailId ? 'disabled-gravi-button' : ''}
            />
          </Tooltip>

          <GraviButton className='ml-3' theme2 buttonText='Add Price' onClick={createProvision} />
        </Horizontal>
      ),
    }),
    [canWrite, hasDetailEdits, isFetchingDetailValuation, managedDetail]
  )
  const agPropOverrides = useMemo(
    () => ({
      frameworkComponents: {
        number: NumberCellEditor,
        SearchableSelect,
      },
      rowGroupPanelShow: 'never' as const,
      getRowId: (row) => row.data.TradeEntryPriceId || row.data.LocalTradeEntryPriceId,
    }),
    []
  )
  const detailCellRendererParams = useMemo(
    () => ({
      isGridView: true,
      detailId: managedDetail?.TradeEntryDetailId,
      isExtracted: header?.IsExtracted,
    }),
    [managedDetail]
  )
  return (
    <Vertical flex={5}>
      <GraviGrid
        controlBarProps={controlBarProps}
        agPropOverrides={agPropOverrides}
        columnDefs={columnDefsMemo}
        externalRef={gridAPIRef}
        hideSaveDisplay
        storageKey='priceProvisions'
        rowData={managedDetail?.Prices}
        updateEP={updateManagedDetail} // normalizes then calls setManagedDetail
        // @ts-expect-error isRowMaster is passed through to AG Grid
        isRowMaster={(row) => row.ProvisionType !== ProvisionTypes.FIXED && row.Status === 'Valid'}
        masterDetail
        detailRowAutoHeight
        detailCellRenderer={PriceProvisionDisplay}
        detailCellRendererParams={detailCellRendererParams}
        loading={!metadata}
      />
      <ProvisionEditorDrawer
        setProvisionToEdit={setProvisionToEdit}
        provisionToEdit={provisionToEdit}
        metadata={metadata}
        updateManagedDetail={updateManagedDetail}
        managedDetail={managedDetail}
      />
    </Vertical>
  )
}
