import '@modules/SellingPlatform/OnlineOrders/styles.css'

import { CloseCircleOutlined, EyeOutlined, MoreOutlined, RedoOutlined, SwapOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { OnlineOrderRow } from '@modules/SellingPlatform/OnlineOrders/Api/types.schema'
import { formatDateWithTimezone } from '@utils/timezone'
import { ColDef } from 'ag-grid-community'
import { Menu, Popover } from 'antd'
import dayjs from '@utils/dayjs'
import React, { useState } from 'react'

interface OnlineOrdersColumnsProps {
  showExternalCompany: boolean
  showExportStatus: boolean
  canToggleHedged: boolean
  canResubmit: boolean
  canCancel: boolean
  onViewDetails: (row: OnlineOrderRow) => void
  onToggleHedged: (tradeEntryId: number) => void
  onResubmit: (tradeEntryId: number) => void
  onCancel: (tradeEntryId: number) => void
}

export const OnlineOrdersColumns = ({
  showExternalCompany,
  showExportStatus,
  canToggleHedged,
  canResubmit,
  canCancel,
  onViewDetails,
  onToggleHedged,
  onResubmit,
  onCancel,
}: OnlineOrdersColumnsProps): ColDef[] =>
  [
    TradeEntryId(),
    OrderType(),
    InstrumentName(),
    InternalContractNumber(),
    CreatedByName(),
    showExternalCompany ? ExternalCounterPartyName() : null,
    ExternalColleagueName(),
    InternalCounterPartyName(),
    CreatedDateTime(),
    OrderAcceptedDateTime(),
    FromDateTime(),
    ToDateTime(),
    TotalDealVolume(),
    ProductName(),
    LocationName(),
    PriceColumn(),
    IsPendingPricing(),
    PricedDateTime(),
    OrderStatus(),
    UpdatedByEmail(),
    IsHedged(),
    LoadingNumbers(),
    showExportStatus ? ExportStatus() : null,
    IndexPrice(),
    OrderOrigin(),
    Currency(),
    UnitOfMeasure(),
    ActionsColumn({ canToggleHedged, canResubmit, canCancel, onViewDetails, onToggleHedged, onResubmit, onCancel }),
  ].filter(Boolean) as ColDef[]

const TradeEntryId = (): ColDef => ({
  headerName: 'ID',
  field: 'TradeEntryId',
})

const OrderType = (): ColDef => ({
  headerName: 'Type',
  field: 'OrderType',
})

const InternalContractNumber = (): ColDef => ({
  headerName: 'Contract Number',
  field: 'InternalContractNumber',
})

const CreatedByName = (): ColDef => ({
  headerName: 'Created By',
  field: 'CreatedByName',
})

const ExternalColleagueName = (): ColDef => ({
  headerName: 'External Contact',
  field: 'ExternalColleagueName',
})

const ExternalCounterPartyName = (): ColDef => ({
  headerName: 'External Company',
  field: 'ExternalCounterPartyName',
})

const InternalCounterPartyName = (): ColDef => ({
  headerName: 'Internal Company',
  field: 'InternalCounterPartyName',
})

const CreatedDateTime = (): ColDef => ({
  headerName: 'Created',
  field: 'CreatedDateTime',
  sort: 'desc',
  valueGetter: ({ data }) => formatDateWithTimezone(data?.CreatedDateTime, dateFormat.SHORT_DATE_YEAR_TIME),
})

const OrderAcceptedDateTime = (): ColDef => ({
  headerName: 'Accepted',
  field: 'OrderAcceptedDateTime',
  valueGetter: ({ data }) => formatDateWithTimezone(data?.OrderAcceptedDateTime, dateFormat.SHORT_DATE_YEAR_TIME),
})

const FromDateTime = (): ColDef => ({
  headerName: 'Order From',
  field: 'FromDateTime',
  valueGetter: ({ data }) =>
    formatDateWithTimezone(data?.FromDateTime, dateFormat.SHORT_DATE_YEAR_TIME, data?.LocationTimeZone),
})

const ToDateTime = (): ColDef => ({
  headerName: 'Order To',
  field: 'ToDateTime',
  valueGetter: ({ data }) =>
    formatDateWithTimezone(data?.ToDateTime, dateFormat.SHORT_DATE_YEAR_TIME, data?.LocationTimeZone),
})

const TotalDealVolume = (): ColDef => ({
  headerName: 'Volume',
  field: 'TotalDealVolume',
  filter: 'agNumberColumnFilter',
  cellStyle: { textAlign: 'right' },
  valueFormatter: ({ value }) => (value ? fmt.integer(value) : ''),
})

const IndexPrice = (): ColDef => ({
  headerName: 'Live Price',
  field: 'IndexPrice',
  filter: 'agNumberColumnFilter',
  cellStyle: { textAlign: 'right' },
  valueFormatter: ({ value }) => (value ? fmt.currency(value) : ''),
})

const IsPendingPricing = (): ColDef => ({
  headerName: 'Pending Pricing',
  field: 'IsPendingPricing',
  cellDataType: false,
  valueGetter: ({ data }) => (data?.IsPendingPricing ? 'Yes' : 'No'),
})

const PricedDateTime = (): ColDef => ({
  headerName: 'Priced Date',
  field: 'PricedDateTime',
  valueGetter: ({ data }) =>
    data?.PricedDateTime ? dayjs(data.PricedDateTime).format(dateFormat.SHORT_DATE_YEAR_TIME) : '',
})

const OrderStatus = (): ColDef => ({
  headerName: 'Order Status',
  field: 'OrderStatusCodeValueDisplay',
})

const Currency = (): ColDef => ({
  headerName: 'Currency',
  field: 'CurrencyName',
})

const UnitOfMeasure = (): ColDef => ({
  headerName: 'Unit of Measure',
  field: 'UnitOfMeasureName',
})

const UpdatedByEmail = (): ColDef => ({
  headerName: 'Updated By',
  field: 'UpdatedByEmail',
})

const IsHedged = (): ColDef => ({
  headerName: 'Is Hedged',
  field: 'IsHedged',
  cellDataType: false,
  valueGetter: ({ data }) => (data?.IsHedged ? 'Yes' : 'No'),
})

const ExportStatus = (): ColDef => ({
  headerName: 'Export Status',
  field: 'ExportStatus',
})

const OrderOrigin = (): ColDef => ({
  headerName: 'Order Origin',
  field: 'OrderOrigin',
})

const InstrumentName = (): ColDef => ({
  headerName: 'Instrument',
  field: 'InstrumentName',
})

const ProductName = (): ColDef => ({
  headerName: 'Product',
  field: 'ProductName',
})

const LocationName = (): ColDef => ({
  headerName: 'Location',
  field: 'LocationName',
})

const LoadingNumbers = (): ColDef => ({
  headerName: 'Loading Number',
  field: 'LoadingNumbers',
  cellRenderer: ({ data }: { data: OnlineOrderRow }) => {
    const numbers = data?.LoadingNumbers ?? []
    if (numbers.length === 0) return null
    if (numbers.length === 1) return <span>{numbers[0]}</span>
    return (
      <Popover
        placement='bottomLeft'
        content={
          <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            {numbers.map((item) => (
              <Horizontal key={item}>
                <Texto>{item}</Texto>
              </Horizontal>
            ))}
          </div>
        }
      >
        <span>Multiple ({numbers.length})</span>
      </Popover>
    )
  },
})

const PriceColumn = (): ColDef => ({
  headerName: 'Price',
  field: 'Price',
  filter: 'agNumberColumnFilter',
  cellStyle: { textAlign: 'right' },
  valueFormatter: ({ value }) => (value ? fmt.currency(value) : ''),
})

const ActionsCellRenderer = ({
  data,
  canToggleHedged,
  canResubmit,
  canCancel,
  onViewDetails,
  onToggleHedged,
  onResubmit,
  onCancel,
}: {
  data: OnlineOrderRow
  canToggleHedged: boolean
  canResubmit: boolean
  canCancel: boolean
  onViewDetails: (row: OnlineOrderRow) => void
  onToggleHedged: (tradeEntryId: number) => void
  onResubmit: (tradeEntryId: number) => void
  onCancel: (tradeEntryId: number) => void
}) => {
  const [open, setOpen] = useState(false)
  if (!data) return null

  const menuItems: { key: string; icon: React.ReactNode; label: string; onClick: () => void }[] = [
    {
      key: 'details',
      icon: <EyeOutlined />,
      label: 'Details',
      onClick: () => onViewDetails(data),
    },
  ]

  if (canToggleHedged) {
    menuItems.push({
      key: 'toggleHedged',
      icon: <SwapOutlined />,
      label: 'Toggle Hedged',
      onClick: () => onToggleHedged(data.TradeEntryId),
    })
  }

  if (canCancel) {
    menuItems.push({
      key: 'cancel',
      icon: <CloseCircleOutlined />,
      label: 'Cancel',
      onClick: () => onCancel(data.TradeEntryId),
    })
  }

  if (canResubmit) {
    menuItems.push({
      key: 'resubmit',
      icon: <RedoOutlined />,
      label: 'ReSubmit',
      onClick: () => onResubmit(data.TradeEntryId),
    })
  }

  return (
    <div className='online-orders-actions-cell'>
      <Popover
        overlayClassName='online-orders-actions-popover'
        placement='bottomRight'
        trigger='click'
        open={open}
        onOpenChange={setOpen}
        content={
          <Menu
            className='online-orders-actions-menu'
            mode='inline'
            items={menuItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
              onClick: () => {
                item.onClick()
                setOpen(false)
              },
            }))}
          />
        }
      >
        <GraviButton icon={<MoreOutlined />} size='small' />
      </Popover>
    </div>
  )
}

const ActionsColumn = ({
  canToggleHedged,
  canResubmit,
  canCancel,
  onViewDetails,
  onToggleHedged,
  onResubmit,
  onCancel,
}: Pick<
  OnlineOrdersColumnsProps,
  'canToggleHedged' | 'canResubmit' | 'canCancel' | 'onViewDetails' | 'onToggleHedged' | 'onResubmit' | 'onCancel'
>): ColDef => ({
  headerName: 'Actions',
  field: 'actions',
  pinned: 'right',
  width: 80,
  cellRenderer: (params: { data: OnlineOrderRow }) => (
    <ActionsCellRenderer
      data={params.data}
      canToggleHedged={canToggleHedged}
      canResubmit={canResubmit}
      canCancel={canCancel}
      onViewDetails={onViewDetails}
      onToggleHedged={onToggleHedged}
      onResubmit={onResubmit}
      onCancel={onCancel}
    />
  ),
  sortable: false,
  filter: false,
})
