// Freddy mock fixture — fictional

const productList = [
  { Text: 'ULSD', Value: '7001', GroupingValue: 'Distillate' },
  { Text: 'Gasoline 87', Value: '7002', GroupingValue: 'Gasoline' },
  { Text: 'Gasoline 91', Value: '7003', GroupingValue: 'Gasoline' },
  { Text: 'Jet A', Value: '7004', GroupingValue: 'Distillate' },
  { Text: 'Biodiesel B5', Value: '7005', GroupingValue: 'Renewable' },
  { Text: 'Biodiesel B20', Value: '7006', GroupingValue: 'Renewable' },
]

const locationList = [
  { Text: 'Houston Terminal', Value: '5001', GroupingValue: 'Gulf Coast' },
  { Text: 'Dallas Hub', Value: '5002', GroupingValue: 'Mid-Continent' },
  { Text: 'Salt Lake Rack', Value: '5003', GroupingValue: 'Rockies' },
  { Text: 'Phoenix Terminal', Value: '5004', GroupingValue: 'Southwest' },
  { Text: 'Denver Rack', Value: '5005', GroupingValue: 'Rockies' },
]

const counterPartyList = [
  { Text: 'Demo Refining Inc.', Value: '9001', GroupingValue: 'Supplier' },
  { Text: 'Frontier Fuel Services', Value: '9002', GroupingValue: 'Customer' },
  { Text: 'Cascade Logistics', Value: '9003', GroupingValue: 'Customer' },
  { Text: 'Prairie Trading Co.', Value: '9004', GroupingValue: 'Customer' },
  { Text: 'Demo Trucking Co.', Value: '9005', GroupingValue: 'Carrier' },
]

export const netGrossMetadataFixture = {
  ProductList: productList,
  LocationList: locationList,
  CounterPartyList: counterPartyList,
  NetOrGrossTypeList: [
    { Text: 'Net', Value: '20001', GroupingValue: null },
    { Text: 'Gross', Value: '20002', GroupingValue: null },
  ],
  TradeEntryTypeList: [
    { Text: 'Rack Sale', Value: '21001', GroupingValue: null },
    { Text: 'Bulk Contract', Value: '21002', GroupingValue: null },
    { Text: 'Exchange', Value: '21003', GroupingValue: null },
  ],
  QuoteConfigurationList: [
    { Text: 'Wholesale Rack', Value: '22001', GroupingValue: null },
    { Text: 'Bulk Contracts', Value: '22002', GroupingValue: null },
  ],
  NetOrGrossDefaultTypeList: [
    { Text: 'Quote Defaults', Value: '10101', GroupingValue: null },
    { Text: 'Contract Defaults', Value: '10102', GroupingValue: null },
    { Text: 'Trade Entry Defaults', Value: '10103', GroupingValue: null },
  ],
}

const rule = (
  id: number,
  order: number,
  product: string,
  productId: number,
  location: string,
  locationId: number,
  counterParty: string,
  counterPartyId: number,
  netOrGross: 'Net' | 'Gross'
) => ({
  CounterParty: counterParty,
  CounterPartyId: counterPartyId,
  Location: location,
  LocationId: locationId,
  NetGrossDefaultId: id,
  NetGrossDefaultType: 'Quote Defaults',
  NetGrossDefaultTypeCvId: 10101,
  NetOrGrossCodeValueDisplay: netOrGross,
  NetOrGrossCvId: netOrGross === 'Net' ? 20001 : 20002,
  Order: order,
  Product: product,
  ProductId: productId,
  QuoteConfiguration: 'Wholesale Rack',
  QuoteConfigurationId: 22001,
  TradeEntryType: 'Rack Sale',
  TradeEntryTypeCvId: 21001,
})

export const netGrossRulesFixture = {
  TotalRecords: 8,
  Data: [
    rule(16001, 1, 'ULSD', 7001, 'Houston Terminal', 5001, 'Frontier Fuel Services', 9002, 'Net'),
    rule(16002, 2, 'Gasoline 87', 7002, 'Houston Terminal', 5001, 'Frontier Fuel Services', 9002, 'Net'),
    rule(16003, 3, 'Gasoline 91', 7003, 'Houston Terminal', 5001, 'Cascade Logistics', 9003, 'Gross'),
    rule(16004, 4, 'ULSD', 7001, 'Dallas Hub', 5002, 'Cascade Logistics', 9003, 'Net'),
    rule(16005, 5, 'Jet A', 7004, 'Dallas Hub', 5002, 'Prairie Trading Co.', 9004, 'Gross'),
    rule(16006, 6, 'Biodiesel B5', 7005, 'Salt Lake Rack', 5003, 'Prairie Trading Co.', 9004, 'Net'),
    rule(16007, 7, 'Gasoline 87', 7002, 'Phoenix Terminal', 5004, 'Demo Trucking Co.', 9005, 'Gross'),
    rule(16008, 8, 'ULSD', 7001, 'Denver Rack', 5005, 'Frontier Fuel Services', 9002, 'Net'),
  ],
  Query: null,
  Validations: [],
}
