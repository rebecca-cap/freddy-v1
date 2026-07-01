import '../../../../styles.css'

import { ClockCircleOutlined, SendOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { BBDTag, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { InvitationManagement } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/InvitationManagement'
import { IndexOfferDisplay } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/OfferInfo/IndexOfferDisplay'
import { PickupWindow } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/OfferInfo/PickupWindow'
import { Price } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/OfferInfo/Price'
import { Responses } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/OfferInfo/Responses'
import { VisibilityWindow } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/OfferInfo/VisibilityWindow'
import { Volume } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/OfferInfo/Volume'
import { getRemainingLabel, getStatusTagStyle } from '@modules/Dashboard/SpecialOffers/utils/Utils/OfferInfoHelpers'
import { formatDateWithTimezone } from '@utils/timezone'
import { Skeleton } from 'antd'

type OfferInfoProps = {
  isLoading: boolean
  data?: SpecialOfferBreakdownResponseData
  onSendReminder?: () => void
  canWrite: boolean
}

export function OfferInfo({ data, onSendReminder, isLoading, canWrite }: OfferInfoProps) {
  if (!data) return null

  const offer = data.OfferInfo
  const price = data.PriceDiscovery

  const status = offer.Status

  const remainingLabel = getRemainingLabel(offer.VisibilityEndDateTime)

  const isAuction = !!price?.IsAuction

  const indexDisplay = offer?.IndexOfferDisplay

  if (isLoading) {
    return (
      <Horizontal className='p-4' style={{ minHeight: '100%', minWidth: '100%' }} horizontalCenter>
        <Skeleton active />
      </Horizontal>
    )
  }

  return (
    <div>
      <Horizontal className={'offer-info-header-container'}>
        <Vertical gap={6}>
          <Texto category={'h3'} weight='700'>
            {offer?.SpecialOfferTitle}
          </Texto>
          <Horizontal gap={10} className='mt-2' verticalCenter>
            <BBDTag style={getStatusTagStyle(status)}>{status}</BBDTag>
            {isAuction && <BBDTag>Silent Auction</BBDTag>}
            <Texto category={'p2'}>
              <ClockCircleOutlined className={'mr-1'} /> {remainingLabel}
            </Texto>
          </Horizontal>
        </Vertical>
        <Horizontal gap={10} verticalCenter>
          <GraviButton
            className='send-reminder-btn'
            icon={<SendOutlined className='send-reminder-icon' />}
            onClick={onSendReminder}
            buttonText='Send Reminder'
          />
        </Horizontal>
      </Horizontal>
      <Horizontal className='offer-info-wrap' gap={24}>
        {/* 1. Visibility Window */}
        <VisibilityWindow data={data} canWrite={canWrite} />

        {/* 2. Invitation Management */}
        <InvitationManagement data={data} canWrite={canWrite} />

        {/* 3. Pickup Window */}
        <PickupWindow data={data} />

        {/* 4. Volume */}
        <Volume data={data} canWrite={canWrite} status={status} />

        {/* 5. Reserve Price */}
        <Price data={data} />

        {/* 6. Responses */}
        <Responses data={data} />
      </Horizontal>
      <Horizontal className={'created-by-container'}>
        {offer.CreatedBy && <Texto>Created by {offer.CreatedBy}</Texto>}
        {offer.CreatedBy && <Texto className={'mx-3'}>•</Texto>}
        {offer.CreatedDateTime && <Texto>{formatDateWithTimezone(offer.CreatedDateTime, dateFormat.DATE_TIME)}</Texto>}
        <Texto className={'ml-4'}>ID:</Texto>
        <Texto className={'ml-2'}>{offer.SpecialOfferId}</Texto>
      </Horizontal>
      {indexDisplay && <IndexOfferDisplay indexDisplay={indexDisplay} isAuction={isAuction} />}
    </div>
  )
}
