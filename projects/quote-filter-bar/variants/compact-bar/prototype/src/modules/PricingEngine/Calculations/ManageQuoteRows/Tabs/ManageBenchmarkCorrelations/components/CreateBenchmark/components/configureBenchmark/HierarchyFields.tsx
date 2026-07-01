import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { BenchmarkMetadataResponse } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/api/schema.types'
import { toAntOption } from '@utils/index'
import { Form, Select } from 'antd'
import React, { useMemo } from 'react'

export interface HierarchyFieldsProps {
  metadata?: BenchmarkMetadataResponse
}

export function HierarchyFields({ metadata }: HierarchyFieldsProps) {
  // Create options for hierarchy dropdowns
  const productHierarchyOptions = useMemo(() => {
    if (!metadata?.Data?.ProductHierarchies) return []
    return metadata.Data.ProductHierarchies.map(toAntOption).sort((a, b) => (a?.label || '').localeCompare(b?.label || ''))
  }, [metadata?.Data?.ProductHierarchies])

  const locationHierarchyOptions = useMemo(() => {
    if (!metadata?.Data?.LocationHierarchies) return []
    return metadata.Data.LocationHierarchies.map(toAntOption).sort((a, b) => (a?.label || '').localeCompare(b?.label || ''))
  }, [metadata?.Data?.LocationHierarchies])

  return (
    <Vertical className='w-full mb-4'>
      <Horizontal className='mb-2' justifyContent='space-between'>
        <Vertical flex={1} className='mr-4'>
          <Texto className='mb-1'>Product Hierarchy *</Texto>
          <Form.Item 
            name='ProductHierarchyId' 
            rules={[{ required: true, message: 'Please select a product hierarchy' }]}
          >
            <Select
              allowClear
              showSearch
              placeholder='Select product hierarchy'
              optionFilterProp='children'
              filterOption={(input, option) => 
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={productHierarchyOptions}
              size='large'
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Vertical>
        <Vertical flex={1}>
          <Texto className='mb-1'>Location Hierarchy *</Texto>
          <Form.Item 
            name='LocationHierarchyId' 
            rules={[{ required: true, message: 'Please select a location hierarchy' }]}
          >
            <Select
              allowClear
              showSearch
              placeholder='Select location hierarchy'
              optionFilterProp='children'
              filterOption={(input, option) => 
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={locationHierarchyOptions}
              size='large'
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}