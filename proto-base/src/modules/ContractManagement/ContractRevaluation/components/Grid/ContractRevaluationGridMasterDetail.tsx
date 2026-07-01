import { GraviGrid } from '@gravitate-js/excalibrr'
import { ContractValuation } from '@modules/ContractManagement/ContractRevaluation/api/types'
import React, { useMemo } from 'react'

import { ContractRevaluationGridMasterDetailColumnDefs } from './ContractRevaluationGridMasterDetailColumnDefs'

export interface ContractRevaluationGridMasterDetailProps {
  data: ContractValuation
}

export function ContractRevaluationGridMasterDetail({ data }: ContractRevaluationGridMasterDetailProps) {
  const columnDefsMemo = useMemo(() => ContractRevaluationGridMasterDetailColumnDefs(), [])

  const controlBarProps = useMemo(() => {
    return {
      title: 'Contract Prices',
      hideActiveFilters: false,
    }
  }, [])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data.CurvePointPriceId || row.data.CurvePointId,
      domLayout: 'autoHeight' as const,
      rowGroupPanelShow: 'never' as const,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
    }),
    []
  )
  const rowData = useMemo(() => data?.Prices || [], [data])

  return (
    <div className='p-3 bg-2'>
      <GraviGrid
        controlBarProps={controlBarProps}
        agPropOverrides={agPropOverrides}
        columnDefs={columnDefsMemo}
        rowData={rowData}
      />
    </div>
  )
}
