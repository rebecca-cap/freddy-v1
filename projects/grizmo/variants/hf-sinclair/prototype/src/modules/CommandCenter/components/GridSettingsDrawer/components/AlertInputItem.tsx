import { BBDTag, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, InputNumber } from 'antd'

export function AlertInputItem({
  settingsProperty,
  label,
  addOnAfter,
  addOnBefore,
  title,
  min,
}: {
  settingsProperty: string
  label: string
  addOnAfter?: string
  addOnBefore?: string
  title?: string
  min?: number
}) {
  return (
    <Vertical className={`my-2 w-full`}>
      {title && (
        <Texto className='mb-2' weight='bold'>
          {title}
        </Texto>
      )}
      <Horizontal flex={1} justifyContent='space-between' verticalCenter className='w-full' style={{ gap: '10px' }}>
        <Vertical flex={1} className='w-full'>
          <BBDTag
            className='p-2 text-center w-full'
            error={settingsProperty.toLowerCase().includes('critical')}
            warning={settingsProperty.toLowerCase().includes('warning')}
          >
            {label}
          </BBDTag>
        </Vertical>
        <Vertical flex={2} className='w-full'>
          <Form.Item name={settingsProperty}>
            <InputNumber style={{ width: '100%' }} addonAfter={addOnAfter} addonBefore={addOnBefore} min={min} />
          </Form.Item>
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
