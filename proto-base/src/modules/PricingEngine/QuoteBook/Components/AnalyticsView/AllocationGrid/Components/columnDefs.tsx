import { defaultNumberColumn } from '@components/shared/Grid/defaultColumnDefs/DefaultNumberColumnDef'
import { addCommasToNumber } from '@gravitate-js/excalibrr'
import { isDefinedAndNotNull } from '@utils/index'
import { ColDef } from 'ag-grid-community'

export function columnDefs() {
  return [AllocationName(), MonthlySection(), WeeklySection(), DailySection()] as ColDef[]
}

function AllocationName() {
  return {
    headerName: 'Allocation Name',
    field: 'AllocationName',
    headerTooltip: 'Allocation Name',
    minWidth: 50,
  }
}

function MonthlySection() {
  return {
    headerName: 'Monthly',
    children: [
      Forecast('Monthly'),
      AllocationPercent('Monthly'),
      Liftings('Monthly'),
      AllocationStatus('Monthly'),
      ToDateForecast('Monthly'),
      ToDatePercentOfForecast('Monthly'),
    ],
  }
}

function WeeklySection() {
  return {
    headerName: 'Weekly',
    children: [
      Forecast('Weekly'),
      AllocationPercent('Weekly'),
      Liftings('Weekly'),
      AllocationStatus('Weekly'),
      ToDateForecast('Weekly'),
      ToDatePercentOfForecast('Weekly'),
      ScaledAllocationAmount('Weekly'),
      Remaining('Weekly'),
    ],
  }
}

function DailySection() {
  return {
    headerName: 'Daily',
    children: [
      Forecast('Daily'),
      AllocationPercent('Daily'),
      Liftings('Daily'),
      AllocationStatus('Daily'),
      ScaledAllocationAmount('Daily'),
      Remaining('Daily'),
    ],
  }
}

function Forecast(section: string) {
  return {
    ...defaultNumberColumn,
    headerName: 'Forecast',
    field: `${section}.Forecast`,
    headerTooltip: `${section} Forecast`,
    valueFormatter: ({ value }) => (isDefinedAndNotNull(value) ? addCommasToNumber(value) : ''),
    minWidth: 50,
  }
}

function ToDateForecast(section: string) {
  return {
    ...defaultNumberColumn,
    headerName: 'To Date Forecast',
    field: `${section}.ToDateForecast`,
    headerTooltip: `${section} To Date Forecast`,
    valueFormatter: ({ value }) => (isDefinedAndNotNull(value) ? addCommasToNumber(value) : ''),
    minWidth: 50,
  }
}

function ToDatePercentOfForecast(section: string) {
  return {
    ...defaultNumberColumn,
    headerName: 'To Date % of Forecast',
    field: `${section}.ToDatePercentageOfForecast`,
    headerTooltip: `${section} To Date % of Forecast`,
    valueFormatter: ({ value }) => (isDefinedAndNotNull(value) ? `${value}%` : ''),
    minWidth: 50,
  }
}

function AllocationStatus(section: string) {
  return {
    headerName: 'Status',
    field: `${section}.AllocationStatus`,
    headerTooltip: `${section} Allocation Status`,
    minWidth: 50,
  }
}

function AllocationPercent(section: string) {
  return {
    ...defaultNumberColumn,
    headerName: 'Scale %',
    field: `${section}.AllocationPercentageAdjustment`,
    headerTooltip: `${section} Allocation % Adjustment`,
    valueFormatter: ({ value }) => (isDefinedAndNotNull(value) ? `${value}%` : ''),
    minWidth: 50,
  }
}

function ScaledAllocationAmount(section: string) {
  return {
    ...defaultNumberColumn,
    headerName: 'Scaled Allocation Amount',
    field: `${section}.ScaledAllocationAmount`,
    headerTooltip: `${section} Scaled Allocation Amount`,
    valueFormatter: ({ value }) => (isDefinedAndNotNull(value) ? addCommasToNumber(value) : ''),
    minWidth: 50,
  }
}

function Liftings(section: string) {
  return {
    ...defaultNumberColumn,
    headerName: 'Liftings',
    field: `${section}.Liftings`,
    headerTooltip: `${section} Liftings`,
    valueFormatter: ({ value }) => (isDefinedAndNotNull(value) ? addCommasToNumber(value) : ''),
    minWidth: 50,
  }
}

function Remaining(section: string) {
  return {
    ...defaultNumberColumn,
    headerName: 'Remaining',
    field: `${section}.Remaining`,
    headerTooltip: `${section} Remaining`,
    valueFormatter: ({ value }) => (isDefinedAndNotNull(value) ? addCommasToNumber(value) : ''),
    minWidth: 50,
  }
}
