import './components/styles.css'

import { Footer } from '@components/shared/Uploaders/UploadStatusModal/components/Footer'
import { ModalContent } from '@components/shared/Uploaders/UploadStatusModal/components/ModalContent'
import { Texto } from '@gravitate-js/excalibrr'
import { Modal } from 'antd'

import { UploadResponseData } from './components/types'
export interface UploadStatusModalProps {
  uploadStatusModalVisible: boolean
  setUploadStatusModalVisible: (visible: boolean) => void
  statusResponse?: UploadResponseData
  submitUploadData: (data: any) => void
  canSubmit: boolean
  setCanSubmit: React.Dispatch<React.SetStateAction<boolean>>
  isUploading: boolean
  getDisplayErrors: (statusResponse: UploadResponseData) => { RowNumber: number; Id: string; Errors: string[] }[]
}

export const UploadStatusModal = ({
  uploadStatusModalVisible,
  setUploadStatusModalVisible,
  statusResponse,
  isUploading,
  submitUploadData,
  canSubmit,
  setCanSubmit,
  getDisplayErrors,
}: UploadStatusModalProps) => {
  return (
    <Modal
      closable={!isUploading}
      maskClosable={!isUploading}
      footer={
        <Footer
          submitUploadData={submitUploadData}
          isUploading={isUploading}
          setUploadStatusModalVisible={setUploadStatusModalVisible}
          canSubmit={canSubmit}
          statusResponse={statusResponse}
        />
      }
      title={<Texto>Upload Status</Texto>}
      visible={uploadStatusModalVisible}
      onCancel={() => {
        setUploadStatusModalVisible(false)
        setCanSubmit(false)
      }}
      width={800}
    >
      <ModalContent
        statusResponse={statusResponse}
        isUploading={isUploading}
        canSubmit={canSubmit}
        getDisplayErrors={getDisplayErrors}
      />
    </Modal>
  )
}
