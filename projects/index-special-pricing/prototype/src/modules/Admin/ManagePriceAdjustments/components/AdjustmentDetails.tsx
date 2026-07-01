import { PlusOutlined } from '@ant-design/icons'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviButton, GraviGrid, Horizontal, NotificationMessage } from '@gravitate-js/excalibrr'
import { GridApi } from 'ag-grid-community'
import { message } from 'antd'
import React, { MutableRefObject, useMemo, useRef } from 'react'

import { getAdjustmentDetailsColumnDefs } from './columnDefs'

export function AdjustmentDetails({
  upsertPriceAdjustmentsMutation,
  priceAdjustment,
  metadata,
  setHasChanges,
  isLoading,
  setIsLoading,
  expandRows,
  canWrite,
}) {
  const gridRef = useRef() as MutableRefObject<GridApi>
  const dirtyRef = useRef<any>(null)

  const data = useMemo(() => {
    return structuredClone(priceAdjustment?.MarketPlatformPriceAdjustmentDetails)
  }, [priceAdjustment?.MarketPlatformPriceAdjustmentDetails])

  const handleDeleteDetail = async (detailId) => {
    setIsLoading(true)
    const updatedDetails = priceAdjustment.MarketPlatformPriceAdjustmentDetails.filter(
      (adjustment) => adjustment.MarketPlatformPriceAdjustmentDetailId !== detailId
    )
    const payload = {
      ...priceAdjustment,
      MarketPlatformPriceAdjustmentDetails: updatedDetails,
    }
    const response = await upsertPriceAdjustmentsMutation.mutateAsync([payload])

    if (response?.Validations.length) {
      NotificationMessage('Error', response.Validations[0]?.Message)
    } else {
      NotificationMessage('Price Adjustment Detail Deleted', `Price Adjustment detail has been deleted`, false)
    }
    setIsLoading(false)
    expandRows()
    return response
  }
  const columnDefs = useMemo(
    () => getAdjustmentDetailsColumnDefs(metadata, setHasChanges, handleDeleteDetail, canWrite),
    [metadata, canWrite]
  )

  const handleDirtySave = async (changes) => {
    setIsLoading(true)
    // go through all the existing details and check if there are any changes and then update the details with the changes and UOM Name
    const updatedDetails = priceAdjustment?.MarketPlatformPriceAdjustmentDetails.map((detail, index) => {
      const change = changes.dirtyChanges.find(
        (change) => change.MarketPlatformPriceAdjustmentDetailId === detail.MarketPlatformPriceAdjustmentDetailId
      )

      if (change) {
        const UnitOfMeasureName = metadata?.UnitOfMeasureList.find(
          (uom) => uom?.Value === change.UnitOfMeasureId.toString()
        )?.Text
        return {
          ...detail,
          ...change,
          UnitOfMeasureName,
        }
      }

      return detail
    })

    // check if there are any rows that are new and added to dirty changes
    const newRows = changes.dirtyChanges
      .filter((r) => r.$inserted)
      .map(({ $inserted, $index, MarketPlatformPriceAdjustmentDetailId, ...cleanedRow }) => ({ ...cleanedRow }))

    if (newRows.some((row) => !row.UnitOfMeasureId)) {
      message.error('UOM selection is required')
      setIsLoading(false)
      return false
    }
    const allDetails = [...updatedDetails, ...newRows]
    const payload = {
      ...priceAdjustment,
      MarketPlatformPriceAdjustmentDetails: allDetails,
    }

    const response = await upsertPriceAdjustmentsMutation.mutateAsync([payload])
    if (response?.Validations.length) {
      NotificationMessage('Error', response.Validations[0]?.Message)
      setIsLoading(false)
      return false
    }
    NotificationMessage('Price Adjustment Details updated', `Price Adjustment details have been updated`, false)
    setIsLoading(false)
    expandRows()
    return true
  }

  const addPriceAdjustmentDetail = async () => {
    const newRow = {
      Duration: 0,
      MarketPlatformPriceAdjustmentDetailId: crypto.randomUUID(),
      Price: 0,
      QuantityFrom: 0,
      QuantityTo: 0,
      UnitOfMeasureId: null,
      UnitOfMeasureName: '',
    }

    dirtyRef?.current.addDirtyRow(newRow)
  }

  const handleDirtyDiscard = () => {
    if (gridRef.current && priceAdjustment?.MarketPlatformPriceAdjustmentDetails) {
      const newData = structuredClone(priceAdjustment.MarketPlatformPriceAdjustmentDetails)
      gridRef.current.setRowData(newData)
    }
  }

  return (
    <div>
      <GraviGrid
        controlBarProps={{
          title: '',
          customSearchBar: () => <></>,
          actionButtons: (
            <Horizontal className='m-3'>
              <GraviButton
                icon={<PlusOutlined />}
                buttonText='Add Detail'
                theme1
                onClick={addPriceAdjustmentDetail}
                disabled={!canWrite}
              />
            </Horizontal>
          ),
        }}
        externalRef={gridRef}
        isDirtyEdit={canWrite}
        primaryKey='MarketPlatformPriceAdjustmentDetailId'
        dirtyChangesRef={canWrite && dirtyRef}
        onDirtyChangeSave={canWrite && handleDirtySave}
        onDirtyChangeDiscard={canWrite && handleDirtyDiscard}
        storageKey='ReferenceData/ManagePriceAdjustments/PriceAdjustmentDetails'
        agPropOverrides={{
          frameworkComponents: { SearchableSelect },
          getRowId: (row) => row.data?.MarketPlatformPriceAdjustmentDetailId?.toString(),
          rowGroupPanelShow: 'never',
          headerHeight: 40,
          domLayout: 'autoHeight',
        }}
        rowData={data}
        columnDefs={columnDefs}
        sideBar={false}
        hideSaveDisplay
        loading={isLoading}
      />
    </div>
  )
}
