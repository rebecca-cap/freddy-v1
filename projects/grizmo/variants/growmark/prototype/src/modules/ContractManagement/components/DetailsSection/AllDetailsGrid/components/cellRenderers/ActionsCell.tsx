import { useContractManagementContext } from '@contexts/ContractManagement'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { Detail } from '@modules/ContractManagement/api/types.schema'
import { buildActions } from '@modules/ContractManagement/components/DetailsSection/DetailCard/ActionMenu'
import { Tooltip } from 'antd'
import React from 'react'

export function ActionsCell({ data }: { data: Detail }) {
  const { openTab, newTab, deleteDetail } = useContractManagementContext()

  const actionItems = buildActions(data, openTab, newTab, deleteDetail)
  return (
    <Horizontal justifyContent='space-evenly' verticalCenter>
      {actionItems.map(({ icon, label, onClick, disabled }) => (
        <Tooltip title={label} key={label}>
          <GraviButton className='ghost-gravi-button' key={label} icon={icon} onClick={onClick} disabled={disabled} />
        </Tooltip>
      ))}
    </Horizontal>
  )
}
