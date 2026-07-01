import { Form, FormInstance, Modal } from 'antd'
import { MouseEvent, useState } from 'react'

import { GraviButton } from '../../Controls/Buttons/GraviButton'
import { Horizontal } from '../../Layout/Horizontal'
import { CreateWizard } from './CreateWizard'

type CreateModalProps<T extends Record<string, any>> = {
  viewCreateModal: boolean
  setViewCreateModal: (value: boolean) => void
  createSelectOptions: any
  sections: any[]
  onCreate: (newRow: T) => void
}

export const CreateModal = <T extends Record<string, any>>({
  viewCreateModal,
  setViewCreateModal,
  createSelectOptions,
  sections,
  onCreate,
}: CreateModalProps<T>) => {
  const [newRow, setNewRow] = useState<T>()
  const [currentStep, setCurrentStep] = useState(0)

  const [form] = Form.useForm()

  return (
    <Modal
      title='Create New Record'
      visible={viewCreateModal}
      destroyOnClose
      onCancel={() => {
        form.resetFields()
        setCurrentStep(0)
        setNewRow(undefined)
        setViewCreateModal(!viewCreateModal)
      }}
      width='50%'
      bodyStyle={{ minHeight: '400px' }}
      footer={
        <CreateFooter
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          sections={sections}
          form={form}
          newRow={newRow}
          setNewRow={setNewRow}
          onCreate={onCreate}
          setViewCreateModal={setViewCreateModal}
        />
      }
    >
      <CreateWizard
        // @ts-ignore - setNewRow isn't a prop on create wizard unused
        setNewRow={setNewRow}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        sections={sections}
        form={form}
        createSelectOptions={createSelectOptions}
      />
    </Modal>
  )
}

type CreateFooterProps<T extends Record<string, any>> = {
  currentStep: number
  setCurrentStep: (value: number) => void
  sections: any[]
  form: FormInstance
  newRow?: T
  setNewRow: React.Dispatch<React.SetStateAction<T | undefined>>
  onCreate: (newRow: T) => void
  setViewCreateModal: (value: boolean) => void
}

const CreateFooter = <T extends Record<string, any>>({
  currentStep,
  setCurrentStep,
  sections,
  form,
  newRow,
  setNewRow,
  onCreate,
  setViewCreateModal,
}: CreateFooterProps<T>) => {
  const goNextStep = (newValues: T) => {
    setNewRow((prevState) => {
      return { ...prevState, ...newValues }
    })
    setCurrentStep(currentStep + 1)
  }

  const goPrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const onCheck = async (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    isSave = false
  ) => {
    try {
      const values = await form.validateFields()
      if (!isSave) {
        goNextStep(values)
      } else {
        const newRowValues = { ...newRow, ...values }
        setNewRow(newRowValues)
        saveRow(newRowValues)
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const saveRow = (newRowValues: T) => {
    onCreate(newRowValues)
    setNewRow(undefined)
    setCurrentStep(0)
    form.resetFields()
    setViewCreateModal(false)
  }
  return (
    <Horizontal justifyContent='flex-end' verticalCenter>
      {currentStep > 0 && (
        <GraviButton
          appearance=''
          theme2
          onClick={goPrevStep}
          buttonText='Previous'
        />
      )}
      {currentStep < sections.length - 1 && (
        <Form.Item className='mb-0 pb-0 ml-3'>
          <GraviButton theme1 onClick={onCheck} buttonText='Next' />
        </Form.Item>
      )}
      {currentStep === sections.length - 1 && (
        <GraviButton
          success
          onClick={(e) => onCheck(e, true)}
          buttonText='Save'
        />
      )}
    </Horizontal>
  )
}
