import { dateFormat } from '@components/TheArmory/helpers'
import { ColDef } from 'ag-grid-community'
import moment from 'moment'

export const ContractRevaluationGridMasterDetailColumnDefs = (): ColDef[] => {
  return [EffectiveFromDate(), EffectiveToDate(), PriceValue(), ValuationStatus(), UpdatedDateTime()]
}

const EffectiveFromDate = (): ColDef => ({
  headerName: 'Effective From',
  field: 'EffectiveFromDateTime',

  valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.SHORT_DATE_YEAR_TIME) : ''),
})

const EffectiveToDate = (): ColDef => ({
  headerName: 'Effective To',
  field: 'EffectiveToDateTime',
  valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.SHORT_DATE_YEAR_TIME) : ''),
})

const PriceValue = (): ColDef => ({
  headerName: 'Price ',
  field: 'Value',
  valueFormatter: ({ value }) => (value !== undefined ? fmt.decimal(value) : ''),
})

const ValuationStatus = (): ColDef => ({
  headerName: 'Valuation Status',
  field: 'ValuationStatus',
})

// UpdatedDateTime
const UpdatedDateTime = (): ColDef => ({
  headerName: 'Updated',
  field: 'UpdatedDateTime',
  valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.SHORT_DATE_YEAR_TIME) : ''),
})
