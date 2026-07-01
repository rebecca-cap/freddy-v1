// Freddy mock fixture — fictional
// /ContractManagement/ContractRevaluation hits two endpoints:
//   - ContractRevaluation/GetMetaData      -> { Data: { ... metadata lists, ValidationRules } }
//   - ContractRevaluation/GetContractValuations -> { TotalRecords, Data: ContractValuation[] }
// Shapes per src/modules/ContractManagement/ContractRevaluation/api/types.ts.

import { calculatedValuesFixture } from './calculatedValueReport'

const item = (id: number | string, text: string, group = '') => ({
  Text: text,
  Value: String(id),
  GroupingValue: group,
})

export const contractRevaluationMetadataFixture = {
  Data: {
    CounterParties: [
      item(9002, 'Frontier Fuel Services'),
      item(9003, 'Cascade Logistics LLC'),
      item(9004, 'Prairie Trading Co.'),
      item(9005, 'Demo Trucking Co.'),
      item(9006, 'Heartland Energy Coop'),
      item(9007, 'Coastal Bunker Partners'),
    ],
    Locations: [
      item(5001, 'Houston Terminal'),
      item(5002, 'Dallas Hub'),
      item(5004, 'Salt Lake Rack'),
      item(5005, 'Boise Terminal'),
      item(5007, 'Phoenix Rack'),
      item(5009, 'Des Moines Hub'),
    ],
    Products: [
      item(7001, 'ULSD'),
      item(7002, 'Gasoline 87'),
      item(7003, 'Gasoline 91'),
      item(7004, 'Jet A'),
      item(7005, 'Biodiesel B5'),
    ],
    TradeInstruments: [item(9100, 'Term Contract'), item(9101, 'Spot Purchase')],
    ContractTypes: [item(1, 'Purchase'), item(2, 'Sale')],
    PricePublishers: [item(1, 'OPIS'), item(2, 'Platts'), item(3, 'Argus')],
    PriceInstruments: [
      item(8001, 'OPIS Houston ULSD Avg', 'OPIS'),
      item(8002, 'OPIS Dallas ULSD Avg', 'OPIS'),
      item(8004, 'Platts USGC ULSD', 'Platts'),
    ],
    ValidationRules: {
      MaxDateRangeDays: 90,
      MinRevaluationDate: '2026-01-01T00:00:00Z',
      MaxRevaluationDate: '2026-12-31T23:59:59Z',
    },
    PricingCalendars: [item(3001, 'Standard Calendar'), item(3002, 'Bulk Calendar')],
  },
  Query: null,
  Validations: [],
}

// Reuse the same valuation rows the EntityReport Valuations grid renders so
// IDs stay consistent across the two pages.
export const contractRevaluationValuationsFixture = calculatedValuesFixture
