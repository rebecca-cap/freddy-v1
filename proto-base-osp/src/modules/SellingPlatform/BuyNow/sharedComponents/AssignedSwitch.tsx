import { DownloadOutlined, SolutionOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Switch, Tooltip } from 'antd'
import React from 'react'

interface AssignedSwitchProps {
  onlyAssigned: boolean
  toggleOnlyAssigned: (checked: boolean) => void
  disabled?: boolean
}

export function AssignedSwitch({ onlyAssigned, toggleOnlyAssigned, disabled = false }: AssignedSwitchProps) {
  return (
    <Horizontal className='mr-3' verticalCenter>
      <Tooltip title='Only Assigned'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Texto className='mr-1' category='h4'>
            <SolutionOutlined />
          </Texto>
          <Switch
            checkedChildren={<DownloadOutlined />}
            onChange={toggleOnlyAssigned}
            defaultChecked={onlyAssigned}
            checked={onlyAssigned}
            disabled={disabled}
          />
        </div>
      </Tooltip>
    </Horizontal>
  )
}
