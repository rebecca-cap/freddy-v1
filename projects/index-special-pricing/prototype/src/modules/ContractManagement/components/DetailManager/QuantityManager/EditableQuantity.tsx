import { EditOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, InputNumber, Radio } from 'antd'

export function EditableQuantity({
  quantity,
  setQuantity,
  setHasDetailEdits,
  setIsDrawerVisible,
  setManagedDetail,
  canWrite,
}) {
  const frequencyOptions = [
    { value: 'Per Month', label: 'Per Month' },
    { value: 'Per Trade', label: 'Per Trade' },
  ]

  return (
    <>
      <div>
        <Texto appearance='primary' category='label'>
          Quantity Volume Amount
        </Texto>
        <InputNumber
          size='large'
          style={{ fontSize: '1.5em', fontWeight: 'bold', minWidth: '10em' }}
          value={quantity}
          min={0}
          max={10_000_000_000}
          formatter={(value) => fmt.decimal(value, 0)}
          onChange={(value) => {
            setHasDetailEdits(true)
            setQuantity(Math.ceil(parseFloat(value)))
          }}
          disabled={!canWrite}
        />
      </div>
      <div>
        <Texto appearance='primary' category='label'>
          Volume Cap
        </Texto>
        <Horizontal>
          <Form.Item name='FrequencyCodeValueDisplay'>
            <Radio.Group
              size='large'
              onChange={(e) => setManagedDetail((prev) => ({ ...prev, FrequencyCodeValueDisplay: e.target.value }))}
              options={frequencyOptions}
              optionType='button'
              disabled={!canWrite}
            />
          </Form.Item>
          <GraviButton
            type='link'
            appearance='text'
            buttonText='Manage'
            icon={<EditOutlined />}
            onClick={() => setIsDrawerVisible(true)}
          />
        </Horizontal>
      </div>
    </>
  )
}
