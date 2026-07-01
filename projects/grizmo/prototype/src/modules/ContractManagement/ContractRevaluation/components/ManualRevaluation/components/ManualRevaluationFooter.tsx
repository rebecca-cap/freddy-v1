import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'

export interface StepFooterProps {
  activeStepIndex: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  isNextDisabled?: boolean
  isBackVisible?: boolean
  nextLabel?: string
  onClose: () => void
}

export function ManualRevaluationFooter({
  activeStepIndex,
  totalSteps,
  onBack,
  onNext,
  isNextDisabled = false,
  isBackVisible = true,
  nextLabel,
  onClose,
}: StepFooterProps) {
  const isLastStep = activeStepIndex === totalSteps - 1
  const computedNextLabel =
    nextLabel ||
    (isLastStep ? (
      'Finish'
    ) : (
      <Horizontal alignItems='center' justifyContent='center'>
        <Texto className='mr-2' style={{ color: 'inherit' }}>
          Next
        </Texto>
        <RightOutlined />
      </Horizontal>
    ))

  if (activeStepIndex === 2) {
    return null
  }

  return (
    <Horizontal justifyContent='space-between'>
      {isBackVisible && activeStepIndex !== 0 ? (
        <GraviButton className='mr-3' onClick={onBack} buttonText={'Back'} icon={<LeftOutlined />} />
      ) : (
        <div />
      )}
      <Horizontal justifyContent='flex-end'>
        <GraviButton onClick={onClose} buttonText={'Cancel'} />
        {activeStepIndex === 0 && (
          <GraviButton theme1 onClick={onNext} disabled={isNextDisabled} buttonText={computedNextLabel} />
        )}
      </Horizontal>
    </Horizontal>
  )
}
