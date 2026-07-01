import { PlusCircleOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import React from 'react'

interface PriceMappingActionButtonsProps {
  isBulkEditMode: boolean
  onActivateAll: () => void
  onDeactivateAll: () => void
  onEditProducts: () => void
  onEditLocations: () => void
  onCancel: () => void
  openCreateModal: () => void
}

export function SubscriptionManagementActionButtons({
  isBulkEditMode,
  onActivateAll,
  onDeactivateAll,
  onEditProducts,
  onEditLocations,
  onCancel,
  openCreateModal,
}: PriceMappingActionButtonsProps) {
  return isBulkEditMode ? (
    <Horizontal verticalCenter style={{ gap: 2, justifyContent: 'flex-start', width: '100%' }}>
      <GraviButton buttonText='Activate All' success size='small' onClick={onActivateAll} className='mr-1' />
      <GraviButton buttonText='Deactivate All' size='small' onClick={onDeactivateAll} className='mr-1' />
      <GraviButton buttonText='Edit Products' theme1 size='small' onClick={onEditProducts} className='mr-1' />
      <GraviButton buttonText='Edit Locations' theme1 size='small' onClick={onEditLocations} className='mr-1' />
      <GraviButton buttonText='Cancel' size='small' onClick={onCancel} className='mr-5' />
    </Horizontal>
  ) : (
    <GraviButton buttonText='Create' success icon={<PlusCircleOutlined />} onClick={openCreateModal} />
  )
}
