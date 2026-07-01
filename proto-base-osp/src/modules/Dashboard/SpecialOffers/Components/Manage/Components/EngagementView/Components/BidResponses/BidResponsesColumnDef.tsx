import { dateFormat } from '@components/TheArmory/helpers'
import { BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr'
import {
  CustomerGroupTag,
  SpecialOfferBreakdownSubmittedOrder,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { OrderStatusTag } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/Components/BidResponses/OrderStatusTag/OrderStatusTag'
import { formatDateWithTimezone } from '@utils/timezone'
import { ColDef } from 'ag-grid-community'
import { Button, Popover } from 'antd'
import React from 'react'

type BidResponsesColumnDefProps = {
  reservePrice: number | undefined
  onApprove: (row: SpecialOfferBreakdownSubmittedOrder) => void
  onReject: (row: SpecialOfferBreakdownSubmittedOrder) => void
  uomSymbol?: string
}

export const BidResponsesColumns = ({
  reservePrice,
  onApprove,
  onReject,
  uomSymbol,
}: BidResponsesColumnDefProps): ColDef[] => {
  return [
    OrderId(),
    Customer(),
    Groups(),
    Price(reservePrice),
    Volume(uomSymbol),
    Status(),
    Submitted(),
    Actions(onApprove, onReject),
  ]
}

const OrderId = (): ColDef => ({
  headerName: 'Order ID',
  field: 'TradeEntryId',
})

const Customer = (): ColDef => ({
  headerName: 'Counterparty',
  field: 'CustomerName',
})

const Groups = (): ColDef => ({
  headerName: 'Groups',
  field: 'CustomerGroupTags',
  minWidth: 200,
  valueGetter: ({ data }) => {
    const groups: CustomerGroupTag[] = data?.CustomerGroupTags || []
    return groups.map((g) => g.TagName).sort((a, b) => a.localeCompare(b))
  },
  cellRenderer: ({ data }: { data: SpecialOfferBreakdownSubmittedOrder }) => {
    const groups = data?.CustomerGroupTags || []
    if (!groups || groups.length === 0) {
      return null
    }

    const sortedGroups = [...groups].sort((a, b) => a.TagName.localeCompare(b.TagName))

    const tagStyle = { fontSize: '11px', padding: '0 6px', lineHeight: '18px' }

    if (sortedGroups.length <= 2) {
      return (
        <Horizontal gap={4} fullHeight verticalCenter>
          {sortedGroups.map((group) => (
            <BBDTag key={group.TagId} style={tagStyle}>
              {group.TagName}
            </BBDTag>
          ))}
        </Horizontal>
      )
    }

    return (
      <Popover
        placement='bottomLeft'
        content={
          <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            {sortedGroups.map((group) => (
              <Horizontal key={group.TagId}>
                <Texto>{group.TagName}</Texto>
              </Horizontal>
            ))}
          </div>
        }
      >
        MULTIPLE GROUPS ({sortedGroups.length})
      </Popover>
    )
  },
  filterParams: {
    valueFormatter: (params) => params.value,
  },
})

const Price = (reservePrice): ColDef => ({
  headerName: 'Bid Price',
  field: 'OrderPrice',
  valueFormatter: ({ value }) => fmt.currency(value, 4),
  cellRenderer: ({ value, data }: { value: number; data: SpecialOfferBreakdownSubmittedOrder }) => {
    const isAbove = value > reservePrice
    const color = isAbove ? 'var(--theme-success)' : 'var(--theme-error)'

    return (
      <Horizontal gap={5} style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Texto style={{ color, fontWeight: 500 }}>{fmt.currency(value, 4)}</Texto>
      </Horizontal>
    )
  },
})

const Volume = (uomSymbol?: string): ColDef => ({
  headerName: 'Volume',
  field: 'OrderVolume',
  valueFormatter: ({ value }) => `${fmt.integer(value, 0)} ${uomSymbol ?? defaultUnitOfMeasureSymbol}(s)`,
})

const Status = (): ColDef => ({
  headerName: 'Status',
  field: 'OrderStatus',
  cellRenderer: ({ value }) => {
    return (
      <Horizontal verticalCenter horizontalCenter className='width-100%'>
        <OrderStatusTag status={value} />
      </Horizontal>
    )
  },
})

const Submitted = (): ColDef => ({
  headerName: 'Submitted',
  field: 'SubmittedDateTime',
  valueFormatter: ({ value }) => formatDateWithTimezone(value, dateFormat.MONTH_DATE_TIME),
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
        <Horizontal fullHeight verticalCenter horizontalCenter className={'width-100%'} gap={5}>
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
