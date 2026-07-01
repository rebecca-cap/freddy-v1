import '../../../styles.css'

import { CopyOutlined, EyeOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { addCommasToNumber, BBDTag, GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { SpecialOffer } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import dayjs from '@utils/dayjs'
import { isDefinedAndNotNull } from '@utils/index'
import { ColDef } from 'ag-grid-community'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import React from 'react'

interface SpecialOfferColumnsProps {
  onOpenOffer: (offer: SpecialOffer) => void
  onCreateFromPrior: (offer: SpecialOffer) => void
  canWrite: boolean
}

export const SpecialOffersColumns = ({
  onOpenOffer,
  onCreateFromPrior,
  canWrite,
}: SpecialOfferColumnsProps): ColDef[] => {
  return [
    OfferId(),
    Type(),
    Name(),
    Product(),
    Location(),
    Volume(),
    AcceptedVolume(),
    VolumePercent(),
    Status(),
    Response(),
    PendingSubmissions(),
    VisibilityWindow(),
    LiftingWindow(),
    Created(),
    CreatedBy(),
    Actions(onOpenOffer, onCreateFromPrior, canWrite),
  ]
}

const OfferId = (): ColDef => ({
  headerName: 'Offer ID',
  field: 'SpecialOfferId',
  sort: 'desc',
})

const Type = (): ColDef => ({
  headerName: 'Type',
  field: 'Type',
})

const Name = (): ColDef => ({
  headerName: 'Name',
  field: 'Name',
})

const Product = (): ColDef => ({
  headerName: 'Product',
  field: 'Product',
})

const Location = (): ColDef => ({
  headerName: 'Location',
  field: 'Location',
})

const Volume = (): ColDef => ({
  headerName: 'Volume',
  field: 'Volume',
  valueFormatter: ({ value }) => `${addCommasToNumber(value)} gal`,
})

const Status = (): ColDef => ({
  headerName: 'Status',
  field: 'Status',
  cellStyle: { padding: 0 },
  cellRenderer: ({ data, value }) => {
    const activeStatus = data?.Status === 'Active'
    const completedStatus = data?.Status === 'Completed'
    return (
      <Horizontal fullHeight verticalCenter horizontalCenter width={'100%'}>
        <BBDTag
          className={classNames('columns-bbd-tag', completedStatus ? 'columns-bbd-tag-completed' : '')}
          success={activeStatus}
        >
          {value}
        </BBDTag>
      </Horizontal>
    )
  },
})

const Response = (): ColDef => ({
  headerName: 'Response',
  field: 'Response',
  valueFormatter: ({ value }) => `${fmt.decimal(value, 2)}%`,
})

const Created = (): ColDef => ({
  headerName: 'Created',
  field: 'Created',
  filter: 'agDateColumnFilter',
  valueFormatter: ({ value }) => (value ? dayjs(value).format(dateFormat.MONTH_DATE_YEAR) : value),
  filterValueGetter: (params) => {
    const raw = params.data?.Created
    return raw ? dayjs(raw).startOf('day').toDate() : null
  },
  filterParams: {
    comparator: (filterDate: Date, cellValue: Date) => {
      if (cellValue == null) return -1
      const cell = dayjs(cellValue).startOf('day')
      const filter = dayjs(filterDate).startOf('day')
      if (cell.isBefore(filter)) return -1
      if (cell.isAfter(filter)) return 1
      return 0
    },
  },
})

const LiftingWindow = (): ColDef => ({
  headerName: 'Lifting Window',
  field: 'LiftingStartDate',
  filter: 'agDateColumnFilter',
  filterParams: {
    inRangeInclusive: true,
    comparator: (filterLocalDateAtMidnight: Date, cellValue) => {
      if (cellValue == null) {
        return 0
      }
      const { startDate, endDate } = cellValue
      if (!startDate || !endDate) {
        return 0
      }

      // Filter date is before the window starts
      if (filterLocalDateAtMidnight < startDate) {
        return 1
      }
      // Filter date is after the window ends
      if (filterLocalDateAtMidnight > endDate) {
        return -1
      }
      // Filter date falls within the window (equals match)
      return 0
    },
  },
  filterValueGetter: (params) => {
    const startDate = params.data?.LiftingStartDate ? dayjs(params.data.LiftingStartDate).startOf('day').toDate() : null
    const endDate = params.data?.LiftingEndDate ? dayjs(params.data.LiftingEndDate).startOf('day').toDate() : null

    if (!startDate || !endDate) {
      return null
    }

    return { startDate, endDate }
  },
  cellRenderer: ({ data }) => {
    const startDate = data?.LiftingStartDate ? dayjs(data.LiftingStartDate).format(dateFormat.MONTH_DATE_TIME) : ''
    const endDate = data?.LiftingEndDate ? dayjs(data.LiftingEndDate).format(dateFormat.MONTH_DATE_TIME) : ''
    if (!startDate && !endDate) return null
    const tz =
      (data?.LocationTimeZoneAlias ?? data?.ServerTimeZoneAlias)
        ? ` ${data?.LocationTimeZoneAlias ?? data?.ServerTimeZoneAlias}`
        : ''
    return (
      <Horizontal width='100%'>
        {startDate} - {endDate}
        {tz}
      </Horizontal>
    )
  },
})

const VolumePercent = (): ColDef => ({
  headerName: 'Volume %',
  field: 'VolumePercent',
  filter: 'agNumberColumnFilter',
  valueGetter: ({ data }) => {
    if (!isDefinedAndNotNull(data?.Volume)) return null
    const accepted = data.AcceptedVolume ?? 0
    const total = data.Volume
    return total > 0 ? (accepted / total) * 100 : 0
  },
  valueFormatter: ({ value }) => (value != null ? `${fmt.decimal(value, 0)}%` : ''),
})

const AcceptedVolume = (): ColDef => ({
  headerName: 'Accepted Volume',
  field: 'AcceptedVolume',
  filter: 'agNumberColumnFilter',
  valueFormatter: ({ value }) => (value != null ? `${addCommasToNumber(value)} gal` : ''),
})

const VisibilityWindow = (): ColDef => ({
  headerName: 'Visibility Window',
  field: 'VisibilityStartDateTime',
  filter: 'agDateColumnFilter',
  hide: true,
  cellRenderer: ({ data }) => {
    const startDate = data?.VisibilityStartDateTime
      ? dayjs(data.VisibilityStartDateTime).format(dateFormat.MONTH_DATE_TIME)
      : ''
    const endDate = data?.VisibilityEndDateTime
      ? dayjs(data.VisibilityEndDateTime).format(dateFormat.MONTH_DATE_TIME)
      : ''
    if (!startDate && !endDate) return null
    const tz = data?.TimeZoneAlias ? ` ${data.TimeZoneAlias}` : ''
    return (
      <Horizontal width='100%'>
        {startDate} - {endDate}
        {tz}
      </Horizontal>
    )
  },
})

const CreatedBy = (): ColDef => ({
  headerName: 'Created By',
  field: 'CreatedByUserName',
})

const PendingSubmissions = (): ColDef => ({
  headerName: 'Pending Submissions',
  field: 'PendingSubmissionCount',
  filter: 'agNumberColumnFilter',
  valueFormatter: ({ value }) => (value != null ? fmt.integer(value, 0) : ''),
})

const Actions = (
  onOpenOffer: (offer: SpecialOffer) => void,
  onCreateFromPrior: (offer: SpecialOffer) => void,
  canWrite: boolean
): ColDef => ({
  headerName: 'Actions',
  filter: false,
  sortable: false,
  suppressFiltersToolPanel: true,
  editable: false,
  cellRenderer: ({ data }) => {
    return (
      <Horizontal fullHeight verticalCenter horizontalCenter style={{ gap: 4 }} width='100%'>
        <Tooltip title='View' mouseEnterDelay={0.3}>
          <span>
            <GraviButton
              appearance='text'
              shape='circle'
              className='special-offers-action-icon'
              icon={<EyeOutlined />}
              aria-label='View offer'
              onClick={() => {
                onOpenOffer(data)
              }}
            />
          </span>
        </Tooltip>
        {canWrite && (
          <Tooltip title='Create new offer from this' mouseEnterDelay={0.3}>
            <span>
              <GraviButton
                appearance='text'
                shape='circle'
                className='special-offers-action-icon'
                icon={<CopyOutlined />}
                aria-label='Create new offer from this'
                onClick={() => {
                  onCreateFromPrior(data)
                }}
              />
            </span>
          </Tooltip>
        )}
      </Horizontal>
    )
  },
})
