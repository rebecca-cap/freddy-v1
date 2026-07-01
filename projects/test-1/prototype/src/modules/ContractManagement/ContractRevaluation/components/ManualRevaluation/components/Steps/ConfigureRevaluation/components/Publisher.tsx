import { Texto } from '@gravitate-js/excalibrr'
import { GetMetaDataResponse } from '@modules/ContractManagement/ContractRevaluation/api/types'
import { toAntOption } from '@utils/index'
import { Form, Select } from 'antd'
import React from 'react'

interface PublisherProps {
  metadata?: GetMetaDataResponse['Data']
}

export function Publisher({ metadata }: PublisherProps) {
  return (
    <>
      <Texto className='mt-4' category='h4'>
        Publisher
      </Texto>
      <Texto category='p2'>Select the publisher that issued the correction</Texto>

      <Form.Item
        className='mt-2'
        name='PricePublisherId'
        rules={[{ required: true, message: 'Please select a publisher' }]}
      >
        <Select
          style={{ width: '50%' }}
          showSearch
          placeholder='Select publisher'
          options={metadata?.PricePublishers?.map(toAntOption)}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        />
      </Form.Item>
    </>
  )
}
