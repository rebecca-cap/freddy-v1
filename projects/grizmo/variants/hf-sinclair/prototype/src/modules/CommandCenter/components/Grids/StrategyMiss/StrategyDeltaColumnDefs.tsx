import { isDefinedAndNotNull } from '@utils/index'
import { ColDef } from 'ag-grid-community'

import { StatusColumn } from '../sharedComponents/sharedColumns'

export function StrategyDeltaColumnDefs() {
  return [
    StatusColumn(),
    {
      headerName: 'Delta to Strategy',
      field: 'MissToStrategy',
      valueFormatter: (params) => (isDefinedAndNotNull(params.value) ? fmt.decimal(params.value) : ''),
      filter: 'agNumberColumnFilter',
    },
  ] as ColDef[]
}
