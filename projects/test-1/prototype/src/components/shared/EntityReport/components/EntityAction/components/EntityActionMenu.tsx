import './EntityActionMenu.css'

import { EditOutlined, MoreOutlined } from '@ant-design/icons'
import { GraviButton, NotificationMessage, Texto, useApi } from '@gravitate-js/excalibrr'
import { useContracts } from '@modules/ContractManagement/api/useContracts'
import { createEntityAction as createAction } from '@utils/api/entityActions'
import { Menu, Popconfirm, Popover } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const actionTypeToClickHandlers = (action, props, api, navigate, setOpen, setIsConfirmVisible) => {
  const actionType = action.EntityAction.EntityActionTypeMeaning
  const { PrimaryKeyField } = props.schema.EntityView
  props?.setSelectedEntityAction(action.EntityAction.UrlPattern)
  switch (actionType) {
    case 'URL':
      return handleURL(action, props, api, PrimaryKeyField, navigate)
    case 'Edit':
      return () => handleEdit(props, navigate)
    case 'Clone':
      return () => handleClone(props, navigate)
    case 'Dialog':
      return handleDialog(props, action, setIsConfirmVisible, setOpen)
    default:
      return console.log(`No action handler found for action name ${actionType}.`, { props })
  }
}
const stubbedActionItems = (props: any, api, navigate, setOpen, setIsConfirmVisible) => {
  const schemaEntityActions = props?.schema?.PageSetupEntityActions
  const menuItems = []

  schemaEntityActions.forEach((entityAction) => {
    const action = createAction(entityAction.EntityActionDisplay, <EditOutlined />, (actions) => {
      const clickHandler = actionTypeToClickHandlers(entityAction, props, api, navigate, setOpen, setIsConfirmVisible)
      return clickHandler
    })
    menuItems.push(action)
  })

  return menuItems
}

export function EntityActionMenu(props) {
  const api = useApi()

  const [open, setOpen] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const { cancelContract } = useContracts()
  const cancelContractMutation = cancelContract()
  const navigate = useNavigate()

  const handleCancelContract = async () => {
    try {
      const response = await cancelContractMutation.mutateAsync(props.data[props.primaryKey])
      if (response.StatusCode === 'OK') {
        NotificationMessage('Contract Cancelled', 'The Contract has been canceled', false)
        props.dataQuery.refetch()
      }
    } catch (error) {
      NotificationMessage('Unable to Cancel', 'The Contract could not be canceled', true)
    }
    setIsConfirmVisible(false)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Popconfirm
        visible={isConfirmVisible}
        onConfirm={handleCancelContract}
        onCancel={() => setIsConfirmVisible(false)}
        placement='left'
        okText='Yes'
        title={
          <>
            <Texto>Are you sure you want to cancel this contract?</Texto>
            <Texto> This action cannot be undone.</Texto>
          </>
        }
      />
      <Popover
        className='action-popover'
        placement='bottomRight'
        content={() => getMenuContent(props, setOpen, actionTypeToClickHandlers, setIsConfirmVisible, navigate, api)}
        trigger='click'
        onVisibleChange={(flag) => setOpen(flag)}
        visible={open}
      >
        <GraviButton icon={<MoreOutlined />} />
      </Popover>
    </div>
  )
}

async function handleURL(action, props, api, PrimaryKeyField, navigate) {
  props.setCurrentItemId(props.data[props.primaryKey])

  if (props.schema.EntityViewName === 'ContractManagement') {
    if (action.EntityActionName === 'Edit') {
      return handleEdit(props, navigate)
    }
    if (action.EntityActionName === 'Clone') {
      return handleClone(props, navigate)
    }
  }

  const endpoint = action.EntityAction.UrlPattern
  const response = await api.post(endpoint, { [PrimaryKeyField]: props.data[PrimaryKeyField] })
  return handleResponse(response, props)
}

function handleEdit(props, navigate) {
  navigate(`/ContractManagement/${props.data[props.primaryKey]}`)
  // window.location.href = `/ContractManagement/${props.data[props.primaryKey]}`
}

function handleClone(props, navigate) {
  const primaryKeyValue = props.data[props.primaryKey]
  navigate(`/ContractManagement/${primaryKeyValue}`, { state: { queryType: 'duplicate' } })
}

function handleDialog(props, action, setIsConfirmVisible, setOpen) {
  props.setCurrentItemId(props.data[props.primaryKey])

  if (props.schema.EntityViewName === 'ContractManagement') {
    if (action.EntityActionName === 'Cancel') {
      props.setIsDeleteModalOpen(true)
      setIsConfirmVisible(true)
      setOpen(false)
    }
  }
  if (props.schema.EntityViewName === 'VTradeEntryValuationResult') {
    props.setIsInfoModalOpen(true)
    setOpen(false)
  }
  if (props.schema.EntityViewName === 'IntegrationStatus') {
    setOpen(false)
    props.setIsInfoModalOpen(true)
    props.setIsDeleteModalOpen(true)
  }

  props.setIsInfoModalOpen(true)
}

function handleResponse(response, props) {
  const message = response?.Validations[0]?.Message
  const showError = response.Validations[0]?.Severity === 'Error' && response?.ActionStatus !== 'Success'
  NotificationMessage(response.ActionStatus, message, showError)
  props.dataQuery.refetch()
}

// TODO: EntityActionTypeMeanings
//  Each is unique in db.  Can use to implement?
const EntityActionTypeMeanings = {
  NAVIGATE: 'URL',
  MODAL: 'Dialog',
}

function getMenuContent(props, setOpen, actionToClickHandler, setIsConfirmVisible, navigate, api) {
  const stubbedItems = stubbedActionItems(props, api, navigate, setOpen, setIsConfirmVisible)

  return (
    <Menu mode='inline' style={{ width: 160 }}>
      {stubbedItems?.map((item) => {
        return (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={() => {
              item.onClick(props)
              setOpen(false)
            }}
          >
            {item.label}
          </Menu.Item>
        )
      })}
    </Menu>
  )
}
