import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
interface FooterProps {
  isUploading: boolean
  setUploadStatusModalVisible: (visible: boolean) => void
  submitUploadData: (statusResponse: any) => void
  canSubmit: boolean
  statusResponse: any
}
export function Footer({
  isUploading,
  setUploadStatusModalVisible,
  canSubmit,
  submitUploadData,
  statusResponse,
}: FooterProps) {
  if (isUploading) {
    return null
  }
  if (canSubmit) {
    return (
      <Horizontal justifyContent='end'>
        <GraviButton
          buttonText='Dismiss'
          onClick={() => {
            setUploadStatusModalVisible(false)
          }}
          className='mr-2'
        />

        <GraviButton
          buttonText='Submit'
          success
          onClick={() => {
            setUploadStatusModalVisible(false)
            submitUploadData(statusResponse)
          }}
        />
      </Horizontal>
    )
  }
  return (
    <GraviButton
      buttonText='Dismiss'
      onClick={() => {
        setUploadStatusModalVisible(false)
      }}
    />
  )
}
