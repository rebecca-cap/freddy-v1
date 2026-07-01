import '../../../../styles.css'

import { CalendarOutlined } from '@ant-design/icons'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { formatDateTimeRange } from '@modules/Dashboard/SpecialOffers/utils/Utils/OfferInfoHelpers'
import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import moment from 'moment'
import React from 'react'

type PickupWindowProps = {
  data: SpecialOfferBreakdownResponseData
}

export function PickupWindow({ data }: PickupWindowProps) {
  const offer = data.OfferInfo

  const effStart = moment(offer.OrderEffectiveStartDateTime)
  const effEnd = moment(offer.OrderEffectiveEndDateTime)

  return (
    <div className='offer-info-item'>
      <Card className='offer-info-card offer-info-card--accent'>
        <Meta
          avatar={<CalendarOutlined style={{ fontSize: 18 }} />}
          title='Pickup Window'
          description={formatDateTimeRange(effStart, effEnd)}
        />
      </Card>
    </div>
  )
}
