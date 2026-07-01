const BENCHMARK_CONFIG = {
  Spot: 'SpotMarketBenchmark',
  'Rack Low': 'RackLowBenchmark',
  'Rack Average': 'RackAverageBenchmark',
  Competitor: 'CompetitorBenchmark',
}
export function getBenchmarkMeasurement(selectedType, selectedRows, latestMeasurements, formValues) {
  const benchmarkProperty = BENCHMARK_CONFIG[selectedType]
  if (!benchmarkProperty) return null

  const correlatedCalculationId = selectedRows[0]?.[benchmarkProperty]?.CorrelatedCalculationId

  // Validate correlatedCalculationId exists and matches form values if present
  if (
    !correlatedCalculationId ||
    (formValues?.[benchmarkProperty] && formValues[benchmarkProperty] !== correlatedCalculationId)
  ) {
    return null
  }

  return latestMeasurements?.Data?.find(
    (measurement) => measurement.CorrelatedCalculationId === correlatedCalculationId
  )
}
