import { CheckOutlined, CloseOutlined, EditFilled, PlusOutlined } from '@ant-design/icons'
import { ErrorNotification, GraviButton, NothingMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Button, Col, Divider, Form, Input, message, Row, Space } from 'antd'
import React, { useState } from 'react'

import { useCodeSets } from '@api/useCodeSet'
import type { CodeSetData } from '@api/useCodeSet/responseTypes'

interface IProps {
  priceTypes: CodeSetData
  closeDrawer: () => void
}

export const ManagePriceTypesDrawer: React.FC<IProps> = ({ priceTypes, closeDrawer }) => {
  const [creating, setCreating] = useState(false)
  const [editingPriceTypeId, setEditingPriceTypeId] = useState<number>()
  const [saveDisabled, setSaveDisabled] = useState(true)

  const { useCodeSetMutation } = useCodeSets()

  // After a successful mutation, invalidate any code set queries for 'PriceType'
  // which should update the priceTypes array fed to this component.
  const mutation = useCodeSetMutation(['PriceType'])

  const handleEdit = (values, id) => {
    if (priceTypes.CodeValues.some((cv) => cv.Display === values?.Display)) {
      message.error('A price type with that name already exists', 3)
    } else {
      const cv = priceTypes?.CodeValues.find((cv) => cv.CodeValueId === id)
      if (cv) {
        mutation.mutate({ ...cv, ...values, CodeSetId: priceTypes.CodeSetId })
      }
    }
    setEditingPriceTypeId(null)
    setSaveDisabled(true)
  }

  const handleSave = (values) => {
    const name = values?.DisplayName

    if (!name) {
      message.error('Price Type Name is required')
      return
    }

    mutation.mutate({
      CodeSetId: priceTypes.CodeSetId,
      Meaning: name,
      Description: name,
      Display: name,
      IsActive: true,
      ...values,
    })

    setCreating(false)
  }

  return (
    <Vertical>
      <Texto appearance='medium' category='heading-small' className='pb-4 pr-5 pl-5'>
        Price Types
      </Texto>
      <Vertical flex={1} scroll>
        {priceTypes?.CodeValues?.length
          ? priceTypes?.CodeValues.map((pt, index) => {
              return (
                <PriceTypeEditor
                  key={index}
                  index={index}
                  priceType={pt}
                  editingPriceTypeId={editingPriceTypeId}
                  setEditingPriceTypeId={setEditingPriceTypeId}
                  handleEdit={handleEdit}
                  setSaveDisabled={setSaveDisabled}
                  saveDisabled={saveDisabled}
                />
              )
            })
          : !creating && <NothingMessage title='No Price Types Found' className='supply-zone-nothing' />}
      </Vertical>
      {creating ? (
        <NewPriceTypeForm
          handleSave={handleSave}
          setSaveDisabled={setSaveDisabled}
          setCreating={setCreating}
          saveDisabled={saveDisabled}
        />
      ) : (
        <Row justify='center'>
          <Col>
            <Button type='link' icon={<PlusOutlined />} onClick={() => setCreating(true)}>
              ADD PRICE TYPE
            </Button>
          </Col>
        </Row>
      )}
    </Vertical>
  )
}

function PriceTypeEditor({
  index,
  priceType,
  editingPriceTypeId,
  setEditingPriceTypeId,
  handleEdit,
  setSaveDisabled,
  saveDisabled,
}) {
  return (
    <Form
      wrapperCol={{ span: 12 }}
      key={index}
      onFinish={(values) => handleEdit(values, priceType.CodeValueId)}
      onFinishFailed={<ErrorNotification />}
    >
      <Row className='supply-zone-row mb-2 pb-2 pr-5 pl-5'>
        <Col flex={3}>
          {editingPriceTypeId === priceType.CodeValueId ? (
            <Form.Item name='Display'>
              <Input defaultValue={priceType.Display} onChange={() => setSaveDisabled(false)} />
            </Form.Item>
          ) : (
            <Texto category='h6'>{priceType.Display}</Texto>
          )}
        </Col>
        <Space>
          <Col>
            {editingPriceTypeId === priceType.CodeValueId ? (
              <Space>
                <Form.Item>
                  <GraviButton
                    icon={<CloseOutlined style={{ color: 'var(--gray-500)' }} />}
                    onClick={() => {
                      setSaveDisabled(true)
                      setEditingPriceTypeId(undefined)
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
              <GraviButton icon={<EditFilled onClick={() => setEditingPriceTypeId(priceType.CodeValueId)} />} />
            )}
          </Col>
        </Space>
        <Divider orientation='bottom' className='m-1 mt-2 p-1' />
      </Row>
    </Form>
  )
}

function NewPriceTypeForm({ handleSave, setSaveDisabled, setCreating, saveDisabled }) {
  return (
    <Form
      name='supply-zone'
      wrapperCol={{ span: 12 }}
      initialValues={{ remember: true }}
      onFinish={handleSave}
      onFinishFailed={ErrorNotification}
      autoComplete='off'
    >
      <Row className='supply-zone-form-row' align='middle'>
        <Col flex={3} className='pl-5 pt-2'>
          <Form.Item name='DisplayName' className='mb-1'>
            <Input placeholder='Enter Price Type Name' onChange={() => setSaveDisabled(false)} />
          </Form.Item>
          <Texto appearance='secondary' className='mt-2'>
            Price Type Name
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
