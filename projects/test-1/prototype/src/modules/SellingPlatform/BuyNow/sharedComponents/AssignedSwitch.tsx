import { DownloadOutlined, SolutionOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Switch, Tooltip } from 'antd'
import React from 'react'

export function AssignedSwitch({ onlyAssigned, toggleOnlyAssigned }) {
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
          />
        </div>
      </Tooltip>
    </Horizontal>
  )
}
