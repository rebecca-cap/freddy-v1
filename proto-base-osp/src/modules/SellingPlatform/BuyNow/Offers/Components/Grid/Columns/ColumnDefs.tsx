import { ClockCircleOutlined, DollarCircleOutlined, EnvironmentOutlined, ShoppingOutlined, StockOutlined } from '@ant-design/icons'
import { BulkNumberCellEditorProps } from '@components/shared/Grid/bulkChange/BulkNumberCellEditor'
import { dateFormat } from '@components/TheArmory/helpers'
import { BBDTag, GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { AllSpecialOffersDisplayModel, CreditData } from '@modules/SellingPlatform/BuyNow/Offers/Api/types.schema'
import {
  formatTimeSpanDHM,
  timeSpanToTotalMinutes,
} from '@modules/SellingPlatform/BuyNow/Offers/Utils/OffersGridHelpers'
import dayjs from '@utils/dayjs'
import { formatPricePerUnit } from '@utils/index'
import { formatDateWithTimezone } from '@utils/timezone'
import type { ColDef, ValueGetterParams } from 'ag-grid-community'
import { Tooltip } from 'antd'
import React, { Dispatch, SetStateAction } from 'react'

type GraviColDef<TData = any, TValue = any> = ColDef<TData, TValue> & {
  isBulkEditable?: boolean
  bulkCellEditor?: any
  bulkCellEditorParams?: Partial<BulkNumberCellEditorProps>
}

interface OffersGridColumnProps {
  setIsDrawerVisible: Dispatch<SetStateAction<boolean>>
  setSelectedOffer: Dispatch<SetStateAction<AllSpecialOffersDisplayModel | null>>
  setIsIndexDrawerVisible: Dispatch<SetStateAction<boolean>>
  setSelectedIndexOffer: Dispatch<SetStateAction<AllSpecialOffersDisplayModel | null>>
  creditData: CreditData | null
  canWrite: boolean
}

export const getOffersGridColumns = ({
  setIsDrawerVisible,
  setIsIndexDrawerVisible,
  setSelectedOffer,
  setSelectedIndexOffer,
  creditData,
  canWrite,
}: OffersGridColumnProps): ColDef<AllSpecialOffersDisplayModel>[] => {
  const orderingDisabled = creditData?.creditStatus === 'CreditHold' || !canWrite
  return [
    OfferId(),
    OfferName(),
    //PricingMechanism(),
    Product(),
    Location(),
    PickupWindow(),
    TimeRemaining(),
    PriceStatus(),
    SubmittedVolume(),
    SubmittedPrice(),
    MinPerOrder(),
    EffectiveMaxPerOrder(),
    VolumeIncrement(),
    OfferExpiration(),
    Currency(),
    UnitOfMeasure(),
    Actions(setIsDrawerVisible, setIsIndexDrawerVisible, setSelectedOffer, setSelectedIndexOffer, orderingDisabled),
  ]
}

const OfferId = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Offer ID',
  field: 'SpecialOffer.SpecialOfferId',
  sortable: true,
  width: 110,
  editable: false,
  hide: true,
})

const OfferName = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Offer Name',
  field: 'SpecialOffer.SpecialOfferName',
  sortable: true,
  flex: 1,
  minWidth: 180,
  editable: false,
  hide: true,
})

const PricingMechanism = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Type',
  field: 'SpecialOffer.PricingMechanism',
  sortable: true,
  editable: false,
  maxWidth: 100,
  cellRenderer: ({ value }) => {
    if (!value) return null

    if (value === 'Index') {
      return (
        <Tooltip title='Index' placement='top' overlayClassName='bid-tooltip' className='offers-grid-tooltip-wrapper'>
          <StockOutlined className={'offers-grid-icon'} />
        </Tooltip>
      )
    }

    if (value === 'Bid') {
      return (
        <Tooltip title='Bid' placement='top' overlayClassName='bid-tooltip' className='offers-grid-tooltip-wrapper'>
          <ShoppingOutlined className={'offers-grid-icon'} />
        </Tooltip>
      )
    }

    return (
      <Tooltip title='Offer' placement='top' overlayClassName='bid-tooltip' className='offers-grid-tooltip-wrapper'>
        <DollarCircleOutlined className={'offers-grid-icon'} />
      </Tooltip>
    )
  },
})

const Product = (): ColDef => ({
  headerName: 'Product',
  field: 'ProductName',
})

const Location = (): ColDef => ({
  headerName: 'Location',
  field: 'LocationName',
  cellRenderer: ({ value }) => {
    if (!value) return null

    return (
      <Horizontal fullHeight verticalCenter>
        <EnvironmentOutlined className={'offers-grid-icon mr-2'} /> {value}
      </Horizontal>
    )
  },
})

