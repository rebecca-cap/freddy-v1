import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { GraviButton, GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { DownloadButton } from '@modules/Admin/NetGrossDefaults/components/DownloadButton'
import {
  ContractValuation,
  ExecuteRevaluationRequest,
  RevaluationPriceChange,
} from '@modules/ContractManagement/ContractRevaluation/api/types'
import { GridApi } from 'ag-grid-community'
import moment from 'moment'
import React, { useMemo, useRef, useState } from 'react'

import { ResultsColumnDefs } from './components/resultsColumnDefs'

export function RevaluationResults({
  revaluationResults,
  selectedContractDetails,
  selectedDates,
  isLoadingResults,
  onClose,
}: {
  revaluationResults: RevaluationPriceChange[]
  selectedContractDetails: ContractValuation[]
  selectedDates: Partial<ExecuteRevaluationRequest>
  isLoadingResults: boolean
  onClose: () => void
}) {
  const gridRef = useRef<GridApi>() as React.MutableRefObject<GridApi>
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const columnDefs = useMemo(() => ResultsColumnDefs(), [])
  const rowData = useMemo(() => {
    return selectedContractDetails.map((item) => {
      return {
        ...item,
        PricingPeriodStart: selectedDates.StartDate,
        PricingPeriodEnd: selectedDates.EndDate,
      }
    })
  }, [revaluationResults])
  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (params: { data: ContractValuation }) =>
        `${params?.data?.TradeEntryDetailId}-${params?.data?.TradeEntryId}`,
      rowSelection: 'multiple' as const,
      rowGroupPanelShow: 'never' as const,
      suppressDragLeaveHidesColumns: true,
      rowHeight: 40,
    }
  }, [rowData])
  const controlBarProps = useMemo(() => {
    return {
      title: '',
      hideActiveFilters: false,
      showSelectedCount: true,
    }
  }, [])

  if (isLoadingResults) {
    return (
      <Vertical style={{ height: '100%' }}>
        <Vertical
          className='mb-2 p-4 border-radius-5'
          style={{
            backgroundColor: '#f0fdf4',
            width: 'fit-content',
            margin: '0 auto',
          }}
        >
          <Horizontal alignItems='center'>
            <SyncOutlined spin style={{ color: '#156534', fontSize: '1.2em' }} />
            <Texto className='ml-2' category='h5' style={{ color: '#156534' }}>
              Processing revaluation...
            </Texto>
          </Horizontal>{' '}
          <Texto category='p2' className='ml-4' style={{ color: '#156534' }}>
            Updating {selectedContractDetails.length} contract details
          </Texto>{' '}
        </Vertical>
      </Vertical>
    )
  }
  return (
    <Vertical style={{ height: '100%' }}>
      <Texto className='mb-2'>Completed at: {moment().format('MM/DD/YYYY HH:mm A')}</Texto>
      <Vertical
        className='mb-2 p-4 border-radius-5'
        style={{ backgroundColor: '#f0fdf4', border: `1px solid var(--theme-success)` }}
      >
        <Horizontal alignItems='center'>
          <CheckCircleOutlined style={{ color: '#156534', fontSize: '1.2em' }} />
          <Texto className='ml-2' category='h5' style={{ color: '#156534' }}>
            Successfully revalued {selectedContractDetails.length} contract{' '}
            {selectedContractDetails.length > 1 ? 'details' : 'detail'}.
          </Texto>
        </Horizontal>
        <Texto category='p2' className='ml-4' style={{ color: '#156534' }}>
          All price updates have been applied.
        </Texto>
      </Vertical>
      <div style={{ height: 400, width: '100%' }}>
        <GraviGrid
          columnDefs={columnDefs}
          rowData={rowData}
          agPropOverrides={agPropOverrides}
          controlBarProps={controlBarProps}
          externalRef={gridRef}
          sideBar={false}
        />
      </div>
      <Horizontal justifyContent='flex-end' alignItems='center' style={{ gap: '10px' }} className='border-top p-2'>
        <DownloadButton gridAPIRef={gridRef} pageTitle={'ContractRevaluation'} setter={setIsDownloading} />
        <GraviButton theme1 onClick={onClose} buttonText={'Return to Contract Values'} />
      </Horizontal>
    </Vertical>
  )
}
