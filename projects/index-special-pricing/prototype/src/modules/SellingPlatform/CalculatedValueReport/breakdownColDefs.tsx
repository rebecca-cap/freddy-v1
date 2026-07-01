import { ESTIMATED_ROW_BG } from '@constants/colors'
import { ColDef } from 'ag-grid-community'

export function breakdownColumnDefs(): ColDef[] {
  return [Key(), PricingId(), PriceName(), PriceType(), Status(), Required(), Price(), Percent(), CalculatedPrice()]
}

function Key(): ColDef {
  return {
    field: 'Key',
    hide: true,
  }
}

function PricingId(): ColDef {
  return {
    field: 'PricingId',
    hide: true,
  }
}

function PriceName(): ColDef {
  return {
    headerName: 'Price Name',
    field: 'PricingName',
    minWidth: 200,
  }
}

function PriceType(): ColDef {
  return {
    headerName: 'Price Type',
    field: 'PriceTypeDisplay',
  }
}

function Status(): ColDef {
  return {
    headerName: 'Status',
    field: 'BackingPrice.PriceStatus',
    maxWidth: 120,
    cellStyle: ({ data, value }) => {
      if (!value) {
        if (data.IsRequired) {
          return { backgroundColor: 'var(--theme-error-dim)' }
        } else return undefined
      }

      switch (value) {
        case 'Estimate':
          return { backgroundColor: ESTIMATED_ROW_BG }
        case 'Old':
          return { backgroundColor: 'var(--theme-warning-dim)' }
        case 'Missing':
          return { backgroundColor: 'var(--theme-error-dim)' }
        case 'Actual':
          return { backgroundColor: 'var(--theme-success-dim)' }
        default:
          return undefined
      }
    },
    valueGetter: ({ data }) => {
      if (!data.BackingPrice && data.IsRequired === 'No') return 'Not required'
      if (!data.BackingPrice) return 'Missing'
      const initial = data.BackingPrice.PriceStatus
      return initial === 'E'
        ? 'Estimate'
        : initial === 'O'
        ? 'Old'
        : initial === 'M'
        ? 'Missing'
        : initial === 'A'
        ? 'Actual'
        : ''
    },
  }
}

function Required(): ColDef {
  return {
    headerName: 'Required',
    field: 'IsRequired',
  }
}

function Price(): ColDef {
  return {
    headerName: 'Price',
    field: 'CurrentValue',
    valueFormatter: ({ value }) => (value != null ? `${fmt.currency(value)}` : 'Effective Price Not Found'),
    type: 'rightAligned',
  }
}

function Percent(): ColDef {
  return {
    headerName: 'Percent',
    field: 'PricingPercentage',
    valueFormatter: ({ value }) => `${fmt.decimal(value, 0)}%`,
    type: 'rightAligned',
  }
}

function CalculatedPrice(): ColDef {
  return {
    headerName: 'Calculated Price',
    field: 'CalculatedValue',
    valueFormatter: ({ value }) => (value != null ? `${fmt.currency(value)}` : 'N/A'),
    type: 'rightAligned',
  }
}
