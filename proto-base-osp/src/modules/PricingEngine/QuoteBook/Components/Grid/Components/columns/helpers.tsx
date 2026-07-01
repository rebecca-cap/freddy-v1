import {
  DollarCircleFilled,
  EnvironmentOutlined,
  LockOutlined,
  PartitionOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons'
import GrossIconFilled from '@assets/icons/GrossIconFilled'
import NetIconFilled from '@assets/icons/NetIconFilled'
import { ESTIMATED_ROW_BG } from '@constants/colors'
import { NotificationMessage } from '@gravitate-js/excalibrr'
import type { Quote, QuoteBookMetadataResponse } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import type { DirtyUpdateField } from '@modules/PricingEngine/QuoteBook/type.schema'
import dayjs from '@utils/dayjs'
import { isDefinedAndNotNull } from '@utils/index'
import type { ValueSetterParams } from 'ag-grid-community'
import _ from 'lodash'
import React from 'react'

export const getDiffIcon = (diffName: string) => {
  if (!diffName) return null
  const trimmed = diffName.trim().toLowerCase()
  if (trimmed.includes('spread')) return <LockOutlined />
  if (trimmed.includes('rack')) return <EnvironmentOutlined />
  if (trimmed.includes('cost')) return <DollarCircleFilled />
  if (trimmed.includes('competitor')) return <UserSwitchOutlined />
  if (trimmed.includes('spot')) return <PartitionOutlined />
}

export const getDiffIconByStrategyBase = (strategyBase, isSpread) => {
  if (!strategyBase) return null
  if (isSpread) return <LockOutlined />
  if (strategyBase.BenchmarkId === 0) return <DollarCircleFilled />

  return <UserSwitchOutlined />
}

const isQuoteRowCellDirty = (row: Quote, originalRows: Quote[] | undefined, fieldName: string) => {
  // find the original row to compare against
  const originalRow = originalRows?.find((or) => or.QuoteConfigurationMappingId === row?.QuoteConfigurationMappingId)
  // if we don't find it , it's not dirty
  if (!originalRow) {
    return false
  }

  // otherwise we check if they are equal and return the result
  return !_.isEqual(originalRow[fieldName], row[fieldName])
}

export const getDirtyCellStyle = (row: Quote, originalRows: Quote[] | undefined, fieldName: string) => {
  const adjustedToday = row.AdjustmentUpdatedDateTime
    ? dayjs(row.AdjustmentUpdatedDateTime).isSame(dayjs(), 'day')
    : false

  const spreadOverrideToday = row.SpreadOverrideUpdatedDateTime
    ? dayjs(row.SpreadOverrideUpdatedDateTime).isSame(dayjs(), 'day')
    : false

  const recentlyPublished =
    row.LatestQuoteDate && row.AdjustmentUpdatedDateTime
      ? dayjs(row.LatestQuoteDate).isAfter(row.AdjustmentUpdatedDateTime, 'second')
      : false
  const isDirty = isQuoteRowCellDirty(row, originalRows, fieldName)
  const needsDirtyCellStyle =
    ((isDirty || row.AdjustedAfterPublish) && !row.SpreadParentMappingId) ||
    (adjustedToday && !recentlyPublished) ||
    spreadOverrideToday

  if (needsDirtyCellStyle) {
    return { backgroundColor: ESTIMATED_ROW_BG, opacity: 1 }
  }
}

export const getMiddayStyle = (value) => {
  if (+value < 0) {
    return { backgroundColor: 'var(--theme-error-trans)', opacity: 1 }
  }
  if (+value > 0) {
    return { backgroundColor: 'var(--theme-success-trans)', opacity: 1 }
  }
  return null
}

export const getSign = (value: number) => (value > 0 ? '+' : '')

export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, pathPart) => current && current[pathPart], obj)
}

export const getBenchMark = (id, params, sectionName) => {
  if (sectionName === 'Proposed') {
    const value = params?.data?.Benchmarks?.find((b) => b.BenchmarkId.toString() === id.toString())
    return value
  }
  const value = params?.data?.[`${sectionName}`]?.Benchmarks?.find((b) => b.BenchmarkId.toString() === id.toString())
  return value
}

