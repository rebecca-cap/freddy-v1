// Freddy mock fixture — fictional
// /Admin/PriceTranslations — usePriceTranslations.
// PriceImport/TranslatedIdentifiers/GetAll -> { Data: PriceTranslationRow[] }
// PriceImport/TranslatedIdentifiers/MetaData -> PriceTranslationMetadata (top-level)

const opt = (id: number | string, text: string) => ({ Text: text, Value: String(id), GroupingValue: null })

const baseRow = (
  i: number,
  source: { cp: string; loc: string; prod: string },
  target: { cpId: number; cpName: string; locId: number; locName: string; prodId: number; prodName: string; pubId: number; pubName: string },
  flags: { isActive: boolean; conflict: boolean; ignore: boolean | null }
) => ({
  HasConflict: flags.conflict,
  HasAllReferenceData: !flags.conflict,
  ReferenceDataKey: { Item1: target.cpId, Item2: target.locId, Item3: target.prodId, Item4: target.pubId },
  CounterPartySourceIdentifier: source.cp,
  IsActive: flags.isActive,
  IgnoreConflicts: flags.ignore,
  LastImportedDateTime: `2026-05-0${1 + (i % 2)}T0${(i % 9)}:30:00Z`,
  LocationSourceIdentifier: source.loc,
  PriceImportTranslatedIdentifierId: 4530 + i,
  PriceImportTypeCodeValueDisplay: i % 2 === 0 ? 'DTN' : 'OPIS',
  PriceImportTypeCvId: i % 2 === 0 ? 301 : 302,
  ProductSourceIdentifier: source.prod,
  StatusCvId: flags.isActive ? 401 : 402,
  StatusMeaning: flags.isActive ? 'Active' : 'InActive',
  TargetCounterPartyId: target.cpId,
  TargetCounterPartyName: target.cpName,
  TargetLocationId: target.locId,
  TargetLocationName: target.locName,
  TargetPricePublisherName: target.pubName,
  TargetProductId: target.prodId,
  TargetProductName: target.prodName,
  TargetPublisherId: target.pubId,
  Extras: { additionalProp1: '', additionalProp2: '', additionalProp3: '' },
})

const targets = [
  { cpId: 9001, cpName: 'Demo Refining Inc.', locId: 5001, locName: 'Houston Terminal', prodId: 7001, prodName: 'ULSD No. 2', pubId: 4001, pubName: 'Demo Publisher One' },
  { cpId: 9002, cpName: 'Frontier Fuel Services', locId: 5002, locName: 'Dallas Hub', prodId: 7002, prodName: 'Gasoline 87 Unl', pubId: 4002, pubName: 'Frontier Rack Service' },
  { cpId: 9003, cpName: 'Cascade Logistics', locId: 5003, locName: 'Salt Lake Rack', prodId: 7003, prodName: 'Gasoline 91 Prem', pubId: 4003, pubName: 'Cascade Spot Quote' },
  { cpId: 9004, cpName: 'Prairie Trading Co.', locId: 5004, locName: 'Denver Terminal', prodId: 7004, prodName: 'Jet A', pubId: 4004, pubName: 'Prairie Trading Index' },
  { cpId: 9005, cpName: 'Summit Energy Partners', locId: 5005, locName: 'Phoenix Rack', prodId: 7005, prodName: 'Biodiesel B5', pubId: 4001, pubName: 'Demo Publisher One' },
  { cpId: 9001, cpName: 'Demo Refining Inc.', locId: 5006, locName: 'Albuquerque Hub', prodId: 7001, prodName: 'ULSD No. 2', pubId: 4002, pubName: 'Frontier Rack Service' },
]

const sources = [
  { cp: 'DEMO-REF', loc: 'HOU01', prod: 'DSL2' },
  { cp: 'FRNT-FUEL', loc: 'DAL02', prod: 'UNL87' },
  { cp: 'CSCD-LOG', loc: 'SLC03', prod: 'UNL91' },
  { cp: 'PRRT-TRD', loc: 'DEN04', prod: 'JETA' },
  { cp: 'SMMT-NRG', loc: 'PHX05', prod: 'B5BIO' },
  { cp: 'DEMO-REF', loc: 'ABQ06', prod: 'DSL2' },
  { cp: 'LEGACY-01', loc: 'HOU-OLD', prod: 'DSL-LEGACY' },
  { cp: 'BLRG-WHL', loc: 'ATL01', prod: 'UNL87' },
]

export const priceTranslationsFixture = {
  Data: sources.map((src, i) =>
    baseRow(i, src, targets[i % targets.length], {
      isActive: i % 4 !== 3,
      conflict: i === 6,
      ignore: i === 6 ? false : null,
    })
  ),
  Query: null,
  Validations: [],
}

export const priceTranslationsMetadataFixture = {
  LocationSourceValues: [
    opt('HOU01', 'HOU01'), opt('DAL02', 'DAL02'), opt('SLC03', 'SLC03'),
    opt('DEN04', 'DEN04'), opt('PHX05', 'PHX05'), opt('ABQ06', 'ABQ06'),
  ],
  ProductSourceValues: [
    opt('DSL2', 'DSL2'), opt('UNL87', 'UNL87'), opt('UNL91', 'UNL91'),
    opt('JETA', 'JETA'), opt('B5BIO', 'B5BIO'),
  ],
  SupplierSourceValues: [
    opt('DEMO-REF', 'DEMO-REF'), opt('FRNT-FUEL', 'FRNT-FUEL'),
    opt('CSCD-LOG', 'CSCD-LOG'), opt('PRRT-TRD', 'PRRT-TRD'),
    opt('SMMT-NRG', 'SMMT-NRG'),
  ],
  Products: [
    opt(7001, 'ULSD No. 2'), opt(7002, 'Gasoline 87 Unl'), opt(7003, 'Gasoline 91 Prem'),
    opt(7004, 'Jet A'), opt(7005, 'Biodiesel B5'),
  ],
  Locations: [
    opt(5001, 'Houston Terminal'), opt(5002, 'Dallas Hub'), opt(5003, 'Salt Lake Rack'),
    opt(5004, 'Denver Terminal'), opt(5005, 'Phoenix Rack'), opt(5006, 'Albuquerque Hub'),
  ],
  CounterParties: [
    opt(9001, 'Demo Refining Inc.'), opt(9002, 'Frontier Fuel Services'),
    opt(9003, 'Cascade Logistics'), opt(9004, 'Prairie Trading Co.'),
    opt(9005, 'Summit Energy Partners'),
  ],
  PricePublishers: [
    opt(4001, 'Demo Publisher One'), opt(4002, 'Frontier Rack Service'),
    opt(4003, 'Cascade Spot Quote'), opt(4004, 'Prairie Trading Index'),
  ],
}
