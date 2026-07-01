// Freddy mock fixture — fictional
// APIResponse<TradeEntrySetupVolumeThreshold[]>

const threshold = (
  setupId: number,
  instrument: string,
  product: string,
  location: string,
  min: number,
  max: number,
  monthlyMin: number,
  monthlyMax: number,
  warning: number,
  isActive: boolean = true
) => ({
  TradeEntrySetupId: setupId,
  InstrumentName: instrument,
  ProductName: product,
  LocationName: location,
  IsActive: isActive,
  MinimumVolume: min,
  MaximumVolume: max,
  MinimumVolumeIncrement: 100,
  MonthlyMinimumVolume: monthlyMin,
  MonthlyMaximumVolume: monthlyMax,
  WarningVolumeThreshold: warning,
})

export const volumeThresholdsFixture = {
  TotalRecords: 8,
  Data: [
    threshold(18001, 'Houston ULSD Rack', 'ULSD', 'Houston Terminal', 1000, 50000, 50000, 1500000, 40000),
    threshold(18002, 'Houston Gas 87 Rack', 'Gasoline 87', 'Houston Terminal', 1000, 45000, 50000, 1300000, 38000),
    threshold(18003, 'Houston Gas 91 Rack', 'Gasoline 91', 'Houston Terminal', 500, 25000, 25000, 700000, 20000),
    threshold(18004, 'Dallas ULSD Rack', 'ULSD', 'Dallas Hub', 1000, 40000, 40000, 1200000, 32000),
    threshold(18005, 'Dallas Gas 87 Rack', 'Gasoline 87', 'Dallas Hub', 1000, 38000, 40000, 1100000, 30000),
    threshold(18006, 'Salt Lake Jet A Bulk', 'Jet A', 'Salt Lake Rack', 5000, 60000, 100000, 1800000, 50000),
    threshold(18007, 'Phoenix B5 Rack', 'Biodiesel B5', 'Phoenix Terminal', 500, 15000, 20000, 450000, 12000),
    threshold(18008, 'Denver ULSD Rack', 'ULSD', 'Denver Rack', 800, 30000, 35000, 900000, 25000, false),
  ],
  Query: null,
  Validations: [],
}
