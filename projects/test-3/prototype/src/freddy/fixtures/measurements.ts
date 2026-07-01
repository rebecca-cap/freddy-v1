// Freddy mock fixture — fictional
// /ContractManagement/Measurements is fully populated by an inline seed in
// src/api/useContractMeasure/seed.ts (the hook resolves seedContracts and
// seedBreakdownResponse via setTimeout, no API call is made). No endpoints
// to register today.
//
// If/when the page is wired to real endpoints, register them here. Reserved
// ID range for measurements: 12000–12050.

export const measurementsPlaceholderFixture = {
  TotalRecords: 0,
  Data: [],
  Query: null,
  Validations: [],
}
