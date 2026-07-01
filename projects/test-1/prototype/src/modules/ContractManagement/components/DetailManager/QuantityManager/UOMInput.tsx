import { Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'

export function UOMInput({ setManagedDetail, metadata, canWrite }) {
  return (
    <div className='flex-1'>
      <Texto appearance='primary' category='label'>
        Unit Of Measure
      </Texto>
      <Form.Item
        style={{ flex: 1, marginBottom: 0, maxWidth: 300 }}
        name='UnitOfMeasureId'
        rules={[{ required: true, message: 'Unit of Measure is required' }]}
      >
        <Select
          disabled={!canWrite}
          showSearch
          filterOption={(input, option) => option?.Text?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          style={{ width: '100%' }}
          size='large'
          placeholder='Select Unit Of Measure'
          onChange={(value) => {
            setManagedDetail((prev) => {
              return {
                ...prev,
                UnitOfMeasureId: value,
                UnitOfMeasureName: metadata?.UnitOfMeasureList.find((item) => item.Value === value).Text,
              }
            })
          }}
          options={metadata?.UnitOfMeasureList.map((i) => {
            return {
              value: i.Value,
              label: i.Text,
            }
          })}
        />
      </Form.Item>
    </div>
  )
}
