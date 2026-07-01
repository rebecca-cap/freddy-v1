// Freddy mock fixture — fictional
// OpisInstruments/Admin/GetAllOpisCurves -> OpisCurveResponse { Data: OpisCurveItem[] }
// OpisInstruments/Admin/GetMetadata -> OpisMetadataResponse { ExchangeSymbolList: string[] }
// Consumer (ManageOpisCurvesGrid.tsx:57) crashes if ExchangeSymbolList is undefined.

const products = [
  { id: 7001, name: 'ULSD No. 2' },
  { id: 7002, name: 'Gasoline 87 Unl' },
  { id: 7003, name: 'Gasoline 91 Prem' },
  { id: 7004, name: 'Jet A' },
  { id: 7005, name: 'Biodiesel B5' },
  { id: 7006, name: 'Renewable Diesel' },
]

const cities = [
  { id: 5001, name: 'Houston, TX' },
  { id: 5002, name: 'Dallas, TX' },
  { id: 5003, name: 'Salt Lake City, UT' },
  { id: 5004, name: 'Denver, CO' },
  { id: 5005, name: 'Phoenix, AZ' },
  { id: 5006, name: 'Albuquerque, NM' },
]

const suppliers = [
  { id: 9001, name: 'Demo Refining Inc.' },
  { id: 9002, name: 'Frontier Fuel Services' },
  { id: 9003, name: 'Cascade Logistics' },
  { id: 9004, name: 'Prairie Trading Co.' },
  { id: 9005, name: 'Summit Energy Partners' },
]

const exchangeSymbols = [
  'CL=F', 'HO=F', 'RB=F', 'NG=F',
  'OPIS-ULSD-HOU', 'OPIS-ULSD-DAL', 'OPIS-ULSD-SLC',
  'OPIS-G87-HOU', 'OPIS-G87-DAL', 'OPIS-G91-HOU',
  'OPIS-JETA-HOU', 'OPIS-B5-DAL', 'OPIS-RD-SLC',
  'PLATTS-USGC-ULSD', 'PLATTS-GROUP3-ULSD', 'PLATTS-USGC-87',
  'NYMEX-CL-M26', 'NYMEX-HO-M26', 'NYMEX-RB-M26', 'NYMEX-NG-M26',
]

const makeCurve = (i: number) => {
  const product = products[i % products.length]
  const city = cities[i % cities.length]
  const supplier = suppliers[i % suppliers.length]
  return {
    OPISCurveId: 3001 + i,
    OPISProductId: product.id,
    OPISProductName: product.name,
    CityId: city.id,
    CityName: city.name,
    SupplierId: supplier.id,
    SupplierName: supplier.name,
    BenchmarkId: 6000 + i,
    BenchmarkName: `${product.name} ${city.name.split(',')[0]} Avg`,
    Branded: i % 3 === 0 ? 'Branded' : 'Unbranded',
    NetOrGross: i % 2 === 0 ? 'Net' : 'Gross',
    PriceInstrumentId: 8000 + i,
    ExchangeSymbol: i < exchangeSymbols.length ? exchangeSymbols[i] : '',
  }
}

export const opisCurvesFixture = {
  TotalRecords: 30,
  Data: Array.from({ length: 30 }, (_, i) => makeCurve(i)),
  Query: null,
  Validations: [],
}

export const opisMetadataFixture = {
  ExchangeSymbolList: [
    ...exchangeSymbols,
    'OPIS-ULSD-PHX', 'OPIS-ULSD-DEN', 'OPIS-G87-SLC', 'OPIS-G91-DAL',
    'OPIS-JETA-DAL', 'OPIS-B5-HOU', 'OPIS-RD-PHX',
    'PLATTS-USGC-G91', 'PLATTS-WC-ULSD', 'PLATTS-WC-G87',
  ],
  Locations: cities.map((c) => ({ Text: c.name, Value: String(c.id), GroupingValue: null })),
  Products: products.map((p) => ({ Text: p.name, Value: String(p.id), GroupingValue: null })),
  Frequencies: [
    { Text: 'Daily', Value: 'Daily', GroupingValue: null },
    { Text: 'Weekly', Value: 'Weekly', GroupingValue: null },
    { Text: 'Monthly', Value: 'Monthly', GroupingValue: null },
  ],
  Query: null,
  Validations: [],
}
