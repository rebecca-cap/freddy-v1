import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Button, Checkbox, Form } from 'antd'
import React from 'react'

export interface FooterProps {
  ValidLoadingNumbers: any[]
  form: any
  orderDetails: any
  acceptOrder: () => void
  rejectOrder: () => void
  disableButtons: boolean
  userHasChanges: boolean
  canWrite: boolean
  canAcceptOrderDates: boolean
}
export function Footer({
  ValidLoadingNumbers,
  form,
  orderDetails,
  acceptOrder,
  rejectOrder,
  disableButtons,
  userHasChanges,
  canWrite,
  canAcceptOrderDates,
}) {
  const canAcceptRejectOrder =
    orderDetails?.OrderStatusCodeValueMeaning === 'Pending' &&
    !orderDetails?.IsBidOrOffer &&
    orderDetails.IsInternalUser

  const isPendingStatus = orderDetails?.OrderStatusCodeValueMeaning === 'Pending'
  const showSaveButton = (orderDetails?.IsBidOrOffer && isPendingStatus) || !!ValidLoadingNumbers?.length

  if (!isPendingStatus) {
    return <div />
  }
  return (
    isPendingStatus && (
      <Horizontal className='bg-3 px-4 py-3 justify-sb' verticalCenter style={{ fontSize: 12 }}>
        <Horizontal verticalCenter>
          {orderDetails?.IsInternalUser && (
            <Button
              style={{
                fontSize: '10px',
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--theme-color-2-dim)',
              }}
            >
              <Texto appearance='primary' style={{ fontSize: 12 }}>
                Send External Notification
              </Texto>
              <Form.Item name='ExternalNotification' noStyle valuePropName='checked' initialValue>
                <Checkbox defaultChecked className='ml-4' />
              </Form.Item>
            </Button>
          )}
        </Horizontal>
        <Horizontal style={{ gap: 25 }}>
          {showSaveButton && (
            <Horizontal className='ml-4' verticalCenter>
              <GraviButton
                onClick={form.submit}
                theme1
                buttonText='Save Changes'
                disabled={!userHasChanges || !canWrite}
              />
            </Horizontal>
          )}
          {!canAcceptRejectOrder && orderDetails?.AreSetupsStillValid && (
            <Horizontal verticalCenter style={{ gap: 10 }}>
              <GraviButton
                style={{
                  border: '1px solid var(--theme-error)',
                  color: 'var(--theme-error)',
                  backgroundColor: 'var(--theme-error-trans)',
                }}
                buttonText={`Cancel ${orderDetails?.IsBidOrOffer ? 'Bid' : 'Order'}`}
                onClick={rejectOrder}
                disabled={disableButtons || !canWrite}
              />
              {orderDetails?.IsInternalUser && (
                <GraviButton theme3 buttonText='Accept Bid' onClick={acceptOrder} disabled={!canWrite} />
              )}
            </Horizontal>
          )}
          {canAcceptRejectOrder && orderDetails?.AreSetupsStillValid && (
            <Horizontal verticalCenter style={{ gap: 20 }}>
              <GraviButton
                buttonText='Reject'
                onClick={rejectOrder}
                disabled={disableButtons || !canWrite}
                style={{
                  border: '1px solid var(--theme-error)',
                  color: 'var(--theme-error)',
                  backgroundColor: 'var(--theme-error-trans)',
                }}
              />
              <GraviButton
                theme3
                buttonText='Accept'
                onClick={acceptOrder}
                disabled={disableButtons || !canWrite || !canAcceptOrderDates}
              />
            </Horizontal>
          )}
          {!orderDetails?.AreSetupsStillValid && orderDetails?.OrderStatus !== 'Withdrawn' && (
            <Horizontal verticalCenter style={{ gap: 20 }}>
              <GraviButton
                style={{
                  border: '1px solid var(--theme-error)',
                  color: 'var(--theme-error)',
                  backgroundColor: 'var(--theme-error-trans)',
                }}
                buttonText={orderDetails.IsInternalUser ? 'Reject' : 'Withdraw'}
                onClick={rejectOrder}
                disabled={disableButtons || !canWrite}
              />
            </Horizontal>
          )}
        </Horizontal>
      </Horizontal>
    )
  )
}
