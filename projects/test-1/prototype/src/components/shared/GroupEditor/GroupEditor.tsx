import { CheckOutlined, CloseOutlined, DeleteFilled, EditFilled } from '@ant-design/icons'
import { ErrorNotification, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Col, Divider, Form, Input, Popconfirm, Row, Space } from 'antd'
import React from 'react'

export function GroupEditor({
  index,
  group,
  editingGroupId,
  setEditingGroupId,
  handleEdit,
  setSaveDisabled,
  saveDisabled,
  handleDelete,
  groupingTitle,
  groupCount = null,
  canWrite,
}) {
  return (
    <Form
      wrapperCol={{ span: 12 }}
      key={index}
      onFinish={(values) => handleEdit(values, group)}
      onFinishFailed={<ErrorNotification />}
    >
      <Row className='supply-zone-row mb-2 pb-2 pr-3 pl-3'>
        <Row />
        <Col flex={3}>
          {editingGroupId === group.Value ? (
            <Form.Item name='GroupName'>
              <Input defaultValue={group.Text} onChange={() => setSaveDisabled(false)} style={{ minWidth: '180%' }} />
            </Form.Item>
          ) : (
            <Vertical verticalCenter>
              <Texto style={{ maxWidth: 300 }} category='h6'>
                {group.Text}
              </Texto>
              {groupingTitle && (
                <Texto category='p2'>
                  {groupingTitle} <span style={{ fontWeight: 600 }}>({groupCount})</span>
                </Texto>
              )}
            </Vertical>
          )}
        </Col>
        <Space>
          <Col>
            {editingGroupId === group.Value ? (
              <Space>
                <Form.Item>
                  <GraviButton
                    icon={<CloseOutlined style={{ color: 'var(--gray-500)' }} />}
                    onClick={() => {
                      setSaveDisabled(true)
                      setEditingGroupId(undefined)
                    }}
                  />
                </Form.Item>
                <Form.Item>
                  <GraviButton
                    style={{ borderRadius: 0 }}
                    success
                    htmlType='submit'
                    icon={<CheckOutlined />}
                    disabled={saveDisabled}
                  />
                </Form.Item>
              </Space>
            ) : (
              <Horizontal style={{ gap: 10 }}>
                {!!handleEdit && canWrite && (
                  <GraviButton icon={<EditFilled onClick={() => setEditingGroupId(group.Value)} />} />
                )}
                {handleDelete && !groupCount && canWrite && (
                  <GraviButton
                    icon={
                      <DeleteFilled style={{ color: 'var(--theme-error)' }} onClick={() => handleDelete(group.Value)} />
                    }
                  />
                )}
                {handleDelete && !!groupCount && groupCount > 0 && canWrite && (
                  <Popconfirm
                    title={`This group has ${groupCount} associations. Are you sure you want to delete this group?`}
                    okText='Delete'
                    cancelText='Cancel'
                    onConfirm={() => {
                      handleDelete(group.Value)
                    }}
                  >
                    <GraviButton icon={<DeleteFilled style={{ color: 'var(--theme-error)' }} />} />
                  </Popconfirm>
                )}
              </Horizontal>
            )}
          </Col>
        </Space>
      </Row>
      <Row />
      <Divider orientation='bottom' className='m-1 mt-2 p-1' />
    </Form>
  )
}
