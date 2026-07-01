import { useProductManagement } from '@api/useProductManagement'
import { TreeView } from '@components/shared/Hierarchies/components/TreeView'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Skeleton } from 'antd'
import React from 'react'

interface ProductTreeProps {
  onSelect?: (keySelected: number) => void
  hierarchy?: number
  canWrite?: boolean
}

function NoOpOnSelect(_: number) {}

const ProductTree: React.FC<ProductTreeProps> = ({ onSelect = NoOpOnSelect, hierarchy = 0, canWrite }) => {
  const { useHierarchyQuery, moveProductsInHierarchyMutation } = useProductManagement()
  const { data, isError, isLoading } = useHierarchyQuery(hierarchy)

  function handleMove({ KeysToMove, TargetKey }) {
    moveProductsInHierarchyMutation.mutate({ KeysToMove, TargetKey, HierarchyKey: hierarchy })
  }

  if (isError)
    return (
      <Horizontal className='pt-4' verticalCenter>
        <Texto category='p2'>Please select a Hierarchy to get started</Texto>
      </Horizontal>
    )
  if (isLoading) return <Skeleton active />

  return <TreeView title='Products' onMove={handleMove} onSelect={onSelect} data={data} canWrite={canWrite} />
}

export default ProductTree
