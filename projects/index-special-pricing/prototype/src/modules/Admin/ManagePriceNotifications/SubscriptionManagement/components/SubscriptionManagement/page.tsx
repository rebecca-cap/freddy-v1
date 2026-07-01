import { GraviGrid, NotificationMessage } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import {
  Location,
  MetadataData,
  Product,
  SubscriptionData,
} from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/api/schema.types'
import { CreateSubscriptionModal } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/SubscriptionManagement/components/CreateSubscriptionModal'
import { LocationSelectionDrawer } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/SubscriptionManagement/components/productsAndLocationsDrawers/locationSelectionDrawer/LocationSelectionDrawer'
import { ProductSelectionDrawer } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/SubscriptionManagement/components/productsAndLocationsDrawers/productSelectionDrawer/ProductSelectionDrawer'
import { GridApi } from 'ag-grid-community'
import React, { MutableRefObject, useCallback, useMemo, useRef, useState } from 'react'

import { usePriceNotifications } from '../../api'
import { getColumnDefs } from './components/columnDefs'
import { SubscriptionManagementActionButtons } from './components/SubscriptionManagementActionButtons'

interface PriceMappingProps {
  isFetching: boolean
  canWrite: boolean
  subscriptions?: SubscriptionData[]
  products?: Product[]
  locations?: Location[]
  metadata?: MetadataData
}

