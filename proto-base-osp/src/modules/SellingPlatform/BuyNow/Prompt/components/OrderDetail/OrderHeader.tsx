import '../../styles.css'

import { FieldTimeOutlined } from '@ant-design/icons'
import { usePromptContext } from '@contexts/PromptContext'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { formatPricePerUnit } from '@utils/index'
import classNames from 'classnames'
import React from 'react'

export function OrderHeader({ form }) {
  const { selectedItemMeta, tradeTimer } = usePromptContext()
  return (
    <Horizontal
      className={classNames(
        'px-4 py-2',
        { 'side-detail-header-background': !tradeTimer || tradeTimer > 0 },
        { 'bg-warning': tradeTimer === 0 && form.getFieldValue('Type') !== 'bid' }
      )}
    >
      <Vertical>
        <Texto weight='bold' category='h3' appearance='white'>
          {selectedItemMeta?.ProductName}
        </Texto>

        <Texto category='h6' weight={500} appearance='white'>
          {selectedItemMeta?.LocationName}
        </Texto>

        <Texto category='p1' appearance='white'>
          Enter deal information to buy a prompt now
        </Texto>
      </Vertical>
      <Vertical verticalCenter flex='none'>
        {!selectedItemMeta.IsInternalUser && form.getFieldValue('Type') !== 'bid' && (
          <Horizontal className='justify-sa bg-1 px-3 mb-2 round-border' verticalCenter style={{ minWidth: 100 }}>
            <FieldTimeOutlined
              className={tradeTimer <= 10 ? 'text-warning' : 'text-secondary'}
              style={{ fontSize: 16 }}
            />
            <Texto
              category='h5'
              className={tradeTimer <= 10 ? 'text-warning' : 'text-secondary'}
              weight={500}
              align='right'
            >
              {tradeTimer !== 0 && (
                <b>
                  {Math.floor(tradeTimer / 60)
                    .toString()
                    .padStart(2, '0')}
                  :{(tradeTimer % 60).toString().padStart(2, '0')}
                </b>
              )}
              {tradeTimer === 0 && <b>Expired</b>}
            </Texto>
          </Horizontal>
        )}
        <Texto category='h5' appearance='white' weight={500} align='right'>
          <b>{formatPricePerUnit(selectedItemMeta?.Price ?? 0)}</b>
        </Texto>
      </Vertical>
    </Horizontal>
  )
}
