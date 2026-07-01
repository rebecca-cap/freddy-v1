// Freddy mock fixture — fictional
// /ContractManagement/Contracts (header entry mode + create flows) hits
// ContractManagement/MetaData. The metadata drives all dropdowns (products,
// locations, counterparties, instruments). Lists are List[] = { Text, Value, GroupingValue }.

const list = (id: number | string, text: string, group: string | null = null) => ({
  Text: text,
  Value: String(id),
  GroupingValue: group,
})

const tradeInstrument = (id: number, text: string, productId: number | null = null) => ({
  Text: text,
  Value: String(id),
  GroupingValue: null,
  DefaultProductId: productId,
  DefaultUnitOfMeasureId: 1,
  DefaultFrequencyTypeCvId: 1,
})

const priceInstrument = (id: number, text: string, group: string) => ({
  Text: text,
  Value: String(id),
  GroupingValue: group,
  CurrencyPerUnitDisplay: 'USD/GAL',
  UnitOfMeasureDisplay: 'GAL',
})

const tradePriceType = (id: number, text: string) => ({
  Text: text,
  Value: String(id),
  GroupingValue: null,
  NumberOfFormulas: 1,
})

export const contractsMetadataFixture = {
  Data: {
    TradeInstrumentList: [
      tradeInstrument(9100, 'Term Contract', 7001),
      tradeInstrument(9101, 'Spot Purchase', 7001),
      tradeInstrument(9102, 'Exchange Agreement', 7002),
      tradeInstrument(9103, 'Rack Sale', 7002),
    ],
    TradePriceTypeList: [
      tradePriceType(1, 'Fixed'),
      tradePriceType(2, 'Formula'),
      tradePriceType(3, 'Index'),
    ],
    InternalCounterPartyList: [list(1, 'Demo Refining Inc.')],
    ExternalCounterPartyList: [
      list(9002, 'Frontier Fuel Services'),
      list(9003, 'Cascade Logistics LLC'),
      list(9004, 'Prairie Trading Co.'),
      list(9005, 'Demo Trucking Co.'),
      list(9006, 'Heartland Energy Coop'),
      list(9007, 'Coastal Bunker Partners'),
    ],
    InternalColleagueList: [list(2001, 'Avery Trader'), list(2002, 'Jordan Scheduler')],
    ExternalColleagueList: [list(2050, 'External Buyer'), list(2051, 'External Seller')],
    ProductList: [
      list(7001, 'ULSD'),
      list(7002, 'Gasoline 87'),
      list(7003, 'Gasoline 91'),
      list(7004, 'Jet A'),
      list(7005, 'Biodiesel B5'),
      list(7006, 'Biodiesel B20'),
    ],
    LocationList: [
      list(5001, 'Houston Terminal'),
      list(5002, 'Dallas Hub'),
      list(5003, 'Austin Rack'),
      list(5004, 'Salt Lake Rack'),
      list(5005, 'Boise Terminal'),
      list(5006, 'Tulsa Rack'),
      list(5007, 'Phoenix Rack'),
      list(5008, 'Albuquerque Hub'),
      list(5009, 'Des Moines Hub'),
      list(5010, 'Omaha Terminal'),
      list(5011, 'Mobile Terminal'),
      list(5012, 'Austin Rack'),
    ],
    CurrencyList: [list(1, 'USD')],
    PricePublisherList: [list(1, 'OPIS'), list(2, 'Platts'), list(3, 'Argus')],
    PriceInstrumentList: [
      priceInstrument(8001, 'OPIS Houston ULSD Avg', 'OPIS'),
      priceInstrument(8002, 'OPIS Dallas ULSD Avg', 'OPIS'),
      priceInstrument(8003, 'OPIS Houston Unl 87 Avg', 'OPIS'),
      priceInstrument(8004, 'Platts USGC ULSD', 'Platts'),
      priceInstrument(8005, 'Argus USGC Jet A', 'Argus'),
    ],
    UnitOfMeasureList: [list(1, 'GAL'), list(2, 'BBL')],
    FrequencyTypeList: [list(1, 'Monthly'), list(2, 'Daily'), list(3, 'Weekly')],
    OrderStatusTypeList: [list(1, 'Active'), list(2, 'Draft'), list(3, 'Canceled')],
    QuantityTypeList: [list(1, 'Total'), list(2, 'Monthly')],
    PriceTypeList: [list(1, 'Fixed'), list(2, 'Formula')],
    PayOrReceiveTypeList: [list(1, 'Pay'), list(2, 'Receive')],
    NetOrGrossTypeList: [list(1, 'Net'), list(2, 'Gross')],
    TradePriceValuationRuleList: [list(1, 'Standard'), list(2, 'EOM')],
    Books: [list(4001, 'Wholesale'), list(4002, 'Bulk'), list(4003, 'Spot')],
    MovementTypes: [list(1, 'Truck'), list(2, 'Pipeline'), list(3, 'Barge')],
    DefaultMaxAllocation: 100,
    DefaultMinAllocation: 0,
    MaxValidAllocation: 100,
    MinValidAllocation: 0,
    PublisherPriceTypes: {},
    PublisherPriceInstruments: {},
    PricePeriodStartOffsets: [list(0, 'Same Day'), list(1, '1 Day'), list(7, '1 Week')],
    OptionalVariableBehaviors: [list(1, 'Skip'), list(2, 'Use Last')],
    FormulaTemplateDdtos: [],
    PricingCalendars: [list(3001, 'Standard Calendar'), list(3002, 'Bulk Calendar')],
  },
  Query: null,
  Validations: [],
}

// TransactionalData/TradeData/GetTradesByQuery — full Trade objects.
// Keep it small; the overview page uses ContractManagement/report/GetAll for
// the visible grid. This endpoint is hit by getContracts() in useContracts.ts
// but not consumed for rendering rows on the report. Still seed a non-empty
// shape so anything that does iterate doesn't crash.
export const tradeDataByQueryFixture = {
  TotalRecords: 0,
  Data: [],
  Query: null,
  Validations: [],
}
