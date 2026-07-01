import { AuditOutlined, DownloadOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Switch, Tooltip } from 'antd'
import React from 'react'

export function TASSwitch({ tasMode, toggleTasMode }) {
  return (
    <Horizontal verticalCenter horizontalCenter>
      <Tooltip title='Trade at Settle'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Texto className='mr-1' category='h4'>
            <AuditOutlined />
          </Texto>
          <Switch
            checkedChildren={<DownloadOutlined />}
            onChange={toggleTasMode}
            defaultChecked={tasMode}
            checked={tasMode}
          />
        </div>
      </Tooltip>
    </Horizontal>
  )
}
