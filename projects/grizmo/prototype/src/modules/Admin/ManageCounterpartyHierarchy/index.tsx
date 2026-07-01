import { useCounterparties } from '@api/useCounterparties'
import { HierarchyItems } from '@components/shared/Hierarchies/components/HierarchyItems'
import { HierarchySelector } from '@components/shared/Hierarchies/components/HierarchySelector'
import { ManageHierarchyDrawer } from '@components/shared/Hierarchies/components/ManageHierarchyDrawer'
import { useUser } from '@contexts/UserContext'
import { Horizontal, useLocalStorage, Vertical } from '@gravitate-js/excalibrr'
import { CounterpartyTree } from '@modules/Admin/ManageCounterpartyHierarchy/components/counterpartyTree'
import { CounterpartyHierarchyGrid } from '@modules/Admin/ManageCounterpartyHierarchy/components/Grid/grid'
import { Drawer } from 'antd'
import { useState } from 'react'

export function ManageCounterpartyHierarchy() {
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.CounterpartyHierarchy?.Write || true
  const { value: selectedHierarchy, setValue: setSelectedHierarchy } = useLocalStorage<number | null>(
    'CounterpartySelectedHierarchy',
    null
  )
  const [selectedKey, setSelectedKey] = useState(0)

  const {
    moveCounterpartiesInHierarchyMutation,
    useHierarchyItemsQuery,
    useHierarchyListQuery,
    upsertHierarchyMutation,
  } = useCounterparties()
  const { data: hItems, isLoading: hierarchyItemsLoading } = useHierarchyItemsQuery(selectedKey, selectedHierarchy)
  const { data: hierarchies = [], isLoading: hierarchyListLoading } = useHierarchyListQuery()

  const [canBulkChange, setCanBulkChange] = useState(false)
  const [counterpartyIdsToBulkMove, setCounterpartyIdsToBulkMove] = useState([])
  const [isBulkMoving, setIsBulkMoving] = useState(false)
  const [shouldShowHierarchiesDrawer, setShowHierarchiesDrawer] = useState(false)
  const idsToShow = (hItems?.ChildrenKeys?.length ?? 0) > 0 ? hItems?.ChildrenKeys : hItems?.SiblingKeys

  function handleIdsToBulkMove(newIds) {
    setCanBulkChange(newIds.length > 0)
    setCounterpartyIdsToBulkMove(newIds)
  }

  function handleSelectNewCounterpartyOnTree(newKey: number) {
    setSelectedKey(newKey)
    if (isBulkMoving) {
      moveCounterpartiesInHierarchyMutation.mutate({
        KeysToMove: counterpartyIdsToBulkMove,
        TargetKey: newKey,
        HierarchyKey: selectedHierarchy ?? 0,
      })
      setCounterpartyIdsToBulkMove([])
      setIsBulkMoving(false)
    }
  }

  return (
    <Horizontal fullHeight>
      <Drawer
        title='Counterparty Hierarchies'
        placement='right'
        width='500'
        closable
        onClose={() => setShowHierarchiesDrawer(false)}
        visible={shouldShowHierarchiesDrawer}
        destroyOnClose
        bodyStyle={{
          padding: '0px',
        }}
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
        <CounterpartyTree
          onSelect={handleSelectNewCounterpartyOnTree}
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
            <CounterpartyHierarchyGrid
              title={hItems?.Level || 'Counterparties'}
              counterpartyIds={idsToShow}
              onChangeSelectedLocationIds={handleIdsToBulkMove}
              canWrite={canWrite}
            />
          }
        />
      </Vertical>
    </Horizontal>
  )
}
