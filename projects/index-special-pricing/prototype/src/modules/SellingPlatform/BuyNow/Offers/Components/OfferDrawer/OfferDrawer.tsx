import { useOffersContext } from '@contexts/OffersContext'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { GetAllSpecialOffersResponse } from '@modules/SellingPlatform/BuyNow/Offers/Api/types.schema'
import { OrderDetailPane } from '@modules/SellingPlatform/BuyNow/Offers/Components/OrderDetail'
import { confirmUnsavedChanges } from '@modules/SellingPlatform/BuyNow/Offers/Utils/OfferDrawerHelper'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { Drawer, Form } from 'antd'
import dayjs from '@utils/dayjs'
import { useEffect } from 'react'

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
      const isBidExternalUser = selectedItemMeta.Type === 'bid' && !selectedItemMeta.IsInternalUser
      form.setFieldsValue({
        ...selectedItemMeta,
        // Don't pre-populate price for external bid users — the value is the reserve price
        ...(isBidExternalUser ? { Price: undefined } : {}),
      })
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
      const startTime = dayjs(specialOfferData.OrderEffectiveStartDateTime).isAfter(dayjs())
        ? dayjs(specialOfferData.OrderEffectiveStartDateTime)
        : dayjs()
      setCurrentFromDate(startTime)

      const endTime = dayjs(specialOfferData.OrderEffectiveEndDateTime)
      const dateOverrideDisabled = selectedItemMeta?.ShowDateOverrideFields
      const endDateWithinMaximum = dayjs(endTime).isSameOrBefore(dayjs(selectedItemMeta?.DateOverrideMaxDate))

      if (!dateOverrideDisabled || endDateWithinMaximum) {
        setCurrentToDate(endTime)
      } else {
        setCurrentToDate(dayjs(selectedItemMeta?.DateOverrideMaxDate))
      }
      return
    }

    // Priority 2: Fall back to PromptDefaultDates for non-special-offer orders
    const startTime = dayjs(promptDefaultDates?.DefaultStartDate).isAfter(dayjs())
      ? dayjs(promptDefaultDates?.DefaultStartDate)
      : dayjs()
    setCurrentFromDate(startTime)

    const splitOffset = promptDefaultDates?.TimeOffset?.split(':')
    const marketEndTime = !priceAdjustmentId
      ? dayjs(promptDefaultDates?.DefaultEndDate)
      : dayjs(promptDefaultDates?.ReferenceStart)
          .add(allowedPriceAdjustments.find((item) => item.key === priceAdjustmentId)?.Duration, 'days')
          .add(Number(splitOffset?.[0] ?? 0), 'hours')
          .add(Number(splitOffset?.[1] ?? 0), 'minutes')
          .add(Number(splitOffset?.[2] ?? 0), 'seconds')
          .add(Number(splitOffset?.[3] ?? 0), 'milliseconds')

    const bidEndTime = dayjs(selectedItemMeta?.PromptDefaultDates?.DefaultEndDate)

    const endTime = form.getFieldValue('Type') === 'bid' ? bidEndTime : marketEndTime

    const dateOverrideDisabled = selectedItemMeta?.ShowDateOverrideFields
    const endDateWithinMaximum = dayjs(endTime).isSameOrBefore(dayjs(selectedItemMeta?.DateOverrideMaxDate))

    if (!dateOverrideDisabled || endDateWithinMaximum) {
      setCurrentToDate(endTime)
    } else {
      setCurrentToDate(dayjs(selectedItemMeta?.DateOverrideMaxDate))
    }
  }

  const checkAndSetValues = (changedValue) => {
    if (changedValue.PriceAdjustmentId) {
      setDateTimeOverrideToLiftingDaysSelection(changedValue.PriceAdjustmentId)
      return
    }
    const startTime = dayjs(selectedItemMeta?.DateOverrideMinDate).isSameOrAfter(dayjs().add(1, 'minute'))
      ? dayjs(selectedItemMeta?.DateOverrideMinDate)
      : dayjs().add(1, 'minute')

    const endTime = selectedItemMeta?.ShowDateOverrideFields
      ? dayjs(selectedItemMeta?.DateOverrideMaxDate)
      : dayjs(selectedItemMeta?.PromptDefaultDates?.DefaultEndDate)

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
      destroyOnHidden
      onClose={handleClose}
      open={isDrawerVisible}
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
