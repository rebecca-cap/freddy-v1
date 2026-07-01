import { LoadingOutlined } from '@ant-design/icons'
import { useContractManagementContext } from '@contexts/ContractManagement'
import { Texto } from '@gravitate-js/excalibrr'
import { Price } from '@modules/ContractManagement/api/types.schema'
import { ProvisionTypes } from '@modules/ContractManagement/utils'
import React, { useMemo } from 'react'

export function ValueCellRenderer({ data, detailId }: { data?: Price; detailId?: number }) {
  const { isFetchingContractValuation, isFetchingDetailValuation, detailValuationPayload, valuationData } =
    useContractManagementContext()
  const formulaValue = useMemo(() => {
    if (!valuationData || !data) return undefined
    const foundPrice = valuationData?.find((valuation) => valuation.TradeEntryPriceId === data.TradeEntryPriceId)
    return foundPrice?.ValuationResult?.FormulaResult?.Value
  }, [valuationData, data])
  const showLoading = detailId && isFetchingDetailValuation && detailValuationPayload?.includes(detailId)
  if (isFetchingContractValuation || showLoading) {
    return <LoadingOutlined spin />
  }
  if (data?.ProvisionType === ProvisionTypes.FIXED) {
    return <Texto category='h5'>{fmt.currency(data.FixedValue || 0)}</Texto>
  }
  if (typeof formulaValue === 'number') {
    return <Texto category='h5'>{fmt.currency(formulaValue || 0)}</Texto>
  }
  return ''
}
