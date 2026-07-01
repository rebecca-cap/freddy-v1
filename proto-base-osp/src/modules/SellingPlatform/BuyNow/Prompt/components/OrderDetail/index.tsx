import { usePromptContext } from '@contexts/PromptContext'
import { Vertical } from '@gravitate-js/excalibrr'
import { getNumSign } from '@utils/index'
import { Skeleton } from 'antd'
import type { FormInstance } from 'antd'
import dayjs from '@utils/dayjs'
import React from 'react'

import { CreateOrder } from '../CreateOrder'
import { PriceExpiredModalContent } from '../CreateOrder/components/PriceExpiredModalContent'
import { ConfirmOrder } from './ConfirmOrder'
import { OrderFooter } from './OrderFooter'
import { OrderHeader } from './OrderHeader'

interface OrderDetailPaneProps {
  form: FormInstance
  setCreatingOrder: React.Dispatch<React.SetStateAction<boolean>>
  setDateTimeOverrideToLiftingDaysSelection: (id: number) => void
}
export function OrderDetailPane({
  form,
  setCreatingOrder,
  setDateTimeOverrideToLiftingDaysSelection,
}: OrderDetailPaneProps) {
  const {
    currentCounterParty,
    orderStep,
    isFetchingCreateData,
    setPendingTrade,
    handleSubmitOrder,
    isPriceExpired,
    selectedItemMeta,
    currentFromDate,
    currentToDate,
    isDateOverrideActive,
  } = usePromptContext()

  const clearOrderState = () => {
    form.resetFields()
    form.setFieldsValue({ ...selectedItemMeta })
    setCreatingOrder(false)
  }
  const handleNextStep = () => {
    if (orderStep === 'create') {
      const formValues = { ...form.getFieldsValue(true) }
      const selectedAdjustment = selectedItemMeta?.PriceAdjustments.find(
        (item) => item.MarketPlatformPriceAdjustmentDetailId === formValues.PriceAdjustmentId
      )
      const selectedAdjustmentDisplay = selectedAdjustment
        ? `${selectedAdjustment.Duration} Days: ${getNumSign(selectedAdjustment.AdjustmentPrice)}${fmt.currency(
            selectedAdjustment.AdjustmentPrice
          )}`
        : ''
      const selectedInternalCounterparty = selectedItemMeta?.InternalCounterPartyOverride.find(
        (item) => item.key === formValues?.InternalCounterPartyId
      )?.value
      const selectedColleague = selectedItemMeta?.ExternalColleagueOverride.find(
        (item) => item.key === formValues?.ExternalColleagueId
      )?.value

      const SelectedItems = formValues.SelectedItems
        ? selectedItemMeta?.AdditionalItems.filter((item) => formValues.SelectedItems.includes(item.key))
        : []


      const LoadingNumbers = selectedItemMeta?.LoadingNumbersList.filter((item) => {
        const loadingNumbersIds = Array.isArray(formValues?.LoadingNumbersIds)
          ? formValues.LoadingNumbersIds
          : [formValues?.LoadingNumbersIds]

        return loadingNumbersIds.includes(item.key)
      })

      const DestinationStates = selectedItemMeta?.DestinationStates.filter((item) => {
        const destinationLocationIds = Array.isArray(formValues?.DestinationStatesIds)
          ? formValues.DestinationStatesIds
          : [formValues?.DestinationStatesIds]

        return destinationLocationIds.includes(item.key)
      })

      const LiftingLocations = selectedItemMeta?.LiftingLocationsList.filter((item) =>
        formValues?.LiftingLocationIds.includes(item.key)
      ).map((item) => item?.LocationName)
      const startDate = isDateOverrideActive ? formValues.OverrideStartDate : currentFromDate
      const laterStartDate = dayjs().isAfter(dayjs(startDate)) ? dayjs().add(1, 'minute') : startDate
      const endDateTime = isDateOverrideActive ? formValues.OverrideEndDate : currentToDate
      const newPendingTrade = {
        ...form.getFieldsValue(true),
        ExternalCounterPartyName: currentCounterParty,
        PriceAdjustmentName: selectedAdjustmentDisplay,
        InternalCounterPartyName: selectedInternalCounterparty,
        ExternalColleagueName: selectedColleague,
        SelectedItems,
        LoadingNumbers,
        DestinationStates,
        LiftingLocations,
        OverrideStartDate: selectedItemMeta?.ShowDateOverrideFields ? laterStartDate : null,
        OverrideEndDate: selectedItemMeta?.ShowDateOverrideFields ? endDateTime : null,
      }

      setPendingTrade({ ...newPendingTrade })
      form.submit()
    } else {
      handleSubmitOrder({ clearOrderState })
    }
  }
  if (isFetchingCreateData || !selectedItemMeta) {
    return (
      <Vertical className='order-form p-3'>
        <Skeleton />
      </Vertical>
    )
  }

  return (
    <Vertical className='order-form'>
      <Vertical flex='none' height='auto'>
        <OrderHeader form={form} />
      </Vertical>
      <Vertical height='auto' style={{ position: 'relative' }}>
        {isPriceExpired && form.getFieldValue('Type') !== 'bid' && <PriceExpiredModalContent />}
        <Vertical>
          <OrderStepComponent
            orderStep={orderStep}
            form={form}
            setDateTimeOverrideToLiftingDaysSelection={setDateTimeOverrideToLiftingDaysSelection}
          />
        </Vertical>
        <Vertical flex='none' height='auto'>
          <OrderFooter form={form} handleNextStep={handleNextStep} />
        </Vertical>
      </Vertical>
    </Vertical>
  )
}

function OrderStepComponent({ orderStep, form, setDateTimeOverrideToLiftingDaysSelection }) {
  if (orderStep === 'create') {
    return (
      <CreateOrder form={form} setDateTimeOverrideToLiftingDaysSelection={setDateTimeOverrideToLiftingDaysSelection} />
    )
  }
  return <ConfirmOrder form={form} />
}
