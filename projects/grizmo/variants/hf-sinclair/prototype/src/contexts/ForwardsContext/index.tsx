import { useForwards } from '@api/useForwards'
import { ForwardsContextResult } from '@contexts/ForwardsContext/index.types'
import { CreditData } from '@contexts/PromptContext/types.schema'
import { useUser } from '@contexts/UserContext'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import { useAssignedToggle } from '@hooks/useAssignedToggle'
import { useImpersonation } from '@hooks/useImpersonation'
import { hasIndexGaps } from '@modules/SellingPlatform/BuyNow/Forwards/components/Grid/utils'
import { useTasToggle } from '@utils/hooks/useTasToggle'
import { isDefinedAndNotNull } from '@utils/index'
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const ForwardsContext = createContext<ForwardsContextResult | null>(null)

export function ForwardsProvider({ children }) {
  const { securityContext } = useUser()
  const [tasMode, toggleTasMode] = useTasToggle()
  const [currentCounterParty] = useImpersonation()
  const [onlyAssigned, toggleOnlyAssigned] = useAssignedToggle()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [error, setError] = useState('')
  const { value: selectedMarketInstrumentId, setValue: setSelectedMarketInstrumentId } = useLocalStorage(
    'BuyNowForwardTab',
    null
  )
  const [marketPlatformInstrument, setMarketPlatformInstrument] = useState<any>(null)
  const [selectedGridCells, setSelectedGridCells] = useState<any[]>([])
  const [deliveryPeriods, setDeliveryPeriods] = useState([])

  const [creditData, setCreditData] = useState<CreditData | null>(null)

  const hasBadSelection = useMemo(() => {
    if (marketPlatformInstrument?.HasDeliveryPeriodGroups && selectedGridCells.length > 1) return true
    if (selectedGridCells.some((c) => c.rowIndex !== selectedGridCells[0].rowIndex)) return true
    if (hasIndexGaps(selectedGridCells.map((c) => c.cellIndex))) return true
    if (selectedGridCells.some((c) => c.cellIndex < 0)) return true
    return false
  }, [selectedGridCells])

  const selectedPeriodIds = useMemo(() => selectedGridCells.map((c) => c.cell.ItemKey), [selectedGridCells])

  const { getMarketPlatformInstruments, loadForwardPrices, getOrderEntryInfo, refetchOrderEntryInfo, submitOrder } =
    useForwards()
  const { data: marketPlatformInstruments } = getMarketPlatformInstruments()
  const { data: availableItems, isFetching: areItemsLoading } = loadForwardPrices(
    marketPlatformInstrument?.MarketPlatformInstrumentId,
    onlyAssigned
  )
  const { data: orderEntryInfo } = getOrderEntryInfo(selectedPeriodIds, onlyAssigned)

  useEffect(() => {
    if (orderEntryInfo !== undefined) {
      setDeliveryPeriods(
        orderEntryInfo?.Data?.SelectedItems?.map((c) => {
          return {
            ...c,
            DisplayName: c.DeliveryPeriodName,
            orderVolume:
              deliveryPeriods?.find(
                (dp) => dp?.ItemKey?.DeliveryPeriodConfigurationId === c?.ItemKey?.DeliveryPeriodConfigurationId
              )?.orderVolume || 0,
            salePrice: c.Price,
          }
        })
      )
    }
  }, [orderEntryInfo])

  const tradeTimeLimit = useMemo(
    () => orderEntryInfo?.Data?.OrderTimeLimitInSeconds ?? undefined,
    [orderEntryInfo?.Data?.OrderTimeLimitInSeconds]
  )
  const validSubtypes = useMemo(() => orderEntryInfo?.Data?.ValidSubtypes, [orderEntryInfo])

  const [isPriceExpired, setIsPriceExpired] = useState(false)
  const [tradeTimer, setTradeTimer] = useState(tradeTimeLimit) // might need to pull from response
  const counterRef = useRef(null)

  const clearTradeTimer = () => {
    destroyTimerInterval()
    setIsPriceExpired(false)
    setTradeTimer(tradeTimeLimit)
  }

  const destroyTimerInterval = () => clearInterval(counterRef.current)

  const initializeTimerInterval = () => {
    if (counterRef?.current) {
      destroyTimerInterval()
    }
    counterRef.current = setInterval(() => {
      setTradeTimer((prevTimer) => {
        if (tradeTimeLimit) {
          const currTime = prevTimer ?? tradeTimeLimit + 1
          if (currTime < 1) {
            clearInterval(counterRef.current)
            setIsPriceExpired(true)
            return prevTimer
          }
          return currTime - 1
        }
        return prevTimer
      })
    }, 1000)
  }

  useEffect(() => {
    if (!isModalVisible) {
      clearTradeTimer()
    } else {
      initializeTimerInterval()
    }
    return () => destroyTimerInterval()
  }, [isModalVisible])

  const forwardInstruments = useMemo(
    () => marketPlatformInstruments?.Data?.filter((i) => i.TradeTypeMeaning === 'Forward'),
    [marketPlatformInstruments]
  )

  const hasTasInstruments = useMemo(() => forwardInstruments?.some((i) => i.IsTas), [forwardInstruments])

  useEffect(() => {
    handleMPIResponse()
  }, [securityContext, tasMode, forwardInstruments, selectedMarketInstrumentId, availableItems])

  const handleMPIResponse = () => {
    if (forwardInstruments) {
      if (!hasTasInstruments && toggleTasMode) {
        toggleTasMode(false)
      }

      if (forwardInstruments.length > 0) {
        // find the instrument that is in local storage and set that as the selected market instrument
        // if the storage key is old / invalid, then take the first instrument and set that as selected
        const selectedMPI =
          forwardInstruments.find(
            (item) => item.MarketPlatformInstrumentId?.toString() === selectedMarketInstrumentId?.toString()
          ) ?? forwardInstruments[0]

        setMarketPlatformInstrument(selectedMPI)
        setSelectedMarketInstrumentId(selectedMPI?.MarketPlatformInstrumentId)
        setCreditData({
          creditHold: availableItems?.Data?.CreditStatus !== 'Normal',
          creditStatus: availableItems?.Data?.CreditStatus,
          totalCreditBalance: availableItems?.Data?.EstimatedRemainingCreditBalance,
          remainingCreditBalance: availableItems?.Data?.EstimatedRemainingCreditBalance,
        })
      }
    }
  }
  const contextValue = useMemo(
    () => ({
      clearTradeTimer,
      initializeTimerInterval,
      isPriceExpired,
      tradeTimer,
      isModalVisible,
      setIsModalVisible,
      refetchOrderEntryInfo,
      availableItems,
      areItemsLoading,
      orderEntryInfo,
      marketPlatformInstrument,
      hasTasInstruments,
      tasMode,
      toggleTasMode,
      hasBadSelection,
      selectedGridCells,
      setSelectedGridCells,
      selectedPeriodIds,
      error,
      setError,
      deliveryPeriods,
      setDeliveryPeriods,
      submitOrder,
      validSubtypes,
      onlyAssigned,
      toggleOnlyAssigned,
      forwardInstruments,
      selectedMarketInstrumentId,
      setSelectedMarketInstrumentId,
      currentCounterParty,
      creditData,
    }),
    [
      clearTradeTimer,
      initializeTimerInterval,
      isPriceExpired,
      tradeTimer,
      isModalVisible,
      setIsModalVisible,
      refetchOrderEntryInfo,
      availableItems,
      areItemsLoading,
      orderEntryInfo,
      marketPlatformInstrument,
      hasTasInstruments,
      tasMode,
      toggleTasMode,
      hasBadSelection,
      selectedGridCells,
      setSelectedGridCells,
      selectedPeriodIds,
      error,
      setError,
      deliveryPeriods,
      setDeliveryPeriods,
      submitOrder,
      validSubtypes,
      onlyAssigned,
      toggleOnlyAssigned,
      forwardInstruments,
      selectedMarketInstrumentId,
      setSelectedMarketInstrumentId,
      currentCounterParty,
      creditData,
    ]
  )
  return <ForwardsContext.Provider value={contextValue}>{children}</ForwardsContext.Provider>
}

export const useForwardsCreation = () => {
  const context = useContext(ForwardsContext)
  if (!isDefinedAndNotNull(context)) {
    throw new Error('Context must be used within a Provider')
  }
  return context
}
