import {
  type CalculatedPriceRow,
  type SecondaryPriceBreakdownRow,
  useCalculatedPriceReportTyped,
} from '@api/useCalculatedValueReport/useCalculatedPriceReportTyped'
import { GraviButton, GraviGrid } from '@gravitate-js/excalibrr'
import { Modal, Select } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { breakdownColumnDefs } from './breakdownColDefs'
import { columnDefs } from './colDefs'

export function CalculatedValueReport() {
  const [selectedTradeTypeCvId, setSelectedTradeTypeCvId] = useState<string | undefined>()
  const [selectedTradeEntrySetupId, setSelectedTradeEntrySetupId] = useState<number | undefined>()
  const [selectedDeliveryPeriodConfigurationId, setSelectedDeliveryPeriodConfigurationId] = useState<
    number | undefined
  >()
  const [priceModalOpen, setPriceModalOpen] = useState(false)

  const { useCalculatedPriceReportQuery, useCalculatedPriceReportMetadataQuery, useCalculatedPriceBreakdownQuery } =
    useCalculatedPriceReportTyped()

  const { data: reportMetadata } = useCalculatedPriceReportMetadataQuery()
  const { data: reportData } = useCalculatedPriceReportQuery(selectedTradeTypeCvId)
  const { data: breakdownData, isLoading: isBreakdownLoading } = useCalculatedPriceBreakdownQuery(
    selectedTradeEntrySetupId,
    selectedDeliveryPeriodConfigurationId
  )

  useEffect(() => {
    setSelectedTradeTypeCvId(reportMetadata?.TradeTypeList?.[0]?.Value ?? undefined)
  }, [reportMetadata])

  const handlePriceModalClose = useCallback(() => setPriceModalOpen(false), [])

  const getSecondaryPopup = useCallback((key: string) => {
    const [num1Str, num2Str] = key.split('_')
    setSelectedTradeEntrySetupId(parseInt(num1Str))
    setSelectedDeliveryPeriodConfigurationId(parseInt(num2Str))
    setPriceModalOpen(true)
  }, [])

  const mainGridColumnDefs = useMemo(() => columnDefs({ getSecondaryPopup }), [reportMetadata, getSecondaryPopup])
  const breakdownGridColumnDefs = useMemo(breakdownColumnDefs, [reportMetadata])
  const breakdownAgProps = useMemo(
    () => ({
      getRowId: (row: any) => row?.data?.Key,
    }),
    []
  )

  const mainAgProps = useMemo(
    () => ({
      getRowId: (row: any) => row?.data?.Key,
    }),
    []
  )
  const breakdownGridControlBarProps = useMemo(
    () => ({
      title: 'Current Prices',
      hideActiveFilters: true,
      actionButtons: (
        <Select
          style={{ width: 200, marginLeft: 10 }}
          defaultValue={reportMetadata?.TradeTypeList?.[0]?.Value ?? undefined}
          value={selectedTradeTypeCvId}
          onChange={(value: string) => setSelectedTradeTypeCvId(value)}
          options={reportMetadata?.TradeTypeList?.map((item) => ({
            value: item.Value ?? '',
            label: item.Text ?? '',
          }))}
        />
      ),
    }),
    [reportMetadata, selectedTradeTypeCvId]
  )

  return (
    <>
      <Modal
        open={priceModalOpen}
        title='Secondary Price Breakdown'
        footer={[<GraviButton key='cancel' buttonText='Cancel' onClick={handlePriceModalClose} />]}
        onCancel={handlePriceModalClose}
        style={{ minWidth: '60vw' }}
      >
        <div style={{ height: '500px' }}>
          <GraviGrid
            enableFilterContextMenu
            agPropOverrides={breakdownAgProps}
            columnDefs={breakdownGridColumnDefs}
            storageKey='CalculatedValueReportBreakdown'
            rowData={(breakdownData?.Data ?? []) as SecondaryPriceBreakdownRow[]}
            loading={isBreakdownLoading}
            showColumnsToolbar={false}
          />
        </div>
      </Modal>

      <GraviGrid
        enableFilterContextMenu
        controlBarProps={breakdownGridControlBarProps}
        agPropOverrides={mainAgProps}
        columnDefs={mainGridColumnDefs}
        storageKey='CalculatedValueReport'
        rowData={(reportData?.Data ?? []) as CalculatedPriceRow[]}
        loading={false}
      />
    </>
  )
}
