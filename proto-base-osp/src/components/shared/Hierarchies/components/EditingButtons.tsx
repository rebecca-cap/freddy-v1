import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { GraviButton } from '@gravitate-js/excalibrr'
import React from 'react'

interface EditingButtonsProps {
  onCancel: () => void
  saveDisabled: boolean
  saveLoading?: boolean
}

export function EditingButtons({ onCancel, saveDisabled, saveLoading = false }: EditingButtonsProps) {
  return (
    <>
      <GraviButton icon={<CloseOutlined style={{ color: 'var(--gray-500)' }} />} onClick={onCancel} className='mr-2' />
      <GraviButton
        style={{ borderRadius: 'var(--button-border-radius)' }}
        success
        htmlType='submit'
        icon={<CheckOutlined />}
        disabled={saveDisabled}
        loading={saveLoading}
      />
    </>
  )
}