const PickupWindow = (): ColDef => ({
  headerName: 'Pickup Window',
  field: 'SpecialOffer.OrderEffectiveStartDateTime',
  type: 'rightAligned',
  cellRenderer: ({ data }) => {
    const startDate = dayjs(data?.SpecialOffer?.OrderEffectiveStartDateTime).format(dateFormat.MONTH_DATE_TIME)
    const endDate = dayjs(data?.SpecialOffer?.OrderEffectiveEndDateTime).format(dateFormat.MONTH_DATE_TIME)
    const alias = data?.SpecialOffer?.LocationTimeZoneAlias || serverTimeZoneAlias
    return (
      <Horizontal width='100%' justifyContent={'flex-end'}>
        {startDate} - {endDate}
        {alias ? ` ${alias}` : ''}
      </Horizontal>
    )
  },
})

const TimeRemaining = (): ColDef => ({
  headerName: 'Time Remaining',
  field: 'SpecialOffer.TimeRemaining',
  type: 'rightAligned',
  valueGetter: (p: ValueGetterParams) => timeSpanToTotalMinutes(p.data?.SpecialOffer?.TimeRemaining),
  valueFormatter: ({ data }) => {
    const formatted = formatTimeSpanDHM(data?.SpecialOffer?.TimeRemaining)
    const alias = data?.SpecialOffer?.TimeZoneAlias
    return alias ? `${formatted} (${alias})` : formatted
  },
  filter: 'agNumberColumnFilter',
  cellClassRules: {
    'time-remaining--urgent': (params) => typeof params.value === 'number' && params.value <= 24 * 60,
    'time-remaining--ok': (params) => typeof params.value === 'number' && params.value > 24 * 60,
  },
})

const getPriceStatusCategory = (data: AllSpecialOffersDisplayModel | undefined) => {
  const isIndex = data?.SpecialOffer?.PricingMechanism === 'Index'
  const isBid = data?.IsBid
  if (isBid && isIndex) return 'Place Index Bid'
  if (isBid) return 'Place Bid'
  if (isIndex) return 'Index'
  return 'Fixed Price'
}

const getPriceValue = (data: AllSpecialOffersDisplayModel | undefined) => {
  const isIndex = data?.SpecialOffer?.PricingMechanism === 'Index'
  if (data?.IsBid) return null
  return isIndex ? data?.ContractDifferential : data?.SpecialOffer?.FixedPrice
}

const PriceStatus = (): ColDef => ({
  headerName: 'Price / Status',
  field: 'SpecialOffer.FixedPrice',
  type: 'rightAligned',
  maxWidth: 150,
  filter: 'agMultiColumnFilter',
  filterParams: {
    filters: [
      {
        filter: 'agSetColumnFilter',
        filterParams: {
          values: ['Place Bid', 'Place Index Bid', 'Index', 'Fixed Price'],
          valueGetter: (params: ValueGetterParams) => getPriceStatusCategory(params.data),
        },
      },
      {
        filter: 'agNumberColumnFilter',
        filterParams: {
          valueGetter: (params: ValueGetterParams) => getPriceValue(params.data),
        },
      },
    ],
  },
  cellRenderer: ({ data }) => {
    const isIndex = data?.SpecialOffer?.PricingMechanism === 'Index'
    const isBid = data?.IsBid

    switch (true) {
      case isBid && isIndex:
        return (
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', height: '100%' }}
          >
            <BBDTag className={'px-3'} success style={{ justifyContent: 'flex-end', marginRight: 0 }}>
              <Texto>Place Index Bid</Texto>
            </BBDTag>
          </div>
        )
      case isBid:
        return (
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', height: '100%' }}
          >
            <BBDTag className={'px-3'} success style={{ justifyContent: 'flex-end', marginRight: 0 }}>
              <Texto>Place Bid</Texto>
            </BBDTag>
          </div>
        )
      case isIndex: {
        const differential = data?.ContractDifferential
        const formattedDiff =
          differential != null
            ? formatPricePerUnit(differential, {
                currencyName: data?.CurrencySymbol,
                uomSymbol: data?.UnitOfMeasureSymbol,
                precisionOverride: 4,
              })
            : '-'
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 4,
              width: '100%',
              height: '100%',
            }}
          >
            <Texto category={'h5'} style={{ lineHeight: 1.2 }}>{formattedDiff}</Texto>
            <BBDTag className={'px-3'} theme2 style={{ marginRight: 0 }}>
              Index
            </BBDTag>
          </div>
        )
      }
      default:
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 4,
              width: '100%',
              height: '100%',
            }}
          >
            <Texto category={'h5'} style={{ lineHeight: 1.2 }}>
              {formatPricePerUnit(data?.SpecialOffer?.FixedPrice, {
                currencyName: data?.CurrencySymbol,
                uomSymbol: data?.UnitOfMeasureSymbol,
                precisionOverride: 4,
              })}
            </Texto>
            <BBDTag className={'px-3'} theme2 style={{ marginRight: 0 }}>
              Fixed Price
            </BBDTag>
          </div>
        )
    }
  },
})

const SubmittedVolume = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Submitted Volume',
  field: 'SpecialOffer.SubmittedVolume',
  sortable: true,
  editable: false,
  hide: true,
  type: 'numericColumn',
  valueFormatter: ({ value }) => (value ? fmt.integer(value, 0) : ''),
})

