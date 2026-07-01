import '../../../styles.css'

import { DownloadOutlined } from '@ant-design/icons'
import { BidUpdateFields } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/UpdateFields/BidUpdateFields'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Model } from '@hooks/useOnlineOrderViewTypes'
import { OrderDates } from '@modules/SellingPlatform/BuyNow/Prompt/components/CreateOrder/components/OrderDates'
import { FormInstance } from 'antd/lib/form/Form'
import { Moment } from 'moment'
import React from 'react'

export interface UpdateFieldProps {
  orderDetails: Model
  form: FormInstance
  calculateVolumes: (value: number) => void
  canWrite: boolean
  showDateOverrideFields?: boolean
  minDate: Date | null
  maxDate: Date | null
  enteredFromDate: Moment | Date | null
  enteredToDate: Moment | Date | null
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
        <Horizontal style={{ minWidth: '450px', gap: '25px' }} verticalCenter justifyContent='flex-end'>
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
        className='bg-3 p-2 px-4'
        style={{ backgroundColor: 'var(--theme-color-2-trans)', minWidth: '650px' }}
        verticalCenter
        justifyContent='space-between'
      >
        <Horizontal verticalCenter style={{ width: '150px' }}>
          <Texto weight={600}>
            <DownloadOutlined className='mr-2' /> BID ORDER
          </Texto>
        </Horizontal>

        <Horizontal style={{ maxWidth: '800px', minWidth: '550px' }} flex={1} justifyContent='flex-end'>
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
