import { AllocationAssociationsReferencesResponseData } from '@modules/Admin/ManageAllocationAssociations/api/types.schema'
import {
  GetAllocationAssociationsResponse,
  GetAllocationsResponse,
} from '@modules/Admin/PriceEngineQuoteBookAllocationManagement/api/types.schema'

interface GetAssociatedRowsProps {
  selectedForeignRow?: GetAllocationsResponse
  associationsData?: GetAllocationAssociationsResponse[]
  referenceData?: AllocationAssociationsReferencesResponseData
}
export function getAssociatedRows({ selectedForeignRow, associationsData, referenceData }: GetAssociatedRowsProps) {
  if (!selectedForeignRow || !associationsData || !referenceData) return associationsData

  const { AllocationId, AllocationProductId, AllocationTerminalId } = selectedForeignRow

  // Find associated product and location IDs
  const associatedProductIds = referenceData.Data.Products.find(
    (row) => row.AllocationProductId === AllocationProductId
  )?.AllocationProductAssociations?.map((association) => association.ProductId)

  const associatedLocationIds = referenceData.Data.Terminals.find(
    (row) => row.AllocationTerminalId === AllocationTerminalId
  )?.AllocationTerminalAssociations?.map((association) => association.LocationId)

  // Filter the association data based on the criteria
  return associationsData.filter((row) => {
    const isMappedToForeignRow = row.LinkedAllocationIds.some((assoc) => assoc.AllocationId === AllocationId)

    const productAndLocationAreMapped =
      associatedProductIds?.includes(row.ProductId) && associatedLocationIds?.includes(row.LocationId)

    return isMappedToForeignRow || productAndLocationAreMapped
  })
}
