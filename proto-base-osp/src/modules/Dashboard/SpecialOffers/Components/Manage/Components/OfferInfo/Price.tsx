import '../../../../styles.css'

import { Texto } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { Card } from 'antd'
import React from 'react'

const { Meta } = Card

type ReservePriceProps = {
  data: SpecialOfferBreakdownResponseData
}

export function Price({ data }: ReservePriceProps) {
  const offer = data?.OfferInfo
  const indexDisplay = offer?.IndexOfferDisplay

  if (indexDisplay) {
    return (
      <div className='offer-info-item'>
        <Card className='offer-info-card'>
          <Meta
            title={<Texto weight='600'>Pricing Mechanism</Texto>}
            description={<Texto category={'h4'}>{offer?.PricingMechanismName}</Texto>}
          />
        </Card>
      </div>
    )
  }

  const isFixedPricing = offer?.PricingMechanismName === 'Fixed'

  if (isFixedPricing) {
    if (!offer?.FixedPrice) return null
    return (
      <div className='offer-info-item'>
        <Card className='offer-info-card'>
          <Meta
            title={<Texto weight='600'>{data.PriceDiscovery?.IsAuction ? 'Reserve Price' : 'Fixed Price'}</Texto>}
            description={<Texto category={'h4'}>{fmt.currency(offer.FixedPrice)}</Texto>}
          />
        </Card>
      </div>
    )
  }

  if (!offer?.ReservePrice) return null

  return (
    <div className='offer-info-item'>
      <Card className='offer-info-card'>
        <Meta
          title={<Texto weight='600'>Reserve Price</Texto>}
          description={<Texto category={'h4'}>{fmt.currency(offer.ReservePrice)}</Texto>}
        />
      </Card>
    </div>
  )
}
