import { PlusOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { UserDefinedPageView } from '@modules/CommandCenter/api/types.schema'
import { Form, Input } from 'antd'
import { Rule } from 'antd/lib/form'
import { useEffect, useMemo, useState } from 'react'

interface PageViewSettingsCreateEditFormProps {
  isEditing: boolean
  newViewName: string
  setNewViewName: (value: string) => void
  handleSave: () => void
  handleCancel: () => void
  handleCreateNew: () => void
  editingId: number | null
  pageViews: UserDefinedPageView[]
  isFooter?: boolean
  isSaving: boolean
  view?: UserDefinedPageView
  isLoading: boolean
}

export function PageViewSettingsCreateEditForm({
  isEditing,
  newViewName,
  setNewViewName,
  handleSave,
  handleCancel,
  handleCreateNew,
  editingId,
  isFooter,
  pageViews,
  isSaving,
  view,
  isLoading,
}: PageViewSettingsCreateEditFormProps) {
  const [form] = Form.useForm()
  const isFormOpen = useMemo(() => {
    const isOpenForFooter = isEditing && editingId === null && isFooter
    const isOpenForListItem = isEditing && editingId !== null && !isFooter
    return isOpenForFooter || isOpenForListItem
  }, [isEditing, editingId, isFooter])

  function nameValidator(_: Rule, value: string) {
    const existing = pageViews?.some((v) => v.display === value && v.userPreferenceId !== view?.userPreferenceId)
    if (existing) {
      return Promise.reject('Name must be unique')
    }
    return Promise.resolve()
  }
  useEffect(() => {
    if (view) {
      form.setFieldsValue({ name: view.display })
    }
  }, [view])
  return (
    <>
      {isFormOpen ? (
        <Vertical className='p-4' style={{ width: '100%' }}>
          <Form form={form} onFinish={handleSave} layout='vertical'>
            <Form.Item name='name' rules={[{ required: true }, { validator: nameValidator }]}>
              <Input
                placeholder='Enter view name'
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                onPressEnter={() => form.submit()}
                autoFocus
                style={{ width: '100%' }}
                maxLength={250}
                showCount
                disabled={isSaving}
              />
            </Form.Item>
            <Horizontal className='my-2' verticalCenter justifyContent='flex-end'>
              <GraviButton
                buttonText='Cancel'
                onClick={() => {
                  form.resetFields()
                  handleCancel()
                }}
                className='mr-2'
                disabled={isSaving}
              />
              <GraviButton success buttonText='Save' onClick={() => form.submit()} loading={isSaving} />
            </Horizontal>
          </Form>
        </Vertical>
      ) : (
        <Vertical style={{ width: '100%' }} className='p-4'>
          <GraviButton
            buttonText='Create New View'
            icon={<PlusOutlined />}
            onClick={handleCreateNew}
            className='ghost-gravi-button'
            disabled={isSaving || isLoading}
          />
        </Vertical>
      )}
    </>
  )
}
