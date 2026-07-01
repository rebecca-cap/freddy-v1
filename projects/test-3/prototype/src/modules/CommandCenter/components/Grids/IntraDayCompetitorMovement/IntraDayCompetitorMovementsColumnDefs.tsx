import { dateFormat } from '@components/TheArmory/helpers'
import { addCommasToNumber } from '@gravitate-js/excalibrr'
import { isDefinedAndNotNull } from '@utils/index'
import { ColDef } from 'ag-grid-community'
import moment from 'moment/moment'

import { StatusColumn } from '../sharedComponents/sharedColumns'

export function IntradayCompetitorMovementsColumnDefs() {
  return [
    StatusColumn(),
    {
      headerName: 'Moves Today',
      field: 'MovesToday',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => (isDefinedAndNotNull(params.value) ? addCommasToNumber(params.value) : ''),
    },
    {
      headerName: 'Avg Move',
      field: 'AvgMove',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => (isDefinedAndNotNull(params.value) ? fmt.decimal(params.value) : ''),
    },
    {
      headerName: 'Last Move',
      field: 'LastMove',
      filterParams: {
        valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.SHORT_DATE_YEAR_TIME) : ''),
      },
      valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.SHORT_DATE_YEAR_TIME) : ''),
    },
  ] as ColDef[]
}
