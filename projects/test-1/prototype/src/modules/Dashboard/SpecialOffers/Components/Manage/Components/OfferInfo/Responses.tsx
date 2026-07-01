import '../../../../styles.css'

import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import {
  getResponsePercent,
  getResponsesAccentColor,
  ResponsesDescription,
} from '@modules/Dashboard/SpecialOffers/utils/Utils/OfferInfoHelpers'
import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import React from 'react'

type ResponsesProps = {
  data: SpecialOfferBreakdownResponseData
}

export function Responses({ data }: ResponsesProps) {
  const offer = data.OfferInfo
  const engagement = data.CustomerEngagement

  const pct = getResponsePercent(offer, engagement)
  const accent = getResponsesAccentColor(pct)

  return (
    <div className='offer-info-item'>
      <Card className='offer-info-card offer-info-card--accent' style={{ borderLeftColor: accent }}>
        <Meta title='Responses' description={<ResponsesDescription offer={offer} engagement={engagement} />} />
      </Card>
    </div>
  )
}
