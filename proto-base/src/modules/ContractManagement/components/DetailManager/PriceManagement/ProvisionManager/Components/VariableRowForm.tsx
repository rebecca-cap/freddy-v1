import { DeleteOutlined, SelectOutlined } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { AdditionalOptionsModalContent } from '@modules/ContractManagement/components/DetailManager/PriceManagement/AdditionalOptionsModalContent'
import {
  validateInstrument,
  validatePriceType,
} from '@modules/ContractManagement/components/DetailManager/PriceManagement/ProvisionManager/Util/formHelpers'
import { toAntOption } from '@utils/index'
import { Button, Form, Input, InputNumber, Modal, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'

export function VariableRowForm({ variable, variableIndex, metadata, name, remove, form, data, groupName }) {
  const [selectedPublisherId, setSelectedPublisherId] = useState(variable?.PricePublisherId ?? null)
  const [selectedPriceInstrumentId, setSelectedPriceInstrumentId] = useState(variable?.PriceInstrumentId ?? null)
  const [viewingAOModal, setViewingAOModal] = useState(false)

  useEffect(() => {
    setSelectedPublisherId(variable?.PricePublisherId ?? null)
  }, [variable?.PricePublisherId])

  const instrumentOptions = useMemo(() => {
    if (selectedPublisherId) {
      const publisherId = +selectedPublisherId || 0
      return metadata?.PublisherPriceInstruments[publisherId] || []
    }
    return []
  }, [selectedPublisherId, metadata?.PublisherPriceInstruments])

  const priceTypeOptions = useMemo(() => {
    if (selectedPublisherId) {
      const publisherId = +selectedPublisherId || 0
      return metadata?.PublisherPriceTypes[publisherId] || []
    }
    return variable?.PriceTypeCvId ? metadata?.PriceTypeList || [] : []
  }, [selectedPublisherId, metadata?.PublisherPriceTypes, variable?.PriceTypeCvId])

  const priceInstrumentUOM = useMemo(() => {
    if (selectedPriceInstrumentId) {
      const selectedPriceInstrument = metadata?.PriceInstrumentList.find(
        (instrument) => instrument.Value === selectedPriceInstrumentId?.toString()
      )
      const uomCurrency = selectedPriceInstrument?.CurrencyPerUnitDisplay
      const uomCurrencyValue = uomCurrency === '/' ? '' : uomCurrency
      return uomCurrencyValue
    }
    return []
  }, [selectedPriceInstrumentId, metadata?.PriceInstrumentList])

  const clearPriceTypeIfInvalid = (publisherId: number | null, currentGroups) => {
    const priceTypeCvId = currentGroups[groupName][variableIndex].PriceTypeCvId
    if (!publisherId || !priceTypeCvId) return

    const availablePriceTypes = metadata?.PublisherPriceTypes?.[publisherId] || []
    const isValid = availablePriceTypes.some((pt) => pt.Value === priceTypeCvId?.toString())

    if (!isValid) {
      currentGroups[groupName][variableIndex].PriceTypeCvId = null
      currentGroups[groupName][variableIndex].PriceTypeDisplayName = null
    }
  }

  const clearInstrumentIfInvalid = (publisherId: number | null, currentGroups) => {
    const priceInstrumentId = currentGroups[groupName][variableIndex].PriceInstrumentId
    if (!publisherId || !priceInstrumentId) return

    const availableInstruments = metadata?.PublisherPriceInstruments?.[publisherId] || []
    const isValid = availableInstruments.some((inst) => inst.Value === priceInstrumentId?.toString())

    if (!isValid) {
      currentGroups[groupName][variableIndex].PriceInstrumentName = null
      currentGroups[groupName][variableIndex].PriceInstrumentId = null
      setSelectedPriceInstrumentId(null)
    }
  }

  const handlePublisherChange = (value, option) => {
    setSelectedPublisherId(value)

    const currentGroups = form.getFieldsValue().Groups
    currentGroups[groupName][variableIndex].PricePublisherId = value

    clearPriceTypeIfInvalid(value, currentGroups)
    clearInstrumentIfInvalid(value, currentGroups)

    form.setFieldsValue({ Groups: currentGroups })
  }
  const handlePriceInstrumentChange = (value, option) => {
    setSelectedPriceInstrumentId(value)
    const currentGroups = form.getFieldsValue().Groups
    currentGroups[groupName][variableIndex].PriceInstrumentId = value
  }

  const handleAOSave = (formValues) => {
    const groupFieldValue = form.getFieldValue(['Groups', '0', name])
    groupFieldValue.UOMConversionOverride = formValues.UOMConversionOverride
    form.setFieldsValue(groupFieldValue)
    setViewingAOModal(false)
  }
  const handleMissingOptionalPriceBehaviorChange = (value, option) => {
    const currentGroups = form.getFieldsValue().Groups
    currentGroups[groupName][variableIndex].MissingOptionalPriceBehaviorCvId = value
    currentGroups[groupName][variableIndex].IsRequired = value === null
    form.setFieldsValue({ Groups: currentGroups })
  }

  return (
    <Horizontal className='px-3 py-2 border-bottom bg-1'>
      <Vertical flex={1}>
        <Form.Item
          initialValue={100}
          name={[name, 'Percentage']}
          rules={[{ required: true, message: 'Percentage is Required' }]}
          className='p-0'
        >
          <InputNumber precision={fmt.currentPrecision} autoFocus placeholder='Percentage' step={0.1} />
        </Form.Item>
      </Vertical>
      <Vertical flex={2} className='mr-3'>
        <Form.Item name={[name, 'PricePublisherId']} rules={[{ required: true, message: 'Publisher is Required' }]}>
          <Select
            allowClear
            showSearch
            placeholder='Publisher'
            onChange={handlePublisherChange}
            dropdownMatchSelectWidth={false}
            optionFilterProp='children'
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={metadata?.PricePublisherList?.map(toAntOption)}
          />
        </Form.Item>
      </Vertical>
      <Vertical flex={2} className='mr-3'>
        <Form.Item
          name={[name, 'PriceInstrumentId']}
          rules={[
            {
              validator: (_, value) => validateInstrument(value, selectedPublisherId, metadata),
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder='Instrument'
            onChange={handlePriceInstrumentChange}
            dropdownMatchSelectWidth={false}
            optionFilterProp='children'
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={instrumentOptions.map(toAntOption)}
          />
        </Form.Item>
      </Vertical>
      <Vertical flex={1} className='mr-3'>
        <Form.Item
          name={[name, 'PriceTypeCvId']}
          rules={[
            {
              validator: (_, value) => validatePriceType(value, selectedPublisherId, metadata),
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder='Type'
            dropdownMatchSelectWidth={false}
            options={priceTypeOptions.map(toAntOption)}
          />
        </Form.Item>
      </Vertical>
      <Vertical flex={1} className='mr-3'>
        <Form.Item name={[name, 'Differential']} rules={[{ required: false }]}>
          <InputNumber precision={fmt.currentPrecision} placeholder='0' step={0.1} />
        </Form.Item>
      </Vertical>
      <Vertical flex={1} className='mr-3'>
        <Form.Item
          name={[name, 'PriceValuationRuleId']}
          rules={[{ required: true, message: 'Price Valuation Rule is Required' }]}
        >
          <Select
            allowClear
            showSearch
            placeholder='Rule'
            dropdownMatchSelectWidth={false}
            options={metadata?.TradePriceValuationRuleList?.map(toAntOption)}
          />
        </Form.Item>
      </Vertical>
      <Vertical flex={1} className='mr-3'>
        <Form.Item name={[name, 'MissingOptionalPriceBehaviorCvId']}>
          <Select
            dropdownMatchSelectWidth={false}
            onChange={handleMissingOptionalPriceBehaviorChange}
            options={metadata?.OptionalVariableBehaviors?.map((option) => ({
              label: option.Text,
              value: option.Value,
            }))}
            placeholder='Required'
          />
        </Form.Item>
      </Vertical>
      <Vertical flex={1} className='mr-3'>
        <Form.Item name={[name, 'DisplayName']} rules={[{ required: false }]}>
          <Input />
        </Form.Item>
      </Vertical>
      <Vertical verticalCenter flex={1} className='mr-3'>
        <Texto>{priceInstrumentUOM}</Texto>
      </Vertical>
      <Vertical flex={1} verticalCenter alignItems='flex-end' className='mr-3'>
        <Horizontal horizontalCenter flex={1}>
          <Button
            type='text'
            onClick={() => setViewingAOModal(true)}
            icon={<SelectOutlined />}
            style={{ color: variable?.UOMConversionOverride ? 'var(--theme-color-2)' : '' }}
          >
            Options
          </Button>

          <Modal
            onCancel={() => setViewingAOModal(false)}
            destroyOnClose
            footer={null}
            title={<Texto>Additional Options</Texto>}
            visible={viewingAOModal}
            style={{ minWidth: 700 }}
          >
            <AdditionalOptionsModalContent
              setViewingAOModal={setViewingAOModal}
              variable={form.getFieldValue(['Groups', '0', name])}
              data={data}
              submit={handleAOSave}
              metadata={metadata}
            />
          </Modal>
          <Button onClick={remove} danger type='text' icon={<DeleteOutlined />} />
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}
