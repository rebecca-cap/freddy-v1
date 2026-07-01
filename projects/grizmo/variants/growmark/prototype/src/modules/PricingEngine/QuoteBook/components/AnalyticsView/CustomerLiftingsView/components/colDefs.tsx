import { RectangularProgressBar } from '@components/shared/Grid/RectangularProgressBar'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { numberToShortString } from '@utils/index'
import { ColDef } from 'ag-grid-community'

export const CustomerLiftingsColumns = () => {
  return [
    Customer(),
    Volume(),
    Freq(),
    InvoiceToPosted(),
    PercentDiscounted(),
    InvoicedMargin(),
    PostedMargin(),
    Share(),
  ] as ColDef[]
}

const Customer = (): ColDef => ({
  headerName: 'Customer',
  field: 'CounterParty',
  cellRenderer: ({ value, rowIndex }) => {
    return (
      <Horizontal verticalCenter>
        <Texto className='customer-liftings-number-badge mr-2'>{rowIndex + 1}</Texto>
        {value}
      </Horizontal>
    )
  },
})

const Volume = (): ColDef => ({
  headerName: 'Volume',
  field: 'CounterPartyTotalQuantity',
  cellRenderer: ({ value }) => {
    return (
      <Horizontal verticalCenter>
        <Texto>{numberToShortString(value, 1)}</Texto>
      </Horizontal>
    )
  },
})

const Freq = (): ColDef => ({
  headerName: 'Freq',
  field: 'AvgBoLsPerWeek',
  cellRenderer: ({ value }) => {
    return (
      <Horizontal verticalCenter>
        <Texto>{value}/wk</Texto>
      </Horizontal>
    )
  },
})

const InvoiceToPosted = (): ColDef => ({
  headerName: 'Invoice to posted',
  field: 'AvgDeltaToQuote',
  cellRenderer: ({ value }) => {
    return (
      <Horizontal verticalCenter>
        <Texto>{fmt.currency(value)}</Texto>
      </Horizontal>
    )
  },
})

const PercentDiscounted = (): ColDef => ({
  headerName: '% Discounted',
  field: 'AvgPercentDiscount',
  cellRenderer: ({ value }) => {
    return (
      <Horizontal verticalCenter>
        <Texto>{fmt.decimal(value, 2)}%</Texto>
      </Horizontal>
    )
  },
})

const InvoicedMargin = (): ColDef => ({
  headerName: 'Invoiced Margin',
  field: 'AvgInvoicedMargin',
  cellRenderer: ({ value }) => {
    return (
      <Horizontal verticalCenter>
        <Texto>{fmt.currency(value, 4)}</Texto>
      </Horizontal>
    )
  },
})

const PostedMargin = (): ColDef => ({
  headerName: 'Posted Margin',
  field: 'AvgQuotedMargin',
  cellRenderer: ({ value }) => {
    return (
      <Horizontal verticalCenter>
        <Texto>{fmt.currency(value, 4)}</Texto>
      </Horizontal>
    )
  },
})

const Share = (): ColDef => ({
  headerName: 'Share',
  field: 'SharePercentage',
  cellRenderer: ({ value }) => {
    return (
      <Horizontal verticalCenter>
        <RectangularProgressBar percent={value as number} />
      </Horizontal>
    )
  },
})
