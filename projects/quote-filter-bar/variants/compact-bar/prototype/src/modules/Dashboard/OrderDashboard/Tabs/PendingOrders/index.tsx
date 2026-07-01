import { InfoCircleOutlined } from '@ant-design/icons'
import { GraviButton, GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import moment from 'moment'
import React from 'react'

import { dateFormat } from '../../../../../components/TheArmory/helpers'

export function PendingOrdersTab({ data, setSelectedOrderId, setIsInfoModalOpen, isFetching }) {
  const customerPendingPromptsStorageKey = 'customerPendingPromptsGrid'
  const customerPendingPromptsGridViewManager = useGridViewManager(customerPendingPromptsStorageKey)

  const customerPendingForwardsStorageKey = 'customerPendingForwardsGrid'
  const customerPendingForwardsGridViewManager = useGridViewManager(customerPendingForwardsStorageKey)

  const promptData = data?.pendingPromptOrders?.Data
  const forwardData = data?.pendingForwardOrders?.Data
  return (
    <Vertical className='mt-4 justify-sb'>
      <Horizontal className='bg-1' height='50%'>
        <div style={{ width: '100%' }}>
          <GraviGrid
            agPropOverrides={{
              rowGroupPanelShow: 'never',
              columnDefs: getPromptColumnDefs(setSelectedOrderId, setIsInfoModalOpen),
              getRowId: (row) => row?.data?.TradeEntryId,
            }}
            rowData={promptData}
            loading={isFetching}
            storageKey={customerPendingPromptsStorageKey}
            gridViewManager={customerPendingPromptsGridViewManager}
            controlBarProps={{ title: 'Pending Prompts' }}
          />
        </div>
      </Horizontal>
      <Horizontal height='50%' className='bg-1 mt-4'>
        <div style={{ width: '100%' }}>
          <GraviGrid
            agPropOverrides={{
              rowGroupPanelShow: 'never',
              columnDefs: getForwardColumnDefs(setSelectedOrderId, setIsInfoModalOpen),
              getRowId: (row) => row?.data?.TradeEntryId,
            }}
            rowData={forwardData}
            loading={isFetching}
            controlBarProps={{ title: 'Pending Forwards' }}
            storageKey={customerPendingForwardsStorageKey}
            gridViewManager={customerPendingForwardsGridViewManager}
          />
        </div>
      </Horizontal>
    </Vertical>
  )
}

export const getPromptColumnDefs = (setSelectedOrderId, setIsInfoModalOpen) => {
  const columns = [
    {
      headerName: 'Details',
      maxWidth: 100,
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
      headerName: 'Product',
      field: 'ProductName',
    },
    {
      headerName: 'Location',
      field: 'FromLocationName',
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
      headerName: 'Effective From',
      field: 'EffectiveFromDateTime',
      valueFormatter: (params) => moment(params?.data?.EffectiveFromDateTime).format(dateFormat.MONTH_DATE_YEAR_TIME),
    },
    {
      headerName: 'Effective To',
      field: 'EffectiveToDateTime',
      valueFormatter: (params) => moment(params?.data?.EffectiveFromDateTime).format(dateFormat.MONTH_DATE_YEAR_TIME),
    },
  ]

  return columns
}

export const getForwardColumnDefs = (setSelectedOrderId, setIsInfoModalOpen) => {
  const columns = [
    {
      headerName: 'Details',
      maxWidth: 100,
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
      valueFormatter: (params) => (params?.data?.IsBidOrOffer ? 'Bid' : 'Market'),
      cellRenderer: ({ value }) => (value ? <Texto>Bid</Texto> : <Texto>Market</Texto>),
    },
    {
      headerName: 'Product',
      field: 'ProductName',
    },
    {
      headerName: 'Subtype',
      field: 'ContractPricingMethodCodeValueMeaning',
    },
    {
      headerName: 'Location',
      field: 'FromLocationName',
    },

    {
      headerName: 'Quantity (Gal)',
      field: 'Quantity',
      valueFormatter: ({ value }) => fmt.decimal(value, 0),
    },
    {
      headerName: 'Price',
      field: 'Price',
      valueFormatter: fmt.currency,
    },
    {
      headerName: 'Effective From',
      field: 'EffectiveFromDateTime',
      valueFormatter: (params) => moment(params?.data?.EffectiveFromDateTime).format(dateFormat.MONTH_DATE_YEAR_TIME),
    },
    {
      headerName: 'Effective To',
      field: 'EffectiveToDateTime',
      valueFormatter: (params) => moment(params?.data?.EffectiveFromDateTime).format(dateFormat.MONTH_DATE_YEAR_TIME),
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
