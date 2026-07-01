import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { NoData } from '@modules/Analytics/PricePerformance/components/Messages'
import React, { useMemo } from 'react'

import { BenchmarkCorrelation } from '../../../api/schema.types'
import { useManageBenchmarkCorrelations } from '../../../api/useManageBenchmarkCorrelations'
import { CardDisplayContainer } from './CardDisplayContainer'
import { BenchmarkCorrelationChart } from './Chart'
import { getBenchmarkMeasurement } from './util'

export function AnalysisView({
  selectedRows,
  selectedType,
  formValues,
}: {
  selectedRows: BenchmarkCorrelation[]
  selectedType: string
  formValues: Record<string, number | undefined>
}) {
  const { useLatestMeasurements } = useManageBenchmarkCorrelations()
  const { data: latestMeasurements } = useLatestMeasurements(selectedRows[0].QuoteConfigurationMappingId)

  const measurementData = useMemo(
    () => getBenchmarkMeasurement(selectedType, selectedRows, latestMeasurements, formValues),
    [selectedType, selectedRows, latestMeasurements, formValues]
  )

  const modelFitCorrelationDisplay = useMemo(() => {
    const newDataForCard = [
      { label: 'Correlation', value: measurementData?.RValue || 0 },
      { label: 'R-Squared', value: measurementData?.RSquared || 0 },
      { label: 'STD Error', value: measurementData?.StandardError || 0 },
      { label: 'P-Value', value: measurementData?.PValue || 0 },
    ]
    return newDataForCard
  }, [measurementData])
  const dataQualityDisplay = useMemo(() => {
    const newDataForCard = [
      { label: 'Data Points', value: measurementData?.NumberOfDataPoints || 0 },
      { label: 'Days Included', value: measurementData?.DaysInRegression || 0 },
      { label: 'Outliers Removed', value: measurementData?.OutliersRemoved || 0 },
      { label: 'Missing Prices', value: measurementData?.VolumesWithoutPricing || 0 },
    ]
    return newDataForCard
  }, [measurementData])
  if (!measurementData) {
    return (
      <Vertical flex={4} className='my-2'>
        <NoData />
      </Vertical>
    )
  }
  return (
    <Vertical flex={4} className='my-2' style={{ height: '100%' }}>
      <CardDisplayContainer title='Model Fit & Correlation' data={modelFitCorrelationDisplay} />
      <Horizontal flex={3} className='p-2 px-4 m-2'>
        <BenchmarkCorrelationChart measurementData={measurementData} isFetchingData={false} />
      </Horizontal>
      <CardDisplayContainer title='Data Quality' data={dataQualityDisplay} />
    </Vertical>
  )
}
