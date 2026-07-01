import { FieldTimeOutlined, SyncOutlined } from '@ant-design/icons'
import { usePromptContext } from '@contexts/PromptContext'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

export function PriceExpiredModalContent() {
  const { selectedItemMeta, setIsPriceExpired, refreshItemsAvailableForOrder, refreshTradeEntryData } =
    usePromptContext()
  return (
    <Vertical
      horizontalCenter
      style={{
        position: 'absolute',
        height: '100%',
        minWidth: '100%',
        zIndex: 1,
        background: 'rgba(255, 255, 255, 0.3)',
      }}
    >
      <Horizontal className=' bordered bg-1' style={{ maxWidth: '80%', marginTop: '30%' }}>
        <Vertical className='m-4'>
          <Horizontal gap={10} verticalCenter>
            <FieldTimeOutlined className='text-warning' style={{ fontSize: 14 }} />
            <Texto category='p2' className='text-warning' weight={500} align='right'>
              <b>PRICE EXPIRED</b>
            </Texto>
          </Horizontal>
          <Horizontal className='mt-3'>
            <Texto category='p2'>
              Your price for {selectedItemMeta?.ProductName} has expired. You can reload the price and continue where
              you left off.
            </Texto>
          </Horizontal>
          <Horizontal className='mt-4 pt-4' verticalCenter horizontalCenter>
            <GraviButton
              icon={<SyncOutlined />}
              theme2
              buttonText='Refresh'
              style={{ minWidth: 100 }}
              onClick={() => {
                refreshItemsAvailableForOrder()
                refreshTradeEntryData()
                setIsPriceExpired(false)
              }}
            />
          </Horizontal>
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
