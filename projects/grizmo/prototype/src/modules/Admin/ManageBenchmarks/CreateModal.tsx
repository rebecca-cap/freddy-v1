import { FolderAddOutlined } from '@ant-design/icons'
import { UpsertBenchmarkPayload } from '@api/useBenchmarks/types'
import { MetadataItem } from '@api/useMarketPlatformFormulas/types'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useMarketPlatformFormula } from '@modules/Admin/ManageMarketPlatformFormulas/hooks/useMarketPlatformFormula'
import { UseMutationResult } from '@tanstack/react-query'
import { Form, Input, message, Modal, Select } from 'antd'
import React, { useMemo, useState } from 'react'

type CreateModalProps = {
  isVisible: boolean
  setIsVisible: (value: boolean) => void
  metadata: { Markers: MetadataItem[]; QuoteConfigurations: MetadataItem[]; ProductHierarchies: MetadataItem[]; LocationHierarchies: MetadataItem[]}
  createBenchmark: UseMutationResult<any, unknown, any, unknown>
}

type FormFields = {
  Name: string
  IsActive: 'Yes' | 'No'
  Marker: string
  MarkerName: string
  ProductHierarchyTypeCvId: string
  LocationHierarchyTypeCvId: string
  QuoteConfigurations: string[]
}

export function CreateModal({ isVisible, setIsVisible, metadata, createBenchmark }: CreateModalProps) {
  const [form] = Form.useForm()
  const [showMarkerMaker, setShowMarkerMaker] = useState(false)
  const formulaApi = useMarketPlatformFormula()

  const setupOptions = (list: MetadataItem[] | undefined) => {
    if (!list) return []
    return list
      .map((g) => ({
        label: g.Text ? g.Text.trim() : '',
        value: g.Value,
      }))
      .sort((a, b) => (a?.label ? a.label.localeCompare(b.label ?? '') : 0))
  }

  const quoteOptions = useMemo(() => setupOptions(metadata?.QuoteConfigurations), [metadata?.QuoteConfigurations])
  const markerOptions = useMemo(() => {
    const newMarkerOption = {
      label: (
        <Horizontal verticalCenter>
          <FolderAddOutlined className='mr-2' /> <Texto>Create New Marker</Texto>
        </Horizontal>
      ),
      value: 'new',
    }
    if (!metadata?.Markers && !metadata?.Markers?.length) return [newMarkerOption]
    const list = setupOptions(metadata?.Markers)
    return [newMarkerOption, { label: 'Select Existing Marker', options: list }]
  }, [metadata?.Markers])

  const productOptions = useMemo(() => setupOptions(metadata?.ProductHierarchies), [metadata?.ProductHierarchies])

  const locationOptions = useMemo(() => setupOptions(metadata?.LocationHierarchies), [metadata?.LocationHierarchies])

  const handleValueChange = (changedValues, allValues) => {
    if ((changedValues.Marker && changedValues.Marker === 'new') || (allValues.Marker && allValues.Marker === 'new')) {
      setShowMarkerMaker(true)
    } else {
      setShowMarkerMaker(false)
    }
  }

  const handleSubmit = async (values: FormFields) => {
    const newBenchmark: UpsertBenchmarkPayload = {
      Name: values?.Name,
      IsActive: values?.IsActive !== 'No',
      QuoteBenchmarkAssociations: values.QuoteConfigurations.map((id: string) => ({
        QuoteConfigurationId: id,
      })),
      MarkerId: values?.Marker !== 'new' ? values?.Marker : undefined,
      NewMarker:
        values?.Marker !== 'new'
          ? undefined
          : {
              Name: values.MarkerName,
              ProductHierarchyTypeCvId: values.ProductHierarchyTypeCvId,
              LocationHierarchyTypeCvId: values.LocationHierarchyTypeCvId,
            },
    }

    const payload = [{ ...newBenchmark }]
    try {
      await createBenchmark.mutateAsync(payload)
      message.success('Benchmark Saved')
      setIsVisible(false)
      form.resetFields()
      setShowMarkerMaker(false)
    } catch (error) {
      message.error('Failed to Create Benchmark')
    }
  }

  return (
    <Form form={form} onValuesChange={handleValueChange} onFinish={handleSubmit}>
      <Modal
        title='Create New Benchmark'
        visible={isVisible}
        destroyOnClose
        onCancel={() => {
          form.resetFields()
          setShowMarkerMaker(false)
          setIsVisible(false)
        }}
        width='50%'
        bodyStyle={{ minHeight: '400px' }}
        footer={<CreateFooter form={form} />}
      >
        <Horizontal>
          <Vertical flex={1}>
            <Vertical className='m-2' flex={1}>
              <Texto>Benchmark Name</Texto>
              <Form.Item name='Name' rules={[{ required: true, message: 'Name is required' }]}>
                <Input placeholder='Enter Benchmark Name' />
              </Form.Item>
            </Vertical>

            <Vertical className='m-2' flex={1}>
              <Texto>Marker</Texto>
              <Form.Item name='Marker' rules={[{ required: true, message: 'Marker is required' }]}>
                <Select
                  placeholder='Select Marker'
                  options={markerOptions}
                  allowClear
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, option) => {
                    if (option?.value === 'new') return false
                    return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }}
                />
              </Form.Item>
            </Vertical>
            {showMarkerMaker && (
              <Vertical className='p-2'>
                <Vertical className='m-2 ml-5'>
                  <Vertical className='m-2'>
                    <Texto>New Marker Name</Texto>
                    <Form.Item name='MarkerName' rules={[{ required: true, message: 'Marker Name is required' }]}>
                      <Input placeholder='Marker Name' />
                    </Form.Item>
                  </Vertical>
                  <Vertical className='m-2'>
                    <Texto>Product Hierarchy</Texto>
                    <Form.Item
                      name='ProductHierarchyTypeCvId'
                      rules={[{ required: showMarkerMaker, message: 'Product is required' }]}
                    >
                      <Select placeholder='Product Hierarchy' options={productOptions} />
                    </Form.Item>
                  </Vertical>
                  <Vertical className='m-2'>
                    <Texto>Location Hierarchy</Texto>
                    <Form.Item
                      name='LocationHierarchyTypeCvId'
                      rules={[{ required: showMarkerMaker, message: 'Location is required' }]}
                    >
                      <Select placeholder='Location Hierarchy' options={locationOptions} />
                    </Form.Item>
                  </Vertical>
                </Vertical>
              </Vertical>
            )}
          </Vertical>
          <Vertical flex={1}>
            <Vertical className='m-2' flex={1}>
              <Texto>Is Active?</Texto>
              <Form.Item name='isActive' rules={[{ required: true, message: 'Is Active? is required' }]}>
                <Select
                  options={[
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                  ]}
                  placeholder='Select Status'
                />
              </Form.Item>
            </Vertical>
            <Vertical className='m-2' flex={1}>
              <Texto>Quote Configuration</Texto>
              <Form.Item
                name='QuoteConfigurations'
                rules={[{ required: true, message: 'Quote Configuration is required' }]}
              >
                <Select
                  placeholder='Select Quote Configuration'
                  options={quoteOptions}
                  mode='multiple'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
            </Vertical>
          </Vertical>
        </Horizontal>
      </Modal>
    </Form>
  )
}

function CreateFooter({ form }) {
  return (
    <Horizontal justifyContent='flex-end' verticalCenter>
      <GraviButton success buttonText='Save' onClick={() => form.submit()} />
    </Horizontal>
  )
}
