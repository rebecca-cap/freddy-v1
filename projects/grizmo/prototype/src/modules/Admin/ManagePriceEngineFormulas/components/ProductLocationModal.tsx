import { IFormulaMetadataResponse, IFormulaVariable, MetadataItem } from '@api/usePriceEngineFormulas/types'
import { Texto } from '@gravitate-js/excalibrr'
import { Divider, Form, Modal, Radio, Select } from 'antd'
import React, { useEffect, useMemo } from 'react'

interface IProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (values: any) => void
  metadata: IFormulaMetadataResponse
  selectedVariable: IFormulaVariable
}

const getDefaultSelectionType = (selectedVariable: IFormulaVariable) => {
  if (selectedVariable?.SpecificProductId || selectedVariable?.SpecificLocationId) return 'ProductLocationCounterparty'
  if (selectedVariable?.PriceInstrumentId) return 'PriceInstrument'
  return 'ProductLocation'
}

export const ProductLocationModal: React.FC<IProps> = ({ visible, onCancel, onSubmit, metadata, selectedVariable }) => {
  const [form] = Form.useForm()
  const SelectionType = Form.useWatch('SelectionType', form)

  useEffect(() => {
    form.resetFields()
  }, [visible])

  const optionsFromList = (optionsArr: MetadataItem[]) =>
    optionsArr?.map((option) => ({
      value: option.Value,
      label: option.Text,
    }))
  const priceInstrumentOptions = useMemo(
    () => optionsFromList(metadata?.PublisherPriceInstruments[selectedVariable?.PricePublisherId]) || [],
    [selectedVariable?.PricePublisherId]
  )

  const counterpartyOptions = useMemo(() => optionsFromList(metadata?.CounterParties), [metadata?.CounterParties])

  const productOptions = useMemo(() => optionsFromList(metadata?.Products), [metadata?.Products])

  const locationOptions = useMemo(() => optionsFromList(metadata?.Locations), [metadata?.Locations])

  const searchFilter = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const SubmitForm = (values) => {
    const payload = {
      ...values,
      SpecificProductId: values.SpecificProductId ?? null,
      SpecificLocationId: values.SpecificLocationId ?? null,
      SpecificCounterPartyId: values.SpecificCounterPartyId ?? null,
      PriceInstrumentId: values.PriceInstrumentId ?? null,
    }
    onSubmit(payload)
  }
  const checkAndClearErrors = (newValues, allValues) => {
    if (allValues.SelectionType === 'ProductLocationCounterparty') {
      if (newValues.SpecificProductId || newValues.SpecificLocationId || newValues.SpecificCounterPartyId) {
        form.setFields([{ name: 'SpecificProductId', errors: [] }])
        form.setFields([{ name: 'SpecificLocationId', errors: [] }])
        form.setFields([{ name: 'SpecificCounterPartyId', errors: [] }])
      }
    }
  }

  return (
    <Form
      form={form}
      onValuesChange={checkAndClearErrors}
      layout='vertical'
      initialValues={{
        SelectionType: getDefaultSelectionType(selectedVariable),
        SpecificProductId: selectedVariable?.SpecificProductId?.toString(),
        SpecificLocationId: selectedVariable?.SpecificLocationId?.toString(),
        SpecificCounterPartyId: selectedVariable?.SpecificCounterPartyId?.toString(),
        PriceInstrumentId: selectedVariable?.PriceInstrumentId?.toString(),
      }}
      onFinish={SubmitForm}
    >
      <Modal visible={visible} title='Lookup Method' onCancel={onCancel} onOk={() => form.submit()}>
        <Form.Item name='SelectionType' rules={[{ required: true, message: 'A selection type is required' }]}>
          <Radio.Group style={{ display: 'flex', flexDirection: 'column' }}>
            <Radio value='ProductLocation'>
              <div style={{ width: '100%', display: 'flex' }}>
                <Texto>Product / Location</Texto>
                <Texto weight='bold' style={{ marginLeft: '12rem' }}>
                  Given Product @ Location
                </Texto>
              </div>
            </Radio>
            <Divider />
            <Radio value='ProductLocationCounterparty' style={{ display: 'inline', marginBottom: '1rem' }}>
              Specific Product (And / Or) Location (And / Or) Counterparty
            </Radio>
            {SelectionType === 'ProductLocationCounterparty' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <Form.Item
                  name='SpecificProductId'
                  rules={[
                    {
                      validator: (_, value) => {
                        const location = form.getFieldValue('SpecificLocationId')
                        const counterparty = form.getFieldValue('SpecificCounterPartyId')
                        if (location || counterparty || value) return Promise.resolve()

                        if (!value) {
                          return Promise.reject('A product, location or counterparty is required')
                        }
                      },
                    },
                  ]}
                >
                  <Select
                    style={{ width: '100%' }}
                    placeholder='Select a Product'
                    showSearch
                    allowClear
                    filterOption={searchFilter}
                    options={productOptions}
                  />
                </Form.Item>
                <Form.Item
                  name='SpecificLocationId'
                  rules={[
                    {
                      validator: (_, value) => {
                        const product = form.getFieldValue('SpecificProductId')
                        const counterparty = form.getFieldValue('SpecificCounterPartyId')
                        if (product || counterparty || value) return Promise.resolve()

                        if (!value) {
                          return Promise.reject('A product, location or counterparty is required')
                        }
                      },
                    },
                  ]}
                >
                  <Select
                    style={{ width: '100%' }}
                    placeholder='Select a Location'
                    showSearch
                    allowClear
                    filterOption={searchFilter}
                    options={locationOptions}
                  />
                </Form.Item>
                <Form.Item
                  name='SpecificCounterPartyId'
                  rules={[
                    {
                      validator: (_, value) => {
                        const product = form.getFieldValue('SpecificProductId')
                        const location = form.getFieldValue('SpecificLocationId')

                        if (product || location || value) return Promise.resolve()

                        if (!value) {
                          return Promise.reject('A product, location or counterparty is required')
                        }
                      },
                    },
                  ]}
                >
                  <Select
                    style={{ width: '100%' }}
                    placeholder='Select a Counterparty'
                    showSearch
                    allowClear
                    filterOption={searchFilter}
                    options={counterpartyOptions}
                  />
                </Form.Item>
              </div>
            )}
            <Divider />

            <Radio value='PriceInstrument' style={{ display: 'inline' }}>
              Specific Price Instrument
            </Radio>
            {SelectionType === 'PriceInstrument' && (
              <Form.Item
                name='PriceInstrumentId'
                className='mt-4'
                rules={[{ required: true, message: 'An instrument is required.' }]}
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder='Select a Price Instrument'
                  showSearch
                  allowClear
                  filterOption={searchFilter}
                  options={priceInstrumentOptions}
                />
              </Form.Item>
            )}
          </Radio.Group>
        </Form.Item>
      </Modal>
    </Form>
  )
}
