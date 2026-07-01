import submitSound from '@assets/sounds/pristine-609.mp3'
import {
  adjustPriceAdjustmentsHelper,
  buildSubmitOrderPayload,
  deriveAllowBid,
  getInitialDatesFromEntry,
  mapEntryDataToContext,
} from '@contexts/OffersContext/helpers'
import { NotificationMessage } from '@gravitate-js/excalibrr'
import { useAssignedToggle } from '@hooks/useAssignedToggle'
import { useImpersonationTyped } from '@hooks/useImpersonationTyped'
import type {
  AllSpecialOffersDisplayModel,
  CreditData,
  SubmitOrderRequest,
} from '@modules/SellingPlatform/BuyNow/Offers/Api/types.schema'
import { useOffersTyped } from '@modules/SellingPlatform/BuyNow/Offers/Api/useOffersTyped'
import { OrderSuccess } from '@modules/SellingPlatform/BuyNow/Prompt/components/OrderSuccess'
import { useTasToggle } from '@utils/hooks/useTasToggle'
import { isDefinedAndNotNull } from '@utils/index'
import { message } from 'antd'
import type React from 'react'
import { type ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

import type {
  DateItem,
  OffersContextValue,
  OffersEntryData,
  OffersSelectedItemMetadata,
  PendingTradePayload,
  PriceAdjustment,
} from './types.schema'

const OffersContext = createContext<OffersContextValue | null>(null)

export const OffersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentCounterParty } = useImpersonationTyped()

  const [selectedOffer, setSelectedOffer] = useState<AllSpecialOffersDisplayModel | null>(null)

  const [entryData, setEntryData] = useState<OffersEntryData | null>(null)
  const [selectedItemMeta, setSelectedItemMeta] = useState<OffersSelectedItemMetadata | null>(null)
  const [allowedPriceAdjustments, setAllowedPriceAdjustments] = useState<PriceAdjustment[]>([])

  const [pendingTrade, setPendingTrade] = useState<PendingTradePayload | null>(null)
  const [hasPendingChanges, setHasPendingChanges] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(false)

  const [orderStep, setOrderStep] = useState<'create' | 'confirm'>('create')
  const [tradeTimer, setTradeTimer] = useState<number | null>(null)
  const [isPriceExpired, setIsPriceExpired] = useState(false)

  const [currentFromDate, setCurrentFromDateTime] = useState<DateItem>(null)
  const [currentToDate, setCurrentToDateTime] = useState<DateItem>(null)
  const [isDateOverrideActive, setIsDateOverrideActive] = useState<boolean>(false)

  const [creditData, setCreditData] = useState<CreditData | null>(null)

  const [audio] = useState(new Audio(submitSound))
  const [messageApi, contextHolder] = message.useMessage()

  const [tasMode, toggleTasMode] = useTasToggle() as [boolean, (next?: boolean) => void]
  const [onlyAssigned, toggleOnlyAssigned] = useAssignedToggle() as [boolean, (next?: boolean) => void]
  const [allowBid, setAllowBid] = useState<boolean>(true)

  const countdownRef = useRef<any>()

  const [pricesRefreshing, setPricesRefreshing] = useState(false)

  const { getOrderEntryDataBySpecialOfferId, submitOrder } = useOffersTyped()
  const submitOrderMutation = submitOrder()

  useEffect(() => {
    if (!selectedOffer?.SpecialOffer?.SpecialOfferId) return
    refreshEntryData()
  }, [selectedOffer?.SpecialOffer?.SpecialOfferId])

  useEffect(() => {
    if (!selectedItemMeta || isPriceExpired || !tradeTimer) return

    countdownRef.current = setInterval(() => {
      setTradeTimer((prev) => {
        if (!isDefinedAndNotNull(prev)) {
          return prev
        }
        if (prev < 1) {
          clearInterval(countdownRef.current)
          setIsPriceExpired(true)
          return prev
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownRef.current)
  }, [selectedItemMeta, isPriceExpired])

  function setCurrentFromDate(v: DateItem) {
    if (selectedItemMeta?.IsInternalUser) setCurrentFromDateTime(v)
  }
  function setCurrentToDate(v: DateItem) {
    if (selectedItemMeta?.IsInternalUser) setCurrentToDateTime(v)
  }

  const initializeFromEntryData = (resp: any) => {
    const {
      entryData: e,
      meta,
      tradeSelectedItem,
    } = mapEntryDataToContext(resp, selectedOffer?.SpecialOffer?.SpecialOfferId)
    setEntryData(e)
    setSelectedItemMeta(meta)

    //No timers for Offers
    setTradeTimer(null)

    setIsPriceExpired(false)
    setOrderStep('create')

    const { from, to } = getInitialDatesFromEntry(e.PromptDefaultDates, tradeSelectedItem)
    setCurrentFromDateTime(from)
    setCurrentToDateTime(to)
    setCreditData({
      creditHold: e?.CreditData?.creditStatus !== 'Normal',
      creditStatus: e?.CreditData?.creditStatus,
      totalCreditBalance: e?.CreditData?.EstimatedRemainingCreditBalance ?? 0,
      remainingCreditBalance: e?.CreditData?.EstimatedRemainingCreditBalance ?? 0,
      EstimatedRemainingCreditBalance: e?.CreditData?.EstimatedRemainingCreditBalance ?? 0,
    })

    setAllowBid(deriveAllowBid(resp?.Data))
  }

  const adjustPriceAdjustments = (form: any, quantity: number): string | null => {
    const { filtered, defaultKey } = adjustPriceAdjustmentsHelper(
      selectedItemMeta?.PriceAdjustments,
      quantity,
      selectedItemMeta?.Type === 'bid'
    )

    setAllowedPriceAdjustments(filtered)
    if (defaultKey) form.setFieldsValue({ PriceAdjustmentId: Number(defaultKey) })
    form.setFieldsValue({ Quantity: quantity })
    return defaultKey
  }

  const constructTrade = (): SubmitOrderRequest | null => {
    if (!pendingTrade || !selectedItemMeta) return null
    return buildSubmitOrderPayload(pendingTrade, selectedItemMeta, entryData)
  }

  const handleSubmitOrder: OffersContextValue['handleSubmitOrder'] = ({ clearOrderState }) => {
    const trade = constructTrade()
    if (!trade) return
    setDisableSubmit(true)
    submitOrderMutation
      .mutateAsync(trade)
      .then((response: any) => {
        if (!response?.Validations?.length) {
          clearOffer()
          setDisableSubmit(false)
          setHasPendingChanges(false)
          messageApi.open({
            type: undefined,
            icon: null,
            content: <OrderSuccess tradeEntryId={response?.Data?.TradeEntryId} />,
            duration: 15,
          })
          audio.play()
          setTradeTimer(entryData?.OrderTimeLimitInSeconds ?? null)
        } else {
          NotificationMessage('Error creating order', response?.Validations?.[0]?.Message, true)
        }
      })
      .catch((error: any) => {
        NotificationMessage(
          'Error creating order',
          error?.message || 'An error occurred while creating the order',
          true
        )
      })
      .finally(() => {
        clearOrderState()
        setDisableSubmit(false)
        setHasPendingChanges(false)
      })
  }

  const refreshEntryData = () => {
    if (!selectedOffer?.SpecialOffer?.SpecialOfferId) return
    setPricesRefreshing(true)
    getOrderEntryDataBySpecialOfferId(selectedOffer?.ItemKey)
      .then((resp: any) => {
        if (resp?.Validations?.length) {
          NotificationMessage('Error loading order data', resp.Validations[0]?.Message ?? 'Unknown error', true)
          return
        }
        initializeFromEntryData(resp)
      })
      .catch((err: any) => {
        NotificationMessage('Error loading order data', err?.message ?? 'Unknown error', true)
      })
      .finally(() => setPricesRefreshing(false))
  }

  const openOffer = (offer: AllSpecialOffersDisplayModel) => {
    setSelectedOffer(offer)
  }

  const clearOffer = () => {
    setIsPriceExpired(false)
    setPendingTrade(null)
    setTradeTimer(entryData?.OrderTimeLimitInSeconds ?? null)
    setIsDateOverrideActive(false)
    setAllowedPriceAdjustments([])
    setHasPendingChanges(false)
    setSelectedOffer(null)
    setSelectedItemMeta(null)
    setCurrentFromDate(null)
    setCurrentToDate(null)
    setOrderStep('create')
  }

  const value: OffersContextValue = useMemo(
    () => ({
      selectedOffer,
      setSelectedOffer,
      entryData,
      selectedItemMeta,
      setSelectedItemMeta,
      allowedPriceAdjustments,
      setAllowedPriceAdjustments,
      adjustPriceAdjustments,
      pendingTrade,
      setPendingTrade,
      hasPendingChanges,
      setHasPendingChanges,
      tradeTimer,
      setTradeTimer,
      isPriceExpired,
      setIsPriceExpired,
      disableSubmit,
      setDisableSubmit,
      pricesRefreshing,
      currentFromDate,
      setCurrentFromDate,
      currentToDate,
      setCurrentToDate,
      isDateOverrideActive,
      setIsDateOverrideActive,
      creditData,
      setCreditData,
      openOffer,
      clearOffer,
      refreshEntryData,
      handleSubmitOrder,
      orderStep,
      setOrderStep,
      tasMode,
      toggleTasMode,
      onlyAssigned,
      toggleOnlyAssigned,
      allowBid,
      setAllowBid,
      currentCounterParty,
    }),
    [
      currentCounterParty,
      selectedOffer,
      entryData,
      selectedItemMeta,
      allowedPriceAdjustments,
      pendingTrade,
      hasPendingChanges,
      tradeTimer,
      isPriceExpired,
      disableSubmit,
      pricesRefreshing,
      currentFromDate,
      currentToDate,
      isDateOverrideActive,
      creditData,
      orderStep,
      setOrderStep,
      allowBid,
      tasMode,
      toggleTasMode,
    ]
  )

  return (
    <OffersContext.Provider value={value}>
      {contextHolder}
      {children}
    </OffersContext.Provider>
  )
}

export const useOffersContext = () => {
  const ctx = useContext(OffersContext)
  if (!isDefinedAndNotNull(ctx)) throw new Error('OffersContext must be used within OffersProvider')
  return ctx
}
