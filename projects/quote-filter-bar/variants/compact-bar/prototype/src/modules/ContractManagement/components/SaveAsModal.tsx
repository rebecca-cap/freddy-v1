import '../styles.css'

import { CheckCircleOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { ContractDetails } from '@modules/ContractManagement/api/types.schema'
import React from 'react'

interface SaveAsModalProps {
  header: ContractDetails
  saveContract: (makeActive?: boolean) => Promise<void>
  setDraftModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}
export const SaveAsModal: React.FC<SaveAsModalProps> = ({ header, saveContract, setDraftModalVisible }) => {
  const showDraftButton = !header?.TradeEntryId || header?.OrderStatusCodeValueDisplay === 'Draft'

  const handleSave = (makeActive) => {
    saveContract(makeActive)
    setDraftModalVisible(false)
  }

  return (
    <Vertical verticalCenter horizontalCenter>
      <Vertical className='mx-4 p-4' verticalCenter>
        <Texto style={{ fontSize: '14px' }}>
          Save this contract as a <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>draft</span> to be made
          active at a later date or make active immediately?
        </Texto>
        <Horizontal className='my-2 p-3' style={{ backgroundColor: 'var(--theme-success-dim)' }} verticalCenter>
          <InfoCircleOutlined className='mr-2' style={{ fontSize: '17px' }} />
          <Vertical>
            <Texto style={{ fontSize: '13px', fontWeight: 'bold' }}>When Contract is Activated</Texto>
            <ul>
              <li>
                <Texto style={{ fontSize: '12px' }}>
                  Some contract fields will no longer be editable, but new data will.
                </Texto>
              </li>
              <li>
                <Texto style={{ fontSize: '12px' }}>The contract will start valuing and pricing items.</Texto>
              </li>
            </ul>
          </Vertical>
        </Horizontal>
      </Vertical>
      <Horizontal className='justify-sb border-top px-4 py-3' width='100%'>
        <GraviButton ghost buttonText='Cancel' onClick={() => setDraftModalVisible(false)} />
        <Horizontal horizontalCenter verticalCenter style={{ gap: 15 }}>
          {showDraftButton && (
            <GraviButton
              className='save-as-modal-draft-button'
              theme4
              buttonText='Save as Draft'
              icon={<FileTextOutlined style={{ fontSize: '11px' }} />}
              onClick={() => handleSave(false)}
            />
          )}
          <GraviButton
            theme2
            buttonText='Make Active'
            icon={<CheckCircleOutlined style={{ fontSize: '11px' }} />}
            onClick={() => handleSave(true)}
          />
        </Horizontal>
      </Horizontal>
    </Vertical>
  )
}
