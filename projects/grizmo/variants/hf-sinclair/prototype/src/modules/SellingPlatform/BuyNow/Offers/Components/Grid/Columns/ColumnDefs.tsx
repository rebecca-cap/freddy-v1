import { DollarCircleOutlined, EnvironmentOutlined, ShoppingOutlined, StockOutlined } from '@ant-design/icons'
import { BulkNumberCellEditorProps } from '@components/shared/Grid/bulkChange/BulkNumberCellEditor'
import { dateFormat } from '@components/TheArmory/helpers'
import { BBDTag, GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { AllSpecialOffersDisplayModel, CreditData } from '@modules/SellingPlatform/BuyNow/Offers/Api/types.schema'
import {
  formatTimeSpanDHM,
  timeSpanToTotalMinutes,
} from '@modules/SellingPlatform/BuyNow/Offers/Utils/OffersGridHelpers'
import type { ColDef, ValueGetterParams } from 'ag-grid-community'
import { Tooltip } from 'antd'
import moment from 'moment/moment'
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
    PricingMechanism(),
    Product(),
    Location(),
    TotalVolumeAvailable(),
    PickupWindow(),
    TimeRemaining(),
    PriceStatus(),
    SubmittedVolume(),
    SubmittedPrice(),
    MinPerOrder(),
    MaxPerOrder(),
    VolumeIncrement(),
    FixedPrice(),
    OfferExpiration(),
    Actions(setIsDrawerVisible, setIsIndexDrawerVisible, setSelectedOffer, setSelectedIndexOffer, orderingDisabled),
  ]
}

const OfferId = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Offer ID',
  field: 'SpecialOffer.SpecialOfferId',
  sortable: true,
  filter: 'agNumberColumnFilter',
  width: 110,
  editable: false,
  hide: true,
})

const OfferName = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Offer Name',
  field: 'SpecialOffer.SpecialOfferName',
  sortable: true,
  filter: 'agTextColumnFilter',
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
      <Horizontal verticalCenter>
        <EnvironmentOutlined className={'offers-grid-icon mr-2'} /> {value}
      </Horizontal>
    )
  },
})

const TotalVolumeAvailable = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Volume Available',
  field: 'SpecialOffer.TotalVolumeAvailable',
  sortable: true,
  filter: 'agNumberColumnFilter',
  editable: false,
  valueFormatter: ({ value }) => fmt.integer(value, 0),
})

const PickupWindow = (): ColDef => ({
  headerName: 'Pickup Window',
  field: 'SpecialOffer.OrderEffectiveStartDateTime',
  filter: 'agDateColumnFilter',
  type: 'rightAligned',
  cellRenderer: ({ data }) => {
    const startDate = moment(data?.SpecialOffer?.OrderEffectiveStartDateTime).format(dateFormat.MONTH_DATE_V2)
    const endDate = moment(data?.SpecialOffer?.OrderEffectiveEndDateTime).format(dateFormat.MONTH_DATE_V2)
    return (
      <Horizontal width='100%' justifyContent={'flex-end'}>
        {startDate} - {endDate}
      </Horizontal>
    )
  },
})

const TimeRemaining = (): ColDef => ({
  headerName: 'Time Remaining',
  field: 'SpecialOffer.TimeRemaining',
  type: 'rightAligned',
  valueGetter: (p: ValueGetterParams) => timeSpanToTotalMinutes(p.data?.SpecialOffer?.TimeRemaining),
  valueFormatter: ({ data }) => formatTimeSpanDHM(data?.SpecialOffer?.TimeRemaining),
  filter: 'agNumberColumnFilter',
  cellClassRules: {
    'time-remaining--urgent': (params) => typeof params.value === 'number' && params.value <= 24 * 60,
    'time-remaining--ok': (params) => typeof params.value === 'number' && params.value > 24 * 60,
  },
})

const PriceStatus = (): ColDef => ({
  headerName: 'Price / Status',
  field: 'SpecialOffer.FixedPrice',
  type: 'rightAligned',
  maxWidth: 150,
  cellRenderer: ({ data }) => {
    const isIndex = data?.SpecialOffer?.PricingMechanism === 'Index'
    const isBid = data?.IsBid

    switch (true) {
      case isBid && isIndex:
        return (
          <Horizontal verticalCenter justifyContent={'flex-end'} width='100%'>
            <BBDTag className={'px-3'} success style={{ justifyContent: 'flex-end' }}>
              <Texto>Place index Bid</Texto>
            </BBDTag>
          </Horizontal>
        )
      case isBid:
        return (
          <Horizontal verticalCenter justifyContent={'flex-end'} width='100%'>
            <BBDTag className={'px-3'} success style={{ justifyContent: 'flex-end' }}>
              <Texto>Place Bid</Texto>
            </BBDTag>
          </Horizontal>
        )
      case isIndex: {
        const differential = data?.ContractDifferential
        const formattedDiff = differential != null ? fmt.currency(differential, 4) : '-'
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%' }}>
            <Texto category={'h6'}>{formattedDiff}</Texto>
            <BBDTag className={'px-3'} theme1 style={{ marginRight: 0 }}>
              Index
            </BBDTag>
          </div>
        )
      }
      default:
        return (
          <div style={{ gap: 10 }}>
            <Horizontal verticalCenter justifyContent={'flex-end'} width='100%'>
              <Texto category={'h6'}>{fmt.currency(data?.SpecialOffer?.FixedPrice, 4)} / gal</Texto>
            </Horizontal>
            <Horizontal verticalCenter justifyContent={'flex-end'}>
              <Texto>Fixed Price</Texto>
            </Horizontal>
          </div>
        )
    }
  },
})

