import '../../../styles.css'

import { EyeOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { addCommasToNumber, BBDTag, GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { SpecialOffer } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { ColDef } from 'ag-grid-community'
import classNames from 'classnames'
import moment from 'moment'
import React, { Dispatch, SetStateAction } from 'react'
import { isDefinedAndNotNull } from '@utils/index'

interface SpecialOfferColumnsProps {
  isShowingManage: boolean
  setIsShowingManage: Dispatch<SetStateAction<boolean>>
  setSelectedSpecialOffer: Dispatch<SetStateAction<SpecialOffer | null>>
}

export const SpecialOffersColumns = ({
  setIsShowingManage,
  setSelectedSpecialOffer,
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
    Actions(setIsShowingManage, setSelectedSpecialOffer),
  ]
}

const OfferId = (): ColDef => ({
  headerName: 'Offer ID',
  field: 'SpecialOfferId',
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
  cellRenderer: ({ data, value }) => {
    const activeStatus = data?.Status === 'Active'
    const completedStatus = data?.Status === 'Completed'
    return (
      <Horizontal width='100%' horizontalCenter>
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
  valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.MONTH_DATE_YEAR) : value),
  filterValueGetter: (params) => {
    return params.data?.Created ? moment(params.data?.Created).toDate() : null
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
    const startDate = params.data?.LiftingStartDate
      ? moment(params.data.LiftingStartDate).startOf('day').toDate()
      : null
    const endDate = params.data?.LiftingEndDate ? moment(params.data.LiftingEndDate).startOf('day').toDate() : null

    if (!startDate || !endDate) {
      return null
    }

    return { startDate, endDate }
  },
  cellRenderer: ({ data }) => {
    const startDate = moment(data?.LiftingStartDate).format(dateFormat.MONTH_DATE_V2)
    const endDate = moment(data?.LiftingEndDate).format(dateFormat.MONTH_DATE_V2)
    return (
      <Horizontal width='100%'>
        {startDate} - {endDate}
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
      ? moment(data.VisibilityStartDateTime).format(dateFormat.MONTH_DATE_V2)
      : ''
    const endDate = data?.VisibilityEndDateTime
      ? moment(data.VisibilityEndDateTime).format(dateFormat.MONTH_DATE_V2)
      : ''
    if (!startDate && !endDate) return null
    return (
      <Horizontal width='100%'>
        {startDate} - {endDate}
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

const Actions = (setIsShowingManage, setSelectedSpecialOffer): ColDef => ({
  headerName: 'Actions',
  filter: false,
  sortable: false,
  suppressFiltersToolPanel: true,
  editable: false,
  cellRenderer: ({ data }) => {
    return (
      <Horizontal width='100%'>
        <GraviButton
          className='ghost-gravi-button'
          icon={<EyeOutlined style={{ fontSize: '14px' }} />}
          buttonText={'View'}
          onClick={() => {
            setSelectedSpecialOffer(data)
            setIsShowingManage(true)
          }}
        />
      </Horizontal>
    )
  },
})
