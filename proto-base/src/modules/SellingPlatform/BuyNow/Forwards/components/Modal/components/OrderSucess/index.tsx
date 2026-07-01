import { CheckCircleFilled } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { message } from 'antd'
import React from 'react'

export function OrderSuccess({ orderNumber }) {
  const handleClose = () => {
    message.destroy() // Close all messages
  }
  return (
    <Horizontal verticalCenter horizontalCenter style={{ minWidth: 500 }}>
      <Vertical className='p-3'>
        <CheckCircleFilled style={{ fontSize: 50 }} />
      </Vertical>
      <Vertical>
        <Texto category='h4' appearance='default'>
          Order #{orderNumber || ''} Saved Successfully
        </Texto>
        <Texto>
          Successful save! You can navigate to the order or{' '}
          <span onClick={handleClose} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
            close this pop up
          </span>
        </Texto>
      </Vertical>
    </Horizontal>
  )
}
