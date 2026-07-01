import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { steps as defaultSteps } from '@modules/Dashboard/SpecialOffers/utils/Constants/FormConstants'
import type { FormInstance } from 'antd'
interface FooterProps {
  finished: boolean
  setFinished: React.Dispatch<React.SetStateAction<boolean>>
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  validateFormAndNavigate: () => void
  form: FormInstance
  /** Step labels for the "Step X of N" counter and last-step detection.
   *  Defaults to the 4-step wizard's constant when omitted. */
  steps?: string[]
  /** Label for the final-step submit button (default "Finish"). */
  submitLabel?: string
}
export function Footer({
  finished,
  setFinished,
  currentStep,
  setCurrentStep,
  validateFormAndNavigate,
  form,
  steps = defaultSteps,
  submitLabel = 'Finish',
}: FooterProps) {
  const goBack = () => setCurrentStep((current) => current - 1)

  return (
    <Vertical style={{ minHeight: '75px' }} verticalCenter className={'bg-1 border-radius-10 bordered'}>
      <Horizontal verticalCenter className={'p-4'} justifyContent='space-between'>
        <GraviButton
          disabled={currentStep === 0 || finished}
          className={'border-radius-5'}
          onClick={() => goBack()}
          appearance='outline'
          buttonText={
            <Horizontal gap={10} verticalCenter>
              <ArrowLeftOutlined />
              <Texto style={{ color: 'inherit' }}>Previous</Texto>
            </Horizontal>
          }
        />
        <div className='gap-10' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Texto>
            Step {currentStep + 1} of {steps.length}
          </Texto>
          <GraviButton
            loading={finished}
            theme1
            className={'border-radius-5'}
            buttonText={
              currentStep === steps.length - 1 ? (
                submitLabel
              ) : (
                <Horizontal gap={5} verticalCenter>
                  <Texto style={{ color: 'inherit' }}>Next</Texto>
                  <ArrowRightOutlined />
                </Horizontal>
              )
            }
            onClick={() => {
              if (currentStep === steps.length - 1) {
                setFinished(true)
                form.submit()
              } else validateFormAndNavigate()
            }}
          />
        </div>
      </Horizontal>
    </Vertical>
  )
}
