import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import { useContractManagementContext } from '@contexts/ContractManagement'
import { GraviButton } from '@gravitate-js/excalibrr'
import { Menu, Popover } from 'antd'
import _ from 'lodash'
import React, { useState } from 'react'

export function buildActions(detail, openTab, newTab, deleteDetail, closeMenu?: () => void, hideViewEdit = false) {
  const { header, details, canWrite } = useContractManagementContext()

  const isActionDisabled = (actionKey: string) => {
    const currentDetailId = detail?.LocalTradeEntryDetailId

    const deleteDisabled =
      header?.OrderStatusCodeValueDisplay === 'Accepted' || header?.OrderStatusCodeValueDisplay === 'Canceled'
    // need to use Trade Entry detail id for details that are saved to check against new/duplicated details
    switch (actionKey) {
      case 'Delete':
        return deleteDisabled ?? false
      case 'Duplicate':
        if (!currentDetailId) return true
        return details.every((entry) => entry.LocalTradeEntryDetailId !== currentDetailId)
      default:
        return false
    }
  }

  const writeActions = canWrite
    ? [
        {
          icon: <AppstoreAddOutlined />,
          label: 'Duplicate',
          onClick: (e: React.MouseEvent | React.KeyboardEvent) => {
            e.stopPropagation()
            const duplicateDetail = _.cloneDeep(detail)
            const detailToShow = {
              ...duplicateDetail,
              LocalTradeEntryDetailId: `duplicate/${detail.LocalTradeEntryDetailId}`,
              TradeEntryDetailId: '',
            }
            newTab(detailToShow)
            if (closeMenu) {
              closeMenu()
            }
          },
          disabled: isActionDisabled('Duplicate'),
        },
        {
          icon: <DeleteOutlined />,
          label: 'Delete',
          onClick: (e: React.MouseEvent | React.KeyboardEvent) => {
            e.stopPropagation()
            deleteDetail(detail)
            if (closeMenu) {
              closeMenu()
            }
          },
          disabled: isActionDisabled('Delete'),
        },
      ]
    : []
  const viewEditActions = !hideViewEdit
    ? [
        {
          icon: <EditOutlined />,
          label: `View ${canWrite ? '/ Edit' : ''}`,
          onClick: (e: React.MouseEvent | React.KeyboardEvent) => {
            e.stopPropagation()
            openTab(detail)
            if (closeMenu) {
              closeMenu()
            }
          },
          disabled: false,
        },
      ]
    : []
  return [...viewEditActions, ...writeActions]
}

function MenuButton({ onClick, isActive = false }) {
  return (
    <GraviButton
      onClick={onClick}
      className='ghost-gravi-button'
      icon={<MoreOutlined style={{ fontSize: '1.8em', color: isActive ? 'white' : 'inherit' }} />}
    />
  )
}

function ActionMenuItems({ actions }) {
  return (
    <Menu mode='inline' style={{ width: 160 }}>
      {actions.map(({ icon, label, onClick, disabled }) => (
        <Menu.Item key={label} icon={icon} onClick={(e) => onClick(e.domEvent)} disabled={disabled}>
          {label}
        </Menu.Item>
      ))}
    </Menu>
  )
}

export function ActionMenu({ detail, openTab, newTab, deleteDetail, isActive = false, hideViewEdit = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const openMenu = () => setIsMenuOpen(true)
  const closeMenu = () => setIsMenuOpen(false)

  const actions = buildActions(detail, openTab, newTab, deleteDetail, closeMenu, hideViewEdit)

  return (
    <Popover
      className='action-popover'
      placement='bottomRight'
      content={() => <ActionMenuItems actions={actions} />}
      trigger='click'
      onVisibleChange={(event) => setIsMenuOpen(event)}
      visible={isMenuOpen}
    >
      <MenuButton
        onClick={(e) => {
          e.stopPropagation()
          openMenu()
        }}
        isActive={isActive}
      />
    </Popover>
  )
}
