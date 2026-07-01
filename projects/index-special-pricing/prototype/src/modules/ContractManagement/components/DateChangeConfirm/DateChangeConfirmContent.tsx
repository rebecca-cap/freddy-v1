import { useContractManagementContext } from '@contexts/ContractManagement'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Detail, Price } from '@modules/ContractManagement/api/types.schema'
import { DateChangeMultiplePriceDisplay } from '@modules/ContractManagement/components/DateChangeConfirm/DateChangeMultiplePriceDisplay'
import { ConfirmTypes } from '@modules/ContractManagement/utils'
import type { FormInstance } from 'antd'
import dayjs from '@utils/dayjs'
import type { Dayjs } from '@utils/dayjs'
import React, { useEffect, useMemo, useState } from 'react'

export type ConfirmTypeStrings = 'ALL_PRICES' | 'ALL_DETAILS' | ''
export type ErrorPriceDate = {
  localDetailId: string
  localPriceId: number | string
  detail: number | string
  price: number | string
  error: string[]
}
interface DateChangeConfirmContentProps {
  setIsShowingDateConfirm: React.Dispatch<React.SetStateAction<boolean>>
  dateDiffs: number[]
  effectiveDates?: [Dayjs, Dayjs]
  form?: FormInstance
  details?: Detail[]
  prices?: Price[]
  confirmType?: ConfirmTypeStrings
  updateCascadeDates?: (prices: Price[]) => void
}
export function DateChangeConfirmContent({
  setIsShowingDateConfirm,
  dateDiffs,
  details,
  prices,
  form,
  confirmType,
  effectiveDates,
  updateCascadeDates,
}: DateChangeConfirmContentProps) {
  const { getUpdatedQuantities } = useContractManagementContext()
  const [useStartOverride, setUseStartOverride] = useState(false)
  const [startValue, setStartValue] = useState(dateDiffs[0])
  const [useEndOverride, setUseEndOverride] = useState(false)
  const [endValue, setEndValue] = useState(dateDiffs[1])

  useEffect(() => {
    if (confirmType !== ConfirmTypes.ALL_DETAILS) {
      setUseStartOverride(false)
      setUseEndOverride(false)
      setStartValue(dateDiffs[0])
      setEndValue(dateDiffs[1])
    }
  }, [confirmType, dateDiffs])

  const title = useMemo(() => {
    if (confirmType === ConfirmTypes.ALL_PRICES) return 'price and detail in this contract'
    if (confirmType === ConfirmTypes.ALL_DETAILS) return 'detail in this contract'
    return 'price in this detail'
  }, [confirmType])

  const pricesWithUpdatedDates = useMemo(() => {
    if (!prices) return []
    return prices.map((price) => ({
      ...price,
      FromDate: dayjs(price.FromDate).add(useStartOverride ? startValue : dateDiffs[0], 'days'),
      ToDate: dayjs(price.ToDate).add(useEndOverride ? endValue : dateDiffs[1], 'days'),
    }))
  }, [prices, startValue, endValue, useStartOverride, useEndOverride, dateDiffs])

  const detailsWithUpdatedDates = useMemo(() => {
    if (!details || !form || !effectiveDates) return []
    return details.map((detail) => {
      const updatedQuantities = getUpdatedQuantities(detail, effectiveDates)
      const newTotalQuantity = updatedQuantities?.reduce((sum, q) => sum + q.Quantity, 0) || 0

      return {
        ...detail,
        Quantity: newTotalQuantity, // Update the main quantity field
        Prices:
          detail.Prices.length === 1
            ? detail.Prices.map((price) => ({ ...price, ToDate: effectiveDates[1], FromDate: effectiveDates[0] }))
            : detail.Prices.map((price) => ({
                ...price,
                FromDate: dayjs(price.FromDate).add(useStartOverride ? startValue : dateDiffs[0], 'days'),
                ToDate: dayjs(price.ToDate).add(useEndOverride ? endValue : dateDiffs[1], 'days'),
              })),
        ToDateTime: effectiveDates[1],
        FromDateTime: effectiveDates[0],
        EffectiveDates: [effectiveDates[0], effectiveDates[1]],
        Quantities: updatedQuantities,
      }
    })
  }, [details, startValue, endValue, useStartOverride, useEndOverride, dateDiffs, form])

  const errorPriceDates = useMemo(() => {
    if (!detailsWithUpdatedDates || !effectiveDates || confirmType !== ConfirmTypes.ALL_PRICES) return []
    const errors: ErrorPriceDate[] = []
    detailsWithUpdatedDates?.forEach((detail) => {
      let hasOverlap = false
      for (let i = 1; i < detail.Prices.length; i++) {
        const currentPrice = detail.Prices[i]
        const previousPrice = detail.Prices[i - 1]
        if (dayjs(previousPrice.ToDate).isSameOrAfter(dayjs(currentPrice.FromDate))) {
          hasOverlap = true
          break
        }
      }
      if (hasOverlap) {
        errors.push({
          localDetailId: detail.LocalTradeEntryDetailId,
          localPriceId: '',
          detail: detail.TradeEntryDetailId || '',
          price: 'Multiple Prices',
          error: ['Overlapping Price Dates'],
        })
        return
      }
      detail.Prices.forEach((price, index) => {
        const errorList: string[] = []
        if (dayjs(price.FromDate).isAfter(dayjs(effectiveDates[1]))) {
          errorList.push('From Date is after Contract End Date')
        }
        if (dayjs(price.ToDate).isBefore(dayjs(effectiveDates[0]))) {
          errorList.push('To Date is before Contract Start Date')
        }
        if (dayjs(price.FromDate).isAfter(dayjs(price.ToDate))) {
          errorList.push('From Date is after To Date')
        }
        if (errorList.length > 0) {
          errors.push({
            localDetailId: detail.LocalTradeEntryDetailId,
            localPriceId: price.LocalTradeEntryPriceId,
            error: errorList,
            detail: detail.TradeEntryDetailId || 'New Detail',
            price: price.TradeEntryPriceId || 'New Price',
          })
        }
      })
    })

    return errors
  }, [detailsWithUpdatedDates, effectiveDates, confirmType])

  const showMultiplePrices = useMemo(() => {
    const detailWithMultiplePrices = detailsWithUpdatedDates?.filter((detail) => detail.Prices.length > 1)
    return (
      confirmType === ConfirmTypes.ALL_PRICES &&
      (pricesWithUpdatedDates?.length > 1 || detailWithMultiplePrices?.length > 0)
    )
  }, [confirmType, detailsWithUpdatedDates, pricesWithUpdatedDates])
  return (
    <Vertical>
      <Vertical className='px-3 mb-3'>
        {!errorPriceDates.length && (
          <Texto className='my-2'>Are you sure you want to change the dates on every {title}?</Texto>
        )}
        {errorPriceDates.length > 0 && (
          <Vertical gap='10px'>
            <Texto className='my-1'>Warning: The following details have prices that are invalid:</Texto>

            {errorPriceDates.map((err) => (
              <Vertical key={`errorDescription-${err.detail}-${err.price}`}>
                <Texto className='ml-2'>Detail: {err.detail}</Texto>
                <Texto className='ml-2'> Error: {err.error.map((error) => error).join(', ')}</Texto>
              </Vertical>
            ))}
            <Horizontal className='my-2'>
              <Texto>
                Check Set Dates: Prices to match price dates to detail dates, or manually adjust each price.
              </Texto>
            </Horizontal>
          </Vertical>
        )}
        {showMultiplePrices && (
          <DateChangeMultiplePriceDisplay
            detailsWithUpdatedDates={detailsWithUpdatedDates}
            dateDiffs={dateDiffs}
            setUseStartOverride={setUseStartOverride}
            setUseEndOverride={setUseEndOverride}
            useStartOverride={useStartOverride}
            useEndOverride={useEndOverride}
            startValue={startValue}
            setStartValue={setStartValue}
            endValue={endValue}
            setEndValue={setEndValue}
            pricesWithUpdatedDates={pricesWithUpdatedDates}
            effectiveDates={effectiveDates}
            details={details}
            prices={prices}
          />
        )}
      </Vertical>

      <Horizontal verticalCenter justifyContent='flex-end' className='pt-2 px-2 border-top'>
        <GraviButton
          buttonText='Cancel'
          onClick={() => {
            setIsShowingDateConfirm(false)
          }}
        />
        <GraviButton
          disabled={errorPriceDates.length > 0}
          className='ml-4'
          success
          buttonText='Confirm'
          onClick={() => {
            setIsShowingDateConfirm(false)
            if (updateCascadeDates) {
              updateCascadeDates(pricesWithUpdatedDates)
            }
            if (form) {
              form.setFieldsValue({ detailsWithUpdatedDates })
              form.submit()
            }
          }}
        />
      </Horizontal>
    </Vertical>
  )
}
