import { dateFormat } from '@components/TheArmory/helpers'
import { ColDef } from 'ag-grid-community'
import moment from 'moment'

export const SelectContractDetailGridMasterDetailColumnDefs = (): ColDef[] => {
  return [EffectiveFromDate(), EffectiveToDate(), PriceValue(), ValuationStatus()]
}

const EffectiveFromDate = (): ColDef => ({
  headerName: 'Effective From',
  field: 'EffectiveFromDateTime',
  filter: 'agDateColumnFilter',
  valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.SHORT_DATE_YEAR_TIME) : ''),
})

const EffectiveToDate = (): ColDef => ({
  headerName: 'Effective To',
  field: 'EffectiveToDateTime',
  filter: 'agDateColumnFilter',
  valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.SHORT_DATE_YEAR_TIME) : ''),
})

const PriceValue = (): ColDef => ({
  headerName: 'Price',
  field: 'Value',
  filter: 'agNumberColumnFilter',
  valueFormatter: ({ value }) => (value !== undefined ? fmt.decimal(value) : ''),
})

const ValuationStatus = (): ColDef => ({
  headerName: 'Valuation Status',
  field: 'ValuationStatus',
})
