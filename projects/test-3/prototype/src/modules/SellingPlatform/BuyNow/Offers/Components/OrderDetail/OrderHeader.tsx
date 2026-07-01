import '../../styles.css'

import { ClockCircleFilled, FieldTimeOutlined } from '@ant-design/icons'
import { useOffersContext } from '@contexts/OffersContext'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { isWithin24Hours } from '@modules/SellingPlatform/BuyNow/Offers/Utils/OffersGridHelpers'
import { useTimespanCountdown } from '@modules/SellingPlatform/BuyNow/Offers/Utils/useTimeSpanCountdown'
import classNames from 'classnames'
import React from 'react'

export function OrderHeader({ form, showOrderTimer = true, showTimeRemaining = true }) {
  const { selectedItemMeta, tradeTimer, setIsPriceExpired } = useOffersContext()

  const isBid = selectedItemMeta?.Type === 'bid'

  const orderHeaderSubtitle = isBid
    ? 'Submit bid price and volume for review. Bids are competitive, volume not guaranteed.'
    : 'Submit volume for review. Volume not guaranteed.'

  const offerTimespan = selectedItemMeta?.SpecialOfferData?.TimeRemaining
  const { text: offerCountdownText, isExpired } = useTimespanCountdown(offerTimespan, {
    showSeconds: true,
    onExpire: () => {
      setIsPriceExpired(true)
    },
  })

  return (
    <Horizontal
      className={classNames(
        'px-4 py-2',
        { 'side-detail-header-background': !tradeTimer || tradeTimer > 0 },
        { 'bg-warning': tradeTimer === 0 && form.getFieldValue('Type') !== 'bid' }
      )}
    >
      <Vertical style={{ flex: 1 }} verticalCenter>
        <Texto weight='bold' category='h3' appearance='white'>
          {selectedItemMeta?.ProductName}
        </Texto>
        <Texto category='h6' weight={500} appearance='white'>
          {selectedItemMeta?.LocationName}
        </Texto>
        <Texto category='p1' appearance='white'>
          {orderHeaderSubtitle}
        </Texto>
      </Vertical>
      <Vertical style={{ flex: 1 }} className='justify-end'>
        {!selectedItemMeta?.IsInternalUser && form.getFieldValue('Type') !== 'bid' && showOrderTimer && (
          <Horizontal className='justify-sa bg-1 px-3 mb-2 round-border' verticalCenter style={{ minWidth: 100 }}>
            <FieldTimeOutlined
              className={tradeTimer && tradeTimer <= 10 ? 'text-warning' : 'text-secondary'}
              style={{ fontSize: 16 }}
            />
            <Texto
              category='h5'
              className={tradeTimer && tradeTimer <= 10 ? 'text-warning' : 'text-secondary'}
              weight={500}
              align='right'
            >
              {!!tradeTimer && tradeTimer !== 0 && (
                <b>
                  {Math.floor(tradeTimer / 60)
                    .toString()
                    .padStart(2, '0')}
                  :{(tradeTimer % 60).toString().padStart(2, '0')}
                </b>
              )}
              {!tradeTimer && <b>Expired</b>}
            </Texto>
          </Horizontal>
        )}
        <Texto category='h5' appearance='white' weight={500} align='right'>
          {isBid ? (
            <b>Submit Bid Price</b>
          ) : (
            <>
              <b>${fmt.decimal(selectedItemMeta?.Price || 0)}</b> / gal
            </>
          )}
        </Texto>
        {showTimeRemaining && (
          <Texto
            category='h5'
            weight={500}
            appearance={isWithin24Hours(offerTimespan) ? 'warning' : 'white'}
            align='right'
          >
            <ClockCircleFilled /> {isExpired ? 'Expired' : offerCountdownText}
          </Texto>
        )}
      </Vertical>
    </Horizontal>
  )
}
