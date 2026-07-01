import { useMarketPlatformPriceAdjustments } from '@api/useMarketPlatformPriceAdjustments'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { useUser } from '@contexts/UserContext'
import { GraviGrid, Horizontal, NotificationMessage, Texto, useLocalStorage, Vertical } from '@gravitate-js/excalibrr'
import { GridApi } from 'ag-grid-community'
import { Alert } from 'antd'
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'

import { AdjustmentDetails } from './components/AdjustmentDetails'
import { getColumnDefs } from './components/columnDefs'
import { newPriceAdjustmentCreateConfig } from './components/createConfig'

export function ManagePriceAdjustments() {
  const gridRef = useRef() as MutableRefObject<GridApi>
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.PriceAdjustments?.Write

  const { useMetadataQuery, usePriceAdjustmentQuery, upsertPriceAdjustmentsMutation, deletePriceAdjustmentsMutation } =
    useMarketPlatformPriceAdjustments()
  const { data: metadata, isLoading: metadataLoading } = useMetadataQuery()
  const {
    data: priceAdjustments,
    isLoading: adjustmentsLoading,
    refetch: refetchPriceAdjustments,
  } = usePriceAdjustmentQuery()

  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const { value: openRowGroups, setValue: setOpenRowGroups } = useLocalStorage('OpenPriceAdjustments', [])

  const handleSaveChanges = async (data) => {
    const response = await upsertPriceAdjustmentsMutation.mutateAsync([data])
    if (response?.Validations.length) {
      NotificationMessage('Error', response.Validations[0]?.Message)
    } else {
      NotificationMessage('Price Adjustment updated', `Price Adjustment has been updated`, false)
    }
    return response
  }

  const handleDelete = async (data) => {
    const payload = {
      MarketPlatformPriceAdjustmentHeaderId: data,
    }
    const response = await deletePriceAdjustmentsMutation.mutateAsync([payload])
    if (response?.Validations.length) {
      NotificationMessage('Error', response.Validations[0]?.Message)
    }
    return response
  }

  const handleCreate = async (formValues) => {
    const MarketPlatformInstrumentId =
      metadata?.MarketPlatformInstrumentList?.find((item) => item.Text === formValues.MarketPlatformInstrument)
        ?.Value || null
    const ProductId = metadata?.ProductList?.find((item) => item.Text === formValues.Product)?.Value || null
    const LocationId = metadata?.LocationList?.find((item) => item.Text === formValues.Location)?.Value || null

    const payload = {
      MarketPlatformInstrumentId,
      ProductId,
      LocationId,
    }
    try {
      const response = await upsertPriceAdjustmentsMutation.mutateAsync([payload])
      if (response?.Validations.length) {
        NotificationMessage('Error', response.Validations[0]?.Message)
      } else {
        NotificationMessage('Price Adjustment Created', `Price Adjustment has been created`, false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const columnDefs = useMemo(() => getColumnDefs(metadata, handleDelete, canWrite), [metadata, canWrite])

  const onRowGroupOpened = (event) => {
    const { node } = event
    const isOpen = node.expanded
    const groupId = `${node.data.MarketPlatformInstrumentId}-${node.data.ProductId}-${node.data.LocationId}`

    if (isOpen && !openRowGroups.includes(groupId)) {
      setOpenRowGroups((prevOpenGroups) => [...prevOpenGroups, groupId])
    } else {
      setOpenRowGroups((prevOpenGroups) => prevOpenGroups.filter((group) => group !== groupId))
    }

    if (!node.expanded && hasChanges) {
      refetchPriceAdjustments()
      setHasChanges(false)
    }
  }

  useEffect(() => {
    if (gridRef?.current) {
      expandRows()
    }
  }, [gridRef.current, priceAdjustments?.Data])

  const expandRows = () => {
    setTimeout(() => {
      gridRef.current.forEachNode((node) => {
        const id = `${node.data.MarketPlatformInstrumentId}-${node.data.ProductId}-${node.data.LocationId}`
        if (openRowGroups.includes(id)) {
          node.setExpanded(true)
          setOpenRowGroups((prevOpenGroups) => prevOpenGroups.filter((group) => group !== node.id))
        }
      })
    }, 1000)
  }

  return (
    <Horizontal fullHeight style={{ width: '100%' }}>
      <Vertical>
        <GraviGrid
          externalRef={gridRef}
          controlBarProps={{ title: 'Manage Price Adjustments' }}
          agPropOverrides={{
            rowGroupPanelShow: 'never',
            frameworkComponents: { SearchableSelect },
            getRowId: (row) => row.data?.MarketPlatformPriceAdjustmentHeaderId?.toString(),
            rowSelection: 'multiple',
            rowHeight: 50,
          }}
          columnDefs={columnDefs}
          storageKey='ReferenceData/ManagePriceAdjustments'
          rowData={priceAdjustments?.Data || []}
          masterDetail
          detailRowAutoHeight
          isRowMaster={(rowData) => rowData.MarketPlatformPriceAdjustmentDetails != null}
          detailCellRenderer={(params) => (
            <AdjustmentDetails
              metadata={metadata}
              setHasChanges={setHasChanges}
              priceAdjustment={params.data}
              upsertPriceAdjustmentsMutation={upsertPriceAdjustmentsMutation}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              expandRows={expandRows}
              canWrite={canWrite}
            />
          )}
          updateEP={canWrite ? handleSaveChanges : undefined}
          createConfig={newPriceAdjustmentCreateConfig}
          createSelectOptions={metadata}
          createEP={canWrite ? handleCreate : undefined}
          loading={adjustmentsLoading || metadataLoading || isLoading}
          onRowGroupOpened={onRowGroupOpened}
          editable={canWrite}
        />
        <Horizontal className='my-4' flex={0} style={{ width: '100%' }}>
          <Alert
            style={{ width: '100%' }}
            message={
              <div style={{ width: '100%' }}>
                <Texto category='p2' style={{ fontSize: 15 }}>
                  * Adjustments may not have gaps in volume quantities. Set maximum Quantity To value equal to the
                  maximum desired order quantity allowed for a single transaction.
                </Texto>
              </div>
            }
            type='warning'
          />
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}
