import { useOffersContext } from '@contexts/OffersContext'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { GetAllSpecialOffersResponse } from '@modules/SellingPlatform/BuyNow/Offers/Api/types.schema'
import { OrderDetailPane } from '@modules/SellingPlatform/BuyNow/Offers/Components/OrderDetail'
import { confirmUnsavedChanges } from '@modules/SellingPlatform/BuyNow/Offers/Utils/OfferDrawerHelper'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { Drawer, Form } from 'antd'
import moment from 'moment/moment'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type RefetchFn = (
  options?: RefetchOptions & RefetchQueryFilters<GetAllSpecialOffersResponse>
) => Promise<QueryObserverResult<GetAllSpecialOffersResponse, unknown>>

type OfferDrawerProps = {
  isDrawerVisible: boolean
  setIsDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>
  refetchItemsAvailableForOrder: RefetchFn
}
export function OfferDrawer({ isDrawerVisible, setIsDrawerVisible, refetchItemsAvailableForOrder }: OfferDrawerProps) {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const {
    selectedItemMeta,
    hasPendingChanges,
    setHasPendingChanges,
    allowedPriceAdjustments,
    setCurrentFromDate,
    setCurrentToDate,
    clearOffer,
    setOrderStep,
  } = useOffersContext()

  useEffect(() => {
    if (isDrawerVisible && selectedItemMeta) {
      form.setFieldsValue({ ...selectedItemMeta })
    }
  }, [selectedItemMeta, isDrawerVisible])

  const drawerTitle = (
    <div className='flex justify-sb'>
      <Texto category='h6'>Create New Order</Texto>
    </div>
  )

  const setDateTimeOverrideToLiftingDaysSelection = (priceAdjustmentId: number) => {
    const specialOfferData = selectedItemMeta?.SpecialOfferData
    const promptDefaultDates = selectedItemMeta?.PromptDefaultDates

    // Priority 1: Use SpecialOfferData dates if available (actual special offer dates)
    if (specialOfferData?.OrderEffectiveStartDateTime && specialOfferData?.OrderEffectiveEndDateTime) {
      const startTime = moment(specialOfferData.OrderEffectiveStartDateTime).isAfter(moment())
        ? moment(specialOfferData.OrderEffectiveStartDateTime)
        : moment()
      setCurrentFromDate(startTime)

      const endTime = moment(specialOfferData.OrderEffectiveEndDateTime)
      const dateOverrideDisabled = selectedItemMeta?.ShowDateOverrideFields
      const endDateWithinMaximum = moment(endTime).isSameOrBefore(moment(selectedItemMeta?.DateOverrideMaxDate))

      if (!dateOverrideDisabled || endDateWithinMaximum) {
        setCurrentToDate(endTime)
      } else {
        setCurrentToDate(moment(selectedItemMeta?.DateOverrideMaxDate))
      }
      return
    }

    // Priority 2: Fall back to PromptDefaultDates for non-special-offer orders
    const startTime = moment(promptDefaultDates?.DefaultStartDate).isAfter(moment())
      ? moment(promptDefaultDates?.DefaultStartDate)
      : moment()
    setCurrentFromDate(startTime)

    const splitOffset = promptDefaultDates?.TimeOffset?.split(':')
    const marketEndTime = !priceAdjustmentId
      ? moment(promptDefaultDates?.DefaultEndDate)
      : moment(promptDefaultDates?.ReferenceStart)
          .add(allowedPriceAdjustments.find((item) => item.key === priceAdjustmentId)?.Duration, 'days')
          .add(splitOffset?.[0], 'hours')
          .add(splitOffset?.[1], 'minutes')
          .add(splitOffset?.[2], 'seconds')
          .add(splitOffset?.[3], 'milliseconds')

    const bidEndTime = moment(selectedItemMeta?.PromptDefaultDates?.DefaultEndDate)

    const endTime = form.getFieldValue('Type') === 'bid' ? bidEndTime : marketEndTime

    const dateOverrideDisabled = selectedItemMeta?.ShowDateOverrideFields
    const endDateWithinMaximum = moment(endTime).isSameOrBefore(moment(selectedItemMeta?.DateOverrideMaxDate))

    if (!dateOverrideDisabled || endDateWithinMaximum) {
      setCurrentToDate(endTime)
    } else {
      setCurrentToDate(moment(selectedItemMeta?.DateOverrideMaxDate))
    }
  }

  const checkAndSetValues = (changedValue) => {
    if (changedValue.PriceAdjustmentId) {
      setDateTimeOverrideToLiftingDaysSelection(changedValue.PriceAdjustmentId)
      return
    }
    const startTime = moment(selectedItemMeta?.DateOverrideMinDate).isSameOrAfter(moment().add(1, 'minute'))
      ? moment(selectedItemMeta?.DateOverrideMinDate)
      : moment().add(1, 'minute')

    const endTime = selectedItemMeta?.ShowDateOverrideFields
      ? moment(selectedItemMeta?.DateOverrideMaxDate)
      : moment(selectedItemMeta?.PromptDefaultDates?.DefaultEndDate)

    if (changedValue.Type === 'market') {
      const adjustment = form.getFieldValue('PriceAdjustmentId')
      if (adjustment) {
        setDateTimeOverrideToLiftingDaysSelection(adjustment)
      } else {
        setCurrentFromDate(startTime)
        setCurrentToDate(null)
      }
    }
    if (changedValue.Type === 'bid') {
      setCurrentFromDate(startTime)
      setCurrentToDate(endTime)
    }
    if (changedValue.OverrideOrderDateTime) {
      form.setFields([
        {
          name: 'PriceAdjustmentId',
          errors: [],
        },
      ])
    }
  }

  const forceClose = () => {
    form.resetFields()
    clearOffer()
    setIsDrawerVisible(false)
    navigate('/BuyNow/Offers')
  }

  const handleClose = (e?: React.SyntheticEvent) =>
    confirmUnsavedChanges({
      event: e,
      hasPendingChanges,
      forceClose,
    })

  return (
    <Drawer
      title={drawerTitle}
      placement='right'
      width={600}
      destroyOnClose
      onClose={handleClose}
      visible={isDrawerVisible}
      className='offers-grid-drawer'
    >
      <Vertical style={{ width: '100%', margin: 0 }}>
        <Form
          name='OfferDrawerForm'
          form={form}
          onFieldsChange={() => setHasPendingChanges(true)}
          onValuesChange={checkAndSetValues}
          onFinish={(formValues) => {
            setOrderStep('confirm')
          }}
          style={{ minHeight: '100%' }}
          scrollToFirstError
        >
          <OrderDetailPane
            form={form}
            setCreatingOrder={setIsDrawerVisible}
            setDateTimeOverrideToLiftingDaysSelection={setDateTimeOverrideToLiftingDaysSelection}
            refetchItemsAvailableForOrder={refetchItemsAvailableForOrder}
          />
        </Form>
      </Vertical>
    </Drawer>
  )
}
