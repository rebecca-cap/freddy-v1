import { PlusOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import React from 'react'

type ManageBenchmarksGridActionsProps = {
  canWrite: boolean
  setIsShowingCreateForm: React.Dispatch<React.SetStateAction<boolean>>
}

export function ManageBenchmarkCorrelationsGridActions({
  canWrite,
  setIsShowingCreateForm,
}: ManageBenchmarksGridActionsProps) {
  return (
    <Horizontal gap='1em'>
      {canWrite && (
        <GraviButton
          onClick={() => setIsShowingCreateForm((isShowing) => !isShowing)}
          icon={<PlusOutlined className='pr-2' />}
          buttonText='Create New Benchmark'
          color='primary'
          className='mr-3'
        />
      )}
    </Horizontal>
  )
}
