import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import {
  PreviewMode,
  PriceNotification,
} from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/PreviewNotifications/api/schema.types'
import { Radio } from 'antd'
import React from 'react'

interface PreviewActionButtonsProps {
  selectedRows: PriceNotification[]
  setIsShowingConfirmModal: React.Dispatch<React.SetStateAction<boolean>>
  mode: PreviewMode
  setMode: React.Dispatch<React.SetStateAction<PreviewMode>>
}

export function PreviewActionButtons({
  setIsShowingConfirmModal,
  selectedRows,
  mode,
  setMode,
}: PreviewActionButtonsProps) {
  return (
    <Horizontal verticalCenter justifyContent='space-between' className='ml-2 w-full'>
      <Horizontal flex={1} verticalCenter style={{ minWidth: '350px' }}>
        <Texto className='mr-2'>Mode: </Texto>
        <Radio.Group name='mode' value={mode} onChange={(e) => setMode(e.target.value)}>
          <Radio.Button value='EndOfDay'>End of Day Prices</Radio.Button>
          <Radio.Button value='IntraDay'>Midday Price Changes</Radio.Button>
          <Radio.Button value='EndOfDayCurrentPeriod'>Current Period Prices</Radio.Button>
        </Radio.Group>
      </Horizontal>
      <Horizontal flex={0.5} verticalCenter justifyContent='flex-end'>
        <GraviButton
          buttonText={`Notify Selected (${selectedRows.length})`}
          disabled={!selectedRows.length}
          theme1
          onClick={() => setIsShowingConfirmModal(true)}
        />
      </Horizontal>
    </Horizontal>
  )
}
