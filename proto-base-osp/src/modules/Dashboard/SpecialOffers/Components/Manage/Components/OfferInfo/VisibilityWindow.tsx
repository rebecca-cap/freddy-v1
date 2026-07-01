import '../../../../styles.css'

import { CheckCircleOutlined, CloseCircleOutlined, EditFilled, EyeOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { useSpecialOffersTyped } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffersTyped'
import { formatDateTimeRange } from '@modules/Dashboard/SpecialOffers/utils/Utils/OfferInfoHelpers'
import { Card, DatePicker } from 'antd'
import dayjs from '@utils/dayjs'
import type { Dayjs } from '@utils/dayjs'
import React, { useState } from 'react'

const { Meta } = Card

const { RangePicker } = DatePicker

type VisibilityWindowProps = {
  data: SpecialOfferBreakdownResponseData
  canWrite: boolean
}

export function VisibilityWindow({ data, canWrite }: VisibilityWindowProps) {
  const { updateSpecialOffer } = useSpecialOffersTyped()

  const offer = data.OfferInfo

  const visStart = dayjs(offer.VisibilityStartDateTime)
  const visEnd = dayjs(offer.VisibilityEndDateTime)

  const canEditVisibility = canWrite && dayjs().isBefore(dayjs(offer.VisibilityEndDateTime))
  const [isEditingVisibility, setIsEditingVisibility] = useState(false)
  const [draftVisibilityRange, setDraftVisibilityRange] = useState<[Dayjs, Dayjs]>([visStart, visEnd])

  const startEditing = () => {
    setDraftVisibilityRange([visStart, visEnd])
    setIsEditingVisibility(true)
  }

  const onSaveVisibility = () => {
    const newEnd = draftVisibilityRange?.[1]
    const localString = newEnd.format('YYYY-MM-DDTHH:mm:ss') // no timezone info

    if (!newEnd) return

    updateSpecialOffer.mutate(
      {
        SpecialOfferId: offer.SpecialOfferId,
        NewVisibilityEndDateTime: localString
      },
      {
        onSuccess: () => {
          setIsEditingVisibility(false)
        },
      }
    )
  }

  return (
    <div className='offer-info-item'>
      <Card className='offer-info-card offer-info-card--accent-visibility-window'>
        <Meta
          avatar={<EyeOutlined style={{ fontSize: 18 }} />}
          title={
            <Horizontal verticalCenter justifyContent={'space-between'}>
              <Texto weight='600'>Visibility Window</Texto>

              {canEditVisibility && !isEditingVisibility && (
                <EditFilled style={{ cursor: 'pointer', fontSize: 18 }} onClick={startEditing} />
              )}

              {canEditVisibility && isEditingVisibility && (
                <Horizontal verticalCenter gap={10}>
                  <CloseCircleOutlined
                    style={{
                      cursor: updateSpecialOffer.isPending ? 'not-allowed' : 'pointer',
                      fontSize: 18,
                      color: 'var(--theme-warning)',
                      opacity: updateSpecialOffer.isPending ? 0.5 : 1,
                    }}
                    onClick={() => {
                      if (updateSpecialOffer.isPending) return
                      setIsEditingVisibility(false)
                    }}
                  />
                  <CheckCircleOutlined
                    style={{
                      cursor: updateSpecialOffer.isPending ? 'not-allowed' : 'pointer',
                      fontSize: 18,
                      color: 'var(--theme-success)',
                      opacity: updateSpecialOffer.isPending ? 0.5 : 1,
                    }}
                    onClick={() => {
                      if (updateSpecialOffer.isPending) return
                      onSaveVisibility()
                    }}
                  />
                </Horizontal>
              )}
            </Horizontal>
          }
          description={
            !isEditingVisibility ? (
              <Texto>{formatDateTimeRange(visStart, visEnd, undefined, offer.TimeZoneAlias)}</Texto>
            ) : (
              <RangePicker
                value={draftVisibilityRange}
                bordered={false}
                showTime={{ use12Hours: true, format: 'hh:mm A' }}
                format='MM/DD/YY h:mm A'
                size='small'
                style={{ minWidth: '100%', marginLeft: '-8px' }}
                autoFocus
                disabled={[true, false]}
                className={`visibility-range-picker ${isEditingVisibility ? 'visibility-range-picker--editing' : ''}`}
                onChange={(vals) => {
                  if (!vals || !vals[0] || !vals[1]) return
                  setDraftVisibilityRange([vals[0], vals[1]])
                }}
              />
            )
          }
        />
      </Card>
    </div>
  )
}
