import '../../../../styles.css'

import { usePriceConfigurations } from '@api/usePriceConfigurations'
import { Horizontal, NotificationMessage, Texto } from '@gravitate-js/excalibrr'
import { Checkbox, Form, Select, Tooltip } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'

export function Futures({ configMeta, selectedPriceConfiguration, form, selectedProductGroup, tab }) {
  const { createUpdatePriceConfigurationMutation } = usePriceConfigurations()
  const FutureOptionsList = configMeta?.Data?.FuturesOptionsList.map((option) => {
    return {
      label: option.Text,
      value: option.Value,
    }
  })

  useEffect(() => {
    if (selectedPriceConfiguration) {
      form.setFieldsValue({ FuturesOptionRequired: selectedPriceConfiguration?.FuturesOptionRequired })
      form.setFieldsValue({ FuturesOptionId: selectedPriceConfiguration?.FuturesOptionId?.toString() })
      setFuturesOptionsRequired(selectedPriceConfiguration?.FuturesOptionRequired)
    }
  }, [selectedPriceConfiguration, configMeta])

  const [futuresOptionRequired, setFuturesOptionsRequired] = useState(false)

  const requiredDetailsCount = useMemo(() => {
    return (
      !selectedPriceConfiguration?.PriceConfigurationDetails.some((detail) => detail.IsRequired) &&
      selectedPriceConfiguration?.FuturesOptionRequired
    )
  }, [selectedPriceConfiguration])

  const handleFuturesOption = async () => {
    const FuturesOptionRequired = form.getFieldValue('FuturesOptionRequired')
    const FuturesOptionId = parseInt(form.getFieldValue('FuturesOptionId'))

    const MarketPlatformInstrumentId = configMeta?.Data?.MarketPlatformInstrumentList?.find(
      (instrument) => instrument.Value === tab.toString()
    )?.Value

    const newPriceConfiguration = {
      MarketPlatformPriceConfigurationId:
        selectedPriceConfiguration?.MarketPlatformPriceConfigurationId || parseInt(Math.random() * 100000),
      LocationId: selectedProductGroup.locationId,
      ProductId: selectedProductGroup.productId,
      MarketPlatformInstrumentId,
      FuturesOptionId,
      FuturesOptionRequired,
      PriceConfigurationDetails: [],
    }
    const priceConfig = selectedPriceConfiguration || newPriceConfiguration

    const payload = { ...priceConfig, FuturesOptionId, FuturesOptionRequired }

    if (FuturesOptionRequired && !FuturesOptionId) {
      form.setFields([
        {
          name: 'FuturesOptionId',
          required: true,
          errors: ['Futures Option ID is required'],
        },
      ])
    }

    if (FuturesOptionId) {
      const response = await createUpdatePriceConfigurationMutation.mutateAsync([payload])
      if (!response.Validations?.length) {
        NotificationMessage('Variable Saved', 'Variable saved successfully', false)
      } else {
        form.setFields([
          {
            name: 'FuturesOptionId',
            required: true,
          },
          {
            name: 'FuturesOptionRequired',
            value: false,
          },
        ])
        setFuturesOptionsRequired(false)
        NotificationMessage('Error Saving', response?.Validations[0]?.Message, true)
      }
    }
    return ''
  }

  return (
    <Horizontal className='justify-sb p-2 bg-2 bordered' verticalCenter style={{ minHeight: 40 }}>
      <Horizontal className='ml-3'>
        <Texto category='p1' weight={600}>
          FUTURES:
        </Texto>
      </Horizontal>
      <Horizontal className='mr-3' verticalCenter style={{ gap: 20 }}>
        <Tooltip title={!requiredDetailsCount ? 'You must have at least one required detail row' : null}>
          <Form.Item
            name='FuturesOptionRequired'
            valuePropName='checked'
            initialValue={selectedPriceConfiguration?.FuturesOptionRequired}
          >
            <Checkbox
              disabled={requiredDetailsCount}
              onChange={(value) => {
                setFuturesOptionsRequired(value.target.checked)
                handleFuturesOption()
              }}
            >
              <Texto weight={600}>Futures Price Required?</Texto>
            </Checkbox>
          </Form.Item>
        </Tooltip>
        <Texto category='p1' weight={600}>
          Futures:
        </Texto>
        <Form.Item
          name='FuturesOptionId'
          rules={[{ required: futuresOptionRequired, message: 'Please select a futures option' }]}
        >
          <Select
            disabled={!futuresOptionRequired}
            showSearch
            placeholder='Select futures option'
            style={{ minWidth: 200 }}
            options={FutureOptionsList}
            optionFilterProp='children'
            onChange={handleFuturesOption}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          />
        </Form.Item>
      </Horizontal>
    </Horizontal>
  )
}
