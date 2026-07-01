import { dateFormat } from '@components/TheArmory/helpers'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Popover } from 'antd'
import moment from 'moment'
import React from 'react'

import { ActionMenu } from './components/actionMenu'

const sortByNumberThenText = (list: string[]) => {
  return list
    .filter((item) => item && item.trim()) // Filter out nulls or empty strings
    .map((item) => item.trim()) // Trim whitespace
    .sort((a, b) => {
      const numA = parseInt(a.split(' ')[0], 10)
      const numB = parseInt(b.split(' ')[0], 10)

      if (isNaN(numA) && isNaN(numB)) {
        // Both are NaN
        return a.localeCompare(b)
      }
      if (isNaN(numA)) {
        // A is NaN, but B is not
        return 1
      }
      if (isNaN(numB)) {
        // B is NaN, but A is not
        return -1
      }
      if (numA === numB) {
        // Both are numbers and equal
        return a.localeCompare(b)
      }

      return numA - numB // Both are numbers and not equal
    })
}

export const getContractReportColumnDefs = (dataQuery: any, cancelContractMutation: any) => [
  {
    field: 'TradeEntryId',
    cellRenderer: 'agGroupCellRenderer',
    valueFormatter: () => '',
    headerName: '',
    maxWidth: 50,
  },
  {
    field: 'TradeEntryId',
    headerName: 'Id',
    maxWidth: 70,
  },
  {
    field: 'OrderStatus',
    headerName: 'Status',
    maxWidth: 90,
  },
  {
    headerName: 'Internal Contract#',
    field: 'InternalContractNumber',
    minWidth: 200,
    cellRenderer: (params) => params?.data?.InternalContractNumber || '',
    hide: true,
  },
  {
    headerName: 'External Contract#',
    field: 'ExternalContractNumber',
    minWidth: 200,
    cellRenderer: (params) => params?.data?.ExternalContractNumber || '',
    hide: true,
  },
  {
    field: 'Description',
    minWidth: 200,
    cellRenderer: (params) => {
      const description = params?.data?.Description
      if (!description) return ''
      return description
    },
  },
  {
    field: 'CreatedDateTime',
    headerName: 'Created',
    valueGetter: (params) => moment(params?.data?.CreatedDateTime),
    valueFormatter: ({ value }) => moment(value).format(dateFormat.DATE_SLASH),
    filter: 'agDateColumnFilter',
  },
  {
    field: 'ValuationCalendarName',
    headerName: 'Calendar',
    hide: true,
  },
  {
    field: 'FromDateTime',
    headerName: 'Contract From',
    filter: 'agDateColumnFilter',
    valueGetter: (params) => moment(params?.data?.FromDateTime),
    valueFormatter: ({ value }) => moment(value).format(dateFormat.DATE_SLASH),
  },
  {
    field: 'ToDateTime',
    headerName: 'Contract To',
    filter: 'agDateColumnFilter',
    valueGetter: (params) => moment(params?.data?.ToDateTime),

    valueFormatter: ({ value }) => moment(value).format(dateFormat.DATE_SLASH),
  },
  {
    field: 'Type',
  },
  {
    minWidth: 140,
    field: 'TradeInstrument',
    headerName: 'Instrument',
  },
  {
    minWidth: 220,
    field: 'InternalCounterPartyName',
    headerName: 'Internal Counterparty',
  },
  {
    minWidth: 300,

    field: 'ExternalCounterPartyName',
    headerName: 'External Company',
  },
  {
    minWidth: 300,
    field: 'Locations',
    valueGetter: (params) => params?.data?.Locations,
    cellRenderer: ({ value }) => {
      const locations = value
      if (locations?.length === 0 || locations === null || locations === undefined) return 'N/A'
      if (locations?.length === 1) return locations[0]

      const sortedLocations = sortByNumberThenText(locations)

      return (
        <Popover
          placement='bottomLeft'
          content={
            <Vertical>
              {sortedLocations?.map((location) => (
                <Horizontal key={location}>
                  <Texto>{location}</Texto>
                </Horizontal>
              ))}
            </Vertical>
          }
        >
          Multiple Locations
        </Popover>
      )
    },
  },
  {
    flex: 3,
    headerName: 'Products',
    valueGetter: (params) => Object.keys(params?.data?.Products),
    cellRenderer: ({ value }: { value: string[] }) => {
      if (value.length <= 2) return value.join(', ')

      return (
        <Popover
          placement='bottomLeft'
          content={
            <Vertical>
              {value.map((product) => (
                <Horizontal key={product}>
                  <Texto>{product}</Texto>
                </Horizontal>
              ))}
            </Vertical>
          }
        >
          More Available Groups
        </Popover>
      )
    },
  },
  {
    minWidth: 120,
    field: 'TotalVolume',
    headerName: 'Volume',

    valueGetter: (params) =>
      params?.data?.TotalVolume?.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
  },
  {
    field: 'Book',
    headerName: 'Strategy',
  },
  {
    maxWidth: 180,
    headerName: 'Actions',
    pinned: 'right',
    cellRenderer: ActionMenu,
    cellRendererParams: {
      primaryKey: 'TradeEntryId',
      dataQuery,
      cancelContractMutation,
    },
  },
]
