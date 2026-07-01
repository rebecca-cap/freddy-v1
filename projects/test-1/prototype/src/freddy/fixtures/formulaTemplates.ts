// Freddy mock fixture — fictional
// /ContractManagement/FormulaTemplates uses PEFormulaTemplateEndpoints:
//   - FormulaTemplateManagement/GetAll  -> APIResponse<FormulaTemplateDetails[]> ({ Data: [...] })
//   - FormulaTemplateManagement/Metadata -> FormulaTemplateMetadata (TOP-LEVEL fields, no Data wrapper)
// Shapes per src/modules/FormulaTemplates/Api/types.schema.ts.

const metaItem = (id: number | string, text: string, group: string | null = null) => ({
  Text: text,
  Value: String(id),
  GroupingValue: group,
})

const variable = (
  id: number,
  name: string,
  formulaTemplateId: number,
  opts: Partial<{
    DisplayName: string
    PriceInstrumentId: number | null
    PricePublisherId: number | null
    Differential: number
    Percentage: number
    FixedValue: number
    IsRequired: boolean
  }> = {}
) => ({
  FormulaTemplateVariableId: id,
  FormulaTemplateId: formulaTemplateId,
  VariableName: name,
  DisplayName: opts.DisplayName ?? name,
  PriceInstrumentId: opts.PriceInstrumentId ?? null,
  PricePublisherId: opts.PricePublisherId ?? null,
  Differential: opts.Differential ?? 0,
  Percentage: opts.Percentage ?? 100,
  FixedValue: opts.FixedValue,
  IsRequired: opts.IsRequired ?? true,
  IsVisible: true,
  IsTemplateVariable: true,
  IsSystemVariable: false,
  CreatedDateTime: '2026-04-01T00:00:00Z',
  CreatedByCredentialId: 2001,
  CounterPartyMatchTypeCvId: null,
  AllowMultiOrigin: false,
  PriceTypeCvId: null,
  ValueSourceCvId: null,
  ValueEffectiveDateRuleCvId: null,
  TradeDateRuleCvId: null,
  MissingOptionalPriceBehaviorCvId: null,
  SystemDataType: 'Decimal',
  SpecificCounterPartyId: null,
  SpecificLocationId: null,
  SpecificProductId: null,
  PriceValuationRuleId: null,
})

const makeTemplate = (
  id: number,
  name: string,
  formula: string,
  category: number,
  variables: Array<ReturnType<typeof variable>> = []
) => ({
  FormulaTemplateId: id,
  Name: name,
  Formula: formula,
  FormulaTemplateCategoryId: category,
  FormulaTemplateCategoryDisplay: ['Index', 'Differential', 'Fixed', 'Composite'][category - 1] ?? 'Index',
  FormulaTemplateApplicableLocations: [{ LocationId: 5001 }, { LocationId: 5002 }],
  FormulaTemplateApplicableProducts: [{ ProductId: 7001 }, { ProductId: 7002 }],
  FormulaTemplateVariables: variables.length
    ? variables
    : [variable(id * 10 + 1, 'Index', id, { PriceInstrumentId: 8001, PricePublisherId: 1 })],
  IsActive: true,
  IsSystemCalculation: false,
  IsVisible: true,
  MarkerId: null,
  ParserType: 'Default',
  CreatedByCredentialId: 2001,
  CreatedDateTime: '2026-04-01T00:00:00Z',
})

