import './style.css'

import { LoadingOutlined } from '@ant-design/icons'
import { useForwardsTyped } from '@api/useForwards/useForwardsTyped'
import submitSound from '@assets/sounds/pristine-609.mp3'
import { useForwardsCreation } from '@contexts/ForwardsContext'
import { Horizontal, NotificationMessage } from '@gravitate-js/excalibrr'
import dayjs from '@utils/dayjs'
import { Form, Modal } from 'antd'
import * as PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { FirstStep } from './Components/FirstStep'
import { OrderFooter } from './Components/OrderFooter/OrderFooter'
import { OrderSuccess } from './Components/OrderSucess'
import { SecondStep } from './Components/SecondStep'
import { OrderExpirationModal } from './Components/SecondStep/Components/OrderExpirationModal'

CreateModal.propTypes = { visible: PropTypes.bool }

export const ORDERENTRYSTEPS = {
  VOLUMEENTRY: 'VOLUMEENTRY',
  ADDITIONALOPTIONS: 'ADDITIONALOPTIONS',
}

export function CreateModal({ isModalVisible, setIsModalVisible, setShowConfetti, messageApi }) {
  const [orderEntryStep, setOrderEntryStep] = useState(ORDERENTRYSTEPS.VOLUMEENTRY)
  const {
    isPriceExpired,
    selectedPeriodIds,
    error,
    setError,
    tradeTimer,
    refetchOrderEntryInfo,
    clearTradeTimer,
    initializeTimerInterval,
    orderEntryInfo,
  } = useForwardsCreation()
  const [form] = Form.useForm()
  const [pendingChanges, setPendingChanges] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(false)

  const handleRefresh = () => {
    refetchOrderEntryInfo(selectedPeriodIds)
    clearTradeTimer()
    initializeTimerInterval()
  }

  return (
    <Modal
      className='forwards-modal-container'
      open={isModalVisible}
      centered
      destroyOnHidden
      footer={
        isPriceExpired ? null : (
          <OrderFooter
            error={error}
            setIsModalVisible={setIsModalVisible}
            setOrderEntryStep={setOrderEntryStep}
            orderEntryStep={orderEntryStep}
            form={form}
            pendingChanges={pendingChanges}
            disableSubmit={disableSubmit}
          />
        )
      }
      closable={false}
      title={
        <OrderExpirationModal
          isPriceExpired={isPriceExpired}
          tradeTimer={tradeTimer}
          handleRefresh={handleRefresh}
          orderEntryInfo={orderEntryInfo}
        />
      }
      style={{ minWidth: 1100 }}
    >
      <ModalContents
        orderEntryStep={orderEntryStep}
        setOrderEntryStep={setOrderEntryStep}
        error={error}
        setError={setError}
        form={form}
        setPendingChanges={setPendingChanges}
        setDisableSubmit={setDisableSubmit}
        handleRefresh={handleRefresh}
        setIsModalVisible={setIsModalVisible}
        setShowConfetti={setShowConfetti}
        messageApi={messageApi}
      />
    </Modal>
  )
}

