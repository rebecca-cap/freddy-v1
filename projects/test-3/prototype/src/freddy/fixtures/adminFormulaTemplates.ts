// Freddy mock fixture — fictional
// MarketPlatform/ContractTemplates/* — OSP variant of the FormulaTemplates feature.

const meta = (id: number, text: string) => ({ Text: text, Value: id.toString(), GroupingValue: null })

const products = [
  meta(7001, 'ULSD'),
  meta(7002, 'Gasoline 87'),
  meta(7003, 'Gasoline 91'),
  meta(7004, 'Jet A'),
  meta(7005, 'Biodiesel B5'),
]

const locations = [
  meta(5001, 'Houston Terminal'),
  meta(5002, 'Dallas Hub'),
  meta(5003, 'Salt Lake Rack'),
  meta(5004, 'Phoenix Terminal'),
]

const counterParties = [
  meta(9001, 'Demo Refining Inc.'),
  meta(9002, 'Frontier Fuel Services'),
  meta(9003, 'Cascade Logistics'),
  meta(9004, 'Prairie Trading Co.'),
]

const publishers = [meta(3001, 'OPIS'), meta(3002, 'Platts'), meta(3003, 'Argus')]
const instruments = [
  meta(4001, 'OPIS Houston ULSD Avg'),
  meta(4002, 'OPIS Dallas Gas 87 Low'),
  meta(4003, 'Platts Gulf Coast ULSD'),
  meta(4004, 'OPIS Salt Lake Jet A'),
]
const priceTypes = [meta(5101, 'Average'), meta(5102, 'Low'), meta(5103, 'High'), meta(5104, 'Contract')]

export const adminFormulaTemplatesMetadataFixture = {
  FormulaTemplateCategories: [
    meta(8101, 'Contract Pricing'),
    meta(8102, 'Wholesale Markup'),
    meta(8103, 'Supply Cost'),
    meta(8104, 'Spot Settlement'),
  ],
  Products: products,
  Locations: locations,
  Publishers: publishers,
  Instruments: instruments,
  LiveInstruments: instruments,
  DateRules: [meta(9501, 'Trade Date'), meta(9502, 'Effective Date'), meta(9503, 'Day Prior')],
  TradePeriodRules: [meta(9601, 'Daily'), meta(9602, 'Monthly Average')],
  CounterpartyMatchRules: [meta(9701, 'Specific'), meta(9702, 'Hierarchy')],
  PriceTypes: priceTypes,
  Sources: [meta(9801, 'Published'), meta(9802, 'Calculated'), meta(9803, 'Manual')],
  CounterParties: counterParties,
  Markers: [],
  ProductHierarchies: [meta(9901, 'Product Group')],
  LocationHierarchies: [meta(9911, 'Region')],
  PublisherPriceTypes: { '3001': priceTypes, '3002': priceTypes, '3003': priceTypes },
  CounterPartyHierarchies: [meta(9921, 'Customer Tier')],
}

const variable = (id: number, templateId: number, name: string, instrumentId: number) => ({
  FormulaTemplateVariableId: id,
  FormulaTemplateId: templateId,
  VariableName: name,
  DisplayName: name,
  PriceInstrumentId: instrumentId,
  PricePublisherId: 3001,
  PriceTypeCvId: 5101,
  IsRequired: true,
  IsCost: false,
  IsPlaceholder: false,
  IsTemplateVariable: true,
  IsVisible: true,
  Differential: 0,
  Percentage: 100,
  CreatedDateTime: '2026-04-15T08:00:00Z',
})

const template = (id: number, name: string, formula: string, productIds: number[], locationIds: number[]) => ({
  FormulaTemplateId: id,
  Name: name,
  Formula: formula,
  FormulaTemplateCategoryId: 8101,
  FormulaTemplateCategoryDisplay: 'Contract Pricing',
  FormulaTemplateApplicableProducts: productIds.map((ProductId) => ({ ProductId })),
  FormulaTemplateApplicableLocations: locationIds.map((LocationId) => ({ LocationId })),
  FormulaTemplateVariables: [variable(id * 100 + 1, id, 'Benchmark', 4001)],
  IsActive: true,
  IsSystemCalculation: false,
  IsVisible: true,
  MarkerId: null,
  ParserType: 'Standard',
  CreatedByCredentialId: 2001,
  CreatedDateTime: '2026-04-15T08:00:00Z',
})

export const adminFormulaTemplatesFixture = {
  TotalRecords: 6,
  Data: [
    template(8201, 'Gulf Coast ULSD Contract', '[Benchmark] + 0.0125', [7001], [5001]),
    template(8202, 'Mid-Con Gas 87 Wholesale', '[Benchmark] + 0.0085', [7002], [5002]),
    template(8203, 'Rockies Jet A Spot', '[Benchmark] + 0.0210', [7004], [5003]),
    template(8204, 'Southwest Gas 91 Premium', '[Benchmark] + 0.0150', [7003], [5004]),
    template(8205, 'Renewable B5 Pass-Through', '[Benchmark] + 0.0050', [7005], [5001, 5002]),
    template(8206, 'Houston ULSD Index Net', '[Benchmark] - 0.0025', [7001], [5001]),
  ],
  Query: null,
  Validations: [],
}