export const getNetGrossIcon = (label) => {
  switch (label) {
    case 'Net':
      return <NetIconFilled />
    case 'Gross':
      return <GrossIconFilled />
    case 'N/A':
      return 'N/A'
    default:
      return 'N/A'
  }
}

export const getUniqueExceptionValues = (data, value) => {
  const uniqueValues = new Set()

  data?.forEach((item) => {
    const exceptions = item?.Exceptions || []
    exceptions?.forEach((exception) => {
      uniqueValues.add(exception?.[value])
    })
  })
  return Array.from(uniqueValues).concat([''])
}

export const resolveComponentName = (cvId: number | undefined, metadata?: QuoteBookMetadataResponse): string => {
  if (cvId === undefined || cvId === null) return ''
  return metadata?.PricingExceptionComponents?.find((c) => c.Value === cvId.toString())?.Text ?? `Component ${cvId}`
}

export const resolveSeverityLabel = (
  severity: number | undefined,
  metadata?: QuoteBookMetadataResponse
): string | undefined => {
  if (severity === undefined || severity === null) return undefined
  return metadata?.PriceExceptionSeverities?.find((s) => s.Value === severity.toString())?.Text || ''
}

function getApplicableMarketMoveValueFromRowData(data: Quote) {
  if (!data.UsesMarketMove) {
    return 0
  }
  if (isDefinedAndNotNull(data.MarketMoveOverride)) {
    return Number(data.MarketMoveOverride)
  }
  if (isDefinedAndNotNull(data.MarketMoveValue)) {
    return Number(data.MarketMoveValue)
  }

  return 0
}

interface UpdateRowDataOnValueChangeProps {
  changedField: DirtyUpdateField
  params: ValueSetterParams
}

export function updateRowPricingDataOnValueChange({ changedField, params }: UpdateRowDataOnValueChangeProps) {
  const isValidChange = validateNewValue(changedField, params)
  if (!isValidChange) return false

  const newValue = Number(params?.newValue)

  if (changedField === 'ProposedPrice') {
    if (newValue < 0) {
      NotificationMessage('Error', 'Price cannot be negative', true)
      return false
    }
    params.data[changedField] = newValue
    params.data.Adjustment = getNewAdjustmentValueFromData(params)
    return true
  }

  const newPrice = getNewSummedPriceFromData({
    ...params,
    data: { ...params.data, [changedField]: newValue },
  })
  if (newPrice === false) {
    return false
  }
  // changing it to a decimal format so that 0 and 0.0000 can be differentiated
  params.data[changedField] = fmt.decimal(newValue)
  params.data.ProposedPrice = newPrice
  return true
}
function validateNewValue(changedField: DirtyUpdateField, params: ValueSetterParams) {
  if (params.data?.SpreadParentMappingId) {
    return false
  }
  if (changedField === 'MarketMoveOverride' && params.newValue === null) {
    return true
  }
  const newValueAsANumber = Number(params.newValue)
  return !(!params.data || params.newValue === null || Number.isNaN(newValueAsANumber))
}

function getNewSummedPriceFromData(params: ValueSetterParams) {
  const marketMoveValue = getApplicableMarketMoveValueFromRowData(params.data)
  const newPrice =
    Number(params.data.StrategyBase.Value) +
    Number(params?.data?.SpreadOverrideId ? params.data.SpreadOverride : params.data.Adjustment) +
    marketMoveValue
  if (newPrice < 0) {
    NotificationMessage('Error', 'Price after applied changes cannot be negative', true)
    return false
  }
  return fmt.decimal(newPrice ?? 0)
}
function getNewAdjustmentValueFromData(params: ValueSetterParams) {
  const marketMoveValue = getApplicableMarketMoveValueFromRowData(params.data)
  return Number(params.data.ProposedPrice) - marketMoveValue - Number(params.data?.StrategyBase?.Value)
}

export function getNewSummedPriceFromRow(row: Quote) {
  const marketMoveValue = getApplicableMarketMoveValueFromRowData(row)
  const newPrice =
    Number(row.StrategyBase?.Value ?? 0) +
    Number(row?.SpreadOverrideId ? row.SpreadOverride : row.Adjustment) +
    marketMoveValue
  if (newPrice < 0) {
    NotificationMessage('Error', 'Price after applied changes cannot be negative', true)
    return false
  }
  return fmt.decimal(newPrice ?? 0)
}
