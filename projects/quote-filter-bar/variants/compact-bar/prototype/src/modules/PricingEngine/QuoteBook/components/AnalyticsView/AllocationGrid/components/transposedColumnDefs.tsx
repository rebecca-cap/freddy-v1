import { isDefinedAndNotNull } from '@utils/index'
import { ColDef } from 'ag-grid-community'

export function transposedColumnDefs(isTransposed: boolean, allocationNames?: string[]) {
  const columns: ColDef[] = [Name(isTransposed), GroupName()]
  allocationNames?.forEach((allocationName) => {
    columns.push(namedColumn(allocationName))
  })
  return columns
}

function GroupName() {
  return {
    headerName: 'Period',
    field: 'ColumnGroup',
    minWidth: 80,
    rowGroup: true,
    hide: true,
  }
}

function Name(isTransposed) {
  return {
    headerName: 'Metric',
    field: 'MetricName',
    rowDrag: isTransposed,
    minWidth: 200,
    cellRenderer: ({ value }) => {
      const metricDisplayNames: { [key: string]: string } = {
        Forecast: 'Forecast',
        AllocationPercentageAdjustment: 'Scale %',
        Liftings: 'Liftings',
        AllocationStatus: 'Status',
        ToDateForecast: 'To Date Forecast',
        ToDatePercentageOfForecast: 'To Date % of Forecast',
        ScaledAllocationAmount: 'Scaled Allocation Amount',
        Remaining: 'Remaining',
      }

      return metricDisplayNames[value] || value
    },
  }
}

function namedColumn(name: string) {
  return {
    headerName: name,
    field: name,
    minWidth: 120,
    cellRenderer: ({ data, value }) => {
      const metric = data?.MetricName

      if (!isDefinedAndNotNull(value)) return ''

      switch (metric) {
        case 'AllocationPercentageAdjustment':
        case 'ToDatePercentageOfForecast':
          return isDefinedAndNotNull(value) ? `${value}%` : ''

        case 'AllocationStatus':
          return value

        case 'Forecast':
        case 'Liftings':
        case 'ToDateForecast':
        case 'ScaledAllocationAmount':
        case 'Remaining':
          return value.toLocaleString()

        default:
          return value
      }
    },
  }
}
