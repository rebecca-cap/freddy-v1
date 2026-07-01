import { ExperimentOutlined } from '@ant-design/icons'
import { useContractManagementContext } from '@contexts/ContractManagement'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Price } from '@modules/ContractManagement/api/types.schema'
import { VariableColumnHeader } from '@modules/ContractManagement/components/DetailManager/PriceManagement/ProvisionManager/Components/VariableColumnHeader'
import { VariableRowDisplay } from '@modules/ContractManagement/components/DetailManager/PriceManagement/VariableRowDisplay'
import { VariableData } from '@modules/ContractManagement/components/DetailsView/api/types.schema'
import React, { Fragment, useMemo } from 'react'

import { useProvisionGroups } from './useProvisionGroups'

interface PriceProvisionDisplayProps {
  data: Price
  isGridView?: boolean
  detailId?: number
  isFetchingDetail?: boolean
  isExtracted?: boolean
}
export function PriceProvisionDisplay({
  data,
  isGridView = false,
  detailId,
  isFetchingDetail,
  isExtracted,
}: PriceProvisionDisplayProps) {
  const provisionGroupManager = useProvisionGroups(data)
  const { valuationData } = useContractManagementContext()

  const priceValuationData = useMemo(() => {
    if (!valuationData || !data) return null
    return valuationData?.find((valuation) => valuation.TradeEntryPriceId === data.TradeEntryPriceId)
  }, [valuationData, data])

  return (
    <div>
      {isGridView && (
        <Horizontal verticalCenter className='bg-2 p-3 border-bottom' justifyContent='space-between'>
          <Texto>{data.Formula?.Name || data.Formula?.Formula}</Texto>

          <Texto align='right' textTransform='uppercase' category='h5'>
            {typeof priceValuationData?.ValuationResult?.FormulaResult?.Value === 'number'
              ? fmt.currency(priceValuationData?.ValuationResult?.FormulaResult?.Value)
              : ''}
          </Texto>
        </Horizontal>
      )}
      <VariableColumnHeader showValue />
      {provisionGroupManager.groups.map((group: VariableData[], index: number) => {
        return (
          <Fragment key={`${data.Formula?.Name}-${index}`}>
            <Horizontal verticalCenter className='bg-2 p-3 border-bottom' justifyContent='space-between'>
              <Texto textTransform='uppercase' className='mr-4 '>
                <ExperimentOutlined className='pr-2' /> formula {` ${index + 1}`}
              </Texto>
            </Horizontal>
            {group.map((variable: VariableData, variableIndex: number) => {
              const variableValuation = priceValuationData?.ValuationResult?.FormulaResult?.Variables?.find(
                (valuation) => valuation?.FormulaVariableId === variable.FormulaVariableId
              )
              return (
                <VariableRowDisplay
                  variable={variable}
                  key={`${index}-${variableIndex}`}
                  variableValuation={variableValuation}
                  isFetchingDetail={isFetchingDetail}
                  detailId={detailId}
                  isExtracted={isExtracted}
                  showValue
                />
              )
            })}
          </Fragment>
        )
      })}
    </div>
  )
}
