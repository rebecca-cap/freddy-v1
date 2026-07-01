import { PlusOutlined } from '@ant-design/icons'
import { getComputedStyleValue } from '@components/TheArmory/helpers'
import { GraviButton } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import { Tooltip } from 'antd'
import React from 'react'

export function getColumnDefs(tasMode, setCreatingOrder, setSelectedItem, canWrite, creditData) {
  const strokeColor = getComputedStyleValue(document.documentElement, '--theme-color-2').trim()
  const fillColor = getComputedStyleValue(document.documentElement, '--theme-color-2-dim').trim()

  const tooltipRenderer = (params) => {
    const { yValue } = params
    return {
      content: fmt.decimal(yValue),
    }
  }

  return [
    {
      headerName: 'Location',
      field: 'LocationName',
      rowGroup: true,
    },
    {
      headerName: 'Product',
      field: 'ProductName',
      rowGroup: true,
    },
    {
      headerName: 'Daily NYMEX Trend',
      flex: 1,
      enableRowGroup: false,
      field: 'MarketPlatformItems[0].SparkChartPoints',
      valueGetter: (params) => params?.data?.MarketPlatformItems[0]?.SparkChartPoints,
      cellRenderer: 'agSparklineCellRenderer',
      cellRendererParams: {
        sparklineOptions: {
          type: 'line', // Change the type to 'area' to fill the area under the line
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
    },
    {
      headerName: tasMode ? 'Basis Price' : 'Price',
      field: 'MarketPlatformItems[0].Price',
      valueGetter: (params) => params?.data?.MarketPlatformItems[0]?.Price,
      type: 'rightAligned',
      valueFormatter: fmt.currency,
      suppressMovable: true,
      enableRowGroup: false,
      maxWidth: 100,
    },
    {
      headerName: 'Daily High',
      field: 'MarketPlatformItems[0].DailyHigh',
      valueGetter: (params) => params?.data?.MarketPlatformItems[0]?.DailyHigh,
      type: 'rightAligned',
      valueFormatter: fmt.currency,
      suppressMovable: true,
      enableRowGroup: false,
      maxWidth: 150,
    },
    {
      headerName: 'Daily Low',
      field: 'MarketPlatformItems[0].DailyLow',
      valueGetter: (params) => params?.data?.MarketPlatformItems[0]?.DailyLow,
      type: 'rightAligned',
      valueFormatter: fmt.currency,
      suppressMovable: true,
      enableRowGroup: false,
      maxWidth: 150,
    },
    {
      suppressMovable: true,
      enableColumnResizing: false,
      enableRowGroup: false,
      maxWidth: 200,
      editable: false,
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
                theme3
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
    },
  ] as ColDef[]
}
