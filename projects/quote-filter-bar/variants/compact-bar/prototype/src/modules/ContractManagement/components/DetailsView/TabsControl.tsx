import '../../styles.css'

import { ExclamationCircleOutlined, PlusCircleFilled, SyncOutlined } from '@ant-design/icons'
import { useContractManagementContext } from '@contexts/ContractManagement'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Modal, Tabs } from 'antd'
import React, { useMemo } from 'react'

import { ActionMenu } from '../DetailsSection/DetailCard/ActionMenu'

export function TabsControl() {
  const {
    details,
    activeTabId,
    setActiveTabId,
    newTab,
    openTab,
    closeTab,
    hasDetailEdits,
    setHasDetailEdits,
    deleteDetail,
    canWrite,
  } = useContractManagementContext()
  const { confirm } = Modal

  const onChange = (newActiveKey: string) => {
    if (hasDetailEdits) {
      showConfirm(newActiveKey)
    } else {
      setActiveTabId(newActiveKey)
    }
  }

  const showConfirm = (newActiveKey) => {
    confirm({
      title: 'Are you sure you want to navigate away?',
      icon: <ExclamationCircleOutlined />,
      content: 'There are unsaved changes. If you navigate away, you will lose any unsaved changes.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setHasDetailEdits(false)
        if (activeTabId) {
          closeTab(activeTabId)
        }
        setActiveTabId(newActiveKey)
      },
    })
  }

  const openTabs = useMemo(() => {
    return details?.filter((detail) => detail.isOpen)
  }, [details])

  const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'add') {
      newTab()
    } else if (hasDetailEdits) {
      showConfirm('0')
    } else {
      closeTab(targetKey)
    }
  }

  const addButton = (
    <>
      <PlusCircleFilled style={{ marginRight: '0.5em' }} />
      New Detail
    </>
  )

  const activeTabIsDuplicate = useMemo(() => {
    const detail = details?.find((detail) => detail.LocalTradeEntryDetailId === activeTabId)

    return (detail && !detail.LocalTradeEntryDetailId) || activeTabId?.includes('duplicate')
  }, [activeTabId])
  const activeTabIsDraft = useMemo(() => {
    const detail = details?.find((detail) => detail.LocalTradeEntryDetailId === activeTabId)

    return detail && !detail.TradeEntryDetailId
  }, [activeTabId])

  return (
    <Tabs
      defaultActiveKey='0'
      type='editable-card'
      className={activeTabIsDraft ? 'detail-tabs-draft' : 'detail-tabs'}
      onChange={onChange}
      activeKey={activeTabId}
      onEdit={onEdit}
      addIcon={addButton}
      hideAdd={!canWrite}
    >
      <Tabs.TabPane
        closeIcon={<NullIcon />}
        tab={
          <Texto appearance={activeTabId === '0' ? 'white' : 'default'} className='p-3' category='p2'>
            All Details
          </Texto>
        }
        key='0'
      />
      {activeTabId === '' && <Tabs.TabPane closeIcon={<NullIcon />} tab={<EmptyLabel />} key='' />}
      {activeTabIsDuplicate && <Tabs.TabPane closeIcon={<NullIcon />} tab={<DuplicateLabel />} key={activeTabId} />}
      {openTabs?.map((detail) => (
        <Tabs.TabPane
          tab={
            <TabLabel
              isActive={activeTabId === detail.LocalTradeEntryDetailId}
              detail={detail}
              openTab={openTab}
              newTab={canWrite ? newTab : null}
              deleteDetail={deleteDetail}
            />
          }
          key={detail.LocalTradeEntryDetailId}
        />
      ))}
    </Tabs>
  )
}

function NullIcon() {
  return null
}

function TabLabel({ detail, openTab, newTab, deleteDetail, isActive }) {
  const activeTabIsDraft = useMemo(() => {
    return detail && !detail.TradeEntryDetailId
  }, [detail])
  return (
    <Horizontal>
      <Vertical className='pt-1'>
        <ActionMenu isActive={isActive} detail={detail} openTab={openTab} newTab={newTab} deleteDetail={deleteDetail} />
      </Vertical>
      <Vertical className='pt-1'>
        {!activeTabIsDraft && (
          <Texto appearance={isActive ? 'white' : 'default'} category='p2'>
            {detail?.TradeEntryDetailId}
          </Texto>
        )}
        {activeTabIsDraft && (
          <Texto appearance={isActive ? 'white' : 'default'} category='p2'>
            Draft
          </Texto>
        )}
        <Texto appearance={isActive ? 'white' : 'default'} category='p2'>
          {detail.ToLocationName || detail.FromLocationName}
        </Texto>
        <Texto appearance={isActive ? 'white' : 'default'}>{detail.ProductName}</Texto>
      </Vertical>
    </Horizontal>
  )
}

function EmptyLabel() {
  return (
    <Horizontal verticalCenter>
      <Vertical>
        <SyncOutlined style={{ color: 'white' }} />
      </Vertical>
      <Vertical>
        <Texto appearance='white' category='p2'>
          Pending Detail
        </Texto>
        <Texto appearance='white'>Awaiting Save</Texto>
      </Vertical>
    </Horizontal>
  )
}

function DuplicateLabel() {
  return (
    <Horizontal verticalCenter>
      <Vertical>
        <SyncOutlined style={{ color: 'white' }} />
      </Vertical>
      <Vertical>
        <Texto appearance='white' category='p2'>
          Duplicating Detail
        </Texto>
        <Texto appearance='white'>Awaiting Save</Texto>
      </Vertical>
    </Horizontal>
  )
}
