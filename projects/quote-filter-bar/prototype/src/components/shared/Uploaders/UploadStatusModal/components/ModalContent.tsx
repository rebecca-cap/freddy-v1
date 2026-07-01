import uploadAnim from '@assets/Animation/upload_anim.json'
import { ErrorGrid } from '@components/shared/Uploaders/UploadStatusModal/components/ErrorGrid'
import { UploadResponseData } from '@components/shared/Uploaders/UploadStatusModal/components/types'
import { Horizontal, LoadingAnimation, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useMemo } from 'react'

export interface ModalContentsProps {
  statusResponse?: UploadResponseData
  isUploading: boolean
  canSubmit: boolean
  getDisplayErrors: (statusResponse: UploadResponseData) => { RowNumber: number; Id: string; Errors: string[] }[]
}

export function ModalContent({ statusResponse, isUploading, canSubmit, getDisplayErrors }: ModalContentsProps) {
  const displayErrors = useMemo(() => {
    if (canSubmit || !statusResponse?.Validations?.length) return []

    return getDisplayErrors(statusResponse)
  }, [statusResponse, canSubmit, isUploading, getDisplayErrors])
  if (isUploading) {
    return (
      <Horizontal horizontalCenter verticalCenter>
        <LoadingAnimation
          title='Uploading Spreadsheet'
          message='This might take a minute. Please wait until the upload results are ready.'
          animationData={uploadAnim}
          loop
          height={250}
        />
      </Horizontal>
    )
  }
  if (displayErrors?.length > 0 && !canSubmit) {
    return (
      <Vertical className='gap-10'>
        <Texto category='h5'>File upload failed.</Texto>
        <Texto> No holidays were updated.</Texto>
        <ErrorGrid displayErrors={displayErrors} />

        <Texto>Please resolve the errors above and resubmit the file.</Texto>
      </Vertical>
    )
  }
  if (canSubmit) {
    return (
      <Vertical className='gap-10'>
        <Texto>Your file has no errors, and may now be submitted for upload!</Texto>
      </Vertical>
    )
  }
  return (
    <Horizontal horizontalCenter>
      <Texto>No results were uploaded. Please check your sheet and try again.</Texto>
    </Horizontal>
  )
}
