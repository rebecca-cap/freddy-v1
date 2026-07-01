import '../../../../styles.css'

import { Texto } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import React from 'react'

type ReservePriceProps = {
  data: SpecialOfferBreakdownResponseData
}

export function Price({ data }: ReservePriceProps) {
  const offer = data?.OfferInfo
  const indexDisplay = offer?.IndexOfferDisplay

  //TODO: BE needs to fix this Formula string
  if (indexDisplay) {
    return (
      <div className='offer-info-item'>
        <Card className='offer-info-card'>
          <Meta
            title='Formula'
            description={<span className='formula-string-mono'>{offer?.IndexOfferDisplay?.FormulaString}</span>}
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
          <Meta title='Fixed Price' description={<Texto category={'h4'}>{fmt.currency(offer.FixedPrice)}</Texto>} />
        </Card>
      </div>
    )
  }

  if (!offer?.ReservePrice) return null

  return (
    <div className='offer-info-item'>
      <Card className='offer-info-card'>
        <Meta title='Reserve Price' description={<Texto category={'h4'}>{fmt.currency(offer.ReservePrice)}</Texto>} />
      </Card>
    </div>
  )
}