function ModalContents({
  orderEntryStep,
  setOrderEntryStep,
  error,
  setError,
  form,
  setPendingChanges,
  setDisableSubmit,
  handleRefresh,
  setIsModalVisible,
  setShowConfetti,
  messageApi,
}) {
  const { selectedPeriodIds, deliveryPeriods, setDeliveryPeriods, selectedGridCells, currentCounterParty } =
    useForwardsCreation()

  const [selectedSubtype, setSelectedSubtype] = useState(null)
  const [volumePeriod, setVolumePeriod] = useState('Total')
  const { getOrderEntryInfo } = useForwardsTyped()
  const [constraints, setConstraints] = useState(null)
  const [audio] = useState(new Audio(submitSound))
  const [totalVolume, setTotalVolume] = useState(0)

  const { data: orderEntryInfo, isFetching } = getOrderEntryInfo(selectedPeriodIds)

  useEffect(() => {
    if (selectedSubtype?.VolumeDistributionTypeMeaning === 'Weighted') {
      setVolumePeriod('Total')
    }
  }, [selectedSubtype])

  useEffect(() => {
    setConstraints(orderEntryInfo?.Data?.SelectedItems[0].Constraints)
  }, [orderEntryInfo])

  const { submitOrder, validSubtypes } = useForwardsCreation()

  const constructTrade = () => {
    const formValues = form.getFieldsValue(true)
    const selectedLoadingNumbers =
      formValues.LoadingNumbersIds && Array.isArray(formValues.LoadingNumbersIds)
        ? formValues.LoadingNumbersIds
        : formValues.LoadingNumbersIds
        ? [formValues.LoadingNumbersIds]
        : []

    const selectedDestinationLocationIds = formValues.DestinationStatesIds

    const selectedLiftingLocations = formValues.LiftingLocationIds
    const formSubtype = validSubtypes.find(
      (types) => types.MarketPlatformInstrumentSubtypeId === form.getFieldValue('SelectedSubtype')
    )

    // need to find the correct itemkey objects for each selected item
    const selectedAdditionalItems = formValues?.SelectedItems?.length
      ? orderEntryInfo?.Data?.SelectedItems[0]?.AdditionalItems.map((item) => {
          if (formValues.SelectedItems.includes(item.ItemKey.TradeEntrySetupId?.toString())) {
            return { ItemKey: item.ItemKey }
          }
        }).filter((item) => item)
      : []

    const isBid = formValues.PricingStrategy === 'Bid'
    let submitDeliveryPeriods = deliveryPeriods
    if (formSubtype.VolumeDistributionTypeMeaning === 'PullAnytime') {
      submitDeliveryPeriods = deliveryPeriods.map((dp) => ({ ...dp, orderVolume: 0 }))
      submitDeliveryPeriods[0].orderVolume = form.getFieldValue('Volume')
    }
    const pendingOrder = {
      MarketPlatformInstrumentSubtypeId: formSubtype.MarketPlatformInstrumentSubtypeId,
      Items: submitDeliveryPeriods.map((item) => {
        const overridePrice =
          formSubtype.ContractPricingMethodMeaning === 'DeliveryPeriod' ? item.Price : formValues.OverridePrice

        const deliveryPeriodAdditionalItems = selectedAdditionalItems.map((additionalItem) => {
          return {
            ...additionalItem,
            ItemKey: {
              ...additionalItem.ItemKey,
              DeliveryPeriodConfigurationId: item.ItemKey.DeliveryPeriodConfigurationId,
            },
          }
        })

        const payloadItem = {
          Volume: item.orderVolume,
          DestinationLocationIds: selectedDestinationLocationIds,
          LoadingNumberIds: selectedLoadingNumbers,
          LiftingLocationIds: selectedLiftingLocations,
          MarketPlatformPriceAdjustmentDetailId: undefined,
          OverridePrice: !isBid ? overridePrice : formValues.BidPrice,
          ItemKey: item.ItemKey,
          SelectedAdditionalItems: deliveryPeriodAdditionalItems,
        }
        return payloadItem
      }),
      IsBid: isBid,
      BidPrice: isBid ? formValues.BidPrice : undefined,
      BidExpiry: isBid ? dayjs(formValues?.BidExpiration)?.format('YYYY-MM-DD HH:mm:ss') : undefined,
      ExternalColleagueOverride: formValues?.ExternalColleagueId,
      InternalCounterPartyOverride: formValues?.InternalCounterPartyId,
      ShouldSendExternalNotification: formValues.SendExternalNotification,
      Notes: formValues.Notes,
      State: orderEntryInfo?.Data?.State,
    }

    return pendingOrder
  }

  const handleSubmit = () => {
    if (orderEntryStep === ORDERENTRYSTEPS.VOLUMEENTRY && !error) {
      setOrderEntryStep(ORDERENTRYSTEPS.ADDITIONALOPTIONS)
    } else if (orderEntryStep === ORDERENTRYSTEPS.ADDITIONALOPTIONS) {
      setDisableSubmit(true)
      const order = constructTrade()
      submitOrder(order)
        .then((response) => {
          if (!response?.Validations?.length) {
            setIsModalVisible(false)
            const orderNumber = response?.Data?.TradeEntryId
            setPendingChanges(false)

            audio.play()
            messageApi.open({
              type: null,
              icon: null,
              content: <OrderSuccess orderNumber={orderNumber} />,
              duration: 15,
            })

            setShowConfetti(true)

            handleRefresh(selectedPeriodIds)
            setOrderEntryStep(ORDERENTRYSTEPS.VOLUMEENTRY)
            form.resetFields()
            setDeliveryPeriods(
              selectedGridCells.map((c) => {
                return { ...c.cell, orderVolume: 0, salePrice: c.cell.Price }
              })
            )
            setDisableSubmit(false)
          } else {
            setDisableSubmit(false)
            NotificationMessage('Error creating order', response?.Validations[0]?.Message)
          }
        })
        .catch((e) => {
          NotificationMessage('Save Error', 'Error creating order')
          setDisableSubmit(false)
        })
    }
  }

  if (isFetching) {
    return (
      <Horizontal style={{ height: 700 }} horizontalCenter verticalCenter>
        <LoadingOutlined style={{ minWidth: 50, minHeight: 50 }} />
      </Horizontal>
    )
  }

  return (
    <Horizontal style={{ height: 700, width: 'auto' }}>
      <Form
        form={form}
        onFinish={() => handleSubmit()}
        style={{ minWidth: '100%' }}
        onFieldsChange={setPendingChanges}
        scrollToFirstError
      >
        {orderEntryStep === ORDERENTRYSTEPS.VOLUMEENTRY ? (
          <FirstStep
            subTypes={validSubtypes}
            setVolumePeriod={setVolumePeriod}
            volumePeriod={volumePeriod}
            selectedPeriodIds={selectedPeriodIds}
            form={form}
            selectedSubtype={selectedSubtype}
            setSelectedSubtype={setSelectedSubtype}
            constraints={constraints}
            deliveryPeriods={deliveryPeriods}
            setDeliveryPeriods={setDeliveryPeriods}
            error={error}
            setError={setError}
            totalVolume={totalVolume}
            setTotalVolume={setTotalVolume}
          />
        ) : (
          <SecondStep
            form={form}
            selectedSubtype={selectedSubtype}
            deliveryPeriods={deliveryPeriods}
            setDeliveryPeriods={setDeliveryPeriods}
            orderEntryInfo={orderEntryInfo}
            constraints={constraints}
            totalVolume={totalVolume}
            setTotalVolume={setTotalVolume}
            currentCounterParty={currentCounterParty}
          />
        )}
      </Form>
    </Horizontal>
  )
}
