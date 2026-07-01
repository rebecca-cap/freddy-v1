import { dateFormat } from '@components/TheArmory/helpers'
import { addCommasToNumber, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  PreviewMode,
  PriceNotification,
} from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/PreviewNotifications/api/schema.types'
import { Modal } from 'antd'
import moment from 'moment'
import React, { useMemo } from 'react'

interface ConfirmModalProps {
  isShowingConfirmModal: boolean
  setIsShowingConfirmModal: React.Dispatch<React.SetStateAction<boolean>>
  sendNotifications: () => void
  selectedQuoteConfigs: PriceNotification[]
  mode: PreviewMode
  isSending: boolean
}
export function ConfirmModal({
  isShowingConfirmModal,
  setIsShowingConfirmModal,
  sendNotifications,
  selectedQuoteConfigs,
  mode,
  isSending,
}: ConfirmModalProps) {
  const hasMissingPrices = useMemo(() => selectedQuoteConfigs?.some((quote) => !quote.Price), [selectedQuoteConfigs])
  const hasNoCustomers = useMemo(
    () => selectedQuoteConfigs?.some((quote) => !quote.CustomerCount),
    [selectedQuoteConfigs]
  )
  const totalCustomerCount = useMemo(
    () => selectedQuoteConfigs?.reduce((acc, curr) => acc + (curr.CustomerCount || 0), 0) || 0,
    [selectedQuoteConfigs]
  )
  const effectiveDateTime = useMemo(() => {
    const now = moment()
    return mode === 'EndOfDay'
      ? now.hours(18).minutes(0).seconds(0).format(dateFormat.MONTH_DATE_TIME)
      : now.format(dateFormat.MONTH_DATE_TIME)
  }, [selectedQuoteConfigs])
  return (
    <Modal
      title='Confirm Price Notification'
      visible={isShowingConfirmModal}
      onCancel={() => setIsShowingConfirmModal(false)}
      footer={
        <Horizontal justifyContent='flex-end' verticalCenter>
          <GraviButton
            disabled={isSending}
            buttonText='Cancel'
            className='mr-1'
            onClick={() => setIsShowingConfirmModal(false)}
          />
          <GraviButton disabled={isSending} buttonText='Confirm & Send' success onClick={sendNotifications} />
        </Horizontal>
      }
    >
      <Vertical verticalCenter className='notification-summary px-2'>
        <Horizontal verticalCenter className='mb-2'>
          <Texto>
            You are about to send price notifications for {addCommasToNumber(selectedQuoteConfigs?.length)}{' '}
            {selectedQuoteConfigs.length > 1 ? 'prices' : 'price'} to customers.
          </Texto>
        </Horizontal>

        {(hasMissingPrices || hasNoCustomers) && (
          <Vertical verticalCenter className='p-2 px-4 mb-2 issues-detected'>
            <Texto appearance='error'>Warning: Issues Detected in Selected Prices </Texto>
            {hasNoCustomers && <Texto appearance='error'>• Some prices have zero customer count </Texto>}
            {hasMissingPrices && <Texto appearance='error'>• Some prices have missing (M) values</Texto>}
            <Texto appearance='error'>These issues may result in customers not receiving expected notifications.</Texto>
          </Vertical>
        )}

        <Vertical verticalCenter className='mt-2'>
          <Texto category='h6'>Notification Summary</Texto>
          <Texto>
            • Mode: {mode === 'EndOfDay' ? 'End of Day' : mode === 'IntraDay' ? 'Midday' : 'Current Period'}
          </Texto>
          <Texto>• Total Prices: {addCommasToNumber(selectedQuoteConfigs?.length)}</Texto>
          <Texto>• Effective Date: {effectiveDateTime}</Texto>
          <Texto>• Total Customer Count: {addCommasToNumber(totalCustomerCount)}</Texto>
        </Vertical>
      </Vertical>
    </Modal>
  )
}
