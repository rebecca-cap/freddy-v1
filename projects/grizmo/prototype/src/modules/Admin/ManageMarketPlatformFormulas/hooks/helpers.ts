import { MarketPlatformFormulaMetadata } from '@api/useMarketPlatformFormulas/types'

interface INewLivePriceVariableProps {
  values: any
  metadata: MarketPlatformFormulaMetadata
}

export const initializeNewLivePriceVariable = ({ values, metadata }: INewLivePriceVariableProps) => {
  return {
    ...values,
    VariableName: 'LivePrice',
    FormulaVariableId: Math.floor(Math.random() * 1000000), // fake a random ID until the variable is saved. (needed for ag grid)
  }
}
