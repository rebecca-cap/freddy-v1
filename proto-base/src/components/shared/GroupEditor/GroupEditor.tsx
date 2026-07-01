import { CheckOutlined, CloseOutlined, DeleteFilled, EditFilled } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Col, Divider, Form, Input, Row, Space, Tooltip } from 'antd'
import React from 'react'

export type Group = {
  Value: string
  Text: string
}

export type GroupEditorProps = {
  index: number
  group: Group
  editingGroupId: string
  setEditingGroupId: (id: string) => void
  handleEdit?: ((values: { GroupName: string }, group: Group) => void | Promise<void>) | false
  /** @deprecated Editor derives submit-disabled state internally; this prop is ignored. */
  setSaveDisabled?: (disabled: boolean) => void
  /** @deprecated Editor derives submit-disabled state internally; this prop is ignored. */
  saveDisabled?: boolean
  handleDelete?: ((groupId: string) => void | Promise<void>) | false
  groupingTitle?: string
  groupCount?: number | null
  canWrite?: boolean
  deleteTooltip?: string
}

export function GroupEditor({
  index,
  group,
  editingGroupId,
  setEditingGroupId,
  handleEdit,
  handleDelete,
  groupingTitle,
  groupCount = null,
  canWrite,
  deleteTooltip,
}: GroupEditorProps) {
  const [form] = Form.useForm<{ GroupName: string }>()
  const isEditing = editingGroupId === group.Value
  const currentValue = Form.useWatch('GroupName', form) ?? group.Text
  const trimmedValue = currentValue.trim()
  const hasChanges = trimmedValue !== group.Text.trim()
  const submitDisabled = !hasChanges || trimmedValue.length === 0

  return (
    <Form
      form={form}
      wrapperCol={{ span: 12 }}
      key={index}
      onFinish={(values) => handleEdit && handleEdit(values, group)}
    >
      <Row className='supply-zone-row mb-2 pb-2 pr-3 pl-3'>
        <Row />
        <Col flex={3}>
          {isEditing ? (
            <Form.Item
              name='GroupName'
              initialValue={group.Text}
              rules={[
                { required: true, message: 'Group name is required' },
                { whitespace: true, message: 'Group name cannot be blank' },
              ]}
            >
              <Input autoFocus style={{ minWidth: '180%' }} />
            </Form.Item>
          ) : (
            <Vertical verticalCenter>
              <Texto style={{ maxWidth: 300, fontSize: '0.95rem', fontWeight: 600 }} category='h6'>
                {group.Text}
              </Texto>
              {groupingTitle && (
                <Texto category='p2' style={{ fontSize: '0.75rem', color: 'var(--text-color-tertiary, #9ca3af)' }}>
                  {groupingTitle} ({groupCount})
                </Texto>
              )}
            </Vertical>
          )}
        </Col>
        <Space>
          <Col>
            {isEditing ? (
              <Space>
                <Form.Item>
                  <GraviButton icon={<CloseOutlined />} onClick={() => setEditingGroupId('')} aria-label='Cancel' />
                </Form.Item>
                <Form.Item>
                  <GraviButton
                    color='success'
                    htmlType='submit'
                    icon={<CheckOutlined />}
                    disabled={submitDisabled}
                    aria-label='Save'
                  />
                </Form.Item>
              </Space>
            ) : (
              <Horizontal gap={10}>
                {!!handleEdit && canWrite && (
                  <GraviButton icon={<EditFilled />} onClick={() => setEditingGroupId(group.Value)} aria-label='Edit' />
                )}
                {handleDelete && !groupCount && canWrite && (
                  <GraviButton
                    color='danger'
                    icon={<DeleteFilled />}
                    onClick={() => handleDelete(group.Value)}
                    aria-label='Delete'
                  />
                )}
                {handleDelete && !!groupCount && groupCount > 0 && canWrite && (
                  <Tooltip title={deleteTooltip || 'Unable to delete. This group has associations.'} placement='left'>
                    <span style={{ display: 'inline-flex', cursor: 'not-allowed' }}>
                      <GraviButton
                        icon={<DeleteFilled />}
                        disabled
                        aria-label='Delete'
                        style={{ pointerEvents: 'none' }}
                      />
                    </span>
                  </Tooltip>
                )}
              </Horizontal>
            )}
          </Col>
        </Space>
      </Row>
      <Row />
      <Divider className='m-1 mt-2 p-1' />
    </Form>
  )
}
