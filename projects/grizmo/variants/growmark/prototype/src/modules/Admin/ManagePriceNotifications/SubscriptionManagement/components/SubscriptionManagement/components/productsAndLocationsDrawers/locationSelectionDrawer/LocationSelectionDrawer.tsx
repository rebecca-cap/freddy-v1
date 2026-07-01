import { GraviGrid } from '@gravitate-js/excalibrr'
import { Location } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/api/schema.types'
import { GridApi, GridReadyEvent } from 'ag-grid-community'
import { Drawer } from 'antd'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ActionButtons } from '../shared/ActionButtons'
import { DrawerFooter } from '../shared/DrawerFooter'
import { GridTitle } from '../shared/GridTitle'
import { getColumnDefs } from './columnDefs'

interface LocationSelectionDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedLocationIds: number[]
  onSave: (selectedLocations: number[]) => void
  counterpartyName: string
  locations?: Location[]
  isBulkMode?: boolean
}

export function LocationSelectionDrawer({
  isOpen,
  onClose,
  locations,
  selectedLocationIds,
  onSave,
  counterpartyName,
  isBulkMode = false,
}: LocationSelectionDrawerProps) {
  const gridAPIRef = useRef() as React.MutableRefObject<GridApi>
  const [selections, setSelections] = useState<number[]>(selectedLocationIds)

  useEffect(() => {
    setSelections(selectedLocationIds)
    gridAPIRef.current?.forEachNodeAfterFilter((node) => {
      if (selectedLocationIds.includes(node.data.LocationId)) {
        node.setSelected(true)
      } else {
        node.setSelected(false)
      }
    })
  }, [selectedLocationIds])

  const sortedLocations = useMemo(() => {
    return locations ? [...locations].sort((a, b) => a.Name?.localeCompare(b.Name || '')) : []
  }, [locations])

  const onRowSelected = useCallback((params) => {
    if (params.source === 'checkboxSelected' || params.source === 'uiSelectAllFiltered') {
      const selectedRows = params.api.getSelectedRows()
      const newSelections = selectedRows.map((row) => row.LocationId)
      setSelections(newSelections)
    }
  }, [])

  const clearStateAndClose = () => {
    setSelections(selectedLocationIds)
    gridAPIRef.current?.deselectAll()
    onClose()
  }
  useEffect(() => {
    setSelections(selectedLocationIds)
    gridAPIRef.current?.forEachNodeAfterFilter((node) => {
      if (selectedLocationIds.includes(node.data.LocationId)) {
        node.setSelected(true)
      } else {
        node.setSelected(false)
      }
    })
  }, [selectedLocationIds])

  const controlBarProps = useMemo(
    () => ({
      showSelectedCount: true,
      hideActiveFilters: false,
      title: <GridTitle isBulkMode={isBulkMode} counterpartyName={counterpartyName} itemName='Locations' />,
      actionButtons: <ActionButtons clearStateAndClose={clearStateAndClose} />,
    }),
    [isBulkMode, counterpartyName]
  )

  const agPropOverrides = useMemo(
    () => ({
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      getRowId: (params) => params.data.LocationId,
      onRowSelected,
      suppressDragLeaveHidesColumns: true,
    }),
    []
  )
  const columnDefs = useMemo(getColumnDefs, [])

  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      gridAPIRef.current = params.api
      setSelections(selectedLocationIds)
      params.api.forEachNode((node) => {
        if (selectedLocationIds.includes(node.data.LocationId)) {
          node.setSelected(true)
        } else {
          node.setSelected(false)
        }
      })
    },
    [selectedLocationIds]
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
          totalItems={locations?.length}
          itemName='locations'
        />
      }
      bodyStyle={{ padding: 0 }}
      placement='bottom'
      height='70vh'
    >
      <GraviGrid
        rowData={sortedLocations}
        columnDefs={columnDefs}
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        storageKey='PriceNotifications/SubscriptionManagementPage/LocationSelection'
        externalRef={gridAPIRef}
        onGridReady={onGridReady}
      />
    </Drawer>
  )
}
