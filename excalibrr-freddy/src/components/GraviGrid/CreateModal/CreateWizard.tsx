import {
  Col,
  DatePicker,
  Divider,
  Form,
  FormInstance,
  FormItemProps,
  Input,
  InputNumber,
  Row,
  Select,
  Steps,
  TimePicker,
} from 'antd'

import { titleCase } from '../../../Utils/general'
import { Texto } from '../../DataDisplay/Texto/Texto'

const { Step } = Steps
const { Option } = Select

type CreateWizardProps = {
  currentStep: number
  sections: any[]
  form: FormInstance
}

export const CreateWizard: React.FC<CreateWizardProps> = ({
  currentStep,
  sections,
  form,
}) => {
  if (sections.length <= 1)
    return <CreateForm inputs={sections[currentStep]} form={form} />
  return (
    <>
      <div style={{ width: '80%', margin: 'auto' }}>
        <Steps current={currentStep}>
          {sections.map((section, i) => (
            <Step key={i} title={section.step_title} />
          ))}
        </Steps>
      </div>
      <Divider className='mb-5 mt-5' />
      <CreateForm inputs={sections[currentStep]} form={form} />
    </>
  )
}

type Inputs = {
  form_title: string
  section: Array<{
    name: string
    fieldLabel: string
    input: string
    type: string
    placeholder: string
    maxLength: number
    rules: FormItemProps['rules']
    options: string[]
    initialValue: any
    max: number
    min: number
    precision: number
    displayAsPercentage: boolean
  }>
}

function CreateForm({ inputs, form }: { inputs: Inputs; form: FormInstance }) {
  return (
    <>
      <Texto category='h5' weight='bold' appearance='medium' className='mb-3'>
        {inputs.form_title}
      </Texto>
      <Form form={form} requiredMark>
        <Row>
          {inputs.section.map((item, index) => (
            <Col key={item.name} span={11}>
              <div className='ml-3'>
                <Texto appearance='medium' className='ml-5 mb-1'>
                  {titleCase(item.fieldLabel || item.name)}
                </Texto>
              </div>
              <Form.Item
                name={item.name}
                className='ml-5'
                rules={item.rules}
                hasFeedback={!!item.rules}
                initialValue={item.initialValue}
              >
                <InputField item={item} autoFocus={!index} />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </>
  )
}

type InputsFieldProps = {
  item: Inputs['section'][number]
  autoFocus: boolean
}

const InputField: React.FC<InputsFieldProps> = ({ item, ...others }) => {
  switch (item.input) {
    case 'input':
      return (
        <Input
          type={item.type}
          placeholder={item.placeholder}
          maxLength={item.maxLength}
          {...others}
        />
      )
    case 'select':
      return (
        <Select
          mode={item.type as 'multiple' | 'tags'}
          placeholder={item.placeholder}
          showSearch
          showArrow
          {...others}
        >
          {item.options.sort().map((option, i) => (
            <Option key={i} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      )
    case 'inputNumber':
      return (
        <InputNumber
          style={{ width: '100%' }}
          placeholder={item.placeholder}
          max={item.max}
          min={item.min}
          precision={item.precision}
          addonAfter={item.displayAsPercentage && '%'}
          {...others}
        />
      )
    case 'time':
      return (
        <TimePicker
          style={{ width: '100%' }}
          showNow={false}
          {...item}
          {...others}
        />
      )
    case 'date':
      return <DatePicker {...others} style={{ width: '100%' }} />
    default:
      return (
        <Input
          type={item.type}
          placeholder={item.placeholder}
          maxLength={item.maxLength}
          {...others}
        />
      )
  }
}
