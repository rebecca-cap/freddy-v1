import { FolderAddOutlined } from '@ant-design/icons'
import { useMarketPlatformFormulas } from '@api/useMarketPlatformFormulas'
import { IFormulaMetadataResponse } from '@api/usePriceEngineFormulas/types'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Button, Form, Input, message, Popover, Select, Tooltip } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useEffect, useMemo } from 'react'

interface IProps {
  visible: boolean
  onVisibleChange: (visible: boolean) => void
  setActiveEditMarkerKey: React.Dispatch<React.SetStateAction<string | null>>
  onSubmit: () => void
  productOptions: IFormulaMetadataResponse['ProductHierarchies']
  locationOptions: IFormulaMetadataResponse['LocationHierarchies']
  counterPartyHierarchyOptions?: IFormulaMetadataResponse['CounterPartyHierarchies']
  setNewMarkerFormVisible: React.Dispatch<React.SetStateAction<boolean>>
  mode: 'create' | 'edit'
  activeMarker?: IFormulaMetadataResponse['Markers']
  canInsertNewMarker?: boolean
}

export const NewMarkerPopover: React.FC<IProps> = ({
  visible,
  onVisibleChange,
  productOptions,
  locationOptions,
  counterPartyHierarchyOptions,
  setNewMarkerFormVisible,
  setActiveEditMarkerKey,
  activeMarker,
  canInsertNewMarker = true,
}) => {
  const [form] = useForm()
  const { useMarketPlatformFormulaMarkerUpsertMutation } = useMarketPlatformFormulas()
  const upsert = useMarketPlatformFormulaMarkerUpsertMutation()

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      const values = form.getFieldsValue()
      upsert.mutate({ ...values })
      setNewMarkerFormVisible(false)
      setActiveEditMarkerKey(null)
      form.resetFields()
    } catch (error) {
      // Form validation failed
      message.error('Please fill in all required fields')
    }
  }

  const mode = useMemo(() => (activeMarker ? 'edit' : 'create'), [activeMarker])
  useEffect(() => {
    if (activeMarker) {
      form.setFieldsValue({
        MarkerId: activeMarker?.Value,
        Name: activeMarker?.Text,
        ProductHierarchyTypeCvId: activeMarker?.ProductHierarchyTypeCvId?.toString(),
        LocationHierarchyTypeCvId: activeMarker?.LocationHierarchyTypeCvId?.toString(),
        CounterPartyHierarchyDefinitionId: activeMarker?.CounterPartyHierarchyDefinitionId?.toString(),
      })
    }
  }, [activeMarker])

  return (
    <Popover
      trigger='click'
      visible={visible || !!activeMarker}
      onVisibleChange={(visible) => {
        if (!visible) {
          // set form state to empty values
          form.resetFields()
          setActiveEditMarkerKey(null)
        }
        setNewMarkerFormVisible(visible)
      }}
      placement='bottom'
      content={
        <Form form={form} onFinish={handleSubmit} layout='vertical' style={{ minWidth: 280 }}>
          <Vertical style={{ gap: '1rem' }} className='p-3'>
            <Texto category='h5' style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <FolderAddOutlined />
              {mode === 'edit' ? `Edit Marker` : 'New Marker'}
            </Texto>

            {activeMarker && (
              <Form.Item name='MarkerId' label='MarkerId' hidden>
                <Input value={activeMarker.Value} />
              </Form.Item>
            )}

            <Form.Item name='Name' label='Name' rules={[{ required: true, message: 'Name is required' }]}>
              <Input placeholder='Marker Name' disabled={!canInsertNewMarker} />
            </Form.Item>

            <Form.Item name='ProductHierarchyTypeCvId' label='Product Hierarchy'>
              <Select placeholder='Product Hierarchy'>
                {productOptions?.map((option) => (
                  <Select.Option value={option.Value} key={option.Value}>
                    {option.Text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name='LocationHierarchyTypeCvId'
              label='Location Hierarchy'
              // rules={[{ required: mode !== 'edit', message: 'Location is required' }]}
            >
              <Select placeholder='Location Hierarchy'>
                {locationOptions?.map((option) => (
                  <Select.Option value={option.Value} key={option.Value}>
                    {option.Text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name='CounterPartyHierarchyDefinitionId'
              label='CounterParty Hierarchy'
            >
              <Select placeholder='CounterParty Hierarchy (Optional)' allowClear>
                {counterPartyHierarchyOptions?.map((option) => (
                  <Select.Option value={option.Value} key={option.Value}>
                    {option.Text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
                {mode === 'edit' ? 'Save' : 'Create'}
              </Button>
            </Form.Item>
          </Vertical>
        </Form>
      }
    >
      {canInsertNewMarker && (
        <Tooltip title='Create New Marker' placement='bottomRight'>
          <Button icon={<FolderAddOutlined />} onClick={() => onVisibleChange(true)} />
        </Tooltip>
      )}
    </Popover>
  )
}
