import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import { dateFormat, getComputedStyleValue } from '@components/TheArmory/helpers'
import { GraviButton, Texto } from '@gravitate-js/excalibrr'
import { ColoredText, OrderAction, typeFilterParams } from '@modules/Dashboard/Shared/ColumnDefs/columnUtil'
import {
  Counterparty,
  Details,
  Instrument,
  LocationCol,
  OrderOrigin,
  Product,
  Quantity,
  TradeEntryId,
} from '@modules/Dashboard/Shared/ColumnDefs/sharedColumns'
import { formatDateWithTimezone } from '@utils/timezone'
import { Tooltip } from 'antd'
import { ColDef } from 'ag-grid-community'
import React from 'react'

export function getForwardColumnDefs(
  setSelectedOrderId: (id: number) => void,
  setIsInfoModalOpen: (open: boolean) => void,
  acceptOrRejectOrder: (data: unknown, action: OrderAction) => void,
  canWrite: boolean
): ColDef[] {
  return [
    Details(setSelectedOrderId, setIsInfoModalOpen),
    TradeEntryId(),
    Instrument(),
    OrderOrigin(),
    ForwardPurchaseType(),
    Product(),
    LocationCol(),
    Counterparty(),
    Quantity(),
    MarketPrice(),
    MarketMargin(),
    OfferedPrice(),
    EffectiveFrom(),
    EffectiveTo(),
    Currency(),
    UnitOfMeasure(),
    Actions(acceptOrRejectOrder, canWrite),
  ]
}

function ForwardPurchaseType(): ColDef {
  return {
    headerName: 'Purchase Type',
    field: 'IsBidOrOffer',
    filter: 'agTextColumnFilter',
    filterParams: typeFilterParams,
    valueFormatter: (params) => (params?.data?.IsBidOrOffer ? 'Bid' : 'Market'),
    cellRenderer: ({ value }) => (value ? <Texto>Bid</Texto> : <Texto>Market</Texto>),
  }
}

function MarketPrice(): ColDef {
  return {
    headerName: 'Market Price',
    field: 'Price',
    cellRenderer: ({ value, data }) => {
      const canCalculateMarketPrice = value != null && data.Margin != null && data.OrderMarginVsCurrentMarketMargin != null
      if (!canCalculateMarketPrice) return ''
      const price = fmt.currency(value - data.OrderMarginVsCurrentMarketMargin + data.Margin)
      if (data.ContractPricingMethodCodeValueMeaning === 'DeliveryPeriod') {
        return (
          <Tooltip title='Monthly pricing displayed as an average for quick reference'>
            <span>{price}*</span>
          </Tooltip>
        )
      }
      return price
    },
    cellStyle: { textAlign: 'center' },
    headerClass: 'ag-center-aligned-header',
  }
}

function MarketMargin(): ColDef {
  return {
    headerName: 'Market Margin',
    field: 'Margin',
    cellRenderer: ({ value, data }) => {
      if (value == null) return ''
      if (data.IsMarketPricingIncomplete) {
        return (
          <Tooltip title='Some delivery periods are missing pricing data'>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <ColoredText value={value} />
              <span>*</span>
            </span>
          </Tooltip>
        )
      }
      return <ColoredText value={value} />
    },
    cellStyle: ({ value }) => {
      if (value == null) return { textAlign: 'center' }
      if (value > 0) return { textAlign: 'center', backgroundColor: 'var(--theme-success-dim)' }
      if (value < 0) return { textAlign: 'center', backgroundColor: 'var(--theme-error-dim)' }
      return { textAlign: 'center' }
    },
    headerClass: 'ag-center-aligned-header',
  }
}

function OfferedPrice(): ColDef {
  return {
    headerName: 'Offered Price',
    field: 'Price',
    valueFormatter: ({ value }) => fmt.currency(value),
  }
}

function EffectiveFrom(): ColDef {
  return {
    headerName: 'Effective From',
    field: 'FromDateTime',
    valueFormatter: (params) =>
      formatDateWithTimezone(params?.data?.FromDateTime, dateFormat.MONTH_DATE_YEAR_TIME, params?.data?.TimeZoneAlias),
  }
}

function EffectiveTo(): ColDef {
  return {
    headerName: 'Effective To',
    field: 'ToDateTime',
    valueFormatter: (params) =>
      formatDateWithTimezone(params?.data?.ToDateTime, dateFormat.MONTH_DATE_YEAR_TIME, params?.data?.TimeZoneAlias),
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
    field: 'UnitOfMeasureName',
    hide: true,
  }
}
function Actions(acceptOrRejectOrder: (data: unknown, action: OrderAction) => void, canWrite: boolean): ColDef {
  return {
    colId: 'actions',
    suppressMovable: true,
    editable: false,
    filter: false,
    headerName: 'Actions',
    cellStyle: { display: 'flex', alignItems: 'center' },
    cellRenderer: ({ data }) => {
      const twoToneColorSuccess = getComputedStyleValue(document.documentElement, '--theme-success').trim()
      const twoToneColorReject = getComputedStyleValue(document.documentElement, '--theme-error').trim()
      const successDim = getComputedStyleValue(document.documentElement, '--theme-success-dim').trim()
      const rejectDim = getComputedStyleValue(document.documentElement, '--theme-error-dim').trim()
      const showActionButtons = data?.OrderStatusCodeValueMeaning === 'Pending'
      return (
        showActionButtons && (
          <div className='pending-prompts-actions'>
            <GraviButton
              icon={<CloseCircleTwoTone style={{ fontSize: 24 }} twoToneColor={[twoToneColorReject, rejectDim]} />}
              onClick={() => acceptOrRejectOrder(data, 'Withdraw')}
              className='ghost-gravi-button'
              disabled={!canWrite}
            />
            <GraviButton
              icon={<CheckCircleTwoTone style={{ fontSize: 24 }} twoToneColor={[twoToneColorSuccess, successDim]} />}
              onClick={() => acceptOrRejectOrder(data, 'Accept')}
              className='ghost-gravi-button'
              disabled={!canWrite}
            />
          </div>
        )
      )
    },
  }
}
