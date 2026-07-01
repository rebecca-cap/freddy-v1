import { InfoCircleOutlined } from '@ant-design/icons'
import { BBDTag, GraviButton, GraviGrid, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import moment from 'moment'
import React from 'react'

import { dateFormat } from '../../../../../components/TheArmory/helpers'

export function ProcessedOrdersTab({ data, setSelectedOrderId, setIsInfoModalOpen, isFetching }) {
  const orderData = data?.recentlyProcessedForwards?.Data.concat(data?.recentlyProcessedPrompts?.Data)
  orderData?.sort(function (a, b) {
    return b.TradeEntryId - a.TradeEntryId
  })

  const customerProcessedForwardsStorageKey = 'customerProcessedForwardsGrid'
  const customerProcessedForwardsGridViewManager = useGridViewManager(customerProcessedForwardsStorageKey)

  return (
    <Horizontal className='bg-1 mt-4' height='100%'>
      <div style={{ width: '100%' }}>
        <GraviGrid
          agPropOverrides={{
            rowGroupPanelShow: 'never',
            columnDefs: getColumnDefs(setSelectedOrderId, setIsInfoModalOpen),
            getRowId: (row) => row.data.TradeEntryId,
          }}
          storageKey={customerProcessedForwardsStorageKey}
          gridViewManager={customerProcessedForwardsGridViewManager}
          rowData={orderData}
          loading={isFetching}
          controlBarProps={{ title: 'Recently Processed Orders' }}
        />
      </div>
    </Horizontal>
  )
}

export const getColumnDefs = (setSelectedOrderId, setIsInfoModalOpen) => {
  const columns = [
    {
      headerName: 'Details',
      cellRenderer: (params) => (
        <GraviButton
          icon={<InfoCircleOutlined />}
          theme1
          appearance='outline'
          onClick={() => {
            setIsInfoModalOpen(true)
            setSelectedOrderId(params.data.TradeEntryId)
          }}
        />
      ),
    },
    {
      headerName: 'ID #',
      field: 'TradeEntryId',
    },
    {
      headerName: 'Instrument',
      field: 'FullTypeName',
    },
    {
      headerName: 'Order Origin',
      field: 'OrderOriginType',
      filter: 'agTextColumnFilter',
      filterParams: orderOriginTypeFilterParams,
    },
    {
      headerName: 'Purchase Type',
      field: 'IsBidOrOffer',
      filter: 'agTextColumnFilter',
      filterParams: typeFilterParams,
      valueGetter: (params) => {
        if (params?.data?.SourceIndexOfferId != null) return 'Index'
        return params?.data?.IsBidOrOffer ? 'Bid' : 'Market'
      },
      cellRenderer: (params) => {
        if (params?.data?.SourceIndexOfferId != null) return <Texto>Index</Texto>
        return params?.data?.IsBidOrOffer ? <Texto>Bid</Texto> : <Texto>Market</Texto>
      },
    },
    {
      headerName: 'Status',
      field: 'OrderStatusCodeValueDisplay',
      cellRenderer: ({ data }) => {
        if (data) return getStatus(data.OrderStatusCodeValueDisplay)
        return ''
      },
    },
    {
      headerName: 'Product',
      field: 'ProductName',
    },
    {
      headerName: 'Location',
      field: 'FromLocationName',
    },
    {
      headerName: 'Counterparty',
      field: 'ExternalCounterPartyName',
    },
    {
      headerName: 'Quantity (Gal)',
      field: 'Quantity',
      valueFormatter: ({ value }) => fmt.decimal(value, 0),
    },
    {
      headerName: 'Price',
      field: 'Price',
      valueFormatter: ({ value, data }) => {
        if (data?.SourceIndexOfferId != null) return data?.IndexOfferDisplay?.FormulaDisplayName
        return fmt.currency(value)
      },
    },
    {
      headerName: 'Accepted Date',
      field: 'OrderAcceptedDateTime',
      valueFormatter: (params) =>
        params.data?.OrderAcceptedDateTime != null
          ? moment(params.data?.OrderAcceptedDateTime)?.format(dateFormat.MONTH_DATE_YEAR_TIME)
          : '',
    },
  ]

  return columns
}

const typeFilterParams = {
  filterOptions: [
    'empty',
    {
      displayKey: 'index',
      displayName: 'Index',
      predicate: (_, cellValue) => cellValue === 'Index',
      numberOfInputs: 0,
    },
    {
      displayKey: 'bid',
      displayName: 'Bid',
      predicate: (_, cellValue) => cellValue === 'Bid',
      numberOfInputs: 0,
    },
    {
      displayKey: 'market',
      displayName: 'Market',
      predicate: (_, cellValue) => cellValue === 'Market',
      numberOfInputs: 0,
    },
  ],
  maxNumConditions: 0,
}

const orderOriginTypeFilterParams = {
  filterOptions: [
    'empty',
    {
      displayKey: 'marketplace',
      displayName: 'Marketplace',
      predicate: (_, cellValue) => cellValue === 'Marketplace',
      numberOfInputs: 0,
    },
    {
      displayKey: 'auction',
      displayName: 'Auction',
      predicate: (_, cellValue) => cellValue === 'Auction',
      numberOfInputs: 0,
    },
    {
      displayKey: 'special',
      displayName: 'Special',
      predicate: (_, cellValue) => cellValue === 'Special',
      numberOfInputs: 0,
    },
  ],
  maxNumConditions: 0,
}

const getStatus = (status) => {
  switch (status) {
    case 'Accepted':
      return (
        <BBDTag success style={{ textAlign: 'center' }}>
          Accepted
        </BBDTag>
      )
    case 'Filled':
      return (
        <BBDTag success style={{ textAlign: 'center' }}>
          Accepted
        </BBDTag>
      )
    case 'Canceled':
      return (
        <BBDTag error style={{ textAlign: 'center' }}>
          Canceled
        </BBDTag>
      )
    case 'Declined':
      return (
        <BBDTag error style={{ textAlign: 'center' }}>
          Declined
        </BBDTag>
      )
    default:
      return <BBDTag style={{ textAlign: 'center' }}> {status} </BBDTag>
  }
}
