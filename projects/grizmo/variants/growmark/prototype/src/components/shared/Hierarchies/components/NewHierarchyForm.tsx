import { EditForm } from '@components/shared/Hierarchies/components/EditForm'
import { EditingButtons } from '@components/shared/Hierarchies/components/EditingButtons'
import { ErrorNotification, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Form } from 'antd'
import { Dispatch, SetStateAction } from 'react'

interface NewHierarchyFormProps {
  onCancel: () => void
  onSave: (data: { Name: string; HierarchyKey?: number }) => void
  setSaveDisabled: Dispatch<SetStateAction<boolean>>
  saveDisabled: boolean
  saveLoading?: boolean
}

export function NewHierarchyForm({
  onCancel,
  onSave,
  setSaveDisabled,
  saveDisabled,
  saveLoading,
}: NewHierarchyFormProps) {
  const [form] = Form.useForm()

  const handleEditCancel = () => {
    setSaveDisabled(true)
    onCancel()
    form.resetFields()
  }
  return (
    <Form
      form={form}
      layout='inline'
      name='hierarchy'
      initialValues={{ Name: '' }}
      onFinish={(values) => {
        onSave(values)
        form.resetFields()
      }}
      onFinishFailed={ErrorNotification}
    >
      <Horizontal
        style={{ maxHeight: 'fit-content', minHeight: 'fit-content' }}
        className={'px-5 mb-3 py-4 full-height-width'}
        justifyContent={'space-between'}
      >
        <Vertical flex={3}>
          <EditForm itemName='' setSaveDisabled={setSaveDisabled} form={form} />
        </Vertical>
        <Horizontal flex={1} justifyContent='end'>
          <EditingButtons onCancel={handleEditCancel} saveDisabled={saveDisabled} saveLoading={saveLoading} />
        </Horizontal>
      </Horizontal>
    </Form>
  )
}
