import { CheckOutlined, CloseOutlined, EditFilled, PlusOutlined } from '@ant-design/icons'
import { ErrorNotification, GraviButton, NothingMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Button, Col, Divider, Form, Input, message, Row, Space } from 'antd'
import React, { useState } from 'react'

export function ManagePeriodGroupsDrawer({ periodGroups, MarketPlatformInstrumentId, updateEP }) {
  const [creating, setCreating] = useState(false)
  const [editingGroupTypeId, setEditingGroupTypeId] = useState('')
  const [saveDisabled, setSaveDisabled] = useState(true)

  const handleEdit = async (values, periodGroup) => {
    const DeliveryPeriodGroupName = values?.DeliveryPeriodGroupName
    const DeliveryPeriodGroupId = periodGroup?.Value

    if (periodGroups.some((group) => group.Text === DeliveryPeriodGroupName)) {
      message.error('A delivery period group with that name already exists', 5)
      return
    }

    const updatedPeriodGroup = {
      MarketPlatformInstrumentId,
      DeliveryPeriodGroupName,
      DeliveryPeriodGroupId,
    }
    const response = await updateEP.mutateAsync(updatedPeriodGroup)
    if (!response?.Validations.length) {
      setEditingGroupTypeId('')
      setSaveDisabled(true)
    } else {
      message.error(response?.Validations[0]?.Message, 5)
    }
  }

  const handleSave = async (values) => {
    const DeliveryPeriodGroupName = values?.DeliveryPeriodGroupName

    if (!DeliveryPeriodGroupName) {
      message.error(' Period Group Name is required')
      return
    }
    if (periodGroups.some((group) => group.Text === DeliveryPeriodGroupName)) {
      message.error('A delivery period group with that name already exists', 5)
      return
    }

    const newPeriodGroup = {
      MarketPlatformInstrumentId,
      DeliveryPeriodGroupName,
    }

    const response = await updateEP.mutateAsync(newPeriodGroup)
    if (!response?.Validations.length) {
      setCreating(false)
    } else {
      message.error(response?.Validations[0]?.Message, 5)
    }
  }

  return (
    <Vertical>
      <Texto appearance='medium' category='heading-small' className='pb-4 pr-5 pl-5'>
        Delivery Period Groups
      </Texto>
      <Vertical flex={1} scroll>
        {periodGroups?.length
          ? periodGroups?.map((group, index) => {
              return (
                <GroupTypeEditor
                  key={index}
                  index={index}
                  periodGroup={group}
                  editingGroupTypeId={editingGroupTypeId}
                  setEditingGroupTypeId={setEditingGroupTypeId}
                  handleEdit={handleEdit}
                  setSaveDisabled={setSaveDisabled}
                  saveDisabled={saveDisabled}
                />
              )
            })
          : !creating && <NothingMessage title='No  Period Groups Found' className='supply-zone-nothing' />}
      </Vertical>
      {creating ? (
        <NewGroupTypeForm
          handleSave={handleSave}
          setSaveDisabled={setSaveDisabled}
          setCreating={setCreating}
          saveDisabled={saveDisabled}
        />
      ) : (
        <Row justify='center'>
          <Col>
            <Button type='link' icon={<PlusOutlined />} onClick={() => setCreating(true)}>
              ADD PERIOD GROUP
            </Button>
          </Col>
        </Row>
      )}
    </Vertical>
  )
}

function GroupTypeEditor({
  index,
  periodGroup,
  editingGroupTypeId,
  setEditingGroupTypeId,
  handleEdit,
  setSaveDisabled,
  saveDisabled,
}) {
  return (
    <Form
      wrapperCol={{ span: 12 }}
      key={index}
      onFinish={(values) => handleEdit(values, periodGroup)}
      onFinishFailed={<ErrorNotification />}
    >
      <Row className='supply-zone-row mb-2 pb-2 pr-5 pl-5'>
        <Col flex={3}>
          {editingGroupTypeId === periodGroup.Value ? (
            <Form.Item name='DeliveryPeriodGroupName'>
              <Input defaultValue={periodGroup.Text} onChange={() => setSaveDisabled(false)} />
            </Form.Item>
          ) : (
            <Texto category='h6'>{periodGroup.Text}</Texto>
          )}
        </Col>
        <Space>
          <Col>
            {editingGroupTypeId === periodGroup.Value ? (
              <Space>
                <Form.Item>
                  <GraviButton
                    icon={<CloseOutlined style={{ color: 'var(--gray-500)' }} />}
                    onClick={() => {
                      setSaveDisabled(true)
                      setEditingGroupTypeId(undefined)
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
              <GraviButton icon={<EditFilled onClick={() => setEditingGroupTypeId(periodGroup.Value)} />} />
            )}
          </Col>
        </Space>
        <Divider orientation='bottom' className='m-1 mt-2 p-1' />
      </Row>
    </Form>
  )
}

function NewGroupTypeForm({ handleSave, setSaveDisabled, setCreating, saveDisabled }) {
  return (
    <Form
      name='NewGroupType'
      wrapperCol={{ span: 12 }}
      initialValues={{ remember: true }}
      onFinish={handleSave}
      onFinishFailed={ErrorNotification}
      autoComplete='off'
    >
      <Row className='supply-zone-form-row bg-3 p-4' align='middle'>
        <Col flex={3}>
          <Form.Item name='DeliveryPeriodGroupName' className='mb-1'>
            <Input placeholder='Enter  Period Group Name' onChange={() => setSaveDisabled(false)} />
          </Form.Item>
          <Texto appearance='secondary' className='mt-2'>
            Period Group Name
          </Texto>
        </Col>

        <Col style={{ display: 'flex', gap: '8px' }}>
          <GraviButton
            onClick={() => {
              setSaveDisabled(true)
              setCreating(false)
            }}
            icon={<CloseOutlined />}
          />

          <GraviButton htmlType='submit' success disabled={saveDisabled} icon={<CheckOutlined />} />
        </Col>
      </Row>
    </Form>
  )
}
