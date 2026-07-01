import { useLocationManagement } from '@api/useLocationManagement'
import { HierarchyItems } from '@components/shared/Hierarchies/components/HierarchyItems'
import { HierarchySelector } from '@components/shared/Hierarchies/components/HierarchySelector'
import { ManageHierarchyDrawer } from '@components/shared/Hierarchies/components/ManageHierarchyDrawer'
import { useUser } from '@contexts/UserContext'
import { Horizontal, useLocalStorage, Vertical } from '@gravitate-js/excalibrr'
import { Drawer } from 'antd'
import React, { useState } from 'react'

import { LocationHierarchyGrid } from './components/Grid/grid'
import LocationTree from './components/locationTree'

export function ManageLocationHierarchy() {
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.LocationHierarchy?.Write

  const { value: selectedHierarchy, setValue: setSelectedHierarchy } = useLocalStorage<number | null>(
    'LocationSelectedHierarchy',
    null
  )

  const [selectedKey, setSelectedKey] = useState(0)

  const { moveLocationsInHierarchyMutation, useHierarchyListQuery, upsertHierarchyMutation, useHierarchyItemsQuery } =
    useLocationManagement()
  const { data: hierarchies = [], isLoading: hierarchyListLoading } = useHierarchyListQuery()
  const { data: hItems, isLoading: hierarchyItemsLoading } = useHierarchyItemsQuery(selectedKey, selectedHierarchy)

  const [locationIdsToBulkMove, setLocationIdsToBulkMove] = useState([])
  const [isBulkMoving, setIsBulkMoving] = useState(false)
  const [shouldShowHierarchiesDrawer, setShowHierarchiesDrawer] = useState(false)

  function handleSelectNewLocationOnTree(newKey: number) {
    setSelectedKey(newKey)
    if (isBulkMoving) {
      moveLocationsInHierarchyMutation.mutate({
        KeysToMove: locationIdsToBulkMove,
        TargetKey: newKey,
        HierarchyKey: selectedHierarchy ?? 0,
      })
      setLocationIdsToBulkMove([])
      setIsBulkMoving(false)
    }
  }

  const [canBulkChange, setCanBulkChange] = useState(false)
  const idsToShow = (hItems?.ChildrenKeys?.length ?? 0) > 0 ? hItems?.ChildrenKeys : hItems?.SiblingKeys

  function handleIdsToBulkMove(newIds) {
    setCanBulkChange(newIds.length > 0)
    setLocationIdsToBulkMove(newIds)
  }

  return (
    <Horizontal fullHeight>
      <Drawer
        title='Location Hierarchies'
        placement='right'
        width='500'
        closable
        onClose={() => setShowHierarchiesDrawer(false)}
        visible={shouldShowHierarchiesDrawer}
        bodyStyle={{
          padding: '0px',
        }}
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
        <LocationTree
          onSelect={handleSelectNewLocationOnTree}
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
            <LocationHierarchyGrid
              title={hItems?.Level || 'Locations'}
              locationIds={idsToShow}
              onChangeSelectedLocationIds={handleIdsToBulkMove}
              canWrite={canWrite}
            />
          }
        />
      </Vertical>
    </Horizontal>
  )
}
