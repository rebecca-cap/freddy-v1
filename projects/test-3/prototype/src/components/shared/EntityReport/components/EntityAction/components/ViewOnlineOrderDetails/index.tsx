import '../styles.css'
import './viewOrderStyles.css'

import { LoadingOutlined } from '@ant-design/icons'
import { AdditionalInfo } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/AdditionalInfo'
import { AdditionalItems } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/AdditionalItems'
import { CounterPartyInfo } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/CounterPartyInfo'
import { Footer } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/Footer'
import { FormulaComponents } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/FormulaComponents'
import { Header } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/Header'
import { PricingTerms } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/PricingTerms'
import { TradeNotes } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/TradeNotes'
import { UpdateFields } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/UpdateFields/UpdateFields'
import { ValidationIssues } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/ValidationIssues'
import { VolumeAllocation } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/VolumeAllocation'
import { dateFormat } from '@components/TheArmory/helpers'
import { Permission, useUser } from '@contexts/UserContext'
import { Horizontal, NothingMessage, NotificationMessage, Vertical } from '@gravitate-js/excalibrr'
import { useOnlineOrderView } from '@hooks/useOnlineOrderView'
import { OrderDetail } from '@hooks/useOnlineOrderViewTypes'
import { useOffers } from '@modules/SellingPlatform/BuyNow/Offers/Api/useOffers'
import { isDefinedAndNotNull } from '@utils/index'
import { Form } from 'antd'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'

