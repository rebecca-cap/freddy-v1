import '../../../../styles.css'

import { CheckCircleOutlined, CloseCircleOutlined, EditFilled } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { useSpecialOffers } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffers'
import { numberToShortString } from '@utils/index'
import { Card, InputNumber } from 'antd'
import Meta from 'antd/es/card/Meta'
import moment from 'moment'
import React, { useState } from 'react'

type VolumeProps = {
  data: SpecialOfferBreakdownResponseData
  canWrite: boolean
  status: string
}

export function Volume({ data, canWrite, status }: VolumeProps) {
  const { updateSpecialOffer } = useSpecialOffers()

  const offer = data.OfferInfo

  const canEditVolume = canWrite && moment().isBefore(moment(offer.VisibilityEndDateTime))
  const [isEditingVolume, setIsEditingVolume] = useState(false)

  const [draftVolume, setDraftVolume] = useState<number>(offer.TotalVolume)

  const startEditing = () => {
    setDraftVolume(offer.TotalVolume) // or offer.RemainingVolume if that's the true target
    setIsEditingVolume(true)
  }

  const onSaveVolume = () => {
    updateSpecialOffer.mutate(
      {
        SpecialOfferId: offer.SpecialOfferId,
        NewRemainingVolume: draftVolume,
        // NewVisibilityEndDateTime: undefined,
      },
      {
        onSuccess: () => {
          setIsEditingVolume(false)
        },
      }
    )
  }

  return (
    <div className='offer-info-item'>
      <Card className='offer-info-card'>
        <Meta
          title={
            <Horizontal verticalCenter justifyContent={'space-between'}>
              <Texto weight='600'>Volume</Texto>

              {canEditVolume && !isEditingVolume && (
                <EditFilled style={{ cursor: 'pointer', fontSize: 18 }} onClick={startEditing} />
              )}

              {canEditVolume && isEditingVolume && (
                <Horizontal verticalCenter style={{ gap: 10 }}>
                  <CloseCircleOutlined
                    style={{
                      cursor: updateSpecialOffer.isLoading ? 'not-allowed' : 'pointer',
                      fontSize: 18,
                      color: 'var(--theme-warning)',
                      opacity: updateSpecialOffer.isLoading ? 0.5 : 1,
                    }}
                    onClick={() => {
                      if (updateSpecialOffer.isLoading) return
                      setIsEditingVolume(false)
                    }}
                  />

                  <CheckCircleOutlined
                    style={{
                      cursor: updateSpecialOffer.isLoading ? 'not-allowed' : 'pointer',
                      fontSize: 18,
                      color: 'var(--theme-success)',
                      opacity: updateSpecialOffer.isLoading ? 0.5 : 1,
                    }}
                    onClick={() => {
                      if (updateSpecialOffer.isLoading) return
                      onSaveVolume()
                    }}
                  />
                </Horizontal>
              )}
            </Horizontal>
          }
          description={
            !isEditingVolume ? (
              <Texto category={'h4'}>{numberToShortString(offer.TotalVolume)} gal</Texto>
            ) : (
              <InputNumber
                className={`volume-h4-input ${isEditingVolume ? 'volume-h4-input--editing' : ''}`}
                size='large'
                bordered={false}
                value={draftVolume}
                min={0}
                formatter={(value) => (value != null ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                parser={(value) => Number(value?.replace(/,/g, '') || 0)}
                onChange={(val) => setDraftVolume(val ?? 0)}
                autoFocus
                controls={false}
              />
            )
          }
        />
      </Card>
    </div>
  )
}
