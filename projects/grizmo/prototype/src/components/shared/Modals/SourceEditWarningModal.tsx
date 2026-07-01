import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { Modal } from 'antd'
import React from 'react'

interface SourceEditWarningModalProps {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
  sourceSystemName?: string
}

export function SourceEditWarningModal({
  visible,
  onConfirm,
  onCancel,
  sourceSystemName,
}: SourceEditWarningModalProps) {
  return (
    <Modal
      visible={visible}
      title='Edit Confirmation'
      footer={
        <Horizontal justifyContent={'flex-end'}>
          <GraviButton buttonText='Cancel' onClick={() => onCancel()} />
          <GraviButton buttonText='Continue' onClick={() => onConfirm()} success />
        </Horizontal>
      }
      onCancel={onCancel}
      width={500}
    >
      <div style={{ padding: '20px 0' }}>
        <p style={{ marginBottom: '16px', fontSize: '14px' }}>
          <strong>Warning:</strong> You are about to modify a record from source system:{' '}
          <strong>{sourceSystemName || 'Unknown'}</strong> which is not configured to be editable source.
        </p>
        <p style={{ marginBottom: '16px', fontSize: '14px' }}>
          Future synchronizations from the source system may overwrite the changes made on this page.
        </p>
        <p style={{ marginBottom: '0', fontSize: '14px' }}>Do you want to continue with this modification?</p>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          (note: If you continue, you won't see this message again for 8 hours)
        </div>
      </div>
    </Modal>
  )
}
