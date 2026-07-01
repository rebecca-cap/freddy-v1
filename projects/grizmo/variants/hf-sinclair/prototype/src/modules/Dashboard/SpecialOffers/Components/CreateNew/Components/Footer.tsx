import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { steps } from '@modules/Dashboard/SpecialOffers/utils/Constants/FormConstants'
import { FormInstance } from 'antd/lib/form/Form'
interface FooterProps {
  finished: boolean
  setFinished: React.Dispatch<React.SetStateAction<boolean>>
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  validateFormAndNavigate: () => void
  form: FormInstance
}
export function Footer({
  finished,
  setFinished,
  currentStep,
  setCurrentStep,
  validateFormAndNavigate,
  form,
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
            <Horizontal verticalCenter className='gap-10'>
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
                'Finish'
              ) : (
                <Horizontal verticalCenter className='gap-5'>
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
