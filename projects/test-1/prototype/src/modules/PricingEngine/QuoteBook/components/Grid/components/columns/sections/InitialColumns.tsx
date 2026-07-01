import { isSpreadRow } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteSpreads/columnDefs'

export const checkboxColumn = {
  headerCheckboxSelection: true,
  checkboxSelection: (params) => !isSpreadRow(params),
  maxWidth: 50,
  headerName: '',
  suppressMenu: true,
  suppressSorting: true,
  headerCheckboxSelectionFilteredOnly: true,
}

export const QuoteConfigurationNameColumn = {
  field: 'QuoteConfigurationName',
  rowGroup: true,
  rowGroupIndex: 0,
  hide: true,
}
