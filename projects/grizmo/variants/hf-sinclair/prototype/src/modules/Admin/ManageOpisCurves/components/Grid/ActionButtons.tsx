import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { OpisCurveItem } from '@modules/Admin/ManageOpisCurves/api/types.schema'
import { Popconfirm } from 'antd'
import React from 'react'

type ManageOpisCurvesGridActionButtonsProps = {
  selectedRows: OpisCurveItem[]
  handleActivateOpisCurves: () => void
  isLoading: boolean
}

export function ManageOpisCurvesGridActionButtons({
  selectedRows,
  handleActivateOpisCurves,
  isLoading,
}: ManageOpisCurvesGridActionButtonsProps) {
  return (
    <Horizontal>
      <Popconfirm
        title='Are you sure you want to activate the selected rows for integration?'
        onConfirm={() => handleActivateOpisCurves()}
        okText='Yes'
        cancelText='No'
      >
        <GraviButton
          success
          loading={isLoading}
          buttonText={selectedRows?.length ? `Activate (${selectedRows?.length})` : 'Activate'}
          disabled={!selectedRows?.length}
        />
      </Popconfirm>
    </Horizontal>
  )
}
