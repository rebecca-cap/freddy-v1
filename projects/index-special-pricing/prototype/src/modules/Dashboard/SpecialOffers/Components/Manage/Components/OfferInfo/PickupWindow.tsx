import '../../../../styles.css'

import { CalendarOutlined } from '@ant-design/icons'
import { Texto } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { formatDateTimeRange } from '@modules/Dashboard/SpecialOffers/utils/Utils/OfferInfoHelpers'
import { Card } from 'antd'
import dayjs from '@utils/dayjs'
import React from 'react'

const { Meta } = Card

type PickupWindowProps = {
  data: SpecialOfferBreakdownResponseData
}

export function PickupWindow({ data }: PickupWindowProps) {
  const offer = data.OfferInfo

  const effStart = dayjs(offer.OrderEffectiveStartDateTime)
  const effEnd = dayjs(offer.OrderEffectiveEndDateTime)

  return (
    <div className='offer-info-item'>
      <Card className='offer-info-card offer-info-card--accent'>
        <Meta
          avatar={<CalendarOutlined style={{ fontSize: 18 }} />}
          title={<Texto weight='600'>Pickup Window</Texto>}
          description={formatDateTimeRange(
            effStart,
            effEnd,
            undefined,
            offer.LocationTimeZoneAlias ?? offer.ServerTimeZoneAlias ?? offer.TimeZoneAlias
          )}
        />
      </Card>
    </div>
  )
}