export function SubscriptionManagementPage({
  subscriptions,
  products,
  locations,
  isFetching,
  metadata,
  canWrite,
}: PriceMappingProps) {
  const { upsertSubscriptionMutation } = usePriceNotifications()
  const gridAPIRef = useRef() as MutableRefObject<GridApi>
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<SubscriptionData | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [isBulkEditMode, setIsBulkEditMode] = useState(false)
  const [bulkEditRows, setBulkEditRows] = useState<SubscriptionData[]>([])
  const [isBulkProductMode, setIsBulkProductMode] = useState(false)
  const [isBulkLocationMode, setIsBulkLocationMode] = useState(false)
  const storageKey = `PriceNotifications/SubscriptionManagementPage`
  const gridViewManager = useGridViewManager(storageKey)

  const openProductDrawer = (row: SubscriptionData) => {
    setSelectedRow(row)
    setIsProductModalOpen(true)
    setIsBulkProductMode(false)
  }

  const openLocationDrawer = (row: SubscriptionData) => {
    setSelectedRow(row)
    setIsLocationModalOpen(true)
    setIsBulkLocationMode(false)
  }

  const handleBulkProductEdit = () => {
    if (bulkEditRows.length === 0) {
      NotificationMessage('No Selection', 'Please select at least one row to edit products', true)
      return
    }
    setIsBulkProductMode(true)
    setIsProductModalOpen(true)
  }

  const handleBulkLocationEdit = () => {
    if (bulkEditRows.length === 0) {
      NotificationMessage('No Selection', 'Please select at least one row to edit locations', true)
      return
    }
    setIsBulkLocationMode(true)
    setIsLocationModalOpen(true)
  }

  const updateSubscription = async (updatedSubscriptions: Partial<SubscriptionData> | Partial<SubscriptionData>[]) => {
    try {
      await upsertSubscriptionMutation.mutateAsync(
        Array.isArray(updatedSubscriptions) ? updatedSubscriptions : [updatedSubscriptions]
      )
    } catch (error) {
      console.error('Error updating subscriptions:', error)
    }
  }

  const saveProductSelections = (selectedProducts: number[]) => {
    if (isBulkProductMode && bulkEditRows.length > 0) {
      // Update all selected rows with the same products
      const newSubs = bulkEditRows.map((row) => ({
        ...row,
        ProductIds: selectedProducts,
      }))
      updateSubscription(newSubs)
    } else if (selectedRow) {
      // Update just the single selected row
      const newSubs = { ...selectedRow, ProductIds: selectedProducts }
      updateSubscription(newSubs)
    }
    setIsProductModalOpen(false)
    setIsBulkProductMode(false)
  }

  const saveLocationSelections = (selectedLocations: number[]) => {
    if (isBulkLocationMode && bulkEditRows.length > 0) {
      // Update all selected rows with the same locations
      const newSubs = bulkEditRows.map((row) => ({
        ...row,
        LocationIds: selectedLocations,
      }))
      updateSubscription(newSubs)
    } else if (selectedRow) {
      // Update just the single selected row
      const newSubs = { ...selectedRow, LocationIds: selectedLocations }
      updateSubscription(newSubs)
    }
    setIsLocationModalOpen(false)
    setIsBulkLocationMode(false)
  }

  const handleActivateAll = () => {
    if (bulkEditRows.length === 0) {
      NotificationMessage('No Selection', 'Please select at least one row to activate', true)
      return
    }

    const newSubs = bulkEditRows.map((row) => ({
      ...row,
      IsActive: true,
    }))
    updateSubscription(newSubs)
  }

  const handleDeactivateAll = () => {
    if (bulkEditRows.length === 0) {
      NotificationMessage('No Selection', 'Please select at least one row to deactivate', true)
      return
    }

    const newSubs = bulkEditRows.map((row) => ({
      ...row,
      IsActive: false,
    }))
    updateSubscription(newSubs)
  }

  const handleCancelBulkEdit = () => {
    if (gridAPIRef.current) {
      gridAPIRef.current.deselectAll()
    }
    setIsBulkEditMode(false)
    setBulkEditRows([])
  }

  const columnDefs = useMemo(
    () =>
      getColumnDefs({
        openProductDrawer,
        openLocationDrawer,
        canWrite,
        isBulkEditMode,
        bulkEditRows,
        metadata,
      }),
    [products, locations, canWrite, isBulkEditMode, bulkEditRows, metadata, subscriptions]
  )

  const onRowSelected = useCallback((params) => {
    const currentSelection = params.api.getSelectedRows()
    setIsBulkEditMode(currentSelection.length > 0)
    setBulkEditRows(currentSelection)
  }, [])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data?.PriceNotificationSubscriptionId,
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      onRowSelected,
      suppressDragLeaveHidesColumns: true,
    }),
    [onRowSelected]
  )
  const openCreateModal = () => {
    setSelectedRow(null)
    setIsProductModalOpen(false)
    setIsBulkProductMode(false)
    setIsLocationModalOpen(false)
    setIsBulkLocationMode(false)
    setIsCreateModalOpen(true)
  }
  const controlBarProps = useMemo(
    () => ({
      title: 'Subscription Management',
      showSelectedCount: canWrite,
      hideActiveFilters: false,
      actionButtons: (
        <SubscriptionManagementActionButtons
          isBulkEditMode={isBulkEditMode}
          onActivateAll={handleActivateAll}
          onDeactivateAll={handleDeactivateAll}
          onEditProducts={handleBulkProductEdit}
          onEditLocations={handleBulkLocationEdit}
          onCancel={handleCancelBulkEdit}
          openCreateModal={openCreateModal}
        />
      ),
    }),
    [canWrite, isBulkEditMode, bulkEditRows.length]
  )

  return (
    <div style={{ height: '85vh', width: '100%' }}>
      <GraviGrid
        rowData={subscriptions}
        externalRef={gridAPIRef}
        columnDefs={columnDefs}
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        storageKey={storageKey}
        updateEP={canWrite ? updateSubscription : undefined}
        loading={isFetching}
        gridViewManager={gridViewManager}
      />
      <CreateSubscriptionModal
        metadata={metadata}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        upsertSubscriptionMutation={upsertSubscriptionMutation}
      />
      <ProductSelectionDrawer
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false)
          setIsBulkProductMode(false)
        }}
        products={products}
        selectedProductIds={isBulkProductMode ? [] : selectedRow?.ProductIds || []}
        onSave={saveProductSelections}
        counterpartyName={
          isBulkProductMode ? `${bulkEditRows.length} selected counterparties` : selectedRow?.CounterPartyName || ''
        }
        isBulkMode={isBulkProductMode}
      />

      <LocationSelectionDrawer
        isOpen={isLocationModalOpen}
        onClose={() => {
          setIsLocationModalOpen(false)
          setIsBulkLocationMode(false)
        }}
        locations={locations}
        selectedLocationIds={isBulkLocationMode ? [] : selectedRow?.LocationIds || []}
        onSave={saveLocationSelections}
        counterpartyName={
          isBulkLocationMode ? `${bulkEditRows.length} selected counterparties` : selectedRow?.CounterPartyName || ''
        }
        isBulkMode={isBulkLocationMode}
      />
    </div>
  )
}
