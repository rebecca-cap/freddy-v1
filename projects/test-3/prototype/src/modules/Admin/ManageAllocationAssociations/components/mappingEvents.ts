import {
  Allocation,
  AllocationAssociationMetadataResponse,
  AllocationAssociationsReferencesResponseData,
  AllocationManagementResponse,
  CounterPartySetupOption,
  UpsertLinksPayload,
} from '@modules/Admin/ManageAllocationAssociations/api/types.schema'

export function createUpsertLinksPayload({
  counterpartyRows,
  overrideRefreshFrequencyTypeCvId,
  selectedDTNRow,
  allocationAssociationMetadata,
}: {
  counterpartyRows: CounterPartySetupOption[]
  overrideRefreshFrequencyTypeCvId?: number
  selectedDTNRow?: Allocation
  allocationAssociationMetadata?: AllocationAssociationMetadataResponse
}) {
  const Links = Array.isArray(counterpartyRows)
    ? counterpartyRows.map((cp) => {
        const RefreshFrequencyTypeCvId =
          overrideRefreshFrequencyTypeCvId ||
          cp.RefreshFrequencyTypeCvId ||
          allocationAssociationMetadata?.Data.FrequencyTypeList.find((type) => type.Text === 'Daily')?.Value ||
          null
        return {
          CounterPartyId: cp.CounterPartyId,
          TradeEntrySetupId: cp.AuthorizationAllocationSetup.TradeEntrySetupId,
          AllocationId: selectedDTNRow?.AllocationId || cp.LinkedAllocationId,
          RefreshFrequencyTypeCvId: RefreshFrequencyTypeCvId,
        }
      })
    : counterpartyRows

  const payload = { Links } as UpsertLinksPayload
  return payload
}
export function getCounterpartyRowId(row) {
  return `${row.data.CounterPartyId}-${row.data.AuthorizationAllocationSetup.ProductId}-${row.data.AuthorizationAllocationSetup.LocationId}-${row.data.AuthorizationAllocationSetup.MarketPlatformInstrumentId}-${row.data.AuthorizationAllocationSetup.TradeEntrySetupId}`
}

export function getAllocationData(
  data: AllocationManagementResponse,
  metadata: AllocationAssociationsReferencesResponseData
) {
  const allocationData = data as AllocationManagementResponse
  const referenceData = metadata as AllocationAssociationsReferencesResponseData
  const rawData = allocationData?.Allocations.map((allocation) => {
    const AllocationProductName = referenceData?.Data?.Products?.find(
      (product) => product.AllocationProductId === allocation.AllocationProductId
    )?.Display
    const AllocationTerminalName = referenceData?.Data?.Terminals?.find(
      (terminal) => terminal.AllocationTerminalId === allocation.AllocationTerminalId
    )?.Display
    const AllocationConsigneeName = referenceData?.Data?.Consignees?.find(
      (consignee) => consignee.AllocationConsigneeId === allocation.AllocationConsigneeId
    )?.Display

    const MappedCount = allocationData?.CounterPartySetupOptions?.filter(
      (counterpartySetup) =>
        counterpartySetup.LinkedAllocationId &&
        counterpartySetup.AuthorizationAllocationLinkId &&
        counterpartySetup.LinkedAllocationId === allocation.AllocationId
    )?.length
    return { ...allocation, AllocationProductName, AllocationTerminalName, AllocationConsigneeName, MappedCount }
  })

  return rawData
}
export function getAutoMapGravitateDataPayload(
  data: AllocationManagementResponse,
  metadata: AllocationAssociationsReferencesResponseData
) {
  const allocationData = data as AllocationManagementResponse
  const referenceData = metadata as AllocationAssociationsReferencesResponseData
  const CounterPartySetupsRawData = allocationData?.CounterPartySetupOptions.filter(
    (item) => !item.AuthorizationAllocationLinkId
  )
  const ExternalAllocationsRawData = allocationData?.Allocations

  const updatedData = CounterPartySetupsRawData?.map((row) => {
    // find the associated consignee, terminals, product ids
    const associatedAllocationProductIds = referenceData?.Data?.Products.reduce((acc: number[], product) => {
      const associations = product.AllocationProductAssociations.map((item) => item.ProductId)

      if (associations.includes(row.AuthorizationAllocationSetup.ProductId)) {
        const allocationProductIds = product.AllocationProductId
        acc.push(allocationProductIds)
      }
      return acc
    }, [])
    const associatedAllocationTerminalIds = referenceData?.Data?.Terminals.reduce((acc: number[], terminal) => {
      const associations = terminal.AllocationTerminalAssociations.map((item) => item.LocationId)

      if (associations.includes(row.AuthorizationAllocationSetup.LocationId)) {
        const allocationTerminalIds = terminal.AllocationTerminalId
        acc.push(allocationTerminalIds)
      }
      return acc
    }, [])
    const associatedAllocationConsigneeIds = referenceData?.Data?.Consignees.reduce((acc: number[], consignee) => {
      const associations = consignee.AllocationConsigneeAssociations.map((item) => item.CounterPartyId)

      if (associations.includes(row.CounterPartyId)) {
        const allocationConsigneeIds = consignee.AllocationConsigneeId
        acc.push(allocationConsigneeIds)
      }
      return acc
    }, [])
    const MatchingExternalAllocation = ExternalAllocationsRawData?.filter(
      (allocation) =>
        associatedAllocationConsigneeIds?.includes(allocation.AllocationConsigneeId) &&
        associatedAllocationTerminalIds?.includes(allocation.AllocationTerminalId) &&
        associatedAllocationProductIds?.includes(allocation.AllocationProductId)
    )

    if (MatchingExternalAllocation?.length === 1) {
      const LinkedAllocationId = MatchingExternalAllocation[0]?.AllocationId
      return { ...row, LinkedAllocationId }
    }
    return row
  })

  const payloadContent = updatedData
    .filter((item) => item.LinkedAllocationId)
    .map((cp) => {
      return {
        CounterPartyId: cp.CounterPartyId,
        TradeEntrySetupId: cp.AuthorizationAllocationSetup.TradeEntrySetupId,
        AllocationId: cp.LinkedAllocationId,
        RefreshFrequencyTypeCvId: cp.RefreshFrequencyTypeCvId,
      }
    })
  const payload = { Links: payloadContent } as UpsertLinksPayload
  return payload
}
