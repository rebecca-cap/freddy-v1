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
import { ColDef } from 'ag-grid-community'

export function getPromptColumnDefs(
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
    PromptPurchaseType(),
    Product(),
    LocationCol(),
    Counterparty(),
    Quantity(),
    MarketPrice(),
    MarketMargin(),
    OrderPrice(),
    OrderMargin(),
    BidExpiration(),
    Currency(),
    UnitOfMeasure(),
    Actions(acceptOrRejectOrder, canWrite),
  ]
}

function PromptPurchaseType(): ColDef {
  return {
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
  }
}

function MarketPrice(): ColDef {
  return {
    headerName: 'Market Price',
    field: 'Price',
    valueFormatter: ({ value, data }) => {
      if (data?.SourceIndexOfferId != null) return 'N/A'
      const canCalculateMarketPrice = value != null && data?.Margin != null && data?.OrderMarginVsCurrentMarketMargin != null
      if (!canCalculateMarketPrice) return ''
      return `${fmt.currency(value - data.OrderMarginVsCurrentMarketMargin + data.Margin)}`
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
      if (data?.SourceIndexOfferId != null) return <Texto align='center'>N/A</Texto>
      if (value == null) return ''
      return <ColoredText value={value} />
    },
    cellStyle: ({ value, data }) => {
      if (data?.SourceIndexOfferId != null || value == null) return { textAlign: 'center' }
      if (value > 0) return { textAlign: 'center', backgroundColor: 'var(--theme-success-dim)' }
      if (value < 0) return { textAlign: 'center', backgroundColor: 'var(--theme-error-dim)' }
      return { textAlign: 'center' }
    },
    headerClass: 'ag-center-aligned-header',
  }
}

function OrderPrice(): ColDef {
  return {
    headerName: 'Order Price',
    field: 'Price',
    valueFormatter: ({ value, data }) => {
      if (data?.SourceIndexOfferId != null) return data?.IndexOfferDisplay?.PricingDisplayText
      if (value == null) return ''
      return fmt.currency(value)
    },
    cellStyle: { textAlign: 'center' },
    headerClass: 'ag-center-aligned-header',
  }
}

function OrderMargin(): ColDef {
  return {
    headerName: 'Order Margin',
    field: 'OrderMarginVsCurrentMarketMargin',
    cellRenderer: ({ value, data }) => {
      if (data?.SourceIndexOfferId != null) {
        return <ColoredText value={data?.IndexOfferDisplay?.ContractDifferential} />
      }
      if (value == null) return ''
      return <ColoredText value={value} />
    },
    cellStyle: ({ value, data }) => {
      const marginValue = data?.SourceIndexOfferId != null ? data?.IndexOfferDisplay?.ContractDifferential : value
      if (marginValue == null) return { textAlign: 'center' }
      if (marginValue > 0) return { textAlign: 'center', backgroundColor: 'var(--theme-success-dim)' }
      if (marginValue < 0) return { textAlign: 'center', backgroundColor: 'var(--theme-error-dim)' }
      return { textAlign: 'center' }
    },
    headerClass: 'ag-center-aligned-header',
    sort: 'desc',
  }
}

function BidExpiration(): ColDef {
  return {
    headerName: 'Bid Expiration',
    field: 'BidExpirationDate',
    valueFormatter: (params) =>
      params?.data?.TradeEntryExpiry
        ? formatDateWithTimezone(
            params.data.TradeEntryExpiry,
            dateFormat.MONTH_DATE_YEAR_TIME,
            params.data.TimeZoneAlias
          )
        : 'N/A',
    type: 'rightAligned',
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
