import { CheckOutlined, CloseOutlined, EditFilled, PlusOutlined } from '@ant-design/icons'
import { ErrorNotification, GraviButton, Horizontal, NothingMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useQuoteRows } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/useQuoteRows'
import { Button, Col, Divider, Form, Input, message, Row, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import _ from 'lodash'
import React, { useState } from 'react'

interface IProps {
  groups: string[]
  closeDrawer: () => void
}

export const QuoteRowGroupsDrawer: React.FC<IProps> = ({ groups }) => {
  const [drawerMode, setDrawerMode] = useState<'editing' | 'creating' | 'viewing'>('viewing')
  const [editingId, setEditingId] = useState(null)
  const [saveDisabled, setSaveDisabled] = useState(true)
  const { upsertGroup } = useQuoteRows()

  const handleSave = async (formValues) => {
    const { GroupName, QuoteConfigurationMappingGroupId } = formValues

    if (!GroupName) {
      message.error('Group Name is required')
      return
    }

    const payload = {
      QuoteConfigurationMappingGroupId: QuoteConfigurationMappingGroupId || Math.floor(Math.random() * 9999999),
      GroupName,
      GroupDescription: GroupName,
    }

    try {
      await upsertGroup.mutateAsync(payload)

      setDrawerMode('viewing')
      message.success('Group saved')
    } catch (error) {
      console.error(error)
      message.error('Failed to save group')
    }
  }

  return (
    <Vertical>
      <Vertical flex={1} scroll>
        {groups.length === 0 ? (
          <EmptyListOfGroups />
        ) : (
          groups.map((group) => {
            return (
              <GroupEditor
                group={group}
                onSave={handleSave}
                drawerMode={drawerMode}
                setDrawerMode={setDrawerMode}
                editingId={editingId}
                setEditingId={setEditingId}
              />
            )
          })
        )}
      </Vertical>
      {drawerMode === 'creating' ? (
        <NewGroupForm
          handleSave={handleSave}
          setSaveDisabled={setSaveDisabled}
          setDrawerMode={setDrawerMode}
          saveDisabled={saveDisabled}
        />
      ) : (
        <Row justify='center'>
          <Col>
            <Button type='link' icon={<PlusOutlined />} onClick={() => setDrawerMode('creating')}>
              ADD GROUP
            </Button>
          </Col>
        </Row>
      )}
    </Vertical>
  )
}

function EmptyListOfGroups() {
  return <NothingMessage message='' title='No Quote Row Groups Found' className='supply-zone-nothing' />
}

function GroupEditor({ group, onSave, drawerMode, setDrawerMode, editingId, setEditingId }) {
  function handleFinish(values) {
    const newGroup = { ...group, ...values }
    if (!_.isEqual(group, newGroup)) onSave(newGroup)
  }

  return (
    <Row className='supply-zone-row mb-2 pb-2 pr-5 pl-5'>
      {drawerMode === 'editing' && editingId === group.QuoteConfigurationMappingGroupId ? (
        <EditingGroupRow
          formKey={group.QuoteConfigurationMappingGroupId}
          name={group.GroupName}
          onFinish={handleFinish}
          onCancel={() => setDrawerMode('viewing')}
        />
      ) : (
        <StaticGroupRow
          name={group.GroupName}
          onEdit={() => {
            setEditingId(group.QuoteConfigurationMappingGroupId)
            setDrawerMode('editing')
          }}
        />
      )}
      <Divider className='m-1 mt-2 p-1' />
    </Row>
  )
}
function EditingGroupRow({ formKey, name, onCancel, onFinish }) {
  const [form] = useForm()

  return (
    <Form key={formKey} onFinish={onFinish} className='flex-1' form={form} validateTrigger=''>
      <Horizontal style={{ gap: '0.25rem' }}>
        <Form.Item name='GroupName' rules={[{ required: true, message: 'Group Name cannot be empty' }]}>
          <Input placeholder='Group Name' defaultValue={name} size='large' />
        </Form.Item>
        <Form.Item>
          <GraviButton size='large' icon={<CloseOutlined style={{ color: 'var(--gray-500)' }} />} onClick={onCancel} />
        </Form.Item>
        <Form.Item>
          <GraviButton size='large' style={{ borderRadius: 0 }} success htmlType='submit' icon={<CheckOutlined />} />
        </Form.Item>
      </Horizontal>
      <Horizontal className='mt-2'>{/* <Form.ErrorList errors={errors} /> */}</Horizontal>
    </Form>
  )
}

function StaticGroupRow({ name, onEdit }) {
  return (
    <>
      <Col flex={3}>
        <Texto category='h6'>{name}</Texto>
      </Col>
      <Space>
        <Col>
          <GraviButton icon={<EditFilled onClick={onEdit} />} />
        </Col>
      </Space>
    </>
  )
}

function NewGroupForm({ handleSave, setSaveDisabled, setDrawerMode, saveDisabled }) {
  const [form] = useForm()

  return (
    <Form
      name='new-group-name'
      wrapperCol={{ span: 12 }}
      initialValues={{ remember: true }}
      onFinish={handleSave}
      onFinishFailed={ErrorNotification}
      autoComplete='off'
      form={form}
    >
      <Horizontal style={{ gap: '0.25rem' }}>
        <Form.Item name='GroupName' className='mb-1' noStyle>
          <Input placeholder='Enter Group Name' onChange={() => setSaveDisabled(false)} style={{ width: '100%' }} />
        </Form.Item>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <GraviButton
            onClick={() => {
              setSaveDisabled(true)
              setDrawerMode('viewing')
            }}
            icon={<CloseOutlined />}
          />
          <GraviButton success disabled={saveDisabled} icon={<CheckOutlined />} htmlType='submit' />
        </div>
      </Horizontal>
    </Form>
  )
}
