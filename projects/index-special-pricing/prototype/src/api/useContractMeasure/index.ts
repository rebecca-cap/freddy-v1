import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useApi } from '@gravitate-js/excalibrr'
import { seedBreakdownResponse, seedContracts } from './seed'
import type { Contract, MeasurementBreakdownResponse } from './types'

const endpoints = {
  contractById: 'REPLACE_ME',
  comparisonContractIds: 'REPLACE_ME',
  breakdown: 'REPLACE_ME',
}

const seedContractById = async (): Promise<Contract> => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(seedContracts[0])
    }, 1000)
  })
}

const comparisonContractsMetadata = async (): Promise<{ value: string; label: string }[]> => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(seedContracts.map((contract) => ({ value: contract.contract_id, label: contract.contract_id })))
    }, 1000)
  })
}

const seedMeasurementBreakdown = async (): Promise<MeasurementBreakdownResponse> => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(seedBreakdownResponse)
    })
  })
}

export const useContractMeasure = () => {
  const queryClient = useQueryClient()
  const api = useApi()

  const useContractQuery = (contractId: string) => {
    return useQuery([endpoints.contractById, contractId], seedContractById)
  }

  const useComparisonContractMetadata = () => {
    return useQuery([endpoints.comparisonContractIds], comparisonContractsMetadata)
  }

  const useBreakdownQuery = () => {
    return useQuery([endpoints.breakdown], seedMeasurementBreakdown)
  }

  return { useContractQuery, useComparisonContractMetadata, useBreakdownQuery }
}
