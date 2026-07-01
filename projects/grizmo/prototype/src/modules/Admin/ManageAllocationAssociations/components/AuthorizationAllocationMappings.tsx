import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { LinkUnlinkAssociationActionButtons } from '@components/shared/Grid/sharedActionButtons/LinkUnlinkActionButtons'
import { GraviGrid, Horizontal, NotificationMessage, useLocalStorage } from '@gravitate-js/excalibrr'
import { AllocationReferencesPageProps } from '@modules/Admin/ManageAllocationAssociations'
import {
  Allocation,
  AllocationAssociationsReferencesResponseData,
  AllocationManagementResponse,
  AuthorizationAllocationUnlinkPayload,
  CounterPartySetupOption,
} from '@modules/Admin/ManageAllocationAssociations/api/types.schema'
import { useAllocationAssociations } from '@modules/Admin/ManageAllocationAssociations/api/useAllocationAssociations'
import { createAllocationColumnDefs } from '@modules/Admin/ManageAllocationAssociations/components/allocationColumnDefs'
import { createCounterpartySetupColumnDefs } from '@modules/Admin/ManageAllocationAssociations/components/counterpartySetupColumnDefs'
import { FilterSwitch } from '@modules/Admin/ManageAllocationAssociations/components/FilterSwitch'
import {
  createUpsertLinksPayload,
  getAllocationData,
  getAutoMapGravitateDataPayload,
  getCounterpartyRowId,
} from '@modules/Admin/ManageAllocationAssociations/components/mappingEvents'
import { GridApi } from 'ag-grid-community'
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function AuthorizationAllocationMappings({
  data,
  metadata,
  userTab,
  canWrite,
  isLoading,
}: AllocationReferencesPageProps) {
  const gridRefAllocations = useRef() as MutableRefObject<GridApi>
  const gridRefCounterpartySetups = useRef() as MutableRefObject<GridApi>

  const {
    useAllocationAssociationLinksMutation,
    useAllocationAssociationUnlinkMutation,
    useAllocationAssociationsMetadata,
  } = useAllocationAssociations()
  const { data: allocationAssociationMetadata } = useAllocationAssociationsMetadata()
  const linkMutation = useAllocationAssociationLinksMutation()
  const unlinkMutation = useAllocationAssociationUnlinkMutation()

  const { value: filterMode, setValue: setFilterMode } = useLocalStorage('AllocationMappingsGravitateFilterMode', false)

  const [selectedDTNRow, setSelectedDTNRow] = useState<Allocation | undefined>(undefined)
  const [selectedCounterpartyRows, setSelectedCounterpartyRows] = useState<CounterPartySetupOption[]>([])
  const [bulkSelectedRefreshRate, setBulkSelectedRefreshRate] = useState<number | undefined>(undefined)
  const Allocations = useMemo(() => {
    if (!data || !metadata) return []
    return getAllocationData(
      data as AllocationManagementResponse,
      metadata as AllocationAssociationsReferencesResponseData
    )
  }, [data, userTab, metadata])

  const CounterPartySetups = useMemo(() => {
    if (!data || !metadata) return []
    const allocationData = data as AllocationManagementResponse
    const rawData = allocationData?.CounterPartySetupOptions
    const referenceData = metadata as AllocationAssociationsReferencesResponseData
    const associatedCounterparties = referenceData?.Data?.Consignees.reduce((acc: number[], consignee) => {
      if (consignee.AllocationConsigneeId === selectedDTNRow?.AllocationConsigneeId) {
        const counterPartyIds = consignee.AllocationConsigneeAssociations.map(
          (association) => association.CounterPartyId
        )
        acc.push(...counterPartyIds)
      }
      return acc
    }, [])

    const associatedProducts = referenceData?.Data?.Products.reduce((acc: number[], product) => {
      if (product.AllocationProductId === selectedDTNRow?.AllocationProductId) {
        const productIds = product.AllocationProductAssociations.map((association) => association.ProductId)
        acc.push(...productIds)
      }
      return acc
    }, [])

    const associatedLocations = referenceData?.Data?.Terminals.reduce((acc: number[], terminal) => {
      if (terminal.AllocationTerminalId === selectedDTNRow?.AllocationTerminalId) {
        const terminalIds = terminal.AllocationTerminalAssociations.map((association) => association.LocationId)
        acc.push(...terminalIds)
      }
      return acc
    }, [])

    const filterModeOnData = rawData?.filter(
      (counterPartySetup) =>
        counterPartySetup.LinkedAllocationId === selectedDTNRow?.AllocationId ||
        (associatedCounterparties?.includes(counterPartySetup.CounterPartyId) &&
          associatedProducts?.includes(counterPartySetup.AuthorizationAllocationSetup.ProductId) &&
          associatedLocations?.includes(counterPartySetup.AuthorizationAllocationSetup.LocationId))
    )

    const filterModeOffData = rawData

    setSelectedCounterpartyRows(selectedDTNRow?.AllocationId && filterMode ? filterModeOnData : filterModeOffData)
    return selectedDTNRow?.AllocationId && filterMode ? filterModeOnData : filterModeOffData
  }, [data, metadata, selectedDTNRow?.AllocationId, filterMode, userTab])

  const dtnColumnDefs = useMemo(() => createAllocationColumnDefs(), [data, Allocations])
  const gravitateColumnDefs = useMemo(
    () => createCounterpartySetupColumnDefs({ canWrite, metadata: allocationAssociationMetadata }),
    [data, CounterPartySetups, canWrite, allocationAssociationMetadata]
  )

  useEffect(() => {
    if (filterMode) {
      gridRefCounterpartySetups.current?.selectAll()
      setSelectedCounterpartyRows(CounterPartySetups)
    } else {
      gridRefCounterpartySetups.current?.deselectAll()
      setSelectedCounterpartyRows([])
    }
  }, [filterMode, selectedDTNRow?.AllocationId, data, userTab])

  useEffect(() => {
    if (!selectedDTNRow && Allocations) {
      gridRefAllocations?.current?.forEachNode((node, index) => {
        if (index === 0) {
          node.setSelected(true)
        }
      })
      setSelectedDTNRow(Allocations[0])
    }
  }, [Allocations])

  const handleAllocationsRowSelection = useCallback((e) => {
    const selectedRows = e.api.getSelectedRows()
    setSelectedDTNRow(selectedRows[0])
  }, [])

  const handleCounterpartySetupSelection = useCallback((e) => {
    const selectedRows = e.api.getSelectedRows()
    setSelectedCounterpartyRows(selectedRows)
  }, [])

  const linkCounterpartySetups = async () => {
    const payload = createUpsertLinksPayload({
      counterpartyRows: selectedCounterpartyRows,
      selectedDTNRow,
      allocationAssociationMetadata,
    })

    try {
      const response = await linkMutation.mutateAsync(payload)
      if (response?.Validations.length) {
        NotificationMessage('Error', response.Validations[0]?.Message)
      } else {
        setSelectedCounterpartyRows(CounterPartySetups)
        NotificationMessage(
          'Allocation Link(s) updated',
          `Allocation Id ${selectedDTNRow?.AllocationId} has been added to ${payload?.Links?.length} row(s).`,
          false
        )
      }
    } catch (error) {
      console.error(error)
      NotificationMessage('Error', 'Failed to link allocation.')
    }
  }

  const unlinkCounterpartySetups = async () => {
    const AuthorizationAllocationLinkIds = selectedCounterpartyRows.map((cp) => {
      return cp.AuthorizationAllocationLinkId
    })
    const payload = { AuthorizationAllocationLinkIds } as AuthorizationAllocationUnlinkPayload
    try {
      const response = await unlinkMutation.mutateAsync(payload)
      if (response?.Severity === 'Error') {
        NotificationMessage('Error', response?.Message)
      } else {
        setSelectedCounterpartyRows(CounterPartySetups)
        NotificationMessage(
          'Allocation Link(s) updated',
          `Allocation Id ${selectedDTNRow?.AllocationId} has been unlinked from ${selectedCounterpartyRows?.length} row(s).`,
          false
        )
      }
    } catch (error) {
      console.error(error)
      NotificationMessage('Error', 'Failed to unlink allocation.')
    }
  }

  const autoMapGravitateData = async () => {
    const payload = getAutoMapGravitateDataPayload(
      data as AllocationManagementResponse,
      metadata as AllocationAssociationsReferencesResponseData
    )
    try {
      await linkMutation.mutateAsync(payload)
      NotificationMessage(
        'Allocation Link(s) updated',
        `Allocation Id ${selectedDTNRow?.AllocationId} has been added to ${payload?.Links?.length} row(s).`,
        false
      )
    } catch (error) {
      console.error(error)
      NotificationMessage('Error', 'Failed to auto map gravitate data.')
    }
  }

  const canLink = useMemo(() => !!selectedCounterpartyRows?.length && canWrite, [selectedCounterpartyRows, canWrite])

  const canUnlink = useMemo(
    () => selectedCounterpartyRows?.some((row) => row.AuthorizationAllocationLinkId),
    [selectedCounterpartyRows]
  )

  const allocationsAgPropOverrides = useMemo(
    () => ({
      frameworkComponents: { SearchableSelect },
      getRowId: (row) => row.data?.AllocationId?.toString(),
      rowSelection: 'single' as const,
      onRowSelected: handleAllocationsRowSelection,
      rowGroupPanelShow: 'never' as const,
      suppressCellSelection: true,
    }),
    [handleAllocationsRowSelection]
  )

  const counterpartySetupsAgPropOverrides = useMemo(
    () => ({
      frameworkComponents: { SearchableSelect },
      getRowId: getCounterpartyRowId,
      rowSelection: canWrite ? ('multiple' as const) : undefined,
      onRowSelected: handleCounterpartySetupSelection,
      rowGroupPanelShow: 'never' as const,
      suppressRowClickSelection: true,
    }),
    [canWrite, handleCounterpartySetupSelection, getCounterpartyRowId]
  )

  const allocationsControlBarProps = useMemo(
    () => ({
      title: 'Authorization Allocations',
      actionButtons: (
        <Horizontal>
          <FilterSwitch
            title='Show Related Data'
            valueSetter={setFilterMode}
            value={filterMode}
            disabled={false}
            tooltipTitle=''
          />
        </Horizontal>
      ),
      hideActiveFilters: true,
    }),
    [setFilterMode, filterMode]
  )

  const createPayloadAndSendRequest = async (rowData) => {
    try {
      const payload = createUpsertLinksPayload({
        counterpartyRows: [rowData],
        allocationAssociationMetadata,
      })
      await linkMutation.mutateAsync(payload)
      NotificationMessage(
        'Allocation Link(s) updated',
        `Refresh frequency has been updated for ${rowData?.CounterPartyId}.`,
        false
      )
    } catch (error) {
      console.error(error)
      NotificationMessage('Error', 'Failed to update refresh frequency.')
    }
  }

  const bulkUpdateRefreshRate = async () => {
    try {
      const payload = createUpsertLinksPayload({
        counterpartyRows: selectedCounterpartyRows,
        overrideRefreshFrequencyTypeCvId: bulkSelectedRefreshRate,
      })
      await linkMutation.mutateAsync(payload)
      setBulkSelectedRefreshRate(undefined)
      NotificationMessage(
        'Allocation Link(s) updated',
        `Refresh rate has been updated for ${selectedCounterpartyRows?.length} row(s).`,
        false
      )
    } catch (error) {
      console.error(error)
      NotificationMessage('Error', 'Failed to update refresh rate.')
    }
  }

  const gravitateControlBarProps = useMemo(
    () => ({
      title: 'Gravitate Data',
      actionButtons: (
        <LinkUnlinkAssociationActionButtons
          selectedForeignRow={selectedDTNRow}
          selectedGravitateRowsToAssociate={selectedCounterpartyRows}
          handleLink={linkCounterpartySetups}
          canLink={canLink}
          canUnlink={canUnlink}
          handleUnlink={unlinkCounterpartySetups}
          canAutoMap
          handleAutoMap={autoMapGravitateData}
          canWrite={canWrite}
          metadata={allocationAssociationMetadata}
          bulkSelectedRefreshRate={bulkSelectedRefreshRate}
          setBulkSelectedRefreshRate={setBulkSelectedRefreshRate}
          bulkUpdateRefreshRate={bulkUpdateRefreshRate}
        />
      ),
      hideActiveFilters: true,
    }),
    [
      selectedDTNRow,
      selectedCounterpartyRows,
      linkCounterpartySetups,
      canLink,
      canUnlink,
      unlinkCounterpartySetups,
      autoMapGravitateData,
      canWrite,
      allocationAssociationMetadata,
      bulkUpdateRefreshRate,
    ]
  )

  return (
    <div style={{ display: 'flex', width: '100%', height: '89vh' }}>
      <div style={{ flex: 1 }}>
        <GraviGrid
          controlBarProps={allocationsControlBarProps}
          externalRef={gridRefAllocations}
          storageKey='ReferenceData/AllocationMappings/DTNData'
          agPropOverrides={allocationsAgPropOverrides}
          rowData={Allocations}
          sideBar={false}
          columnDefs={dtnColumnDefs}
          loading={isLoading}
        />
      </div>
      <div style={{ flex: 1 }}>
        <GraviGrid
          controlBarProps={gravitateControlBarProps}
          externalRef={gridRefCounterpartySetups}
          storageKey='ReferenceData/AllocationMappings/CounterpartySetups'
          agPropOverrides={counterpartySetupsAgPropOverrides}
          rowData={CounterPartySetups}
          sideBar={false}
          columnDefs={gravitateColumnDefs}
          updateEP={createPayloadAndSendRequest}
          hideSaveDisplay
          loading={isLoading}
        />
      </div>
    </div>
  )
}
