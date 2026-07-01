import { dateFormat } from '@components/TheArmory/helpers'
import { getGroupValue } from '@modules/Analytics/PricePerformance/components/Grid/gridHelpers'
import { RowGetter } from '@modules/Analytics/PricePerformance/components/types'
import { ColDef, ValueGetterParams } from 'ag-grid-community'
import moment from 'moment'

export const getColumnDefs = (getGroupRowData: RowGetter): ColDef[] => {
  return [
    ExternalCounterparty(getGroupRowData),
    TradeEntryId(),
    StartDate(getGroupRowData),
    EndDate(getGroupRowData),
    Terminal(),
    Product(),
  ]
}
const formatDate = (date: string) => date && moment(date).format(dateFormat.MONTH_DATE_YEAR)
const ExternalCounterparty = (getGroupRowData: RowGetter) => ({
  headerName: 'External Counterparty',
  field: 'ExternalCounterParty',
  valueGetter: (params: ValueGetterParams) => getGroupValue(params, getGroupRowData, 'ExternalCounterParty'),
  filterParams: {
    showTooltips: true,
  },
})

const TradeEntryId = () => ({
  headerName: 'Contract ID',
  field: 'TradeEntryId',
  rowGroup: true,
  rowGroupIndex: 1,
  hide: true,
})

const StartDate = (getGroupRowData: RowGetter) => ({
  headerName: 'Start Date',
  field: 'StartDate',
  valueGetter: (params: ValueGetterParams) => getGroupValue(params, getGroupRowData, 'StartDate'),
  valueFormatter: ({ value }) => formatDate(value),
  filterParams: {
    valueFormatter: ({ value }) => formatDate(value),
  },
  sort: 'asc',
})

const EndDate = (getGroupRowData: RowGetter) => ({
  headerName: 'End Date',
  field: 'EndDate',
  valueGetter: (params: ValueGetterParams) => getGroupValue(params, getGroupRowData, 'EndDate'),
  valueFormatter: ({ value }) => formatDate(value),
  filterParams: {
    valueFormatter: ({ value }) => formatDate(value),
  },
})

const Terminal = () => ({
  headerName: 'Terminal',
  field: 'Location',
  rowGroup: true,
  rowGroupIndex: 2,
  hide: true,
})

const Product = () => ({ headerName: 'Product', field: 'Product', rowGroup: true, hide: true })
