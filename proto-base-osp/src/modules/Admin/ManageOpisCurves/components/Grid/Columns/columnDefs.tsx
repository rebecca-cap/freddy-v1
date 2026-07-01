import { ColDef } from 'ag-grid-community'

type ManageOpisCurvesGridColumnProps = {
  filteredExchangeSymbolList: string[] | undefined
}

const defaultColumnDef = () => {
  return {
    cellStyle: { textAlign: 'left' },
  }
}

export const getManageOpisCurvesColumnDefs = ({
  filteredExchangeSymbolList,
}: ManageOpisCurvesGridColumnProps): ColDef[] => {
  return [
    SelectionColumn(),
    OpisCurveId(),
    Product(),
    Location(),
    Supplier(),
    Benchmark(),
    Branded(),
    NetOrGross(),
    PriceInstrumentId(),
    ExchangeSymbol(filteredExchangeSymbolList),
  ]
}
const SelectionColumn = () => ({
  headerCheckboxSelection: true,
  checkboxSelection: true,
  maxWidth: 50,
  headerCheckboxSelectionFilteredOnly: true,
})

const OpisCurveId = () => ({
  ...defaultColumnDef(),
  headerName: 'Opis Id',
  field: 'OPISCurveId',
  editable: false,
})

const Product = () => ({
  headerName: 'Product',
  field: 'OPISProductName',
  type: 'center',
  editable: false,
})

const Location = () => ({
  ...defaultColumnDef(),
  headerName: 'City',
  field: 'CityName',
  editable: false,
})

const Supplier = () => ({
  ...defaultColumnDef(),
  headerName: 'Supplier',
  field: 'SupplierName',
  editable: false,
})

const Benchmark = () => ({
  ...defaultColumnDef(),
  headerName: 'Benchmark',
  field: 'BenchmarkName',
  editable: false,
})

const Branded = () => ({
  ...defaultColumnDef(),
  headerName: 'Branded',
  field: 'Branded',
  editable: false,
})

const NetOrGross = () => ({
  ...defaultColumnDef(),
  headerName: 'Net Or Gross',
  field: 'NetOrGross',
  editable: false,
})

const PriceInstrumentId = () => ({
  ...defaultColumnDef(),
  headerName: 'Price Instrument ID',
  field: 'PriceInstrumentId',
  editable: false,
})

const ExchangeSymbol = (filteredExchangeSymbolList: string[] | undefined) => ({
  ...defaultColumnDef(),
  headerName: 'Exchange Symbol',
  field: 'ExchangeSymbol',
  editable: ({ data }) => !!data?.PriceInstrumentId,
  cellEditor: 'SearchableSelect',
  cellEditorParams: {
    options: filteredExchangeSymbolList?.map((option) => ({
      value: option,
      label: option,
    })),
    showSearch: true,
    allowClear: true,
  },
})
