// Freddy mock fixture — fictional
// /ContractManagement/Valuations is now driven by EntityReport/Read with
// ReportName='TradeEntryValuation'. Rows shape mirrors ContractValuation in
// src/modules/ContractManagement/ContractRevaluation/api/types.ts so the
// downstream ContractRevaluationGrid columns also render against this data.

const makeValuation = (
  i: number,
  contractId: number,
  detailId: number,
  counterparty: string,
  product: string,
  origin: string,
  destination: string,
  value: number,
  status: 'Valid' | 'Missing' | 'Stale' = 'Valid'
) => ({
  TradeEntryId: contractId,
  TradeEntryDetailId: detailId,
  CounterPartyName: counterparty,
  ProductId: 7000 + (i % 6) + 1,
  ProductName: product,
  OriginLocationId: 5000 + (i % 6) + 1,
  OriginLocationName: origin,
  DestinationLocationId: 5000 + ((i + 2) % 6) + 1,
  DestinationLocationName: destination,
  EffectiveFromDateTime: '2026-05-01T00:00:00Z',
  EffectiveToDateTime: '2026-05-31T23:59:59Z',
  CurvePointId: 4000 + i,
  CurvePointPriceId: 4500 + i,
  FormulaResultId: 6000 + i,
  TradeEntryTypeCodeValueMeaning: i % 2 === 0 ? 'Sale' : 'Purchase',
  TradeInstrumentName: 'Term Contract',
  UpdatedDateTime: '2026-05-02T08:00:00Z',
  ValuationStatus: status,
  Value: value,
  ValuationCalendarId: 3001,
  Prices: [
    {
      EffectiveFromDateTime: '2026-05-01T00:00:00Z',
      EffectiveToDateTime: '2026-05-31T23:59:59Z',
      Value: value,
      CurvePointPriceId: 4500 + i,
      CurvePointId: 4000 + i,
      FormulaResultId: 6000 + i,
      ValuationStatus: status,
    },
  ],
  HideDetails: false,
})

export const calculatedValuesFixture = {
  TotalRecords: 8,
  Data: [
    makeValuation(1, 11001, 21001, 'Frontier Fuel Services', 'ULSD', 'Houston Terminal', 'Dallas Hub', 2.7459),
    makeValuation(2, 11001, 21002, 'Frontier Fuel Services', 'Gasoline 87', 'Houston Terminal', 'Dallas Hub', 2.5821),
    makeValuation(3, 11002, 21003, 'Cascade Logistics LLC', 'Gasoline 91', 'Salt Lake Rack', 'Boise Terminal', 2.8154),
    makeValuation(4, 11003, 21004, 'Prairie Trading Co.', 'Jet A', 'Dallas Hub', 'Tulsa Rack', 3.1245),
    makeValuation(5, 11004, 21005, 'Demo Trucking Co.', 'ULSD', 'Phoenix Rack', 'Albuquerque Hub', 2.7512),
    makeValuation(6, 11005, 21006, 'Heartland Energy Coop', 'Biodiesel B5', 'Des Moines Hub', 'Omaha Terminal', 2.9421, 'Stale'),
    makeValuation(7, 11006, 21007, 'Coastal Bunker Partners', 'ULSD', 'Houston Terminal', 'Mobile Terminal', 2.7388),
    makeValuation(8, 11007, 21008, 'Frontier Fuel Services', 'Gasoline 87', 'Dallas Hub', 'Austin Rack', 2.5950),
  ],
  Query: null,
  Validations: [],
}
