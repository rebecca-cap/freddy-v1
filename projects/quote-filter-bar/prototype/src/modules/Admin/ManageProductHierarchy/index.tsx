import { useProductManagement } from '@api/useProductManagement'
import { HierarchyItems } from '@components/shared/Hierarchies/components/HierarchyItems'
import { HierarchySelector } from '@components/shared/Hierarchies/components/HierarchySelector'
import { ManageHierarchyDrawer } from '@components/shared/Hierarchies/components/ManageHierarchyDrawer'
import { useUser } from '@contexts/UserContext'
import { Horizontal, useLocalStorage, Vertical } from '@gravitate-js/excalibrr'
import { ProductHierarchyGrid } from '@modules/Admin/ManageProductHierarchy/components/Grid/grid'
import { Drawer } from 'antd'
import React, { useState } from 'react'

import ProductTree from './components/productTree'

export function ManageProductHierarchy() {
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.ProductHierarchy?.Write

  const { value: selectedHierarchy, setValue: setSelectedHierarchy } = useLocalStorage<number | null>(
    'ProductSelectedHierarchy',
    null
  )
  const [selectedKey, setSelectedKey] = useState(0)

  const { moveProductsInHierarchyMutation, useHierarchyItemsQuery, useHierarchyListQuery, upsertHierarchyMutation } =
    useProductManagement()

  const { data: hItems, isLoading: hierarchyItemsLoading } = useHierarchyItemsQuery(selectedKey, selectedHierarchy)
  const { data: hierarchies = [], isLoading: hierarchyListLoading } = useHierarchyListQuery()

  const [canBulkChange, setCanBulkChange] = useState(false)

  const [productIdsToBulkMove, setProductIdsToBulkMove] = useState([])
  const [isBulkMoving, setIsBulkMoving] = useState(false)
  const [shouldShowHierarchiesDrawer, setShowHierarchiesDrawer] = useState(false)
  const idsToShow = (hItems?.ChildrenKeys?.length ?? 0) > 0 ? hItems?.ChildrenKeys : hItems?.SiblingKeys

  function handleIdsToBulkMove(newIds) {
    setCanBulkChange(newIds.length > 0)
    setProductIdsToBulkMove(newIds)
  }

  function handleSelectNewProductOnTree(newKey: number) {
    setSelectedKey(newKey)
    if (isBulkMoving) {
      moveProductsInHierarchyMutation.mutate({
        KeysToMove: productIdsToBulkMove,
        TargetKey: newKey,
        HierarchyKey: selectedHierarchy ?? 0,
      })
      setProductIdsToBulkMove([])
      setIsBulkMoving(false)
    }
  }

  return (
    <Horizontal fullHeight>
      <Drawer
        title='Product Hierarchies'
        placement='right'
        width='500'
        bodyStyle={{
          padding: '0px',
        }}
        closable
        onClose={() => setShowHierarchiesDrawer(false)}
        visible={shouldShowHierarchiesDrawer}
        className='supply-zone-drawer'
        destroyOnClose
      >
        <ManageHierarchyDrawer
          hierarchyList={hierarchies}
          isLoading={hierarchyListLoading}
          onUpsert={({ Name, HierarchyKey }) => {
            upsertHierarchyMutation.mutate({ Name, HierarchyKey })
          }}
        />
      </Drawer>
      <Vertical style={{ maxWidth: 450, overflowY: 'scroll' }}>
        <HierarchySelector value={selectedHierarchy} onChange={setSelectedHierarchy} hierarchies={hierarchies} />
        <ProductTree
          onSelect={handleSelectNewProductOnTree}
          hierarchy={selectedHierarchy ?? undefined}
          canWrite={canWrite}
        />
      </Vertical>
      <Vertical className='ml-3'>
        <HierarchyItems
          isBulkMoving={isBulkMoving}
          onStartBulkMove={() => setIsBulkMoving(true)}
          onCancelBulkMove={() => setIsBulkMoving(false)}
          onManageHierarchies={() => setShowHierarchiesDrawer(true)}
          canWrite={canWrite}
          canBulkChange={canBulkChange}
          isLoading={hierarchyItemsLoading}
          hItems={hItems}
          grid={
            <ProductHierarchyGrid
              title={hItems?.Level || 'Products'}
              productIds={idsToShow}
              onChangeSelectedProductIds={handleIdsToBulkMove}
              canWrite={canWrite}
            />
          }
        />
      </Vertical>
    </Horizontal>
  )
}
