import { CloseOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { benchMarkTypeDescriptions } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/util'
import {
  BenchmarkTypes,
  CreateWizardStates,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/types/page.types'
import React, { useMemo } from 'react'

export interface CreateHeaderProps {
  resetAndClose: () => void
  currentState: CreateWizardStates
  selectedType: BenchmarkTypes
  isLoading: boolean
}
export function CreateHeader({ currentState, selectedType, resetAndClose, isLoading }: CreateHeaderProps) {
  const title = useMemo(
    () => (currentState === 'isSelectingType' ? 'Select Benchmark Type' : `Create a New ${selectedType} Benchmark`),
    [currentState]
  )
  const description = useMemo(
    () =>
      currentState === 'isSelectingType'
        ? 'Choose the type of benchmark you want to create based on your pricing strategy needs.'
        : `Configure a benchmark based on ${benchMarkTypeDescriptions[selectedType]}`,
    [currentState, selectedType]
  )
  return (
    <Horizontal className='bg-1' justifyContent='center' alignItems='center'>
      <Horizontal className='max-header-width' justifyContent='space-between' alignItems='center'>
        <Vertical>
          <Texto category='h4' className='mb-1'>
            {title}
          </Texto>
          <Texto weight='normal'>{description}</Texto>
        </Vertical>
        <GraviButton
          className='ghost-gravi-button mx-1'
          buttonText={
            <Horizontal alignItems='center'>
              <CloseOutlined className='mr-1 small-button-icon' />
              <Texto className='primary-color'>Close</Texto>
            </Horizontal>
          }
          onClick={resetAndClose}
          disabled={isLoading}
        />
      </Horizontal>
    </Horizontal>
  )
}
