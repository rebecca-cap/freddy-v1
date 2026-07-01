import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'
import { dateFormat } from '@components/TheArmory/helpers'
import { BBDTag, Horizontal } from '@gravitate-js/excalibrr'
import {
  BenchmarkKey,
  benchmarkKeys,
  BenchmarkMetadataResponse,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/api/schema.types'
import {
  formatBenchmarkCorrelationsHeader,
  getBenchmarkSelectOptions,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/util'
import { ColDef } from 'ag-grid-community'
import { Typography } from 'antd'
import dayjs from '@utils/dayjs'
import React from 'react'

const { Text, Link } = Typography

type ManageBenchmarksGridColumnProps = {
  canWrite: boolean
  benchmarkCorrelationsMetadataResponse: BenchmarkMetadataResponse | undefined
}

const defaultColumnDef = () => {
  return {
    cellStyle: { textAlign: 'center' },
  }
}

export const getManageBenchmarkCorrelationsColumnDefs = ({
  canWrite,
  benchmarkCorrelationsMetadataResponse,
}: ManageBenchmarksGridColumnProps): ColDef[] => {
  return [
    Id(),
    Configuration(),
    Product(),
    Location(),
    PriceEffective(),
    Group(),
    ...benchmarkKeys.map((key) => BenchmarkColumn(key, benchmarkCorrelationsMetadataResponse)),
  ] as ColDef[]
}

const Id = () => ({
  ...defaultColumnDef(),
  headerName: 'Id',
  field: 'QuoteConfigurationMappingId',
  hide: true,
})

const Configuration = () => ({
  ...defaultColumnDef(),
  headerName: 'Configuration',
  field: 'QuoteConfigurationDisplayName',
  rowGroup: true,
  rowGroupIndex: 1,
  hide: true,
})

const Product = () => ({
  headerName: 'Product',
  field: 'ProductName',
  type: 'center',
  editable: false,
})

const Location = () => ({
  ...defaultColumnDef(),
  headerName: 'Location',
  field: 'LocationName',
  rowGroup: true,
  rowGroupIndex: 2,
  hide: true,
  editable: false,
})

const PriceEffective = () => ({
  ...defaultColumnDef(),
  headerName: 'Price Effective',
  field: 'PricePeriodStartOffset',
  filter: 'agTextColumnFilter',
  editable: false,
  valueGetter: ({ data }) => {
    const value = data?.PricePeriodStartOffset
    if (!value) return ''
    const start = dayjs(value, 'HH:mm:ss').format(dateFormat.FULL_TIME)
    const end = dayjs(value, 'HH:mm:ss').subtract(1, 'minutes').format(dateFormat.FULL_TIME)
    return `${start} - ${end}`
  },
  cellRenderer: ({ value }) => {
    const startOffset = dayjs(value, 'HH:mm:ss').format(dateFormat.FULL_TIME)
    const endOffset = dayjs(value, 'HH:mm:ss').subtract(1, 'minutes').format(dateFormat.FULL_TIME)
    return (
      <Horizontal horizontalCenter>
        {startOffset} - {endOffset}
      </Horizontal>
    )
  },
})

const Group = () => ({
  ...defaultColumnDef(),
  headerName: 'Group',
  field: 'GroupName',
})

const BenchmarkColumn = (
  benchmarkKey: BenchmarkKey,
  benchmarkCorrelationsMetadataResponse: BenchmarkMetadataResponse | undefined
) => {
  const benchmarkList = benchmarkCorrelationsMetadataResponse?.Data[benchmarkKey.replace(/([^s])$/, '$1s')] ?? []
  return {
    ...defaultColumnDef(),
    headerName: formatBenchmarkCorrelationsHeader(benchmarkKey),
    field: `${benchmarkKey}`,
    cellEditor: 'SearchableSelect',
    cellEditorPopup: true,
    cellEditorParams: () => {
      return {
        options: getBenchmarkSelectOptions(benchmarkList),
        showSearch: true,
        allowClear: true,
      }
    },
    isBulkEditable: true,
    bulkCellEditor: BulkSelectEditor,
    bulkCellEditorParams: {
      propKey: benchmarkKey,
      options: getBenchmarkSelectOptions(benchmarkList),
      selectEditorProps: {
        showSearch: true,
        allowClear: true,
      },
      selectEditorStyle: {
        width: 400,
      },
    },
    filterValueGetter: ({ data }) => {
      return data?.[benchmarkKey]?.Name ?? '(Blanks) Not Assigned '
    },
    valueGetter: ({ data }) => data?.[benchmarkKey]?.Name ?? 'Not Assigned',
    cellRenderer: ({ value, data }) => {
      if (value === 'Not Assigned') return <BBDTag style={{ textAlign: 'center', minWidth: 85 }}>Not Assigned</BBDTag>
      return (
        <Text
          ellipsis={{
            tooltip: data[benchmarkKey]?.Name,
          }}
        >
          {data[benchmarkKey]?.Name}
        </Text>
      )
    },
  }
}
