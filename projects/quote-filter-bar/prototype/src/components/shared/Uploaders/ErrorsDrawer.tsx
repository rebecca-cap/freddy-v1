import { Texto } from '@gravitate-js/excalibrr'
import { Drawer, Divider } from 'antd'
import React from 'react'

type ErrorsDrawerProps = {
  uploadErrors: string[]
  setUploadErrors: (errors: string[]) => void
}

export const ErrorsDrawer: React.FC<ErrorsDrawerProps> = ({ uploadErrors, setUploadErrors }) => {
  return (
    <Drawer visible={uploadErrors?.length > 0} onClose={() => setUploadErrors([])} title='Import Row Errors'>
      {uploadErrors?.map((error) => (
        <>
          <Texto key={error}>{error}</Texto>
          <Divider />
        </>
      ))}
    </Drawer>
  )
}
