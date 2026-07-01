import '../../../styles.css'

import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { RevaluationStep } from '@modules/ContractManagement/ContractRevaluation/components/ManualRevaluation/utils'
import { Progress } from 'antd'
import React from 'react'

export function RevaluationStepHeader({
  activeStepIndex,
  step,
  totalSteps,
}: {
  activeStepIndex: number
  step: RevaluationStep
  totalSteps: number
}) {
  const percent = ((activeStepIndex + 1) / totalSteps) * 100

  return (
    <Vertical className='revaluation-step-header'>
      <div>
        <Horizontal justifyContent='space-between' style={{ marginBottom: 8 }}>
          <Texto category='h5'>
            Step {activeStepIndex + 1} of {totalSteps}
          </Texto>
        </Horizontal>
        <Progress percent={percent} showInfo={false} strokeColor='#179088' strokeWidth={8} />
      </div>
      <Vertical className={'mt-4'}>
        <Texto category={'h3'}>{step.title}</Texto>
        <Texto category={'p2'}>{step.subtitle}</Texto>
      </Vertical>
    </Vertical>
  )
}
