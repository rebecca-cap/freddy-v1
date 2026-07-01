import '../../../styles.css'

import { DownloadOutlined } from '@ant-design/icons'
import { BidUpdateFields } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/UpdateFields/BidUpdateFields'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Model } from '@hooks/useOnlineOrderViewTypes'
import { OrderDates } from '@modules/SellingPlatform/BuyNow/Prompt/components/CreateOrder/components/OrderDates'
import type { FormInstance } from 'antd'
import type { Dayjs } from '@utils/dayjs'
import React from 'react'

export interface UpdateFieldProps {
  orderDetails: Model
  form: FormInstance
  calculateVolumes: (value: number) => void
  canWrite: boolean
  showDateOverrideFields?: boolean
  minDate: Date | null
  maxDate: Date | null
  enteredFromDate: Dayjs | Date | null
  enteredToDate: Dayjs | Date | null
}
export function UpdateFields({
  orderDetails,
  form,
  calculateVolumes,
  canWrite,
  showDateOverrideFields,
  minDate,
  maxDate,
  enteredFromDate,
  enteredToDate,
}: UpdateFieldProps) {
  if (
    showDateOverrideFields &&
    !orderDetails?.IsBidOrOffer &&
    orderDetails?.OrderStatusCodeValueMeaning === 'Pending'
  ) {
    return (
      <Horizontal
        style={{ backgroundColor: 'var(--theme-color-2-trans)', gap: '25px' }}
        verticalCenter
        justifyContent='flex-end'
        className='p-2 px-4'
        flex={1}
      >
        <Horizontal gap='25px' style={{ minWidth: '450px' }} verticalCenter justifyContent='flex-end'>
          <OrderDates
            currentFromDate={orderDetails.FromDateTime}
            currentToDate={orderDetails.ToDateTime}
            dateOverrideMinDate={minDate}
            dateOverrideMaxDate={maxDate}
            form={form}
            orderViewModal
            enteredFromDate={enteredFromDate}
            enteredToDate={enteredToDate}
          />
        </Horizontal>
      </Horizontal>
    )
  }
  if (orderDetails?.IsBidOrOffer && orderDetails?.OrderStatusCodeValueMeaning === 'Pending') {
    return (
      <Horizontal
        className='bg-3 px-4 pt-4'
        style={{ backgroundColor: 'var(--theme-color-2-trans)', minWidth: '650px' }}
        justifyContent='space-between'
      >
        <Horizontal style={{ minWidth:'fit-content', marginTop: '10px' }} >
          <Texto weight={600} >
            <DownloadOutlined className='mr-2' /> BID ORDER
          </Texto>
        </Horizontal>

        <Horizontal style={{  minWidth: 'fit-content' }}  justifyContent='flex-end'>
          {showDateOverrideFields && (
            <Vertical flex={1} style={{ minWidth: '210px', maxWidth: '210px' }}>
              <OrderDates
                currentFromDate={orderDetails.FromDateTime}
                currentToDate={orderDetails.ToDateTime}
                dateOverrideMinDate={minDate}
                dateOverrideMaxDate={maxDate}
                form={form}
                orderViewModal
                enteredFromDate={enteredFromDate}
                enteredToDate={enteredToDate}
              />
            </Vertical>
          )}
          <BidUpdateFields
            orderDetails={orderDetails}
            form={form}
            calculateVolumes={calculateVolumes}
            canWrite={canWrite}
            showDateOverrideFields={showDateOverrideFields}
          />
        </Horizontal>
      </Horizontal>
    )
  }
  return null
}
