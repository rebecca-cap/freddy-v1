import { AllocationAssociationsReferencesResponseData } from '@modules/Admin/ManageAllocationAssociations/api/types.schema'
import { Horizontal, useLocalStorage, Vertical } from '@gravitate-js/excalibrr'
import { GetAllocationsResponse } from '@modules/Admin/PriceEngineQuoteBookAllocationManagement/api/types.schema'
import { useAllocationManagement } from '@modules/Admin/PriceEngineQuoteBookAllocationManagement/api/useAllocationManagement'
import { AllocationsGrid } from '@modules/Admin/PriceEngineQuoteBookAllocationManagement/components/AllocationsGrid'
import { AssociationsGrid } from '@modules/Admin/PriceEngineQuoteBookAllocationManagement/components/AssociationsGrid'
import React, { useState } from 'react'

interface AllocationManagementMainTabProps {
  data: GetAllocationsResponse[]
  isLoading: boolean
  metadata: AllocationAssociationsReferencesResponseData
  canWrite: boolean
}
export function AllocationManagementMainTab({ data, isLoading, metadata, canWrite }: AllocationManagementMainTabProps) {
  const [selectedAllocationRow, setSelectedAllocationRow] = useState<GetAllocationsResponse | undefined>()
  const { value: isFilteringToRelatedData, setValue: setIsFilteringToRelatedData } = useLocalStorage(
    'AllocationAssociationManagement-setIsFilteringToRelatedData',
    false
  )
  const { getAssociationsQuery } = useAllocationManagement()
  const { data: associationsData, isLoading: isAssociationsDataLoading } = getAssociationsQuery()
  return (
    <Horizontal className='full-height-width'>
      <Vertical flex={1} className='full-height-width'>
        <AllocationsGrid
          isFilteringToRelatedData={isFilteringToRelatedData}
          setIsFilteringToRelatedData={setIsFilteringToRelatedData}
          data={data}
          isLoading={isLoading}
          setSelectedAllocationRow={setSelectedAllocationRow}
          selectedAllocationRow={selectedAllocationRow}
          associationsData={associationsData}
        />
      </Vertical>
      <Vertical flex={1} className='full-height-width'>
        <AssociationsGrid
          isFilteringToRelatedData={isFilteringToRelatedData}
          selectedAllocationRow={selectedAllocationRow}
          referenceData={metadata}
          associationsData={associationsData}
          isAssociationsDataLoading={isAssociationsDataLoading}
          canWrite={canWrite}
        />
      </Vertical>
    </Horizontal>
  )
}
