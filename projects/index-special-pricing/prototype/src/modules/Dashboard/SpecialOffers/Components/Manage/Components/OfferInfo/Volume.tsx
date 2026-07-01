import '../../../../styles.css'

import { CheckCircleOutlined, CloseCircleOutlined, EditFilled } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { useSpecialOffersTyped } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffersTyped'
import { numberToShortString } from '@utils/index'
import { Card, InputNumber } from 'antd'
import dayjs from '@utils/dayjs'
import React, { useState } from 'react'

const { Meta } = Card

type VolumeProps = {
  data: SpecialOfferBreakdownResponseData
  canWrite: boolean
  status: string
}

export function Volume({ data, canWrite, status }: VolumeProps) {
  const { updateSpecialOffer } = useSpecialOffersTyped()

  const offer = data.OfferInfo
  const acceptedVolume = data.VolumeAnalysis?.AcceptedVolume ?? 0

  const canEditVolume = canWrite && dayjs().isBefore(dayjs(offer.VisibilityEndDateTime))
  const [isEditingVolume, setIsEditingVolume] = useState(false)
  const [editVolume, setEditVolume] = useState<number>(offer.TotalVolume)

  const startEditing = () => {
    setEditVolume(offer.TotalVolume)
    setIsEditingVolume(true)
  }

  const onSaveVolume = () => {
    updateSpecialOffer.mutate(
      {
        SpecialOfferId: offer.SpecialOfferId,
        TotalVolume: editVolume,
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
                      setIsEditingVolume(false)
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
                      onSaveVolume()
                    }}
                  />
                </Horizontal>
              )}
            </Horizontal>
          }
          description={
            !isEditingVolume ? (
              <>
                <Texto category={'p2'} style={{ color: 'var(--theme-text-secondary)' }}>
                  Offered: {numberToShortString(offer.TotalVolume)} gal
                </Texto>
                <Texto category={'h4'}>
                  Remaining: {numberToShortString(offer.TotalVolume - acceptedVolume)} gal
                </Texto>
              </>
            ) : (
              <>
              <Texto category={'p2'} style={{ color: 'var(--theme-text-secondary)', marginBottom: 4 }}>
                Total Offered Volume
              </Texto>
              <InputNumber
                className={`volume-h4-input ${isEditingVolume ? 'volume-h4-input--editing' : ''}`}
                size='large'
                bordered={false}
                value={editVolume}
                min={0}
                formatter={(value) => (value != null ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                parser={(value) => Number(value?.replace(/,/g, '') || 0)}
                onChange={(val) => setEditVolume(val ?? 0)}
                autoFocus
                controls={false}
              />
              </>
            )
          }
        />
      </Card>
    </div>
  );
}