const SubmittedVolume = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Submitted Volume',
  field: 'SpecialOffer.SubmittedVolume',
  sortable: true,
  filter: 'agNumberColumnFilter',
  editable: false,
  hide: true,
  type: 'numericColumn',
  valueFormatter: ({ value }) => (value ? fmt.integer(value, 0) : ''),
})

const SubmittedPrice = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Submitted Price',
  field: 'SpecialOffer.SubmittedPrice',
  sortable: true,
  filter: 'agNumberColumnFilter',
  editable: false,
  type: 'numericColumn',
  hide: true,
  valueFormatter: ({ value }) => fmt.currency(value, 4),
})

const MinPerOrder = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Min / Order',
  field: 'SpecialOffer.MinimumVolumePerOrder',
  sortable: true,
  filter: 'agNumberColumnFilter',
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
  filter: 'agNumberColumnFilter',
  editable: false,
  type: 'numericColumn',
  valueFormatter: ({ value }) => fmt.integer(value, 0),
  hide: true,
})

const VolumeIncrement = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Increment',
  field: 'SpecialOffer.VolumeIncrement',
  sortable: true,
  filter: 'agNumberColumnFilter',
  editable: false,
  type: 'numericColumn',
  valueFormatter: ({ value }) => fmt.integer(value, 0),
  hide: true,
})

const FixedPrice = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Fixed Price',
  field: 'SpecialOffer.FixedPrice',
  sortable: true,
  filter: 'agNumberColumnFilter',
  editable: false,
  type: 'numericColumn',
  hide: true,
  valueFormatter: ({ value }) => fmt.currency(value, 4),
})

const OfferExpiration = (): GraviColDef<AllSpecialOffersDisplayModel> => ({
  headerName: 'Expires',
  field: 'SpecialOffer.OfferExpirationDateTime',
  sortable: true,
  filter: 'agDateColumnFilter',
  editable: false,
  hide: true,
  valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.MONTH_DATE_YEAR) : value),
  comparator: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
})

const Actions = (
  setIsDrawerVisible: Dispatch<SetStateAction<boolean>>,
  setIsIndexDrawerVisible: Dispatch<SetStateAction<boolean>>,
  setSelectedOffer: Dispatch<SetStateAction<AllSpecialOffersDisplayModel | null>>,
  setSelectedIndexOffer: Dispatch<SetStateAction<AllSpecialOffersDisplayModel | null>>,
  orderingDisabled = false
): ColDef => ({
  headerName: 'Actions',
  field: 'actions',
  maxWidth: 150,
  cellRenderer: ({ data }) => {
    const loadingNumberRequired = data?.LoadingNumberSelectionIsRequiredButNoneWereFound
    const tooltipTitle = loadingNumberRequired ? 'A valid loading number is required to order' : ''
    const isDisabled = !data?.SpecialOffer?.CanSubmitOrder || orderingDisabled || loadingNumberRequired

    const isBid = data?.SpecialOffer?.PricingMechanism === 'Bid'
    const isIndexOffer = data?.SpecialOffer?.PricingMechanism === 'Index'
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
      return <GraviButton className={'offers-grid-pending-action-btn'} buttonText={'Pending'} />
    }

    if (isBid) {
      return (
        <Tooltip title={tooltipTitle} placement='top'>
          <span style={{ width: '100%' }}>
            <GraviButton
              className={'offers-grid-place-bid-action-btn'}
              buttonText={'Place Bid'}
              disabled={isDisabled}
              onClick={() => handleClick(setIsDrawerVisible)}
            />
          </span>
        </Tooltip>
      )
    }

    if (isIndexOffer) {
      return (
        <Tooltip title={tooltipTitle} placement='top'>
          <span style={{ width: '100%' }}>
            <GraviButton
              success
              buttonText={'Place Index Order'}
              disabled={isDisabled}
              style={{ borderRadius: 10, width: '100%' }}
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
            success
            buttonText={'Place Order'}
            disabled={isDisabled}
            style={{ borderRadius: 10, width: '100%' }}
            onClick={() => handleClick(setIsDrawerVisible)}
          />
        </span>
      </Tooltip>
    )
  },
})
