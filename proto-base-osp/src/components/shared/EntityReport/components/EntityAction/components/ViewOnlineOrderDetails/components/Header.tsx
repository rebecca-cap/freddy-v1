import { ClockCircleOutlined, ExportOutlined } from '@ant-design/icons'
import { BBDTag, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { Model } from '@hooks/useOnlineOrderViewTypes'
import { formatPricePerUnit } from '@utils/index'
import { Tooltip } from 'antd'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  orderDetails: Model
  isIndexOffer: boolean
}

export function Header({ orderDetails, isIndexOffer }: HeaderProps) {
  const showOrderPrice = useMemo(() => {
    return orderDetails?.ContractPricingMethodCodeValueMeaning !== 'DeliveryPeriod'
  }, [orderDetails])
  const canViewLink = orderDetails?.IsInternalUser && orderDetails?.SpecialOfferId > 0
  const uomSymbol = orderDetails?.UnitOfMeasureSymbol ?? defaultUnitOfMeasureSymbol
  return (
    <Horizontal className='secondary-gradient-background py-2 px-4'>
      <Vertical className='py-2' gap={2}>
        <Horizontal className='justify-sb' width='100%' verticalCenter>
          <Horizontal verticalCenter gap={8}>
            <Texto appearance='white' category='h4'>
              Order# {orderDetails?.TradeEntryId}
            </Texto>
            {orderDetails?.SpecialOfferId > 0 && (
              <BBDTag className='mr-0 py-1 px-4' style={{ fontSize: 13 }}>
                {orderDetails.OrderOriginType}
              </BBDTag>
            )}
          </Horizontal>
          <Horizontal verticalCenter gap={16}>
            {canViewLink && (
              <Link
                className={'text-16'}
                to={`/ManageOffers/${orderDetails.SpecialOfferId}`}
                target='_blank'
              >
                <Texto appearance='white' style={{ textDecoration: 'underline' }}>
                  View Offer Breakdown <ExportOutlined style={{ marginLeft: 4 }} />
                </Texto>
              </Link>
            )}
            {getStatus(orderDetails?.OrderStatusCodeValueMeaning)}
          </Horizontal>
        </Horizontal>
        <Horizontal className='justify-sb' width='100%' verticalCenter>
          <Texto appearance='white' category='h3'>
            {orderDetails?.ProductName}
          </Texto>
          <Texto appearance='white' category='h3'>
            {fmt.decimal(orderDetails?.Quantity, 0)} {uomSymbol}
          </Texto>
        </Horizontal>
        <Horizontal className='justify-sb' width='100%' verticalCenter>
          <Texto appearance='white' category='h4'>
            {orderDetails?.FromLocationName}
          </Texto>
          {showOrderPrice && !isIndexOffer && (
            <Texto appearance='white' category='h4'>
              {formatPricePerUnit(orderDetails?.Price, {
                currencyName: orderDetails?.CurrencySymbol,
                uomSymbol: orderDetails?.UnitOfMeasureSymbol,
              })}
            </Texto>
          )}
          {showOrderPrice && isIndexOffer && (
            <Texto appearance='white' category='h4'>
              {orderDetails?.IndexOfferDisplay?.ContractDifferential &&
                fmt.currency(orderDetails?.IndexOfferDisplay?.ContractDifferential)}
            </Texto>
          )}
        </Horizontal>
        {isIndexOffer && (
          <Tooltip
            title={orderDetails?.IndexOfferDisplay?.PricingDisplayText}
            trigger='hover'
            placement='top'
            overlayStyle={{ maxWidth: '600px' }}
          >
            <div>
              <Texto appearance='white' category='h4' style={{ overflowY: 'auto', maxHeight: 65 }}>
                {orderDetails?.IndexOfferDisplay?.PricingDisplayText}
              </Texto>
            </div>
          </Tooltip>
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
