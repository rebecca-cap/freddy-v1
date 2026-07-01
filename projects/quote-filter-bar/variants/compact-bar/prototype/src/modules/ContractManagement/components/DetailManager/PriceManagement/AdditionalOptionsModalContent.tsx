import { InfoCircleOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, InputNumber, Switch } from 'antd'
import React, { useMemo, useState } from 'react'

export function AdditionalOptionsModalContent({ setViewingAOModal, variable, data, submit, metadata }) {
  const [overrideUOM, setOverrideUOM] = useState(!!variable?.UOMConversionOverride ?? false)
  const selectedPriceInstrumentUOM = useMemo(() => {
    return metadata?.PriceInstrumentList?.find(
      (instrument) => instrument.Text === variable.PriceInstrumentName?.toString()
    )?.UnitOfMeasureDisplay?.toUpperCase()
  }, [metadata?.PriceInstrumentList, variable.PriceInstrumentName])

  return (
    <Vertical>
      <Horizontal className='justify-sb pb-4'>
        <Texto category='h5' appearance='secondary'>
          Price Instrument
        </Texto>
        <Texto category='h5' appearance='primary'>
          {variable?.PriceInstrumentName || 'None Selected'}
        </Texto>
      </Horizontal>
      <Horizontal className='border-bottom' />
      <Form onFinish={submit} name='additionalOptionsForm' wrapperCol={{ span: 16 }} labelCol={{ span: 6 }}>
        <Horizontal className='justify-sb py-5' verticalCenter>
          <Texto category='h5'>
            Override Weight UOM tot Volume UOM <InfoCircleOutlined className='pl-2' />
          </Texto>
          <Switch onChange={setOverrideUOM} defaultChecked={overrideUOM} disabled={!selectedPriceInstrumentUOM} />
        </Horizontal>
        {overrideUOM && (
          <Horizontal className='bordered bg-2 pt-2 px-5' verticalCenter horizontalCenter>
            <Vertical className='justify-start'>
              <Texto category='h5' appearance='medium'>
                Conversion Factor
              </Texto>
              <Texto category='h1'>1 {data?.UnitOfMeasureName.toUpperCase()}</Texto>
            </Vertical>
            <Vertical className='justify-center' horizontalCenter>
              <Texto category='h1'>=</Texto>
            </Vertical>
            <Vertical verticalCenter>
              <Horizontal className='justify-sa' verticalCenter horizontalCenter>
                <Vertical className='mt-4' verticalCenter horizontalCenter>
                  <Form.Item
                    name='UOMConversionOverride'
                    initialValue={variable?.UOMConversionOverride}
                    rules={[{ required: overrideUOM, message: 'Number is Required' }]}
                    style={{ marginTop: 5 }}
                  >
                    <InputNumber
                      defaultValue={null}
                      autoFocus
                      type='number'
                      placeholder='Number'
                      controls={false}
                      style={{ minWidth: 200 }}
                      min={0}
                    />
                  </Form.Item>
                </Vertical>
                <Vertical horizontalCenter>
                  <Texto category='h4'>{selectedPriceInstrumentUOM}</Texto>
                </Vertical>
              </Horizontal>
            </Vertical>
          </Horizontal>
        )}
      </Form>
      <Horizontal className='justify-end mt-4' style={{ gap: 15 }}>
        <GraviButton buttonText='Cancel' onClick={() => setViewingAOModal(false)} style={{ minWidth: 100 }} />
        <GraviButton
          form='additionalOptionsForm'
          buttonText='Save'
          htmlType='submit'
          theme2
          style={{ minWidth: 100 }}
        />
      </Horizontal>
    </Vertical>
  )
}
