import { BBDTag } from '@gravitate-js/excalibrr'
import { ColDef, ValueFormatterParams } from 'ag-grid-community'
import { Button } from 'antd'
import dayjs from '@utils/dayjs'

interface ColumnDefsProps {
  getSecondaryPopup: (key: string) => void
}

export function columnDefs({ getSecondaryPopup }: ColumnDefsProps): ColDef[] {
  return [
    Key(),
    Instrument(),
    FuturesContract(),
    Location(),
    Product(),
    DeliveryPeriod(),
    MarketPrice(),
    FullPrice(),
    IsMissingPricing(),
    Notes(getSecondaryPopup),
  ]
}

function Key(): ColDef {
  return {
    field: 'Key',
    hide: true,
  }
}

function Instrument(): ColDef {
  return {
    headerName: 'Instrument',
    field: 'MarketPlatformInstrumentName',
    minWidth: 110,
  }
}

function FuturesContract(): ColDef {
  return {
    headerName: 'Futures Contract',
    field: 'FuturesMonth',
    minWidth: 110,
  }
}

function Location(): ColDef {
  return {
    field: 'Location',
    minWidth: 110,
  }
}

function Product(): ColDef {
  return {
    field: 'Product',
    minWidth: 110,
  }
}

function DeliveryPeriod(): ColDef {
  return {
    headerName: 'Delivery Period',
    field: 'DeliveryPeriodName',
    valueFormatter: (params: ValueFormatterParams) =>
      params?.data?.DeliveryPeriodName || dayjs(params?.data?.FuturesMonth).format('MMM YYYY'),
  }
}

function MarketPrice(): ColDef {
  return {
    headerName: 'Market Price',
    field: 'Market',
    valueFormatter: ({ value }) => fmt.currency(value),
    type: 'rightAligned',
  }
}

function FullPrice(): ColDef {
  return {
    headerName: 'Full Price',
    field: 'FullPrice',
    valueFormatter: ({ value }) => fmt.currency(value),
    type: 'rightAligned',
  }
}

function IsMissingPricing(): ColDef {
  return {
    field: 'IsMissingPricing',
    minWidth: 130,
    valueFormatter: ({ value }) => (value ? 'Missing' : 'Not Missing'),
    cellRenderer: ({ value }) => (
      <BBDTag theme2={!value} error={value} style={{ textAlign: 'center' }}>
        {value ? 'Prices Missing!' : 'All Prices Present'}
      </BBDTag>
    ),
  }
}

function Notes(getSecondaryPopup: (key: string) => void): ColDef {
  return {
    headerName: 'Notes',
    menuTabs: [],
    sortable: false,
    enableRowGroup: false,
    minWidth: 180,
    editable: false,
    filter: false,
    cellRenderer: ({ data }) => {
      if (data.IsDisabled) return null
      return (
        <Button className='mr-3' onClick={() => getSecondaryPopup(data.Key)}>
          View
        </Button>
      )
    },
  }
}
