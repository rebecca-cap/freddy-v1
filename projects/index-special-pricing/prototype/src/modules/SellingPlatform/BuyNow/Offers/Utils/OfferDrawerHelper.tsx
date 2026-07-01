import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import React from 'react'

const { confirm } = Modal

export type ForceClose = () => void

export type ConfirmUnsavedOptions = {
  event?: React.SyntheticEvent | Event | null
  hasPendingChanges: boolean
  forceClose: ForceClose
  title?: React.ReactNode
  content?: React.ReactNode
  okText?: string
  cancelText?: string
  okType?: 'primary' | 'default' | 'dashed' | 'link' | 'text' | 'ghost' | 'danger'
  afterCancel?: () => void
}

export function confirmUnsavedChanges({
  event,
  hasPendingChanges,
  forceClose,
  title = 'Are you sure you want to navigate away?',
  content = 'There are unsaved changes. If you navigate away, you will lose any unsaved changes.',
  okText = 'Yes',
  cancelText = 'No',
  okType = 'danger',
  afterCancel,
}: ConfirmUnsavedOptions) {
  if (!hasPendingChanges) {
    forceClose()
    return
  }

  if (event && 'preventDefault' in (event as any)) {
    event.preventDefault?.()
    event.stopPropagation?.()
  }

  confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText,
    cancelText,
    okType,
    onOk: () => {
      forceClose()
    },
    onCancel: () => {
      afterCancel?.()
    },
  })
}