const SubmittedPrice = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Submitted Price',
  field: 'SpecialOffer.SubmittedPrice',
  sortable: true,
  editable: false,
  type: 'numericColumn',
  hide: true,
  valueFormatter: ({ value }) => fmt.currency(value, 4),
})

const MinPerOrder = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Min / Order',
  field: 'SpecialOffer.MinimumVolumePerOrder',
  sortable: true,
  width: 120,
  editable: false,
  type: 'numericColumn',
  valueFormatter: ({ value }) => fmt.integer(value, 0),
  hide: true,
})

const MaxPerOrder = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Max / Order',
  field: 'SpecialOffer.MaxVolumePerOrder',
  sortable: true,
  editable: false,
  type: 'numericColumn',
  valueFormatter: ({ value }) => fmt.integer(value, 0),
  hide: true,
})

const EffectiveMaxPerOrder = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Effective Max / Order',
  field: 'SpecialOffer.EffectiveMaxPerOrder',
  sortable: true,
  editable: false,
  type: 'numericColumn',
  valueFormatter: ({ value }) => fmt.integer(value, 0),
  hide: true,
})

const VolumeIncrement = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Increment',
  field: 'SpecialOffer.VolumeIncrement',
  sortable: true,
  editable: false,
  type: 'numericColumn',
  valueFormatter: ({ value }) => fmt.integer(value, 0),
  hide: true,
})

const OfferExpiration = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Expires',
  field: 'SpecialOffer.OfferExpirationDateTime',
  sortable: true,
  editable: false,
  hide: true,
  valueFormatter: ({ value, data }) =>
    value ? formatDateWithTimezone(value, dateFormat.MONTH_DATE_YEAR_TIME, data?.SpecialOffer?.TimeZoneAlias) : value,
  comparator: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
})

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

const Actions = (
  setIsDrawerVisible: Dispatch<SetStateAction<boolean>>,
  setIsIndexDrawerVisible: Dispatch<SetStateAction<boolean>>,
  setSelectedOffer: Dispatch<SetStateAction<AllSpecialOffersDisplayModel | null>>,
  setSelectedIndexOffer: Dispatch<SetStateAction<AllSpecialOffersDisplayModel | null>>,
  orderingDisabled = false
): ColDef => ({
  headerName: 'Actions',
  field: 'actions',
  editable: false,
  filter: false,
  maxWidth: 150,
  cellRenderer: ({ data }) => {
    const loadingNumberRequired = data?.LoadingNumberSelectionIsRequiredButNoneWereFound
    const counterPartyIsNotInvited = data?.ContextCounterPartyIsInvitedToSpecialOffer === false
    const tooltipTitle = counterPartyIsNotInvited
      ? 'The selected counterparty is not invited to this special offer'
      : loadingNumberRequired
        ? 'A valid loading number is required to order'
        : ''
    const isDisabled = !data?.SpecialOffer?.CanSubmitOrder || orderingDisabled || loadingNumberRequired || counterPartyIsNotInvited

    const isIndexOffer = data?.SpecialOffer?.PricingMechanism === 'Index'
    const isBid = data?.IsBid
    const hasPendingSubmission = data?.SpecialOffer?.HasPendingSubmission

    const handleClick = (openDrawer: Dispatch<SetStateAction<boolean>>) => {
      setSelectedOffer({ ...data })
      openDrawer(true)
    }

    const handleIndexOfferClick = () => {
      setSelectedIndexOffer({ ...data })
      setIsIndexDrawerVisible(true)
    }

    if (hasPendingSubmission) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <BBDTag className={'px-4 py-1'} warning style={{ fontSize: 13 }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} /> Pending
          </BBDTag>
        </div>
      )
    }
    if (isBid && !isIndexOffer) {
      return (
        <Tooltip title={tooltipTitle} placement='top'>
          <span style={{ width: '100%' }}>
            <GraviButton
              className={'offers-grid-action-btn'}
              buttonText={<Texto appearance={'white'}>Bid</Texto>}
              disabled={isDisabled}
              onClick={() => handleClick(setIsDrawerVisible)}
            />
          </span>
        </Tooltip>
      )
    }

    if (isIndexOffer) {
      const text = isBid ? 'Index Bid' : 'Index Order'
      return (
        <Tooltip title={tooltipTitle} placement='top'>
          <span style={{ width: '100%' }}>
            <GraviButton
              className={'offers-grid-action-btn'}
              buttonText={<Texto appearance={'white'}>{text}</Texto>}
              disabled={isDisabled}
              onClick={handleIndexOfferClick}
            />
          </span>
        </Tooltip>
      )
    }

    return (
      <Tooltip title={tooltipTitle} placement='top'>
        <span style={{ width: '100%' }}>
          <GraviButton
            className={'offers-grid-action-btn'}
            buttonText={<Texto appearance={'white'}>Order</Texto>}
            disabled={isDisabled}
            onClick={() => handleClick(setIsDrawerVisible)}
          />
        </span>
      </Tooltip>
    )
  },
})
