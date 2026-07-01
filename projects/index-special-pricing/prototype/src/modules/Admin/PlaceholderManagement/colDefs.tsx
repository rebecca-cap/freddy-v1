import { dateFormat } from '@components/TheArmory/helpers'
import { BBDTag } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import { message } from 'antd'
import moment from 'moment'
import React from 'react'

import { BulkMissingPriceEditor } from './components/BulkMissingPriceEditor'

const isDirty = (row, dirtyPlaceHolders) => {
  if (dirtyPlaceHolders?.map((dp) => dp?.TradeEntryPriceComponentId).includes(row?.TradeEntryPriceComponentId)) {
    return true
  }
  return false
}

export const getPlaceholderColumnDefs = (dirtyPlaceHolders) => {
  const columns: ColDef[] = [
    {
      headerName: 'Trade ID',
      field: 'TradeEntryId',
      editable: false,
    },
    {
      headerName: 'Trade Detail ID',
      field: 'TradeEntryDetailId',
      editable: false,
    },
    {
      headerName: 'Trade ID + Detail ID',
      editable: false,
      valueGetter: (params) => `${params.data.FormulaResultComponentId} - ${params.data.TradeEntryDetailId}`,
    },
    {
      field: 'TradeEntryFromDateTime',
      headerName: 'Contract Effective From',
      hide: true,
      editable: false,
      valueFormatter: ({ value }) => moment(value).format(dateFormat.MONTH_DATE_YEAR_TIME),
    },
    {
      field: 'TradeEntryToDateTime',
      headerName: 'Contract Effective To',
      hide: true,
      editable: false,
      valueFormatter: ({ value }) => moment(value).format(dateFormat.MONTH_DATE_YEAR_TIME),
    },
    {
      field: 'TradeEntryDetailFromDateTime',
      headerName: 'Delivery Period From',
      editable: false,
      valueFormatter: ({ value }) => moment(value).format(dateFormat.MONTH_DATE_YEAR_TIME),
    },
    {
      field: 'TradeEntryDetailToDateTime',
      headerName: 'Delivery Period To',
      editable: false,
      valueFormatter: ({ value }) => moment(value).format(dateFormat.MONTH_DATE_YEAR_TIME),
    },
    {
      headerName: 'Product + Location',
      editable: false,
      valueGetter: (params) => `${params.data.Location} - ${params.data.Product}`,
    },
    {
      headerName: 'Location',
      field: 'Location',
      editable: false,
    },
    {
      headerName: 'Product',
      field: 'Product',
      editable: false,
    },
    {
      headerName: 'Price Component',
      field: 'ComponentName',
      editable: false,
    },
    {
      field: 'TradeEntryUpdatedDateTime',
      headerName: 'Last Updated',
      editable: false,
      valueFormatter: ({ value }) => moment(value).format(dateFormat.MONTH_DATE_YEAR_TIME),
    },
    {
      headerName: 'Value',
      field: 'Price',
      cellEditor: 'agTextCellEditor',
      bulkCellEditor: BulkMissingPriceEditor,
      isBulkEditable: true,
      valueFormatter: fmt.currency,
      valueSetter: (params) => {
        if (isNaN(Number(params.newValue))) {
          message.error('Value must be a valid number')

          return false
        }
        const newPrice = params.newValue

        params.data.Price = newPrice
        return true
      },
    },
    {
      headerName: 'Status',
      field: 'OrderStatus',
      editable: false,
      cellRenderer: (params) => {
        const price = params.data.Price
        if (!price) {
          return (
            <BBDTag error style={{ textAlign: 'center' }}>
              Missing
            </BBDTag>
          )
        }
        if (isDirty(params.data, dirtyPlaceHolders)) {
          return (
            <BBDTag theme1 style={{ textAlign: 'center' }}>
              Updated
            </BBDTag>
          )
        }
        return (
          <BBDTag success style={{ textAlign: 'center' }}>
            Priced
          </BBDTag>
        )
      },
    },
  ]

  return columns
}