export function ViewOnlineOrderDetails({
  setIsInfoModalOpen,
  primaryKey,
  currentItemId,
  dataQuery,
  refetchData,
  isAdmin,
}) {
  const [form] = Form.useForm()
  const { hasPermission } = useUser()
  const canWrite =
    hasPermission(Permission.MarketPlatform_OnlineOrder_Write) ||
    hasPermission(Permission.MarketPlatform_SpecialOffer_OnlineOrder_Write)
  const enteredFromDate = Form.useWatch('FromDateTime', form)
  const enteredToDate = Form.useWatch('ToDateTime', form)

  const [disableButtons, setDisableButtons] = useState(false)
  const [userHasChanges, setUserHasChanges] = useState(false)
  const [deliveryPeriods, setDeliveryPeriods] = useState<OrderDetail[] | []>([])
  const [selectedLoadingNumbers, setSelectedLoadingNumbers] = useState<number[]>([])
  const { getOrderView, updateOrder } = useOnlineOrderView()
  const { updateIndexOfferOrder } = useOffers()
  const updateIndexOfferMutation = updateIndexOfferOrder()

  const { data, isLoading, isFetching } = getOrderView(primaryKey, currentItemId, isAdmin)

  const orderDetails = data?.Data?.Model
  const ValidLoadingNumbers = data?.Data?.ValidLoadingNumbers
  const AllowMultipleLoadingNumbers = data?.Data?.AllowMultipleLoadingNumbers || false
  const isPrompt = orderDetails?.TradeTypeCodeValueMeaning === 'Prompt'
  const isAcceptedStatus = orderDetails?.OrderStatusCodeValueMeaning === 'Accepted'
  const isIndexOffer = isDefinedAndNotNull(orderDetails?.SourceIndexOfferId)

  const orderHasAdditionalInfo =
    !!orderDetails?.LoadingNumbers.length ||
    !!orderDetails?.OriginLocations.length ||
    !!ValidLoadingNumbers?.length ||
    !!orderDetails?.DestinationLocations?.length ||
    (orderDetails?.FromDateTime && orderDetails?.ToDateTime && isPrompt && isAcceptedStatus)

  useEffect(() => {
    if (data?.Data.Model) {
      form.setFieldsValue({
        ...orderDetails,
        TradeEntryExpiry: moment(orderDetails?.TradeEntryExpiry),
        FromDateTime: moment(orderDetails?.FromDateTime).isBefore(moment().add(1, 'minute'))
          ? moment().add(1, 'minute')
          : moment(orderDetails?.FromDateTime),
        ToDateTime: moment(orderDetails?.ToDateTime),
        LoadingNumbersIds: orderDetails?.LoadingNumbers?.map((item) => item.LoadingNumberId),
      })
      if (orderDetails?.OrderDetails?.length) {
        setDeliveryPeriods(orderDetails?.OrderDetails)
      }
    }
  }, [data])

  const calculateVolumes = (newVolume) => {
    if (!orderDetails) return
    const periodCount = orderDetails?.OrderDetails.length
    const newTotalVolume = form.getFieldValue('Period') === 'Total' ? newVolume : newVolume * periodCount
    const newMonthlyVolume = Math.floor(newTotalVolume / periodCount)

    let newDeliveryPeriods: OrderDetail[] = []

    if (orderDetails?.VolumeDistributionTypeCodeValueMeaning === 'Rateable') {
      newDeliveryPeriods = deliveryPeriods.map((item) => ({
        ...item,
        Quantity: newMonthlyVolume,
      }))
    } else if (orderDetails?.VolumeDistributionTypeCodeValueMeaning === 'Weighted') {
      newDeliveryPeriods = deliveryPeriods.map((item, i) => ({
        ...item,
      }))
    } else {
      newDeliveryPeriods = deliveryPeriods
    }

    const floorSum = newDeliveryPeriods?.map((p) => Math.floor(p.Quantity)).reduce((a, b) => a + b, 0)
    let differenceToDistribute = newTotalVolume - floorSum

    while (differenceToDistribute > 0) {
      newDeliveryPeriods[differenceToDistribute % newDeliveryPeriods.length].Quantity += 1
      differenceToDistribute -= 1
    }

    const calculateWeightedAverage = () => {
      const weights = newDeliveryPeriods.map((item) => item.Quantity / newTotalVolume)
      const weightedPrices = weights.map((weight, i) => weight * deliveryPeriods[i].Price)
      return fmt.decimal(weightedPrices.reduce((a, b) => a + b, 0))
    }
    if (orderDetails?.ContractPricingMethodCodeValueMeaning === 'WeightedAverage') {
      const price = calculateWeightedAverage()
      form.setFieldsValue({ Price: price })
      form.setFieldsValue({ OverridePrice: price })
    }
    if (orderDetails?.ContractPricingMethodCodeValueMeaning === 'HighPrice') {
      const price = Math.max(...newDeliveryPeriods.map((item) => item.Price))
      form.setFieldsValue({ Price: price })
      form.setFieldsValue({ OverridePrice: price })
    }

    if (newDeliveryPeriods?.length > 0) {
      setDeliveryPeriods(newDeliveryPeriods)
    }
  }

  const handleUpdateOrder = async (payload) => {
    setDisableButtons(true)

    // Use index offer endpoint when applicable
    const response = isIndexOffer ? await updateIndexOfferMutation.mutateAsync(payload) : await updateOrder({ ...payload })

    if (response?.Validations.length || response.message) {
      handleResponse(response)
    } else {
      refetchData()
      NotificationMessage('Order updated', 'The order has been successfully updated', false)
      setIsInfoModalOpen(false)
    }

    setDisableButtons(false)
    setUserHasChanges(false)
    dataQuery.refetch()
  }

  const handleUpdateBid = (Action?: string) => {
    const formValues = form.getFieldsValue()
    const isPullAnytime = orderDetails?.VolumeDistributionTypeCodeValueMeaning === 'PullAnytime'

    let submitDeliveryPeriods = deliveryPeriods
    if (isPullAnytime) {
      submitDeliveryPeriods = deliveryPeriods.map((dp) => ({ ...dp, Quantity: 0 }))
      submitDeliveryPeriods[0].Quantity = form.getFieldValue('Quantity')
      submitDeliveryPeriods = [submitDeliveryPeriods[0]]
    }

    const promptDetails = [
      {
        TradeEntryDetailId: orderDetails?.PrimaryTradeEntryDetailId,
        Quantity: formValues?.Quantity,
      },
    ]

    const DetailUpdates = isPrompt ? promptDetails : submitDeliveryPeriods
    const showDateOverrideFields = data?.Data?.ShowDateOverrideFields

    const fromDatetime = moment(formValues?.FromDateTime).isBefore(moment().add(1, 'minute'))
      ? moment().add(1, 'minute')
      : moment(formValues?.FromDateTime)

    const startDateTime = showDateOverrideFields ? moment(fromDatetime).format(dateFormat.ISO) : null
    const endDateTime = showDateOverrideFields ? moment(formValues?.ToDateTime).format(dateFormat.ISO) : null

    const BidExpiration = moment(formValues?.TradeEntryExpiry).format(dateFormat.ISO)

    const payload = {
      TradeEntryId: currentItemId,
      BidExpiration: BidExpiration,
      BidPrice: formValues.Price,
      LoadingNumberIds: formValues.LoadingNumbersIds,
      DetailUpdates,
      SendExternalNotification: formValues?.ExternalNotification,
      // Only include date overrides for non-index offers
      ...(isIndexOffer
        ? {}
        : {
            OverrideStartDate: startDateTime,
            OverrideEndDate: endDateTime,
          }),
      ...(Action ? { [Action]: true } : {}),
    }
    handleUpdateOrder(payload)
  }

  const canAcceptOrderDates = useMemo(() => {
    if (data?.Data?.ShowDateOverrideFields) {
      return isDefinedAndNotNull(enteredFromDate) && isDefinedAndNotNull(enteredToDate)
    }
    return true
  }, [enteredFromDate, enteredToDate, data?.Data?.ShowDateOverrideFields])

  if (isLoading || isFetching) {
    return (
      <Horizontal height={450} verticalCenter horizontalCenter>
        <LoadingOutlined style={{ color: 'var(--theme-color-2', fontSize: 50 }} />
      </Horizontal>
    )
  }

  if (!orderDetails) {
    return (
      <Horizontal className='bg-3' height={450} verticalCenter horizontalCenter>
        <NothingMessage title='Could not find order details' message={data?.Validations[0]?.Message || ''} />
      </Horizontal>
    )
  }
  return (
    <Form
      form={form}
      onFieldsChange={() => setUserHasChanges(true)}
      onFinish={handleUpdateBid}
      style={{ width: '100%' }}
    >
      <Vertical className='bg-2'>
        <Header orderDetails={orderDetails} isIndexOffer={isIndexOffer} />
        <UpdateFields
          orderDetails={orderDetails}
          form={form}
          calculateVolumes={calculateVolumes}
          canWrite={canWrite}
          showDateOverrideFields={data?.Data?.ShowDateOverrideFields}
          maxDate={data?.Data?.MaxDateOverrideDate}
          minDate={data?.Data?.MinDateOverrideDate}
          enteredFromDate={enteredFromDate}
          enteredToDate={enteredToDate}
        />
        <Horizontal className='m-4' style={{ flexWrap: 'wrap' }}>
          <AdditionalItems order={orderDetails} type='Product' />
          <AdditionalItems order={orderDetails} type='Location' />
          <FormulaComponents orderDetails={orderDetails} />
          <PricingTerms orderDetails={orderDetails} />
          <TradeNotes orderDetails={orderDetails} />
          <VolumeAllocation
            orderDetails={orderDetails}
            orderHasAdditionalInfo={orderHasAdditionalInfo}
            form={form}
            deliveryPeriods={deliveryPeriods}
            setDeliveryPeriods={setDeliveryPeriods}
            selectedSubtype={orderDetails?.ContractPricingMethodCodeValueMeaning}
            setUserHasChanges={setUserHasChanges}
          />
          <AdditionalInfo
            orderDetails={orderDetails}
            orderHasAdditionalInfo={orderHasAdditionalInfo}
            ValidLoadingNumbers={ValidLoadingNumbers}
            selectedLoadingNumbers={selectedLoadingNumbers}
            setSelectedLoadingNumbers={setSelectedLoadingNumbers}
            AllowMultipleLoadingNumbers={AllowMultipleLoadingNumbers}
            showDateOverrideFields={data?.Data?.ShowDateOverrideFields}
          />
          {isPrompt && <CounterPartyInfo orderDetails={orderDetails} />}
        </Horizontal>
        <Horizontal className='mx-4' style={{ flexWrap: 'wrap' }}>
          <ValidationIssues orderDetails={orderDetails} />
          {!isPrompt && <CounterPartyInfo orderDetails={orderDetails} />}
        </Horizontal>
        <Footer
          form={form}
          ValidLoadingNumbers={ValidLoadingNumbers}
          orderDetails={orderDetails}
          acceptOrder={() => handleUpdateBid('Accept')}
          rejectOrder={() => handleUpdateBid('Withdraw')}
          disableButtons={disableButtons}
          userHasChanges={userHasChanges}
          canWrite={canWrite}
          canAcceptOrderDates={canAcceptOrderDates}
        />
      </Vertical>
    </Form>
  )
}

function handleResponse(response) {
  const message = response?.Validations[0]?.Message || response?.message
  const showError =
    (response.Validations[0]?.Severity === 'Error' && response?.ActionStatus !== 'Success') || response?.message
  NotificationMessage(response?.Validations[0]?.Category, message, showError)
}
