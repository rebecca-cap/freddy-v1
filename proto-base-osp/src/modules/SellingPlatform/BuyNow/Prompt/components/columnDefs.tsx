import { PlusOutlined } from '@ant-design/icons'
import { ItemGroup } from '@api/usePrompt/types.schema'
import { getComputedStyleValue } from '@components/TheArmory/helpers'
import { CreditData } from '@contexts/PromptContext/types.schema'
import { GraviButton } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import { Tooltip } from 'antd'
import React, { Dispatch, SetStateAction } from 'react'

interface ColumnDefsParams {
  tasMode: boolean
  setCreatingOrder: Dispatch<SetStateAction<boolean>>
  setSelectedItem: Dispatch<SetStateAction<ItemGroup | null>>
  canWrite: boolean
  creditData: CreditData | null
}

export function getColumnDefs({
  tasMode,
  setCreatingOrder,
  setSelectedItem,
  canWrite,
  creditData,
}: ColumnDefsParams): ColDef[] {
  return [
    Location(),
    Product(),
    DailyNYMEXTrend(),
    Price(tasMode),
    DailyHigh(),
    DailyLow(),
    Currency(),
    UnitOfMeasure(),
    Actions({ setCreatingOrder, setSelectedItem, canWrite, creditData }),
  ]
}

function Location(): ColDef {
  return {
    headerName: 'Location',
    field: 'LocationName',
    rowGroup: true,
  }
}

function Product(): ColDef {
  return {
    headerName: 'Product',
    field: 'ProductName',
    rowGroup: true,
  }
}

function DailyNYMEXTrend(): ColDef {
  const strokeColor = getComputedStyleValue(document.documentElement, '--theme-color-2').trim()
  const fillColor = getComputedStyleValue(document.documentElement, '--theme-color-2-dim').trim()

  const tooltipRenderer = (params) => {
    const { yValue } = params
    return {
      content: fmt.decimal(yValue),
    }
  }

  return {
    filter: false,
    headerName: 'Daily NYMEX Trend',
    flex: 1,
    enableRowGroup: false,
    field: 'MarketPlatformItems[0].SparkChartPoints',
    valueGetter: (params) => params?.data?.MarketPlatformItems[0]?.SparkChartPoints,
    cellRenderer: 'agSparklineCellRenderer',
    cellRendererParams: {
      sparklineOptions: {
        type: 'line',
        line: {
          stroke: strokeColor,
          strokeWidth: 2,
        },
        highlightStyle: {
          size: 5,
          fill: fillColor,
          stroke: strokeColor,
        },
        padding: {
          top: 10,
          right: 5,
          bottom: 10,
          left: 5,
        },
        tooltip: {
          renderer: tooltipRenderer,
        },
      },
    },
  }
}

function Price(tasMode: boolean): ColDef {
  return {
    headerName: tasMode ? 'Basis Price' : 'Price',
    field: 'MarketPlatformItems[0].Price',
    valueGetter: (params) => params?.data?.MarketPlatformItems[0]?.Price,
    type: 'rightAligned',
    valueFormatter: ({ value }) => fmt.currency(value),
    suppressMovable: true,
    enableRowGroup: false,
    maxWidth: 100,
  }
}

function DailyHigh(): ColDef {
  return {
    headerName: 'Daily High',
    field: 'MarketPlatformItems[0].DailyHigh',
    valueGetter: (params) => params?.data?.MarketPlatformItems[0]?.DailyHigh,
    type: 'rightAligned',
    valueFormatter: ({ value }) => fmt.currency(value),
    suppressMovable: true,
    enableRowGroup: false,
    maxWidth: 150,
  }
}

function DailyLow(): ColDef {
  return {
    headerName: 'Daily Low',
    field: 'MarketPlatformItems[0].DailyLow',
    valueGetter: (params) => params?.data?.MarketPlatformItems[0]?.DailyLow,
    type: 'rightAligned',
    valueFormatter: ({ value }) => fmt.currency(value),
    suppressMovable: true,
    enableRowGroup: false,
    maxWidth: 150,
  }
}

function Currency(): ColDef {
  return {
    headerName: 'Currency',
    field: 'CurrencyName',
    hide: true,
  }
}

function UnitOfMeasure(): ColDef {
  return {
    headerName: 'UOM',
    field: 'UnitofMeasurementName',
    hide: true,
  }
}

interface ActionsParams {
  setCreatingOrder: Dispatch<SetStateAction<boolean>>
  setSelectedItem: Dispatch<SetStateAction<ItemGroup | null>>
  canWrite: boolean
  creditData: CreditData | null
}

function Actions({ setCreatingOrder, setSelectedItem, canWrite, creditData }: ActionsParams): ColDef {
  return {
    suppressMovable: true,
    enableRowGroup: false,
    maxWidth: 200,
    editable: false,
    filter: false,
    headerName: 'Actions',
    cellRenderer: ({ data }) => {
      const tooltipText = 'A valid loading number is required to order'
      const tooltipTitle = data?.LoadingNumberSelectionIsRequiredButNoneWereFound ? tooltipText : ''
      const createDisabled =
        !data.MarketPlatformItems[0]?.Price ||
        !canWrite ||
        creditData?.creditStatus === 'CreditHold' ||
        data?.LoadingNumberSelectionIsRequiredButNoneWereFound
      return (
        <Tooltip title={tooltipTitle} placement='top'>
          <span style={{ width: '100%' }}>
            <GraviButton
              color='primary'
              icon={<PlusOutlined style={{ fontSize: 16 }} />}
              buttonText='Create Order'
              disabled={createDisabled}
              onClick={() => {
                setSelectedItem({ ...data })
                setCreatingOrder(true)
              }}
              style={{ borderRadius: 10, width: '100%' }}
            />
          </span>
        </Tooltip>
      )
    },
  }
}
