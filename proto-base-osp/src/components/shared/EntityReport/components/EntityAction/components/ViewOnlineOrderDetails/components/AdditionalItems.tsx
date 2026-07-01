import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

export function AdditionalItems({ order, type }) {
  const additionalItems = useMemo(() => {
    return order?.OrderDetails?.filter(
      (detail) => detail.ParentTradeEntryDetailId && detail.DetailType === `Additional ${type}`
    )
  }, [order])

  const hasOrderDetails = !!additionalItems?.length

  if (!hasOrderDetails) {
    return <div />
  }

  return (
    hasOrderDetails && (
      <div className='flex-half'>
        <Vertical className='mx-4'>
          <Horizontal className='border-bottom'>
            <Texto category='h5' appearance='medium'>
              ADDITIONAL {type.toUpperCase()}S
            </Texto>
          </Horizontal>
          <div className='my-3 bg-1 bordered border-rounded' style={{ borderRadius: 5, fontSize: 12 }}>
            {additionalItems.map((item) => {
              return (
                <Horizontal
                  key={`${item?.ProductName}${item?.FromLocationName}`}
                  className='p-2 justify-sb'
                  style={{ borderRadius: 5, fontSize: 12 }}
                >
                  <Texto appearance='medium' weight={600}>
                    {item.ProductName} @ {item?.FromLocationName}
                  </Texto>
                  <Texto appearance='medium'>{fmt.currency(item?.Price)}</Texto>
                </Horizontal>
              )
            })}
          </div>
        </Vertical>
      </div>
    )
  )
}
