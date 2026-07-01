import { useLocationManagement } from '@api/useLocationManagement'
import { TreeView } from '@components/shared/Hierarchies/components/TreeView'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import React from 'react'

interface LocationTreeProps {
  onSelect?: (keySelected: number) => void
  hierarchy?: number
  canWrite?: boolean
}

function NoOpOnSelect(_: number) {}

const LocationTree: React.FC<LocationTreeProps> = ({ onSelect = NoOpOnSelect, hierarchy = 0, canWrite }) => {
  const { useHierarchyQuery, moveLocationsInHierarchyMutation } = useLocationManagement()
  const { data, isError, isLoading } = useHierarchyQuery(hierarchy)

  function handleMove({ KeysToMove, TargetKey }) {
    moveLocationsInHierarchyMutation.mutate({ KeysToMove, TargetKey, HierarchyKey: hierarchy })
  }

  if (isError)
    return (
      <Horizontal className='pt-4' verticalCenter>
        <Texto category='p2'>Please select a Hierarchy to get started</Texto>
      </Horizontal>
    )
  if (isLoading)
    return (
      <Horizontal className='pt-4' verticalCenter>
        <Texto category='p2'>Loading...</Texto>
      </Horizontal>
    )

  return <TreeView title='Locations' onMove={handleMove} onSelect={onSelect} data={data} canWrite={canWrite} />
}

export default LocationTree
