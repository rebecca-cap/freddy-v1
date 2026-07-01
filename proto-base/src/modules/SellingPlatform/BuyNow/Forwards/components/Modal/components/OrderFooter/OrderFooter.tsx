import { ExclamationCircleOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { Modal } from 'antd'
import React from 'react'

import { ORDERENTRYSTEPS } from '../../index'

export function OrderFooter({
  setIsModalVisible,
  setOrderEntryStep,
  orderEntryStep,
  form,
  error,
  pendingChanges,
  disableSubmit,
}) {
  const { confirm } = Modal

  const handleCancel = () => {
    if (orderEntryStep === ORDERENTRYSTEPS.VOLUMEENTRY) {
      if (pendingChanges) {
        showConfirm()
      } else {
        setIsModalVisible(false)
        form.resetFields()
      }
    } else {
      setOrderEntryStep(ORDERENTRYSTEPS.VOLUMEENTRY)
    }
  }

  const showConfirm = () => {
    confirm({
      centered: true,
      title: 'Are you sure you want to cancel?',
      icon: <ExclamationCircleOutlined />,
      content: 'There are unsaved changes. If you cancel, you will lose any unsaved changes.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setIsModalVisible(false)
        form.resetFields()
      },
    })
  }

  const leftButtonText = orderEntryStep === ORDERENTRYSTEPS.VOLUMEENTRY ? 'Cancel' : 'Back'
  const rightButtonText = orderEntryStep === ORDERENTRYSTEPS.VOLUMEENTRY ? 'Next' : 'Save Order'
  return (
    <Horizontal justifyContent='flex-end' style={{ gap: 20 }}>
      <GraviButton style={{ minWidth: 125 }} buttonText={leftButtonText} onClick={() => handleCancel()} />
      <GraviButton
        style={{ minWidth: 125 }}
        success
        buttonText={rightButtonText}
        disabled={!!error || !form.getFieldValue('Volume') || disableSubmit}
        onClick={() => {
          form.submit()
        }}
      />
    </Horizontal>
  )
}
