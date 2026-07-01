import { GraviGrid } from '@gravitate-js/excalibrr'
import { Product } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/api/schema.types'
import { ActionButtons } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/SubscriptionManagement/components/productsAndLocationsDrawers/shared/ActionButtons'
import { DrawerFooter } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/SubscriptionManagement/components/productsAndLocationsDrawers/shared/DrawerFooter'
import { GridTitle } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/SubscriptionManagement/components/productsAndLocationsDrawers/shared/GridTitle'
import { GridApi, GridReadyEvent } from 'ag-grid-community'
import { Drawer } from 'antd'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getColumnDefs } from './columnDefs'

interface ProductSelectionDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedProductIds: number[]
  onSave: (selectedProducts: number[]) => void
  counterpartyName: string
  isBulkMode?: boolean
  products?: Product[]
}

export function ProductSelectionDrawer({
  isOpen,
  onClose,
  products,
  selectedProductIds,
  onSave,
  counterpartyName,
  isBulkMode = false,
}: ProductSelectionDrawerProps) {
  const gridAPIRef = useRef() as React.MutableRefObject<GridApi>
  const [selections, setSelections] = useState<number[]>(selectedProductIds)

  const sortedProducts = useMemo(() => {
    return products ? [...products].sort((a, b) => a.Name?.localeCompare(b.Name || '')) : []
  }, [products])

  const onRowSelected = useCallback((params) => {
    if (params.source === 'checkboxSelected' || params.source === 'uiSelectAllFiltered') {
      const selectedRows = params.api.getSelectedRows()
      const newSelections = selectedRows.map((row) => row.ProductId)
      setSelections(newSelections)
    }
  }, [])

  const clearStateAndClose = () => {
    setSelections(selectedProductIds)
    gridAPIRef.current?.deselectAll()
    onClose()
  }
  useEffect(() => {
    setSelections(selectedProductIds)
    gridAPIRef.current?.forEachNodeAfterFilter((node) => {
      if (selectedProductIds.includes(node.data.ProductId)) {
        node.setSelected(true)
      } else {
        node.setSelected(false)
      }
    })
  }, [selectedProductIds])
  const controlBarProps = useMemo(
    () => ({
      showSelectedCount: true,
      hideActiveFilters: false,
      title: <GridTitle isBulkMode={isBulkMode} counterpartyName={counterpartyName} itemName='Products' />,
      actionButtons: <ActionButtons clearStateAndClose={clearStateAndClose} />,
    }),
    [isBulkMode, counterpartyName]
  )

  const agPropOverrides = useMemo(
    () => ({
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      getRowId: (params) => params.data.ProductId,
      onRowSelected,
      suppressDragLeaveHidesColumns: true,
    }),
    []
  )
  const columnDefs = useMemo(getColumnDefs, [])
  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      gridAPIRef.current = params.api
      setSelections(selectedProductIds)
      params.api.forEachNode((node) => {
        if (selectedProductIds.includes(node.data.ProductId)) {
          node.setSelected(true)
        } else {
          node.setSelected(false)
        }
      })
    },
    [selectedProductIds]
  )
  return (
    <Drawer
      headerStyle={{ display: 'none' }}
      title={null}
      visible={isOpen}
      onClose={clearStateAndClose}
      footer={
        <DrawerFooter
          selections={selections}
          onSave={onSave}
          onClose={clearStateAndClose}
          totalItems={products?.length}
          itemName='products'
        />
      }
      bodyStyle={{ padding: 0 }}
      placement='bottom'
      height='70vh'
    >
      <GraviGrid
        rowData={sortedProducts}
        columnDefs={columnDefs}
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        storageKey='PriceNotifications/SubscriptionManagementPage/ProductSelection'
        externalRef={gridAPIRef}
        onGridReady={onGridReady}
      />
    </Drawer>
  )
}
