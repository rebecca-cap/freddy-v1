/* eslint-disable camelcase */
import { CloseCircleOutlined } from '@ant-design/icons'
import { GraviButton } from '@components/Controls/Buttons/GraviButton'
import { Form } from 'antd'
import { useEffect } from 'react'
import ReactGA from 'react-ga'
import { useLocation } from 'react-router-dom'
import { DynamicFormField } from './components/DynamicFormField'
import type { BaseFieldProps, Filter } from './types'

export type DynamicFilterFormProps<F extends Filter> = {
  params: BaseFieldProps<F>[]
  submitFunction: (values: F) => void
  submitLabel?: string
  name?: string
  layout?: 'inline' | 'vertical'
  filters: F
  setFilters?: (filters: F) => void
}

export function DynamicFilterForm<F extends Filter>({
  params,
  submitFunction,
  submitLabel = 'Apply Filters',
  name = 'default_form',
  layout = 'inline',
  filters,
  setFilters,
}: DynamicFilterFormProps<F>) {
  const location = useLocation()
  const onFilterSet = (values: F) => {
    const splitPath = location.pathname.split('/')
    ReactGA?.event({
      category: splitPath[1] || 'default',
      action: `SS FILTER: ${JSON.stringify(values)}`,
      label: 'Server Side Filter',
    })
    submitFunction(values)
  }
  const [form] = Form.useForm()
  const numbeRegex = /^-?\d*$/

  useEffect(() => {
    form.setFieldsValue({ ...filters })
  }, [filters])

  const onValuesChange = (formData: F) => {
    Object.keys(formData).forEach((k) => {
      if (
        (k.includes('_min') || k.includes('_max')) &&
        formData[k] !== '' &&
        !numbeRegex.test(formData[k])
      ) {
        form.resetFields([k])
      }
    })
  }

  return (
    <Form
      className='search-grid-form'
      layout={layout}
      name={name}
      onFinish={onFilterSet}
      form={form}
      onValuesChange={onValuesChange}
    >
      {params &&
        Array.isArray(params) &&
        params.map((param) => (
          <DynamicFormField
            key={param.title}
            param={param}
            form={form}
            filters={filters}
            setFilters={setFilters}
          />
        ))}
      <div className='vertical-flex-center'>
        <Form.Item>
          <GraviButton
            className='mt-3'
            theme1
            buttonText={submitLabel}
            htmlType='submit'
          />
          <GraviButton
            className='ml-3'
            buttonText='Clear'
            icon={<CloseCircleOutlined />}
            onClick={() => {
              form.resetFields()
              form.submit()
            }}
          />
        </Form.Item>
      </div>
    </Form>
  )
}
