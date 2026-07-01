import { dateFormat } from '@components/TheArmory/helpers'
import { addCommasToNumber, BBDTag, Texto } from '@gravitate-js/excalibrr'
import { ContractDetails, ContractManagementMetadata, List } from '@modules/ContractManagement/api/types.schema'
import { ActionsCell } from '@modules/ContractManagement/components/DetailsSection/AllDetailsGrid/components/cellRenderers/ActionsCell'
import { ColDef } from 'ag-grid-community'
import moment from 'moment'
import React from 'react'

interface AllDetailsGridColumnDefsProps {
  metadata?: ContractManagementMetadata
  header: ContractDetails
}

export function AllDetailsGridColumnDefs({ metadata, header }: AllDetailsGridColumnDefsProps) {
  return [
    selectionColumn(),
    groupCell(),
    contractDetailId(),
    originLocation(),
    destinationLocation(),
    product(),
    effectiveFrom(),
    effectiveTo(),
    effectiveTime(metadata?.PricePeriodStartOffsets),
    calendar({ pricingCalendars: metadata?.PricingCalendars, valuationCalendarId: header?.ValuationCalendarId }),
    quantity(),
    actions(),
  ] as ColDef[]
}

function selectionColumn() {
  return {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    maxWidth: 50,
    headerCheckboxSelectionFilteredOnly: true,
  }
}

function groupCell() {
  return {
    cellRenderer: 'agGroupCellRenderer',
    headerName: '',
    colId: 'group-column',
    maxWidth: 40,
  }
}
function contractDetailId() {
  return {
    headerName: 'Detail Id',
    field: 'TradeEntryDetailId',
    maxWidth: 120,
    headerTooltip: 'Contract Detail Id',
    valueGetter: ({ data }) => {
      return data?.TradeEntryDetailId ?? 'Draft'
    },
    cellRenderer: ({ value }) => {
      if (value && value !== 'Draft') {
        return <Texto>{value}</Texto>
      }
      return (
        <BBDTag title='Draft' style={{ textAlign: 'center' }}>
          Draft
        </BBDTag>
      )
    },
  }
}

function originLocation() {
  return {
    headerName: 'Origin Location',
    field: 'FromLocationName',
    flex: 2,
    cellRenderer: ({ value }) => <Texto className='text-truncate'>{value}</Texto>,
  }
}
function destinationLocation() {
  return {
    headerName: 'Destination Location',
    field: 'ToLocationName',
    flex: 2,
    cellRenderer: ({ value }) => <Texto className='text-truncate'>{value}</Texto>,
    hide: true,
  }
}
function effectiveTime(pricePeriodStartOffsets) {
  return {
    headerName: 'Effective Time',
    field: 'PricePeriodStartOffset',
    flex: 2,
    cellRenderer: ({ value }) => {
      const pricePeriodOffset = pricePeriodStartOffsets?.find((offset) => offset.Value === value)
      return <Texto className='text-truncate'>{pricePeriodOffset?.Text ?? ''}</Texto>
    },
    filter: 'agSetColumnFilter',
    filterParams: {
      valueFormatter: ({ value }) => {
        const pricePeriodOffset = pricePeriodStartOffsets?.find((offset) => offset.Value === value)
        return pricePeriodOffset?.Text ?? ''
      },
    },
    hide: true,
  }
}

function product() {
  return {
    headerName: 'Product',
    field: 'ProductName',
    flex: 2,
    cellRenderer: ({ value }) => <Texto className='text-truncate'>{value}</Texto>,
  }
}
function effectiveFrom() {
  return {
    headerName: 'Effective From',
    valueFormatter: ({ value }) => moment(value).format(dateFormat.DATE_SLASH),
    filter: 'agDateColumnFilter',
    field: 'FromDateTime',
  }
}

function effectiveTo() {
  return {
    headerName: 'Effective To',
    valueFormatter: ({ value }) => moment(value).format(dateFormat.DATE_SLASH),
    filter: 'agDateColumnFilter',
    field: 'ToDateTime',
  }
}

function calendar({
  pricingCalendars,
  valuationCalendarId,
}: {
  pricingCalendars?: List[]
  valuationCalendarId?: number
}) {
  const calendarDisplay = pricingCalendars?.find((c) => c.Value === valuationCalendarId?.toString())?.Text ?? ''
  return {
    headerName: 'Calendar',
    field: 'ValuationCalendarName',
    hide: true,
    cellRenderer: ({ value }) => {
      return <Texto className='text-truncate'>{value ? value : `${calendarDisplay} (Default)`}</Texto>
    },
  }
}

function quantity() {
  return {
    headerName: 'Quantity',
    field: 'Quantity',
    cellRenderer: (params) => {
      if ((!params?.data?.Quantity && params.data.Quantity !== 0) || isNaN(params?.data?.Quantity)) {
        return ''
      }
      return (
        <Texto>
          {params.data.Quantity ? addCommasToNumber(params.data.Quantity) : params.data.Quantity}{' '}
          {params.data.UnitOfMeasureName}
          {params.data.Quantity > 1 ? 's' : ''}
        </Texto>
      )
    },
  }
}

function actions() {
  return {
    headerName: 'Actions',
    field: 'Actions',
    filter: false,
    sortable: false,
    pinned: 'right',
    maxWidth: 110,
    cellRenderer: (params) => <ActionsCell data={params.data} />,
  }
}
