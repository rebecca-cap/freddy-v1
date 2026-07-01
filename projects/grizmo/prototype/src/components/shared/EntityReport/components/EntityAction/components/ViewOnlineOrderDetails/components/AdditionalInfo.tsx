import { LiftingDaysField } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/LiftingDays'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Model } from '@hooks/useOnlineOrderViewTypes'
import { Form, Select } from 'antd'
import React from 'react'

export interface AdditionalInfoProps {
  orderDetails: Model
  orderHasAdditionalInfo: boolean | undefined
  ValidLoadingNumbers: number[] | undefined
  selectedLoadingNumbers: number[]
  setSelectedLoadingNumbers: React.Dispatch<React.SetStateAction<number[]>>
  AllowMultipleLoadingNumbers: boolean
  showDateOverrideFields: boolean
}
export function AdditionalInfo({
  orderDetails,
  orderHasAdditionalInfo,
  ValidLoadingNumbers,
  selectedLoadingNumbers,
  setSelectedLoadingNumbers,
  AllowMultipleLoadingNumbers,
  showDateOverrideFields,
}: AdditionalInfoProps) {
  const isPrompt = orderDetails?.TradeTypeCodeValueMeaning === 'Prompt'
  const isAcceptedStatus = orderDetails?.OrderStatusCodeValueMeaning === 'Accepted'
  const showLiftingDaysForPendingPromptOrder =
    orderDetails?.OrderStatusCodeValueMeaning === 'Pending' &&
    isPrompt &&
    showDateOverrideFields &&
    !orderDetails?.FromDateTime &&
    orderDetails?.ToDateTime

  if (!orderHasAdditionalInfo && showLiftingDaysForPendingPromptOrder) {
    return (
      <div className='flex-half'>
        <Vertical className='mx-4'>
          <Horizontal className='border-bottom'>
            <Texto category='h5' appearance='medium'>
              ADDITIONAL INFO
            </Texto>
          </Horizontal>
          <LiftingDaysField
            showLiftingDaysForPendingPromptOrder={showLiftingDaysForPendingPromptOrder}
            orderDetails={orderDetails}
          />
        </Vertical>
      </div>
    )
  }
  if (!orderHasAdditionalInfo) {
    return <div />
  }
  const showDestinationStates = !!orderDetails?.DestinationLocations?.length
  const canEditLoadingNumbers =
    orderDetails?.OrderStatusCodeValueMeaning === 'Pending' &&
    orderDetails.IsInternalUser &&
    !!ValidLoadingNumbers?.length
  const showLoadingNumbers = !!ValidLoadingNumbers?.length || !!orderDetails?.LoadingNumbers?.length

  const combinedArray = [
    ...orderDetails.LoadingNumbers,
    ...(Array.isArray(ValidLoadingNumbers) ? ValidLoadingNumbers : []),
  ]
  const LoadingNumberList = Array.from(new Map(combinedArray.map((item) => [item.LoadingNumberId, item])).values())
  const showLiftingDates = showLiftingDaysForPendingPromptOrder || (isPrompt && isAcceptedStatus)
  return (
    <div className='flex-half'>
      <Vertical flex={1} className='mx-4'>
        <Horizontal className='border-bottom'>
          <Texto category='h5' appearance='medium'>
            ADDITIONAL INFO
          </Texto>
        </Horizontal>
        {showLiftingDates && (
          <LiftingDaysField
            showLiftingDaysForPendingPromptOrder={showLiftingDaysForPendingPromptOrder}
            orderDetails={orderDetails}
          />
        )}
        {showDestinationStates && (
          <Horizontal
            className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
            style={{ borderRadius: 5, fontSize: 12 }}
          >
            <Vertical>
              <Horizontal className='mt-2 justify-sb bg-1' style={{ borderRadius: 5 }}>
                <Texto appearance='medium' weight={600}>
                  Destination States
                </Texto>
                <Texto appearance='medium'>{orderDetails?.DestinationLocations?.join(', ')}</Texto>
              </Horizontal>
            </Vertical>
          </Horizontal>
        )}
        {showLoadingNumbers && (
          <Horizontal
            className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
            verticalCenter
            style={{ borderRadius: 5, fontSize: 12 }}
          >
            <Texto appearance='medium' className='mr-4' weight={600} style={{ whiteSpace: 'nowrap' }}>
              Loading Numbers
            </Texto>
            {!canEditLoadingNumbers && (
              <Texto appearance='medium'>{orderDetails?.LoadingNumbers?.map((item) => item.Display).join(', ')}</Texto>
            )}
            {canEditLoadingNumbers && (
              <Form.Item name='LoadingNumbersIds' style={{ minWidth: '70%' }}>
                <Select
                  placeholder='Select Loading Number(s) '
                  mode={AllowMultipleLoadingNumbers ? 'multiple' : undefined}
                  allowClear
                  onChange={setSelectedLoadingNumbers}
                  style={{ minWidth: 250 }}
                  value={selectedLoadingNumbers}
                >
                  {LoadingNumberList?.map((item, i) => (
                    <Select.Option key={item.LoadingNumberId} value={item.LoadingNumberId}>
                      {item.Display}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Horizontal>
        )}
      </Vertical>
    </div>
  )
}
