import { LoadingOutlined } from '@ant-design/icons'
import { useContractManagementContext } from '@contexts/ContractManagement'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { isDefined, isDefinedAndNotNull } from '@utils/index'
import React, { useMemo } from 'react'

import { Variable, VariableData } from '../../DetailsView/api/types.schema'

export interface VariableRowDisplayProps {
  variable: VariableData
  variableValuation?: Variable
  isFetchingDetail?: boolean
  showValue?: boolean
  detailId?: number
  isExtracted?: boolean
}
export function VariableRowDisplay({
  variable,
  variableValuation,
  isFetchingDetail = false,
  showValue = false,
  detailId,
  isExtracted,
}: VariableRowDisplayProps) {
  const { metadata, isFetchingContractValuation, isFetchingDetailValuation, detailValuationPayload } =
    useContractManagementContext()
  const selectedPriceInstrument = metadata?.PriceInstrumentList.find(
    (instrument) => instrument.Value === variable.PriceInstrumentId?.toString()
  )
  const uomCurrency = selectedPriceInstrument?.CurrencyPerUnitDisplay
  const uomCurrencyValue = uomCurrency === '/' ? '' : uomCurrency

  const valuationValue = useMemo(() => {
    if (
      isFetchingContractValuation ||
      (detailId && detailValuationPayload?.includes(detailId) && isFetchingDetailValuation)
    ) {
      return 'Loading'
    }
    if (typeof variableValuation?.Value?.Price === 'number') {
      return fmt.currency(variableValuation?.Value?.Price)
    }

    if (variableValuation?.IsRequired) {
      return variableValuation?.Status
    }
    if (isDefinedAndNotNull(variableValuation)) return 'Not Required'
    return ''
  }, [variableValuation, isFetchingContractValuation, isFetchingDetail, isFetchingDetailValuation])

  const valuationValueStyle = useMemo(() => {
    const status = variableValuation?.Status
    const baseStyle = { borderRadius: 2, width: 'fit-content' }
    if (valuationValue === 'Loading') return baseStyle
    if (status === 'Actual' && typeof variableValuation?.Value?.Price === 'number') {
      return { ...baseStyle, backgroundColor: 'var(--theme-success-dim)' }
    }
    if (!variableValuation?.IsRequired) {
      return {}
    }
    switch (status) {
      case 'Estimate':
      case 'Estimated':
        return { ...baseStyle, backgroundColor: '#D2DCF9' }
      case 'Old':
        return { ...baseStyle, backgroundColor: 'var(--theme-warning-dim)' }
      case 'Missing':
        return { ...baseStyle, backgroundColor: 'var(--theme-error-dim)' }
      default:
        return {}
    }
  }, [variableValuation])

  const missingOptionalBehaviorName = useMemo(() => {
    if (variable.IsRequired) {
      return 'Required'
    }
    if (typeof variable?.MissingOptionalPriceBehaviorCvId === 'number') {
      return metadata?.OptionalVariableBehaviors?.find(
        (item) => item.Value === variable.MissingOptionalPriceBehaviorCvId?.toString()
      )?.Text
    }
  }, [variable])
  return (
    <Horizontal verticalCenter className='p-3 border-bottom bg-1'>
      <Vertical verticalCenter flex={1} className='mr-3'>
        <Texto> {variable.Percentage ? `${fmt.decimal(variable.Percentage)} %` : '100%'}</Texto>
      </Vertical>

      <Vertical verticalCenter flex={2} className='mr-3'>
        {variable.PricePublisherName ? (
          <Texto className='wrapping-text'>{variable.PricePublisherName}</Texto>
        ) : (
          <Texto appearance='warning' weight='bold'>
            {isExtracted ? '' : 'Missing Publisher'}
          </Texto>
        )}
      </Vertical>

      <Vertical verticalCenter flex={2} className='mr-3'>
        {variable.PriceInstrumentName ? (
          <Texto className='wrapping-text'>{variable.PriceInstrumentName}</Texto>
        ) : (
          <Texto appearance='warning' weight='bold'>
            {isExtracted ? '' : 'Missing Instrument'}
          </Texto>
        )}
      </Vertical>

      <Vertical verticalCenter flex={1} className='mr-3'>
        {variable.PriceTypeDisplayName ? (
          <Texto>{variable.PriceTypeDisplayName}</Texto>
        ) : (
          <Texto appearance='warning' weight='bold'>
            {isExtracted ? '' : 'Missing Price Type'}
          </Texto>
        )}
      </Vertical>

      <Vertical verticalCenter flex={1} className='mr-3'>
        <Texto appearance={variable.Differential === 0 || !isDefined(variable.Differential) ? 'medium' : 'default'}>
          {variable.Differential ? fmt.decimal(variable.Differential) : 0}
        </Texto>
      </Vertical>

      <Vertical flex={1} className='mr-3'>
        {variable.PriceValuationRuleName ? (
          <Texto className='wrapping-text'>{variable.PriceValuationRuleName}</Texto>
        ) : (
          <Texto appearance='warning'>{isExtracted ? '' : 'Missing Valuation Rule'}</Texto>
        )}
      </Vertical>
      <Vertical flex={1} className='mr-3'>
        <Texto>{missingOptionalBehaviorName}</Texto>
      </Vertical>
      <Vertical flex={2} className='mr-3'>
        {isExtracted ? (
          <Texto className='wrapping-text'>{variable.VariableName}</Texto>
        ) : (
          <Texto appearance='warning'>{variable.DisplayName}</Texto>
        )}
      </Vertical>

      <Vertical flex={2} className='mr-3'>
        <Texto appearance={variable.Differential === 0 || !isDefined(variable.Differential) ? 'medium' : 'default'}>
          {uomCurrencyValue}
        </Texto>
      </Vertical>

      {showValue && (
        <Vertical flex={1} className='mr-3'>
          <Texto style={valuationValueStyle} className='p-1'>
            {valuationValue === 'Loading' ? <LoadingOutlined spin /> : valuationValue || ''}
          </Texto>
        </Vertical>
      )}
    </Horizontal>
  )
}
