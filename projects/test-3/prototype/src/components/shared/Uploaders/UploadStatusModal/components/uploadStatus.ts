import { NotificationMessage } from '@gravitate-js/excalibrr'
import { CalendarUploadResponseData } from '@modules/Admin/ManagePriceEngineCalendars/api/types'

export interface HandleUploadResponseProps {
  response: any
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>
  setStatusResponse: React.Dispatch<React.SetStateAction<any>>
  setUploadStatusModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  setCanSubmit: React.Dispatch<React.SetStateAction<boolean>>
}

export const handleUploadResponse = ({
  response,
  setIsUploading,
  setStatusResponse,
  setUploadStatusModalVisible,
  setCanSubmit,
}: HandleUploadResponseProps) => {
  if (!response) {
    NotificationMessage(`Upload Error`, `There was a problem uploading your file.`, true)
    setIsUploading(false)
    setUploadStatusModalVisible(false)
    return
  }
  const statusData = response.Data[0] as CalendarUploadResponseData
  if (response.Validations.length < 1) {
    NotificationMessage(`Upload Successful`, `Your file has been successfully uploaded.`, false)
    setCanSubmit(true)
    setStatusResponse(statusData)
  } else {
    NotificationMessage(
      `Upload Error`,
      `There was a problem uploading your file.  ${response.Validations[0].Message}`,
      true
    )
    setStatusResponse(response)
    setCanSubmit(false)
  }
  setIsUploading(false)
  setUploadStatusModalVisible(true)
  return true
}
