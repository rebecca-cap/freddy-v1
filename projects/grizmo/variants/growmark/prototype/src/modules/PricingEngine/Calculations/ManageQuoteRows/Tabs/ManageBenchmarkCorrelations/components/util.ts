import {
  benchmarkKeyMap,
  BenchmarkMetadataBenchmarkItem,
  BenchmarkMetadataResponse,
  BenchmarkTypes,
  CorrelatedCalculationAssociation,
} from '../api/schema.types'

export const formatBenchmarkCorrelationsHeader = (key: string) => {
  return key
    .replace(/Benchmark|Market/g, '') // remove 'Benchmark' and 'Market'
    .replace(/([a-z])([A-Z])/g, '$1 $2') // insert space before capital letters
    .trim()
}

// for future implementation of getting price
export const getPriceFromCorrelatedCalculationAssociations = (
  CorrelationCategoryCodeValueId: number,
  CorrelatedCalculationAssociations: CorrelatedCalculationAssociation[]
) => {
  const associatedCalculation = CorrelatedCalculationAssociations.find(
    (ca) => ca.CorrelationCategoryCvId === CorrelationCategoryCodeValueId
  )

  if (!associatedCalculation) {
    return 'Price not found'
  }

  return associatedCalculation.CorrelatedCalculation.FormulaString
}

export const getSelectBenchmarkPlaceholder = (selectedType) => {
  return `Choose a ${selectedType?.toLowerCase() ?? ''}  benchmark`
}

export const getBenchmarkListKey = (type: BenchmarkTypes): string => {
  return benchmarkKeyMap[type] ?? ''
}

export const isDisplayed = (key: string, selectedType: BenchmarkTypes): 'block' | 'none' => {
  return benchmarkKeyMap[selectedType] === key ? 'block' : 'none'
}

export const getBenchmarkList = (
  benchmarkCorrelationsMetadataResponse: BenchmarkMetadataResponse | undefined,
  selectedType: BenchmarkTypes
) => {
  if (!benchmarkCorrelationsMetadataResponse?.Data || !selectedType) return []

  const key = getBenchmarkListKey(selectedType).replace(/([^s])$/, '$1s')
  return benchmarkCorrelationsMetadataResponse.Data[key] ?? []
}

export const getBenchmarkSelectOptions = (benchmarkList: BenchmarkMetadataBenchmarkItem[]) => {
  return benchmarkList
    ?.sort((a, b) => a.Name.localeCompare(b.Name))
    .map((benchmark) => {
      return {
        ...benchmark,
        label: benchmark.Name,
        value: benchmark.CorrelatedCalculationId,
      }
    })
}
