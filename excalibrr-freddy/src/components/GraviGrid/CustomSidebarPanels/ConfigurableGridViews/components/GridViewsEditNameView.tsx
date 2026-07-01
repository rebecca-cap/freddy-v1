import {
  GridView,
  ViewPayload,
} from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/schema.types'
import { getCurrentGridState } from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/ConfigurableGridViewsEvents'
import { AgGridReact } from 'ag-grid-react'
import { Form, Input } from 'antd'
import type { Rule } from 'antd/lib/form'
import React, { useEffect } from 'react'

import { GraviButton, Horizontal, Vertical } from '@/components'

export interface GridViewsEditNameViewProps {
  width: number
  view: ViewPayload
  saveView: (view: ViewPayload, onClose?: () => void) => void
  setShowForm: React.Dispatch<React.SetStateAction<string | number | null>>
  gridRef: React.MutableRefObject<AgGridReact | null>
  gridViews: GridView[] | null
  isFooter?: boolean
  isLoading: boolean
}
export function GridViewsEditNameView({
  width,
  view,
  saveView,
  setShowForm,
  gridRef,
  gridViews,
  isFooter,
  isLoading,
}: GridViewsEditNameViewProps) {
  const [form] = Form.useForm()
  function clearStateAndCloseForm() {
    setShowForm(null)
  }
  function saveNewViewName(values: { name: string }) {
    saveView(
      {
        ...view,
        name: values.name,
        state: view.state || getCurrentGridState(gridRef),
      },
      clearStateAndCloseForm
    )
  }
  function nameValidator(_: Rule, value: string) {
    const existing = gridViews?.some(
      (v) => v.name === value && v.id !== view.id
    )
    if (existing) {
      return Promise.reject('Name must be unique')
    }
    return Promise.resolve()
  }

  useEffect(() => {
    form.setFieldsValue({ name: view.name })
  }, [view])

  return (
    <Form form={form} onFinish={saveNewViewName}>
      <Vertical
        verticalCenter
        className={`px-3 py-3 border-bottom ${isFooter && 'mb-4 border-top'}`}
        style={{ width }}
      >
        <Form.Item
          name='name'
          rules={[{ required: true }, { validator: nameValidator }]}
        >
          <Input
            disabled={isLoading}
            width='100%'
            placeholder='Enter Unique Name'
            maxLength={250}
            showCount
          />
        </Form.Item>
        <Horizontal
          justifyContent='flex-end'
          verticalCenter
          className='px-3 py-3'
        >
          <GraviButton
            buttonText='Cancel'
            onClick={clearStateAndCloseForm}
            disabled={isLoading}
          />

          <GraviButton
            buttonText='Save'
            loading={isLoading}
            onClick={form.submit}
            success
            className='ml-4'
          />
        </Horizontal>
      </Vertical>
    </Form>
  )
}
