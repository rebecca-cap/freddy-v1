import { dateFormat } from '@components/TheArmory/helpers'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Detail, Price } from '@modules/ContractManagement/api/types.schema'
import { DateChangeMultiplePriceControls } from '@modules/ContractManagement/components/DateChangeConfirm/DateChangeMultiplePriceControls'
import moment from 'moment'
import React, { useMemo } from 'react'

interface DateChangeMultiplePriceDisplayProps {
  dateDiffs: number[]
  setUseStartOverride: React.Dispatch<React.SetStateAction<boolean>>
  setUseEndOverride: React.Dispatch<React.SetStateAction<boolean>>
  startValue: number
  endValue: number
  setStartValue: React.Dispatch<React.SetStateAction<number>>
  setEndValue: React.Dispatch<React.SetStateAction<number>>
  useStartOverride: boolean
  useEndOverride: boolean
  detailsWithUpdatedDates?: Detail[]
  pricesWithUpdatedDates?: Price[]
  effectiveDates?: [moment.Moment, moment.Moment]
  details?: Detail[]
  prices?: Price[]
}

export function DateChangeMultiplePriceDisplay({
  detailsWithUpdatedDates = [],
  pricesWithUpdatedDates = [],
  dateDiffs,
  setUseStartOverride,
  setUseEndOverride,
  startValue,
  endValue,
  setStartValue,
  setEndValue,
  useStartOverride,
  useEndOverride,
  effectiveDates,
  details,
  prices,
}: DateChangeMultiplePriceDisplayProps) {
  // Function to extract relevant prices for constraint calculations
  function extractRelevantPrices() {
    if (prices && prices?.length > 1) {
      return prices
    }

    if (details && details?.length > 0) {
      // Only get prices from details that have multiple prices
      const detailsWithMultiplePrices = details.filter((detail) => (detail.Prices || []).length > 1)
      return detailsWithMultiplePrices.flatMap((detail) => detail.Prices || [])
    }

    return []
  }

  // Calculate min/max values for the InputNumber controls
  const { startMinValue, startMaxValue, endMinValue, endMaxValue } = useMemo(() => {
    if (effectiveDates) {
      const relevantPrices = extractRelevantPrices()

      if (relevantPrices.length > 0) {
        const fromDates = relevantPrices.map((price) => moment(price.FromDate))
        const toDates = relevantPrices.map((price) => moment(price.ToDate))

        const earliestFromDate = moment.min(fromDates)
        const latestToDate = moment.max(toDates)

        const contractStart = effectiveDates[0]
        const contractEnd = effectiveDates[1]

        // Calculate constraints
        const startMin = -earliestFromDate.diff(contractStart, 'days')
        const startMax = latestToDate.diff(earliestFromDate, 'days')

        const endMin = -startMax
        const endMax = contractEnd.diff(latestToDate, 'days')
        return {
          startMinValue: startMin,
          startMaxValue: startMax,
          endMinValue: endMin,
          endMaxValue: endMax,
        }
      }
    }

    return { startMinValue: undefined, startMaxValue: undefined, endMinValue: undefined, endMaxValue: undefined }
  }, [effectiveDates, prices, details])

  return (
    <Vertical className='p-2'>
      <DateChangeMultiplePriceControls
        dateDiffs={dateDiffs}
        endValue={endValue}
        setEndValue={setEndValue}
        startValue={startValue}
        setStartValue={setStartValue}
        useEndOverride={useEndOverride}
        setUseEndOverride={setUseEndOverride}
        useStartOverride={useStartOverride}
        setUseStartOverride={setUseStartOverride}
        startMinValue={startMinValue}
        startMaxValue={startMaxValue}
        endMinValue={endMinValue}
        endMaxValue={endMaxValue}
      />
      <Texto className='mt-3' category='p2'>
        Multiple Price Preview:
      </Texto>
      <div style={{ overflowY: 'scroll', maxHeight: '300px' }}>
        {pricesWithUpdatedDates?.length > 0 &&
          pricesWithUpdatedDates.map((price) => {
            return (
              <Horizontal key={`priceError-${price.LocalTradeEntryPriceId}`} verticalCenter style={{ gap: '5px' }}>
                <Horizontal flex={1} verticalCenter>
                  <Texto className='mr-2'>Type: </Texto>
                  <Texto>{price.ProvisionType}</Texto>
                </Horizontal>
                <Horizontal verticalCenter flex={1}>
                  <Texto className='mr-2'>From:</Texto>
                  <Texto>{moment(price.FromDate).format(dateFormat.DATE)}</Texto>
                </Horizontal>
                <Horizontal verticalCenter flex={1}>
                  <Texto className='mr-2'>To:</Texto>
                  <Texto>{moment(price.ToDate).format(dateFormat.DATE)}</Texto>
                </Horizontal>
              </Horizontal>
            )
          })}
        {detailsWithUpdatedDates?.length > 0 &&
          detailsWithUpdatedDates?.map((detail) => {
            if (!detail.Prices || detail.Prices.length < 2) return null
            return (
              <Vertical key={`detailError-${detail.TradeEntryDetailId}`}>
                <Texto weight='bold' className='mt-2'>
                  Detail: {detail.TradeEntryDetailId}
                </Texto>
                {detail.Prices.map((price) => {
                  return (
                    <Horizontal
                      key={`priceError-${price.LocalTradeEntryPriceId}`}
                      verticalCenter
                      style={{ gap: '5px' }}
                    >
                      <Horizontal flex={1} verticalCenter>
                        <Texto className='mr-2'>Type: </Texto>
                        <Texto>{price.ProvisionType}</Texto>
                      </Horizontal>
                      <Horizontal verticalCenter flex={1}>
                        <Texto className='mr-2'>From:</Texto>
                        <Texto>{moment(price.FromDate).format(dateFormat.DATE)}</Texto>
                      </Horizontal>
                      <Horizontal verticalCenter flex={1}>
                        <Texto className='mr-2'>To:</Texto>
                        <Texto>{moment(price.ToDate).format(dateFormat.DATE)}</Texto>
                      </Horizontal>
                    </Horizontal>
                  )
                })}
              </Vertical>
            )
          })}
      </div>
    </Vertical>
  )
}
