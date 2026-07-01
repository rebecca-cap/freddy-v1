import { FileSyncOutlined } from '@ant-design/icons'
import { addCommasToNumber, GraviButton } from '@gravitate-js/excalibrr'
import { isDefinedAndNotNull } from '@utils/index'
import { ColDef } from 'ag-grid-community'
import { Link } from 'react-router-dom'

import { StatusColumn } from '../sharedComponents/sharedColumns'

export function VolumePaceColumnDefs() {
  return [
    StatusColumn(),
    MTDTarget(),
    MTDPace(),
    WeeklyTarget(),
    WeeklyPace(),
    DailyTarget(),
    DailyRemaining(),
    DailyAdjustment(),
    SoldVolume(),
  ] as ColDef[]
}

function MTDTarget() {
  return {
    headerName: 'MTD Target',
    field: 'MtdTarget',
    valueFormatter: (params) => (isDefinedAndNotNull(params.value) ? addCommasToNumber(params.value) : ''),
    filter: 'agNumberColumnFilter',
  }
}
function MTDPace() {
  return {
    headerName: 'MTD Pace',
    field: 'MtdPacePercent',
    valueFormatter: (params) => (isDefinedAndNotNull(params.value) ? `${params.value}%` : ''),
    filter: 'agNumberColumnFilter',
  }
}
function WeeklyTarget() {
  return {
    headerName: 'WTD Target',
    field: 'WtdTarget',
    valueFormatter: (params) => (isDefinedAndNotNull(params.value) ? addCommasToNumber(params.value) : ''),
    filter: 'agNumberColumnFilter',
  }
}
function WeeklyPace() {
  return {
    headerName: 'Weekly Pace',
    field: 'WeeklyPacePercent',
    valueFormatter: (params) => (isDefinedAndNotNull(params.value) ? `${params.value}%` : ''),
    filter: 'agNumberColumnFilter',
  }
}
function DailyTarget() {
  return {
    headerName: 'Daily Target',
    field: 'DailyTarget',
    valueFormatter: (params) => (isDefinedAndNotNull(params.value) ? addCommasToNumber(params.value) : ''),
    filter: 'agNumberColumnFilter',
  }
}
function DailyRemaining() {
  return {
    headerName: 'Daily Remaining',
    field: 'DailyRemaining',
    valueFormatter: (params) => (isDefinedAndNotNull(params.value) ? addCommasToNumber(params.value) : ''),
    filter: 'agNumberColumnFilter',
  }
}
function DailyAdjustment() {
  return {
    headerName: 'Daily Adjustment',
    field: 'DailyAdjustment',
    valueFormatter: (params) => (isDefinedAndNotNull(params.value) ? `${addCommasToNumber(params.value)}%` : ''),
    filter: 'agNumberColumnFilter',
  }
}
function SoldVolume() {
  return {
    headerName: 'Sold Volume',
    field: 'SoldVolume',
    valueFormatter: (params) => (params.value ? addCommasToNumber(params.value) : 0),
    filter: 'agNumberColumnFilter',
  }
}

function Actions() {
  return {
    headerName: 'Actions',
    field: 'Actions',
    cellRenderer: (params) => {
      return (
        <Link
          target='_blank'
          to={{
            pathname: '/PricingEngine/QuoteBookEOD',
            search: `?HasFilters=true`,
          }}
        >
          <GraviButton
            size='small'
            icon={<FileSyncOutlined />}
            title='QB'
            onClick={() =>
              window.localStorage.setItem(
                'QuoteBookDataGridEndOfDay-ExternalFilterModel',
                JSON.stringify({
                  LocationName: [params.data.TerminalName],
                })
              )
            }
          />
        </Link>
      )
    },
  }
}
