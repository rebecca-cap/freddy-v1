import { useCredential } from '@api/useCredential'
import { usePrompt } from '@api/usePrompt'
import {
  Item,
  ItemGroup,
  MarketPlatformInstrumentsData,
  PromptDefaultDates,
  SelectedPromptItem,
} from '@api/usePrompt/types.schema'
import submitSound from '@assets/sounds/pristine-609.mp3'
import { dateFormat } from '@components/TheArmory/helpers'
import {
  CreditData,
  DateItem,
  MarketPlatformInstrument,
  PendingTradePayload,
  PriceAdjustment,
  Prompt,
  SelectedItemMetadata,
} from '@contexts/PromptContext/types.schema'
import { NotificationMessage, useLocalStorage } from '@gravitate-js/excalibrr'
import { useAssignedToggle } from '@hooks/useAssignedToggle'
import { useImpersonation } from '@hooks/useImpersonation'
import { useTasToggle } from '@hooks/useTasToggle'
import { OrderSuccess } from '@modules/SellingPlatform/BuyNow/Prompt/components/OrderSuccess'
import { isDefinedAndNotNull } from '@utils/index'
import { message } from 'antd'
import moment from 'moment'
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'

const PromptContext = createContext<Prompt | null>(null)

export const PromptProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [marketInstrumentList, setMarketInstrumentList] = useState<MarketPlatformInstrumentsData[] | null>(null)
  const [marketPlatformInstrument, setMarketPlatformInstrument] = useState<MarketPlatformInstrument | null>(null)
  const [creditData, setCreditData] = useState<CreditData | null>(null)

  const [selectedItem, setSelectedItem] = useState<SelectedPromptItem | null>(null)
  const [selectedItemMeta, setSelectedItemMeta] = useState<SelectedItemMetadata | null>(null)
  const [allowedPriceAdjustments, setAllowedPriceAdjustments] = useState<PriceAdjustment[] | []>([])

  const [pendingTrade, setPendingTrade] = useState<PendingTradePayload | null>(null)
  const [pendingChanges, setPendingChanges] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(false)

  const [audio] = useState(new Audio(submitSound))
  const [showConfetti, setShowConfetti] = useState(false)

  const [orderStep, setOrderStep] = useState<'create' | 'confirm'>('create')
  const [loading, setLoading] = useState(true)

  const [orderItems, setOrderItems] = useState<ItemGroup[] | []>([])

  const [tasMode, toggleTasMode] = useTasToggle()
  const [onlyAssigned, toggleOnlyAssigned] = useAssignedToggle()
  const [allowBid, setAllowBid] = useState(true)
  const [marketClosed, setMarketClosed] = useState(false)
  const [currentCounterParty] = useImpersonation()
  const [currentFromDate, setCurrentFromDateTime] = useState<DateItem>(null)
  const [currentToDate, setCurrentToDateTime] = useState<DateItem>(null)
  const [isDateOverrideActive, setIsDateOverrideActive] = useState<boolean>(false)

  const { value: selectedMarketInstrumentId, setValue: setSelectedMarketInstrumentId } = useLocalStorage<number | null>(
    'BuyNowPromptTab',
    null
  )
  function setCurrentToDate(value: DateItem) {
    if (selectedItemMeta?.IsInternalUser) {
      setCurrentToDateTime(value)
    }
  }
  function setCurrentFromDate(value: DateItem) {
    if (selectedItemMeta?.IsInternalUser) {
      setCurrentFromDateTime(value)
    }
  }
  const { useUserInfoQuery } = useCredential()
  const { data: user } = useUserInfoQuery()
  const isInternalUser = user?.Data?.AllowedImpersonationModes?.includes('All')

  const { getMarketPlatformInstruments, getItemsAvailableForOrder, getOrderEntryData, submitOrder } = usePrompt()
  const { data: marketPlatformInstruments } = getMarketPlatformInstruments()
  const {
    data: itemsAvailableForOrder,
    refetch: refreshItemsAvailableForOrder,
    isFetching: pricesRefreshing,
  } = getItemsAvailableForOrder(
    marketPlatformInstrument?.MarketPlatformInstrumentId,
    marketPlatformInstrument?.AutoRefreshIntervalInSeconds,
    onlyAssigned
  )
  const {
    data: tradeEntryData,
    isFetching: isFetchingCreateData,
    refetch: refreshTradeEntryData,
  } = getOrderEntryData(selectedItem?.MarketPlatformItems[0]?.ItemKey, onlyAssigned)

  const countdownRef = useRef()
  const [isPriceExpired, setIsPriceExpired] = useState(false)
  const [tradeTimer, setTradeTimer] = useState<number | null>(tradeEntryData?.Data?.OrderTimeLimitInSeconds || null)

  const [messageApi, contextHolder] = message.useMessage()

  // 1. we wait on the query to get market instruments, then loadMPI
  useEffect(() => {
    if (marketPlatformInstruments) loadMPI()
  }, [marketPlatformInstruments, tasMode, selectedMarketInstrumentId])

  // 2. Once we have a market platform instrument then we get the prices
  useEffect(() => {
    if (marketPlatformInstrument?.MarketPlatformInstrumentId) loadPrices()
  }, [itemsAvailableForOrder])

  // 3. The trade entry data query will run when the selected row changes,
  // once we get new
  // trade entry data, we can clear old trade and set up new trade

  useEffect(() => {
    initializeOrder()
    setDisableSubmit(false)
  }, [tradeEntryData])

  useEffect(() => {
    if (selectedItemMeta && !isPriceExpired && tradeTimer) {
      setTradeTimer(tradeTimer)

      countdownRef.current = setInterval(() => {
        setTradeTimer((prevTimer: number | null) => {
          if (!isDefinedAndNotNull(prevTimer)) return prevTimer
          if (prevTimer < 1) {
            clearInterval(countdownRef.current) // Stop the countdown when the timer reaches 0
            setIsPriceExpired(true)
            return prevTimer // Return 0 to update the state
          }
          return prevTimer - 1 // Decrement the timer by 1 second
        })
      }, 1000)
    }

    return () => {
      clearInterval(countdownRef.current)
    }
  }, [selectedItemMeta, isPriceExpired])

  const promptInstruments = useMemo(
    () => marketPlatformInstruments?.Data?.filter((i) => i.TradeTypeMeaning === 'Prompt') ?? [],
    [marketPlatformInstruments]
  )

  const loadMPI = () => {
    if (marketPlatformInstruments) {
      setMarketInstrumentList(promptInstruments)

      if (!promptInstruments.find((instrument) => instrument.IsTas)) {
        toggleTasMode(false)
      }

      if (promptInstruments.length > 0) {
        // find the instrument that is in local storage and set that as the selected market instrument
        // if the storage key is old / invalid, then take the first instrument and set that as selected
        const selectedMPI =
          promptInstruments.find(
            (item) => item.MarketPlatformInstrumentId?.toString() === selectedMarketInstrumentId?.toString()
          ) ?? promptInstruments[0]
        setMarketPlatformInstrument(selectedMPI)
        setAllowBid(selectedMPI.AllowBid)
        setSelectedMarketInstrumentId(selectedMPI?.MarketPlatformInstrumentId)
      }
    }
  }

  const hasTasInstruments = useMemo(
    () => marketPlatformInstruments?.Data.some((i) => i.IsTas) && !!marketPlatformInstruments?.Data.length,
    [marketPlatformInstruments]
  )

  const loadPrices = () => {
    if (itemsAvailableForOrder) {
      if (itemsAvailableForOrder?.Validations[0]) {
        setMarketClosed(true)
      }

      setCreditData({
        creditHold: itemsAvailableForOrder?.Data?.CreditStatus !== 'Normal',
        creditStatus: itemsAvailableForOrder?.Data?.CreditStatus,
        totalCreditBalance: itemsAvailableForOrder?.Data?.EstimatedRemainingCreditBalance ?? undefined,
        remainingCreditBalance: itemsAvailableForOrder?.Data?.EstimatedRemainingCreditBalance ?? undefined,
      })

      setOrderItems(itemsAvailableForOrder?.Data?.ItemGroups)
      setLoading(false)
    }
  }

  function setupCurrentDates(promptDefaultDates: PromptDefaultDates, tradeSelectedItem: Item) {
    setCurrentFromDateTime(promptDefaultDates.DefaultStartDate)
    if (tradeSelectedItem.PriceAdjustmentDetails?.length === 0) setCurrentToDateTime(promptDefaultDates.DefaultEndDate)
  }

  const initializeOrder = () => {
    const tradeData = tradeEntryData?.Data
    const tradeSelectedItem = tradeData?.SelectedItems[0]
    setOrderStep('create')
    setTradeTimer(tradeData?.OrderTimeLimitInSeconds || null)
    const createSelectList = (keyList, selected?) => {
      return Object.keys(keyList).map((key, index) => ({
        key,
        value: keyList[key],
        selected: selected ? selected === key : index === 0,
      }))
    }
    if (tradeData && tradeSelectedItem) {
      if (tradeData.PromptDefaultDates) setupCurrentDates(tradeData.PromptDefaultDates, tradeSelectedItem)

      const newMetadata = {
        PromptDefaultDates: tradeData.PromptDefaultDates,
        ShowDateOverrideFields: tradeData.ShowDateOverrideFields,
        DateOverrideMaxDate: tradeData.DateOverrideMaxDate,
        DateOverrideMinDate: tradeData.DateOverrideMinDate,
        IsInternalUser: tradeData.IsInternalUser,
        ProductName: tradeSelectedItem?.ProductName,
        LocationName: tradeSelectedItem?.LocationName,
        Price: tradeSelectedItem?.Price,
        Margin: tradeSelectedItem?.Margin,
        OverridePrice: tradeSelectedItem?.Price,
        AdditionalItems: tradeSelectedItem?.AdditionalItems?.map((item) => ({
          ...item,
          selected: false,
          key: item.ItemKey.TradeEntrySetupId.toString(),
        })),
        ExternalColleagueOverride: tradeData.ExternalColleagueOverrideList
          ? createSelectList(tradeData.ExternalColleagueOverrideList)
          : [],
        InternalCounterPartyOverride: tradeData?.InternalCounterPartyOverrideList
          ? createSelectList(
              tradeData.InternalCounterPartyOverrideList,
              tradeSelectedItem?.Defaults?.DefaultCounterPartyId?.toString()
            )
          : [],
        IndexPrice: tradeSelectedItem?.IndexPrice,
        Defaults: tradeSelectedItem?.Defaults,
        Constraints: tradeSelectedItem?.Constraints,
        ItemKey: tradeSelectedItem?.ItemKey,
        FuturesMonth: moment(tradeSelectedItem?.FuturesMonth),
        BidExpiration: tradeSelectedItem?.Defaults?.DefaultBidExpiration,
        MaxBidExpiration: tradeSelectedItem?.Constraints?.MaximumBidExpiration,
        LoadingNumbersList: tradeSelectedItem?.LoadingNumbersList.map((item) => ({
          ...item,
          selected: tradeSelectedItem.LoadingNumbersList.length === 1,
          key: item.LoadingNumberId,
        })),
        DestinationStates: tradeSelectedItem?.DestinationLocations.map((item) => ({
          ...item,
          selected: tradeSelectedItem.DestinationLocations.length === 1,
          key: item.LocationId,
        })),
        PriceAdjustments: tradeSelectedItem?.PriceAdjustmentDetails.map((item) => ({
          ...item,
          key: item.MarketPlatformPriceAdjustmentDetailId,
        })),
        LiftingLocationsList: tradeSelectedItem?.LiftingLocations.map((item) => ({
          ...item,
          key: item.LocationId,
        })),
        Type: 'market',
        CreditData: {
          creditHold: tradeData.CreditData.CreditStatus !== 'Normal',
          totalCreditBalance: tradeData.CreditData.EstimatedRemainingCreditBalance,
          remainingCreditBalance: tradeData.CreditData.EstimatedRemainingCreditBalance,
        },
        TradeNote: '',
        ExternalNotification: true,
      }

      setSelectedItemMeta(newMetadata)
    }
  }

  const clearOrder = () => {
    setIsPriceExpired(false)
    setPendingTrade(null)
    setOrderStep('create')
    setTradeTimer(tradeEntryData?.Data?.OrderTimeLimitInSeconds || null)
    setIsDateOverrideActive(false)
    setAllowedPriceAdjustments([])
    setPendingChanges(false)
    setSelectedItem(null)
    setCurrentFromDate(null)
    setCurrentToDate(null)
  }

  const adjustPriceAdjustments = (form, quantity) => {
    // get updated list that the user can select from based on quantity
    const updatedList = selectedItemMeta?.PriceAdjustments.filter(
      (price) => price.QuantityFrom <= quantity && price.QuantityTo >= quantity
    )

    // get the current selection user had
    const prevSelectedId = form.getFieldValue('PriceAdjustmentId')

    // if the item is still in the list, we dont need to do anything, since the form value still has it

    // but if its not in the list, we need to deselect / reset the form
    const resetSelection =
      prevSelectedId && updatedList.findIndex((a) => a.MarketPlatformPriceAdjustmentDetailId === prevSelectedId) < 0
    if (resetSelection) {
      form.setFieldsValue({ PriceAdjustmentId: null })
    }
    let itemKey = null

    // if have only one, then go ahead and select it as default
    if (updatedList.length === 1 && selectedItemMeta.Type !== 'bid') {
      itemKey = updatedList[0].key
      form.setFieldsValue({ PriceAdjustmentId: itemKey })
    }

    if (updatedList.length > 1) {
      const bestPriceAdjustment = updatedList.find((item) => item.AdjustmentPrice === 0)
      if (bestPriceAdjustment) {
        itemKey = bestPriceAdjustment.key
        form.setFieldsValue({ PriceAdjustmentId: itemKey })
      }
    }

    setAllowedPriceAdjustments(updatedList || [])
    form.setFieldsValue({ Quantity: quantity })
    return itemKey
  }

  const constructTrade = () => {
    const isBid = pendingTrade.Type === 'bid'
    // grab additional products that were selected
    const selectedAdditionalItems = selectedItemMeta.AdditionalItems.filter((p) =>
      pendingTrade.SelectedItems.map((item) => item.key).includes(p.key)
    ).map((item) => ({
      ItemKey: item.ItemKey,
    }))

    const selectedLoadingNumbers =
      pendingTrade.LoadingNumbersIds && Array.isArray(pendingTrade.LoadingNumbersIds)
        ? pendingTrade.LoadingNumbers
        : pendingTrade.LoadingNumbersIds
        ? [pendingTrade.LoadingNumbersIds]
        : []
    const DestinationLocationIds = pendingTrade?.DestinationStatesIds

    // total adjustment price from the selected adjustment
    const totalAdjustmentPrice = selectedItemMeta.PriceAdjustments?.map((a) =>
      a.MarketPlatformPriceAdjustmentDetailId === pendingTrade.PriceAdjustmentId ? a.AdjustmentPrice : 0
    ).reduce((a, b) => a + b, 0)
    const newTrade = {
      Notes: pendingTrade.Notes,
      Items: [
        {
          Volume: pendingTrade.Quantity,
          LoadingNumberIds: selectedLoadingNumbers.map((loadingNumber) => loadingNumber.LoadingNumberId),
          DestinationLocationIds,
          LiftingLocationIds: [],
          ItemKey: pendingTrade.ItemKey,
          MarketPlatformPriceAdjustmentDetailId: isBid ? null : pendingTrade.PriceAdjustmentId,
          SelectedAdditionalItems: selectedAdditionalItems,
          OverridePrice: !isBid ? pendingTrade.Price + totalAdjustmentPrice : undefined,
          OverrideIndexPrice: !isBid ? pendingTrade.IndexPrice : undefined,
        },
      ],
      IsBid: isBid,
      BidPrice: isBid ? pendingTrade?.Price : undefined,
      BidExpiry: isBid ? moment(pendingTrade?.BidExpiration)?.format(dateFormat.ISO_V2) : undefined,
      ExternalColleagueOverride: pendingTrade?.ExternalColleagueId,
      InternalCounterPartyOverride: pendingTrade?.InternalCounterPartyId,
      OverridePrice: !isBid ? pendingTrade.Price + totalAdjustmentPrice : undefined,
      OverrideIndexPrice: !isBid ? pendingTrade.IndexPrice : undefined,
      ShouldSendExternalNotification: pendingTrade.ExternalNotification,
      State: tradeEntryData?.Data?.State,
      OverrideStartDate: pendingTrade?.OverrideStartDate
        ? moment(pendingTrade.OverrideStartDate).format(dateFormat.ISO_V2)
        : null,
      OverrideEndDate: pendingTrade?.OverrideEndDate
        ? moment(pendingTrade.OverrideEndDate).format(dateFormat.ISO_V2)
        : null,
    }

    const { ShouldSendExternalNotification, ...externalTrade } = newTrade

    if (selectedItemMeta.IsInternalUser) {
      return newTrade
    }
    return externalTrade
  }

  const handleSubmitOrder = ({ clearOrderState }: { clearOrderState: () => void }) => {
    const newTrade = constructTrade()
    setDisableSubmit(true)
    submitOrder(newTrade)
      .then((response) => {
        if (!response?.Validations?.length) {
          clearOrder()
          setDisableSubmit(false)
          setPendingChanges(false)
          messageApi.open({
            type: null,
            icon: null,
            content: <OrderSuccess tradeEntryId={response?.Data?.TradeEntryId} />,
            duration: 15,
          })
          setShowConfetti(true)
          audio.play()
          const timer = setTimeout(() => {
            setShowConfetti(false)
          }, 5000)
          setTradeTimer(tradeEntryData?.Data?.OrderTimeLimitInSeconds)
        } else {
          NotificationMessage('Error creating order', response?.Validations[0]?.Message)
        }
      })
      .catch((error) => {
        NotificationMessage('Error creating order', error?.message || 'An error occurred while creating the order')
      })
      .finally(() => {
        clearOrder()
        setDisableSubmit(false)
        setPendingChanges(false)
        clearOrderState()
      })
  }
  const contextValue = useMemo(
    () => ({
      selectedItem,
      setSelectedItem,
      loading,
      setLoading,
      orderItems,
      selectedItemMeta,
      setSelectedItemMeta,
      adjustPriceAdjustments,
      allowedPriceAdjustments,
      setAllowedPriceAdjustments,
      orderStep,
      setOrderStep,
      pendingTrade,
      setPendingTrade,
      handleSubmitOrder,
      tasMode,
      toggleTasMode,
      onlyAssigned,
      toggleOnlyAssigned,
      disableSubmit,
      setDisableSubmit,
      showConfetti,
      setShowConfetti,
      isFetchingCreateData,
      pendingChanges,
      setPendingChanges,
      tradeTimer,
      setTradeTimer,
      isPriceExpired,
      setIsPriceExpired,
      refreshItemsAvailableForOrder,
      refreshTradeEntryData,
      pricesRefreshing,
      hasTasInstruments,
      clearOrder,
      promptInstruments,
      selectedMarketInstrumentId,
      setSelectedMarketInstrumentId,
      currentCounterParty,
      allowBid,
      isInternalUser,
      marketClosed,
      isDateOverrideActive,
      setIsDateOverrideActive,
      currentFromDate,
      setCurrentFromDate,
      currentToDate,
      setCurrentToDate,
      creditData,
    }),
    [
      selectedItem,
      setSelectedItem,
      loading,
      setLoading,
      orderItems,
      selectedItemMeta,
      setSelectedItemMeta,
      adjustPriceAdjustments,
      allowedPriceAdjustments,
      setAllowedPriceAdjustments,
      orderStep,
      setOrderStep,
      pendingTrade,
      setPendingTrade,
      handleSubmitOrder,
      tasMode,
      toggleTasMode,
      onlyAssigned,
      toggleOnlyAssigned,
      disableSubmit,
      setDisableSubmit,
      showConfetti,
      setShowConfetti,
      isFetchingCreateData,
      pendingChanges,
      setPendingChanges,
      tradeTimer,
      setTradeTimer,
      isPriceExpired,
      setIsPriceExpired,
      refreshItemsAvailableForOrder,
      refreshTradeEntryData,
      pricesRefreshing,
      hasTasInstruments,
      clearOrder,
      promptInstruments,
      selectedMarketInstrumentId,
      setSelectedMarketInstrumentId,
      currentCounterParty,
      allowBid,
      isInternalUser,
      marketClosed,
      isDateOverrideActive,
      setIsDateOverrideActive,
      currentFromDate,
      setCurrentFromDate,
      currentToDate,
      setCurrentToDate,
      creditData,
    ]
  )

  return (
    <PromptContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </PromptContext.Provider>
  )
}

export const usePromptContext = () => {
  const context = useContext(PromptContext)
  if (!isDefinedAndNotNull(context)) {
    throw new Error('Context must be used within a Provider')
  }
  return context
}
