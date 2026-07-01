import { ClockCircleOutlined } from '@ant-design/icons'
import { BBDTag, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Model } from '@hooks/useOnlineOrderViewTypes'
import React, { useMemo } from 'react'

interface HeaderProps {
  orderDetails: Model
  isIndexOffer: boolean
}

export function Header({ orderDetails, isIndexOffer }: HeaderProps) {
  const showOrderPrice = useMemo(() => {
    return orderDetails?.ContractPricingMethodCodeValueMeaning !== 'DeliveryPeriod'
  }, [orderDetails])

  return (
    <Horizontal className='secondary-gradient-background py-2 px-4' width='100%' flex={1}>
      <Vertical className='py-2' style={{ gap: 2 }}>
        <Horizontal className='justify-sb' width='100%' verticalCenter>
          <Texto appearance='white' category='h4'>
            Order# {orderDetails?.TradeEntryId}
          </Texto>
          {getStatus(orderDetails?.OrderStatusCodeValueMeaning)}
        </Horizontal>
        <Horizontal className='justify-sb' width='100%' verticalCenter>
          <Texto appearance='white' category='h3'>
            {orderDetails?.ProductName}
          </Texto>
          <Texto appearance='white' category='h3'>
            {fmt.decimal(orderDetails?.Quantity, 0)} GAL(S)
          </Texto>
        </Horizontal>
        <Horizontal className='justify-sb' width='100%' verticalCenter>
          <Texto appearance='white' category='h4'>
            {orderDetails?.FromLocationName}
          </Texto>
          {showOrderPrice && !isIndexOffer && (
            <Texto appearance='white' category='h4'>
              ${fmt.decimal(orderDetails?.Price)} gal
            </Texto>
          )}
          {showOrderPrice && isIndexOffer && (
            <Texto appearance='white' category='h4'>
              {fmt.currency(orderDetails?.IndexOfferDisplay?.ContractDifferential)}
            </Texto>
          )}
        </Horizontal>
        {isIndexOffer && (
          <>
            <Texto appearance='white' category='h4'>
              {orderDetails?.IndexOfferDisplay?.FormulaDisplayName}
            </Texto>
            <Texto style={{ fontStyle: 'italic' }} appearance='white' category='h4'>
              {orderDetails?.IndexOfferDisplay?.FormulaString}
            </Texto>
          </>
        )}
      </Vertical>
    </Horizontal>
  )
}

const getStatus = (status) => {
  switch (status) {
    case 'Accepted':
      return (
        <BBDTag success className='mr-0 py-1 px-4' style={{ fontSize: 13 }}>
          Accepted
        </BBDTag>
      )
    case 'Filled':
      return (
        <BBDTag success className='mr-0 py-1 px-4' style={{ fontSize: 13 }}>
          Accepted
        </BBDTag>
      )
    case 'Canceled':
      return (
        <BBDTag error className='mr-0 py-1 px-4' style={{ fontSize: 13 }}>
          Canceled
        </BBDTag>
      )
    case 'Declined':
      return (
        <BBDTag error className='mr-0 py-1 px-4' style={{ fontSize: 13 }}>
          Declined
        </BBDTag>
      )
    default:
      return (
        <BBDTag className='mr-0 py-1 px-4' style={{ fontSize: 13 }}>
          <ClockCircleOutlined className='mr-2' /> {status}
        </BBDTag>
      )
  }
}
