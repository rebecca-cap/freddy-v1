import { LeftOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { createWizardStates } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/util'
import { CreateWizardStates } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/types/page.types'
import type { FormInstance } from 'antd'
import React from 'react'

export interface CreateFooterProps {
  form: FormInstance
  currentState: CreateWizardStates
  setCurrentState: React.Dispatch<React.SetStateAction<CreateWizardStates>>
  resetAndClose: () => void
  isLoading: boolean
}
export function CreateFooter({ form, currentState, resetAndClose, setCurrentState, isLoading }: CreateFooterProps) {
  if (currentState === createWizardStates.isSelectingType) {
    return null
  }
  return (
    <Horizontal className='mb-2 p-2' justifyContent='center' alignItems='center'>
      <Horizontal className='max-header-width' justifyContent='space-between' alignItems='center'>
        <GraviButton
          disabled={isLoading}
          className='ghost-gravi-button p-1 mx-1'
          buttonText={
            <Horizontal verticalCenter>
              <LeftOutlined className='small-button-icon mr-1' />
              <Texto className='primary-color'>Back to previous</Texto>
            </Horizontal>
          }
          onClick={() => {
            setCurrentState(createWizardStates.isSelectingType)
          }}
        />
        <Horizontal className='w-full' justifyContent='flex-end' alignItems='center'>
          <GraviButton buttonText='Discard' onClick={resetAndClose} className='mr-4' disabled={isLoading} />
          <GraviButton buttonText='Create benchmark' className='gravi-button-success' onClick={() => form.submit()} loading={isLoading} />
        </Horizontal>
      </Horizontal>
    </Horizontal>
  )
}
