import { CloseCircleFilled } from '@ant-design/icons'
import { defaultNumberColumn } from '@components/shared/Grid/defaultColumnDefs/DefaultNumberColumnDef'
import { dateFormat } from '@components/TheArmory/helpers'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { CompetitorPricingRecord } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/api/schema.types'
import { isDefinedAndNotNull } from '@utils/index'
import { ColDef } from 'ag-grid-community'
import { Tooltip } from 'antd'
import moment from 'moment'
import React from 'react'

export function columnDefs(
  categories: CompetitorPricingRecord[],
  selectedRow: Quote,
  useOpisPrices: boolean | undefined
): ColDef[] {
  return [
    Rank(),
    CategoryRankColumns(categories),
    Competitor(selectedRow),
    Publisher(),
    Price(),
    Delta(),
    Change(),
    ChangeDate(useOpisPrices),
    Location(),
    !useOpisPrices ? AverageRank() : undefined,
    OutOfProduct(),
  ].filter(Boolean) as ColDef[]
}
function Rank() {
  return {
    ...defaultNumberColumn,
    headerName: 'Rank',
    headerTooltip: 'Rank',
    field: 'Rank',
    filter: false,
    maxWidth: 100,
    menuTabs: [],
    minWidth: 40,
  }
}

function Competitor(selectedRow: Quote) {
  return {
    headerName: 'Competitor',
    field: 'CompetitorName',
    headerTooltip: 'Competitor Name',
    valueGetter: (params) => {
      if (params.data.IsSelectedRow) return selectedRow?.ProductName
      return params.data.CompetitorName
    },
    cellRenderer: ({ value }) => {
      return (
        <Horizontal verticalCenter>
          <Texto
            category='label'
            weight={900}
            style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'inherit' }}
          >
            {value}
          </Texto>
        </Horizontal>
      )
    },
  }
}

function AverageRank() {
  return {
    ...defaultNumberColumn,
    headerName: 'Rolling Month Avg Rank',
    field: 'MonthlyAverageRank',
    headerTooltip: 'Rolling Monthly Average Rank',
    valueFormatter: ({ value }) => value || '',
    minWidth: 40,
  }
}

function OutOfProduct() {
  return {
    field: 'OutOfProduct',
    editable: false,
    sortable: true,
    valueGetter: (params) => params?.data?.OutOfProduct,
    cellRenderer: (params) => {
      const outOfProduct = !!params?.data?.OutOfProduct
      if (outOfProduct) {
        return (
          <div style={{ textAlign: 'center', verticalAlign: 'center' }}>
            <Tooltip title='Out Of Product'>
              <CloseCircleFilled style={{ color: 'var(--theme-error)', fontSize: 15 }} />
            </Tooltip>
          </div>
        )
      }
      return ''
    },
  }
}

function Location() {
  return {
    headerName: 'Location',
    field: 'LocationName',
    headerTooltip: 'Location',
    minWidth: 50,
  }
}

function Publisher() {
  return {
    headerName: 'Publisher',
    field: 'PublisherAbbreviation',
    headerTooltip: 'Publisher',
    colId: 'Publisher',
    minWidth: 30,
  }
}

function Price() {
  return {
    ...defaultNumberColumn,
    headerName: 'Price',
    headerTooltip: 'Price',
    field: 'Price',
    valueFormatter: fmt.decimal,
    sort: 'asc',
    minWidth: 50,
  }
}

function Change() {
  return {
    ...defaultNumberColumn,
    headerName: 'Change',
    headerTooltip: 'Change',
    field: 'Change',
    cellRenderer: ({ value }) => {
      if (!value) return <Texto align='center'>--</Texto>
      return (
        <Horizontal verticalCenter>
          <Texto className='mr-2' style={{ color: 'inherit' }}>
            {value > 0 && '+'}
            {fmt.decimal(value)}
          </Texto>
        </Horizontal>
      )
    },
    valueFormatter: fmt.decimal,
  }
}

function Delta() {
  return {
    ...defaultNumberColumn,
    headerName: 'Delta To Selected Row',
    headerTooltip: 'Delta To Selected Row',
    field: 'DeltaToMe',
    valueFormatter: fmt.decimal,
    minWidth: 70,
    cellRenderer: ({ value }) => {
      return (
        <Horizontal verticalCenter>
          <Texto className='mr-2' style={{ color: 'inherit' }}>
            {value === 0 ? '' : value < 0 ? '+' : '-'}
            {fmt.decimal(Math.abs(value))}
          </Texto>
        </Horizontal>
      )
    },
    cellStyle: (params) => {
      if (!params.value) return {}
      return {
        backgroundColor: params.value < 0 ? 'var(--theme-success-dim)' : 'var(--theme-error-dim)',
      }
    },
  }
}

function ChangeDate(usesOpisPrices?: boolean) {
  return {
    headerName: 'Change Date',
    headerTooltip: 'Change Date',
    field: 'LastChangedDate',
    valueFormatter: ({ value }) => {
      if (value !== null && value !== undefined) {
        return usesOpisPrices ? moment(value).format(dateFormat.DATE_TIME) : moment(value).format(dateFormat.DATE_SLASH)
      }
      return '--'
    },
    minWidth: 100,
  }
}

function BuildRankColumns(categories: CompetitorPricingRecord[]) {
  const dynamicColumns = categories.map((item, index) => ({
    colId: `Rank ${item.CategoryId}`,
    hide: false,
    ...defaultNumberColumn,
    minWidth: 60,
    headerTooltip: `${item.Category} Rank`,
    headerName: `${item.Category} Rank`,
    field: `${item.Category} Rank`,
    suppressColumnsToolPanel: false,
    valueGetter: (params) => {
      if (!isDefinedAndNotNull(params.data)) return null

      const row = params.data as CompetitorPricingRecord
      if (row.IsSelectedRow && isDefinedAndNotNull(row.RankByCategory)) {
        return row.RankByCategory[item.CategoryId] || null
      }
      return row.CategoryId === item.CategoryId ? row.CategoryRank : null
    },
  }))

  const staticHidden = {
    colId: 'hidden',
    hide: true,
    field: 'hidden',
    suppressColumnsToolPanel: true,
  }

  return [staticHidden].concat(dynamicColumns)
}

function CategoryRankColumns(categories: CompetitorPricingRecord[]) {
  // debugger
  return {
    headerName: 'Publisher Rank',
    headerTooltip: 'Publisher Rank',
    marryChildren: true,
    // colId: 'category_rank',
    children: BuildRankColumns(categories),
  }
}
