import { dateFormat } from '@components/TheArmory/helpers'
import { BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownSubmittedOrder } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { statusColor } from '@modules/Dashboard/SpecialOffers/utils/Utils/StatusColors'
import { ColDef } from 'ag-grid-community'
import { Button } from 'antd'
import moment from 'moment'
import React from 'react'

type BidResponsesColumnDefProps = {
  reservePrice: number | undefined
  onApprove: (row: SpecialOfferBreakdownSubmittedOrder) => void
  onReject: (row: SpecialOfferBreakdownSubmittedOrder) => void
}

export const BidResponsesColumns = ({ reservePrice, onApprove, onReject }: BidResponsesColumnDefProps): ColDef[] => {
  return [Customer(), Price(reservePrice), Volume(), Status(), Submitted(), Actions(onApprove, onReject)]
}

const Customer = (): ColDef => ({
  headerName: 'Counterparty',
  field: 'CustomerName',
})

const Price = (reservePrice): ColDef => ({
  headerName: 'Bid Price',
  field: 'OrderPrice',
  valueFormatter: ({ value }) => fmt.currency(value, 4),
  cellRenderer: ({ value, data }: { value: number; data: SpecialOfferBreakdownSubmittedOrder }) => {
    const isAbove = value > reservePrice
    const color = isAbove ? 'var(--theme-success)' : 'var(--theme-error)'

    return (
      <Horizontal style={{ width: '100%', justifyContent: 'center', gap: 5, alignItems: 'center' }}>
        <Texto style={{ color, fontWeight: 500 }}>{fmt.currency(value, 4)}</Texto>
      </Horizontal>
    )
  },
})

const Volume = (): ColDef => ({
  headerName: 'Volume',
  field: 'OrderVolume',
  valueFormatter: ({ value }) => `${fmt.integer(value, 0)} gal(s)`,
})

const Status = (): ColDef => ({
  headerName: 'Status',
  field: 'OrderStatus',
  cellRenderer: ({ value }) => {
    return (
      <Horizontal horizontalCenter className={'width-100%'} style={{ gap: 10, justifyContent: 'center' }}>
        {getStatus(value)}
      </Horizontal>
    )
  },
})

const Submitted = (): ColDef => ({
  headerName: 'Submitted',
  field: 'SubmittedDateTime',
  valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.MONTH_DATE_TIME) : value),
})

const Actions = (
  onApprove: (row: SpecialOfferBreakdownSubmittedOrder) => void,
  onReject: (row: SpecialOfferBreakdownSubmittedOrder) => void
): ColDef => ({
  headerName: 'Actions',
  filter: false,
  sortable: false,
  suppressFiltersToolPanel: true,
  editable: false,
  cellRenderer: ({ data }: { data: SpecialOfferBreakdownSubmittedOrder }) => {
    if (data.OrderStatus === 'Pending')
      return (
        <Horizontal horizontalCenter className={'width-100%'} style={{ gap: 5, justifyContent: 'center' }}>
          <Button type='link' title='Accept' onClick={() => onApprove(data)}>
            Accept
          </Button>
          <Button type='link' title='Reject' danger onClick={() => onReject(data)}>
            Reject
          </Button>
        </Horizontal>
      )
  },
})

const getStatus = (status) => {
  const base = statusColor(status)

  switch (status) {
    case 'Accepted':
      return (
        <BBDTag
          style={{
            textAlign: 'center',
            background: `color-mix(in srgb, ${base} 70%, white)`, // 20% of base, 80% white
            color: 'white',
            width: '60%',
          }}
        >
          Accepted
        </BBDTag>
      )
    case 'Pending':
      return (
        <BBDTag
          style={{
            textAlign: 'center',
            background: `color-mix(in srgb, ${base} 70%, white)`, // 20% of base, 80% white
            color: 'white',
            width: '60%',
          }}
        >
          Pending
        </BBDTag>
      )
    case 'Canceled':
      return (
        <BBDTag
          style={{
            textAlign: 'center',
            background: `color-mix(in srgb, ${base} 70%, white)`, // 20% of base, 80% white
            color: 'white',
            width: '60%',
          }}
        >
          Canceled
        </BBDTag>
      )
    case 'Declined':
      return (
        <BBDTag
          style={{
            textAlign: 'center',
            background: `color-mix(in srgb, ${base} 60%, white)`, // 20% of base, 80% white
            color: 'white',
            width: '60%',
          }}
        >
          Declined
        </BBDTag>
      )
    default:
      return <BBDTag style={{ textAlign: 'center', width: '60%' }}> {status} </BBDTag>
  }
}