export const formulaTemplatesGetAllFixture = {
  TotalRecords: 6,
  Data: [
    makeTemplate(13001, 'OPIS Houston ULSD + Diff', 'Index + Diff', 2, [
      variable(130011, 'Index', 13001, { PriceInstrumentId: 8001, PricePublisherId: 1 }),
      variable(130012, 'Diff', 13001, { FixedValue: 0.025 }),
    ]),
    makeTemplate(13002, 'Platts USGC ULSD Avg', 'Index', 1, [
      variable(130021, 'Index', 13002, { PriceInstrumentId: 8004, PricePublisherId: 2 }),
    ]),
    makeTemplate(13003, 'Argus Jet A + Diff', 'Index + Diff', 2, [
      variable(130031, 'Index', 13003, { PriceInstrumentId: 8005, PricePublisherId: 3 }),
      variable(130032, 'Diff', 13003, { FixedValue: 0.04 }),
    ]),
    makeTemplate(13004, 'Fixed 2.7500 USD/GAL', 'Fixed', 3, [
      variable(130041, 'Fixed', 13004, { FixedValue: 2.75 }),
    ]),
    makeTemplate(13005, 'OPIS Dallas Unl 87', 'Index', 1, [
      variable(130051, 'Index', 13005, { PriceInstrumentId: 8003, PricePublisherId: 1 }),
    ]),
    makeTemplate(13006, 'Composite ULSD/Gas Blend', '0.7*ULSD + 0.3*Gas', 4, [
      variable(130061, 'ULSD', 13006, { PriceInstrumentId: 8001, PricePublisherId: 1, Percentage: 70 }),
      variable(130062, 'Gas', 13006, { PriceInstrumentId: 8003, PricePublisherId: 1, Percentage: 30 }),
    ]),
  ],
  Query: null,
  Validations: [],
}

// FormulaTemplateMetadata — top-level shape, NOT under Data wrapper.
export const formulaTemplatesMetadataFixture = {
  FormulaTemplateCategories: [
    metaItem(1, 'Index'),
    metaItem(2, 'Differential'),
    metaItem(3, 'Fixed'),
    metaItem(4, 'Composite'),
  ],
  Products: [
    metaItem(7001, 'ULSD'),
    metaItem(7002, 'Gasoline 87'),
    metaItem(7003, 'Gasoline 91'),
    metaItem(7004, 'Jet A'),
    metaItem(7005, 'Biodiesel B5'),
  ],
  Locations: [
    metaItem(5001, 'Houston Terminal'),
    metaItem(5002, 'Dallas Hub'),
    metaItem(5004, 'Salt Lake Rack'),
    metaItem(5007, 'Phoenix Rack'),
  ],
  Publishers: [metaItem(1, 'OPIS'), metaItem(2, 'Platts'), metaItem(3, 'Argus')],
  Instruments: [
    metaItem(8001, 'OPIS Houston ULSD Avg', 'OPIS'),
    metaItem(8002, 'OPIS Dallas ULSD Avg', 'OPIS'),
    metaItem(8003, 'OPIS Houston Unl 87 Avg', 'OPIS'),
    metaItem(8004, 'Platts USGC ULSD', 'Platts'),
    metaItem(8005, 'Argus USGC Jet A', 'Argus'),
  ],
  LiveInstruments: [metaItem(8001, 'OPIS Houston ULSD Avg', 'OPIS')],
  DateRules: [metaItem(1, 'Trade Date'), metaItem(2, 'Effective Date')],
  TradePeriodRules: [metaItem(1, 'Monthly Avg'), metaItem(2, 'Daily')],
  CounterpartyMatchRules: [metaItem(1, 'Any'), metaItem(2, 'Specific')],
  PriceTypes: [metaItem(1, 'Settlement'), metaItem(2, 'Average'), metaItem(3, 'Low')],
  Sources: [metaItem(1, 'Published'), metaItem(2, 'Internal')],
  CounterParties: [
    metaItem(9002, 'Frontier Fuel Services'),
    metaItem(9003, 'Cascade Logistics LLC'),
    metaItem(9004, 'Prairie Trading Co.'),
  ],
  Markers: [],
  ProductHierarchies: [metaItem(1, 'Refined Products'), metaItem(2, 'Renewables')],
  LocationHierarchies: [metaItem(1, 'Gulf Coast'), metaItem(2, 'Mountain West')],
  PublisherPriceTypes: {},
  CounterPartyHierarchies: [metaItem(1, 'All Customers')],
}
