import { EllipsisOutlined } from '@ant-design/icons'
import { Horizontal, GraviButton, GraviGrid } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

import { usePricingEngine } from '@api/usePricingEngine'

export function Prices() {
  const { getPriceWorksheet } = usePricingEngine()
  const prices = useMemo(() => getPriceWorksheet(), [])

  // hit EP to get schema with pageName 'prices' or whatever it is

  // build filters from schema (and eventually build columns)

  // hit read EP, trigger Reload when filters change.

  return (
    <GraviGrid
      controlBarProps={{
        title: 'Price Worksheet',
      }}
      storageKey='worksheet'
      agPropOverrides={{
        rowHeight: 30,
        columnDefs,
        getRowId: (row) => row.data?.LocationName + row.data?.ProductName,
        components: { actionButtons: ActionButtons },
      }}
      rowData={prices?.Data}
    />
  )
}

const columnDefs = [
  {
    headerName: 'Location',
    field: 'LocationName',
    minWidth: 160,
  },
  {
    headerName: 'Commodity',
    field: 'CommodityName',
  },
  {
    headerName: 'Product',
    field: 'ProductName',
  },
  {
    headerName: 'Cost Build Up',
    field: 'LatestPostedPrice',
  },
  {
    headerName: 'Adjustment',
    field: 'LatestPostedPrice',
  },
  {
    headerName: 'Published Cost',
    field: 'LatestPostedPrice',
  },
  {
    headerName: 'Date',
    field: 'LatestPostedPrice',
  },
  {
    headerName: 'Adjustment',
    field: 'LatestPostedPrice',
  },
  {
    headerName: 'Replacement Cost',
    field: 'LatestPostedPrice',
  },
  {
    headerName: 'Delta',
    field: 'LatestPostedPrice',
  },
  {
    headerName: 'Delta %',
    field: 'LatestPostedPrice',
  },
]

function ActionButtons() {
  return (
    <Horizontal fullHeight horizontalCenter verticalCenter>
      <GraviButton icon={<EllipsisOutlined />} />
    </Horizontal>
  )
}
