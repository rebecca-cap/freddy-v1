// Freddy mock fixture — fictional
// /Admin/PriceImportMappings — DTNMappings page.
// PriceImport/TranslationManagement/GetPriceTranslationData -> { Data: { LocationRules, ProductRules, SupplierRules } }
// PriceImport/TranslationManagement/GetMetadata -> { Products, Locations, CounterParties, PricePublishers }

const opt = (id: number, text: string) => ({ Text: text, Value: String(id), GroupingValue: null })

const locationOptions = [
  opt(5001, 'Houston Terminal'),
  opt(5002, 'Dallas Hub'),
  opt(5003, 'Salt Lake Rack'),
  opt(5004, 'Denver Terminal'),
  opt(5005, 'Phoenix Rack'),
  opt(5006, 'Albuquerque Hub'),
]

const productOptions = [
  opt(7001, 'ULSD No. 2'),
  opt(7002, 'Gasoline 87 Unl'),
  opt(7003, 'Gasoline 91 Prem'),
  opt(7004, 'Jet A'),
  opt(7005, 'Biodiesel B5'),
]

const counterPartyOptions = [
  opt(9001, 'Demo Refining Inc.'),
  opt(9002, 'Frontier Fuel Services'),
  opt(9003, 'Cascade Logistics'),
  opt(9004, 'Prairie Trading Co.'),
  opt(9005, 'Summit Energy Partners'),
]

const publisherOptions = [
  opt(4001, 'Demo Publisher One'),
  opt(4002, 'Frontier Rack Service'),
  opt(4003, 'Cascade Spot Quote'),
  opt(4004, 'Prairie Trading Index'),
]

export const priceImportMappingsFixture = {
  Data: {
    LocationRules: [
      { DataTranslationRuleId: 4501, SourceValue: 'HOU01', Display: 'Houston DTN', IsHidden: false, TargetLocationId: 5001 },
      { DataTranslationRuleId: 4502, SourceValue: 'DAL02', Display: 'Dallas DTN', IsHidden: false, TargetLocationId: 5002 },
      { DataTranslationRuleId: 4503, SourceValue: 'SLC03', Display: 'Salt Lake DTN', IsHidden: false, TargetLocationId: 5003 },
      { DataTranslationRuleId: 4504, SourceValue: 'DEN04', Display: 'Denver DTN', IsHidden: false, TargetLocationId: 5004 },
      { DataTranslationRuleId: 4505, SourceValue: 'PHX05', Display: 'Phoenix DTN', IsHidden: false },
      { DataTranslationRuleId: 4506, SourceValue: 'ABQ06', Display: 'Albuquerque DTN', IsHidden: false, TargetLocationId: 5006 },
      { DataTranslationRuleId: 4507, SourceValue: 'LEGACY-01', Display: 'Legacy Houston Code', IsHidden: true, TargetLocationId: 5001 },
    ],
    ProductRules: [
      { DataTranslationRuleId: 4510, SourceValue: 'DSL2', Display: 'ULSD #2 Source', IsHidden: false, TargetProductId: 7001 },
      { DataTranslationRuleId: 4511, SourceValue: 'UNL87', Display: 'Unleaded 87 Source', IsHidden: false, TargetProductId: 7002 },
      { DataTranslationRuleId: 4512, SourceValue: 'UNL91', Display: 'Premium 91 Source', IsHidden: false, TargetProductId: 7003 },
      { DataTranslationRuleId: 4513, SourceValue: 'JETA', Display: 'Jet A Source', IsHidden: false, TargetProductId: 7004 },
      { DataTranslationRuleId: 4514, SourceValue: 'B5BIO', Display: 'B5 Biodiesel Source', IsHidden: false, TargetProductId: 7005 },
      { DataTranslationRuleId: 4515, SourceValue: 'RD100', Display: 'Renewable Diesel Source', IsHidden: false },
    ],
    SupplierRules: [
      { DataTranslationRuleId: 4520, SourceValue: 'REF-DEMO', Display: 'Demo Refining', IsHidden: false, TargetCounterPartyId: 9001, TargetPricePublisherId: 4001 },
      { DataTranslationRuleId: 4521, SourceValue: 'FRNT-FUEL', Display: 'Frontier Fuel Source', IsHidden: false, TargetCounterPartyId: 9002, TargetPricePublisherId: 4002 },
      { DataTranslationRuleId: 4522, SourceValue: 'CSCD-LOG', Display: 'Cascade Logistics Source', IsHidden: false, TargetCounterPartyId: 9003, TargetPricePublisherId: 4003 },
      { DataTranslationRuleId: 4523, SourceValue: 'PRRT-TRD', Display: 'Prairie Trading Source', IsHidden: false, TargetCounterPartyId: 9004, TargetPricePublisherId: 4004 },
      { DataTranslationRuleId: 4524, SourceValue: 'SMMT-NRG', Display: 'Summit Energy Source', IsHidden: false, TargetCounterPartyId: 9005 },
    ],
  },
  Query: null,
  Validations: [],
}

export const priceImportMappingsMetadataFixture = {
  Products: productOptions,
  Locations: locationOptions,
  CounterParties: counterPartyOptions,
  PricePublishers: publisherOptions,
}
