import { LockFilled } from '@ant-design/icons'
import { DisplayText } from '@components/shared/Hierarchies/components/DisplayText'
import { EditButton } from '@components/shared/Hierarchies/components/EditButton'
import { EditForm } from '@components/shared/Hierarchies/components/EditForm'
import { EditingButtons } from '@components/shared/Hierarchies/components/EditingButtons'
import { HierarchyListItem } from '@components/shared/Hierarchies/types'
import { ErrorNotification, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Form } from 'antd'
import React, { useMemo } from 'react'

interface HierarchyEditorProps {
  index: number
  hierarchyItem: HierarchyListItem
  editingId: number | null | string
  setEditingId: React.Dispatch<React.SetStateAction<number | null | string>>
  onChange: (data: { Name: string; HierarchyKey: number }) => void
  setSaveDisabled: React.Dispatch<React.SetStateAction<boolean>>
  saveDisabled: boolean
}

export function HierarchyEditor({
  index,
  hierarchyItem,
  editingId,
  setEditingId,
  onChange,
  setSaveDisabled,
  saveDisabled,
}: HierarchyEditorProps) {
  const [form] = Form.useForm()
  const isEditing = useMemo(() => editingId === hierarchyItem.Key, [editingId, hierarchyItem.Key])

  function handleEditCancel() {
    setSaveDisabled(true)
    setEditingId(null)
    form.resetFields()
  }

  return (
    <Form
      form={form}
      layout='inline'
      initialValues={{ Name: hierarchyItem.Name }}
      onFinish={(values) => {
        onChange({ ...values, HierarchyKey: hierarchyItem.Key })
        form.resetFields()
      }}
      onFinishFailed={ErrorNotification}
    >
      <Horizontal
        key={index}
        style={{ maxHeight: 'fit-content', minHeight: 'fit-content', justifyContent: 'space-between' }}
        className={'full-height-width'}
        justifyContent={'space-between'}
      >
        <Vertical flex={3} verticalCenter>
          {isEditing ? (
            <EditForm itemName={hierarchyItem.Name} setSaveDisabled={setSaveDisabled} form={form} />
          ) : (
            <DisplayText hierarchyItem={hierarchyItem} />
          )}
        </Vertical>

        <Horizontal flex={1} justifyContent='end' className={'full-height-width m-0 p-0'}>
          {hierarchyItem.Name !== 'Primary' ? (
            <>
              {isEditing ? (
                <EditingButtons onCancel={handleEditCancel} saveDisabled={saveDisabled} />
              ) : (
                <EditButton onClick={() => setEditingId(hierarchyItem.Key)} />
              )}
            </>
          ) : (
            <GraviButton icon={<LockFilled />} disabled />
          )}
        </Horizontal>
      </Horizontal>
    </Form>
  )
}
