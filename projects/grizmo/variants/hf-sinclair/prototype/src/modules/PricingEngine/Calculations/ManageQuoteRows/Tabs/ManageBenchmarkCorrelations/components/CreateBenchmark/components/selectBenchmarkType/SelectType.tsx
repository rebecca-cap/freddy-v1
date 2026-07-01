import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { SelectTypeRadioItem } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/selectBenchmarkType/SelectTypeRadioItem'
import {
  benchmarkTypes,
  createWizardStates,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/util'
import {
  BenchmarkTypes,
  CreateWizardStates,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/types/page.types'
import { Form, Radio } from 'antd'
import React from 'react'

export interface SelectTypeProps {
  setCurrentState: React.Dispatch<React.SetStateAction<CreateWizardStates>>
  resetAndClose: () => void
  selectedType: BenchmarkTypes
}
export function SelectType({ setCurrentState, resetAndClose, selectedType }: SelectTypeProps) {
  const typeOptions = Object.keys(benchmarkTypes)
  return (
    <Horizontal justifyContent='center' alignItems='center'>
      <Vertical flex={1} alignItems='flex-start' className='max-content-width'>
        <Horizontal className='mb-2' justifyContent='flex-start'>
          <Texto>Select a benchmark type:</Texto>
        </Horizontal>
        <Form.Item
          className='w-full'
          name='benchmarkType'
          rules={[{ required: true, message: 'Please select a benchmark type' }]}
        >
          <Radio.Group className='w-full' name='benchmarkType'>
            <Vertical>
              {typeOptions.map((type) => (
                <SelectTypeRadioItem key={type} selectedType={selectedType} typeName={type as BenchmarkTypes} />
              ))}
            </Vertical>
          </Radio.Group>
        </Form.Item>
        <Horizontal className='w-full' justifyContent='flex-end' alignItems='center'>
          <GraviButton buttonText='Discard' onClick={resetAndClose} className='mr-4' />
          <GraviButton
            buttonText='Continue'
            success
            onClick={() => setCurrentState(createWizardStates.isConfiguring)}
          />
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}
