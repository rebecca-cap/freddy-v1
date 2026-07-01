import { useContractsReport } from '@api/useContractsReport'
import type { ContractGetAllResponse, MergedContractDetailData } from '@api/useContractsReport/types'
import { GraviGrid } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

import { getContractDetailColumnDefs } from './columnDefs'

type Contract = ContractGetAllResponse['Data'][number]

export const ContractDetailRow: React.FC<{ data: Contract }> = (params) => {
  const columnDefs = useMemo(() => getContractDetailColumnDefs(), [])
  const { useDetailValuationDataQuery } = useContractsReport()
  const { data: valuationDetails, isLoading: valuationDetailsLoading } = useDetailValuationDataQuery(
    params.data.TradeEntryId
  )

  const mergedDetails = useMemo(() => {
    return params.data.Details.map((detail) => {
      const matchingValuation = valuationDetails?.Data?.find((v) => v.TradeEntryDetailId === detail.TradeEntryDetailId)
      if (!matchingValuation) return detail
      return { ...detail, ...matchingValuation } as MergedContractDetailData
    })
  }, [valuationDetails, params.data.Details])
  const agPropOverrides = useMemo(
    () => ({ getRowId: (row) => row?.data?.TradeEntryDetailId, domLayout: 'autoHeight' }),
    [columnDefs]
  )
  return (
    <div className='ml-3'>
      <GraviGrid
        controlBarProps={{ title: 'Details' }}
        agPropOverrides={agPropOverrides}
        rowData={mergedDetails ?? []}
        loading={valuationDetailsLoading ?? true}
        columnDefs={columnDefs}
      />
    </div>
  )
}
