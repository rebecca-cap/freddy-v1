import { Crumbs } from '@components/shared/Hierarchies/components/Crumbs'
import { GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Skeleton } from 'antd'
import React from 'react'

export function HierarchyItems({
  isBulkMoving,
  onStartBulkMove,
  onCancelBulkMove,
  onManageHierarchies,
  canWrite,
  canBulkChange,
  isLoading,
  hItems,
  grid,
}) {
  if (isLoading) return <Skeleton active />

  return (
    <>
      <Horizontal className='p-3 bg-2 pl-3 items-center' style={{ justifyContent: 'space-between' }}>
        <div className='flex-1'>{hItems?.BreadCrumbs?.length ? <Crumbs crumbs={hItems.BreadCrumbs} /> : null}</div>
        {canWrite && (
          <div>
            {!isBulkMoving ? (
              <GraviButton
                disabled={!canBulkChange}
                className='mr-3'
                buttonText='Bulk Move'
                onClick={onStartBulkMove}
              />
            ) : (
              <GraviButton className='mr-3' warning buttonText='Cancel Move' onClick={onCancelBulkMove} />
            )}
            <GraviButton onClick={onManageHierarchies} buttonText='Manage Hierarchies' />
          </div>
        )}
      </Horizontal>
      <Vertical style={isBulkMoving ? { filter: 'grayscale(1)', opacity: '0.6', pointerEvents: 'none' } : {}}>
        {grid}
      </Vertical>
    </>
  )
}
