import {
  ArrowRightOutlined,
  BarChartOutlined,
  CopyOutlined,
  DollarCircleFilled,
  EllipsisOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { GraviButton, Horizontal, NotificationMessage, Texto } from '@gravitate-js/excalibrr'
import { Menu, Popconfirm, Popover, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function NavButton({ onClick, icon, tooltipText = '', disabled = false }) {
  return (
    <Tooltip title={tooltipText}>
      <GraviButton
        size='large'
        disabled={disabled}
        appearance='link'
        type='link'
        style={{ cursor: 'pointer', color: 'var(--theme-gray-800)' }}
        onClick={onClick}
        icon={icon}
      />
    </Tooltip>
  )
}

export function ActionMenu(params) {
  const [open, setOpen] = useState(false)
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)
  const navigate = useNavigate()
  return (
    <Horizontal alignItems='center'>
      <NavButton
        tooltipText='View / Edit'
        onClick={() => navigate(`/ContractManagement/${params?.data.TradeEntryId}`, { replace: true })}
        icon={<ArrowRightOutlined className='mr-2' />}
      />
      <NavButton tooltipText='Measure Volume' onClick={() => {}} icon={<BarChartOutlined />} />
      <NavButton
        tooltipText='Assess Price'
        onClick={() =>
          navigate(`/ContractManagement/Measurements`, { state: { ContractId: params?.data.TradeEntryId } })
        }
        icon={<DollarCircleFilled />}
      />
      <Popover
        className='action-popover'
        placement='bottomLeft'
        content={
          <Menu>
            <Menu.Item
              key='2'
              disabled={params?.data?.IsExtracted}
              icon={<CopyOutlined />}
              onClick={() => {
                navigate(`/ContractManagement/${params?.data.TradeEntryId}`, { state: { queryType: 'duplicate' } })
              }}
            >
              Duplicate
            </Menu.Item>
            <Popconfirm
              visible={isDeleteVisible}
              onConfirm={async () => {
                try {
                  const response = await params?.cancelContractMutation.mutateAsync(params?.data.TradeEntryId)
                  if (response.StatusCode === 'OK') {
                    NotificationMessage('Contract Cancelled', 'The Contract has been canceled', false)
                    params?.dataQuery.refetch()
                  }
                } catch (error) {
                  NotificationMessage('Unable to Cancel', 'The Contract could not be canceled', true)
                }
                setIsDeleteVisible(false)
              }}
              onCancel={() => setIsDeleteVisible(false)}
              placement='left'
              okText='Yes'
              title={
                <>
                  <Texto>Are you sure you want to cancel this contract?</Texto>
                  <Texto> This action cannot be undone.</Texto>
                </>
              }
            >
              <Menu.Item key='3' icon={<StopOutlined />} onClick={() => setIsDeleteVisible(true)}>
                Cancel
              </Menu.Item>
            </Popconfirm>
          </Menu>
        }
        trigger='click'
        onVisibleChange={(flag) => setOpen(flag)}
        visible={open}
      >
        <NavButton icon={<EllipsisOutlined />} onClick={() => {}} />
      </Popover>
    </Horizontal>
  )
}
