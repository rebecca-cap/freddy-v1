import { ExclamationCircleOutlined, FieldTimeOutlined, SyncOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Modal, Tag } from 'antd'
import classNames from 'classnames'
import React from 'react'

export function OrderExpirationModal({ isPriceExpired, handleRefresh, tradeTimer, orderEntryInfo }) {
  const isInternalUser = orderEntryInfo?.Data?.IsInternalUser

  if (!orderEntryInfo) {
    return null
  }

  return (
    <Horizontal className='justify-sb' verticalCenter>
      <Horizontal flex={5} gap={10}>
        <Texto>Create Order</Texto>
        <Tag>
          {orderEntryInfo?.Data?.SelectedItems[0].ProductName} @{orderEntryInfo?.Data?.SelectedItems[0].LocationName}
        </Tag>
      </Horizontal>
      <Horizontal flex={2} horizontalCenter style={{ marginRight: -25 }}>
        <PriceExpiredModal open={isPriceExpired} handleRefresh={handleRefresh} />
        {!isInternalUser && tradeTimer && (
          <Tag className='bg-2'>
            <Texto appearance='medium' category='p2' className='flex-div items-center'>
              <ExclamationCircleOutlined className='pr-2' />
              <Texto appearance='medium'>Price expires in</Texto>
              <Texto
                appearance='medium'
                className={classNames('mx-1', tradeTimer <= 10 ? 'text-warning' : 'text-secondary')}
              >
                {tradeTimer}
              </Texto>
              <Texto appearance='medium'>seconds</Texto>
            </Texto>
          </Tag>
        )}
      </Horizontal>
    </Horizontal>
  )
}

function PriceExpiredModal({ open: visible, handleRefresh }) {
  return (
    <Modal className='expired-modal' open={visible} footer={null} closable={false} centered>
      <Vertical style={{ width: '100%' }}>
        <Horizontal className=' bordered bg-1'>
          <Vertical className='m-4'>
            <Horizontal className='items-center' gap={5} verticalCenter>
              <FieldTimeOutlined className='text-warning' style={{ fontSize: 14 }} />
              <Texto category='p2' className='text-warning' weight={500} align='right'>
                <b>PRICE EXPIRED</b>
              </Texto>
            </Horizontal>
            <Horizontal className='mt-3'>
              <Texto category='p2'>
                Your price has expired. You can reload the price and continue where you left off.
              </Texto>
            </Horizontal>
            <Horizontal className='mt-3 pt-4' verticalCenter horizontalCenter>
              <GraviButton
                icon={<SyncOutlined />}
                theme2
                buttonText='Refresh'
                style={{ minWidth: 100 }}
                onClick={() => {
                  handleRefresh()
                }}
              />
            </Horizontal>
          </Vertical>
        </Horizontal>
      </Vertical>
    </Modal>
  )
}
