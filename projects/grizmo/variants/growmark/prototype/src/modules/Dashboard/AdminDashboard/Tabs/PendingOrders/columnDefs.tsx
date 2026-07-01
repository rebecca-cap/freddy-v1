import { CheckCircleTwoTone, CloseCircleTwoTone, InfoCircleOutlined } from '@ant-design/icons'
import { dateFormat, getComputedStyleValue } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import moment from 'moment/moment'
import React from 'react'

export const getPromptColumnDefs = (setSelectedOrderId, setIsInfoModalOpen, acceptOrRejectOrder, canWrite) => {
  return [
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
      headerName: 'Market Price',
      field: 'Price',
      valueFormatter: ({ value, data }) => {
        if (data?.SourceIndexOfferId != null) return 'N/A'
        return `${fmt.currency(value - data.OrderMarginVsCurrentMarketMargin + data.Margin)}`
      },
      type: 'rightAligned',
    },
    {
      headerName: 'Market Margin',
      field: 'Margin',
      cellRenderer: ({ value, data }) => {
        if (data?.SourceIndexOfferId != null) return <Texto align='right'>N/A</Texto>
        return <ColoredText value={value} />
      },
      type: 'rightAligned',
    },
    {
      headerName: 'Order Price',
      field: 'Price',
      valueFormatter: ({ value, data }) => {
        if (data?.SourceIndexOfferId != null) return data?.IndexOfferDisplay?.FormulaDisplayName
        return fmt.currency(value)
      },
      type: 'rightAligned',
    },

    {
      headerName: 'Order Margin',
      field: 'OrderMarginVsCurrentMarketMargin',
      cellRenderer: ({ value, data }) => {
        if (data?.SourceIndexOfferId != null) {
          return <ColoredText value={data?.IndexOfferDisplay?.ContractDifferential} />
        }
        return <ColoredText value={value} />
      },
      type: 'rightAligned',
      sort: 'desc',
    },
    {
      headerName: 'Bid Expiration',
      field: 'BidExpirationDate',
      valueFormatter: (params) =>
        params?.data?.TradeEntryExpiry
          ? moment(params?.data?.TradeEntryExpiry).format(dateFormat.MONTH_DATE_YEAR_TIME)
          : 'N/A',
      type: 'rightAligned',
    },
    {
      colId: 'actions',
      suppressMovable: true,
      editable: false,
      headerName: 'Actions',
      cellRenderer: ({ data }) => {
        const twoToneColorSuccess = getComputedStyleValue(document.documentElement, '--theme-success').trim()
        const twoToneColorReject = getComputedStyleValue(document.documentElement, '--theme-error').trim()
        const showActionButtons = data?.OrderStatusCodeValueMeaning === 'Pending'
        return (
          showActionButtons && (
            <Horizontal style={{ gap: '1rem', alignItems: 'center' }}>
              <GraviButton
                icon={<CloseCircleTwoTone style={{ fontSize: 24 }} twoToneColor={twoToneColorReject} />}
                onClick={() => acceptOrRejectOrder(data, 'Withdraw')}
                style={{ backgroundColor: 'transparent' }}
                disabled={!canWrite}
              />
              <GraviButton
                icon={<CheckCircleTwoTone style={{ fontSize: 24 }} twoToneColor={twoToneColorSuccess} />}
                onClick={() => acceptOrRejectOrder(data, 'Accept')}
                style={{ backgroundColor: 'transparent' }}
                disabled={!canWrite}
              />
            </Horizontal>
          )
        )
      },
    },
  ]
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

function ColoredText({ value }) {
  const getColor = (value) => {
    if (value === 0) return 'default'
    if (value > 0) return 'success'
    if (value < 0) return 'error'
  }
  return (
    <Texto align='right' appearance={getColor(value)}>
      ${fmt.decimal(value)}
    </Texto>
  )
}

export const getForwardColumnDefs = (setSelectedOrderId, setIsInfoModalOpen, acceptOrRejectOrder, canWrite) => {
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
      valueFormatter: (params) => (params?.data?.IsBidOrOffer ? 'Bid' : 'Market'),
      cellRenderer: ({ value }) => (value ? <Texto>Bid</Texto> : <Texto>Market</Texto>),
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
      headerName: 'Offered Price',
      field: 'Price',
      valueFormatter: fmt.currency,
    },
    {
      headerName: 'Effective From',
      field: 'FromDateTime',
      valueFormatter: (params) => moment(params?.data?.FromDateTime).format(dateFormat.MONTH_DATE_YEAR_TIME),
    },
    {
      headerName: 'Effective To',
      field: 'ToDateTime',
      valueFormatter: (params) => moment(params?.data?.ToDateTime).format(dateFormat.MONTH_DATE_YEAR_TIME),
    },
    {
      colId: 'actions',
      suppressMovable: true,
      editable: false,
      headerName: 'Actions',
      cellRenderer: ({ data }) => {
        const twoToneColorSuccess = getComputedStyleValue(document.documentElement, '--theme-success').trim()
        const twoToneColorReject = getComputedStyleValue(document.documentElement, '--theme-error').trim()
        const showActionButtons = data?.OrderStatusCodeValueMeaning === 'Pending'
        return (
          showActionButtons && (
            <Horizontal style={{ gap: '1rem', alignItems: 'center' }}>
              <GraviButton
                icon={<CloseCircleTwoTone style={{ fontSize: 24 }} twoToneColor={twoToneColorReject} />}
                onClick={() => acceptOrRejectOrder(data, 'Withdraw')}
                style={{ backgroundColor: 'transparent' }}
                disabled={!canWrite}
              />
              <GraviButton
                icon={<CheckCircleTwoTone style={{ fontSize: 24 }} twoToneColor={twoToneColorSuccess} />}
                onClick={() => acceptOrRejectOrder(data, 'Accept')}
                style={{ backgroundColor: 'transparent' }}
                disabled={!canWrite}
              />
            </Horizontal>
          )
        )
      },
    },
  ]

  return columns
}
