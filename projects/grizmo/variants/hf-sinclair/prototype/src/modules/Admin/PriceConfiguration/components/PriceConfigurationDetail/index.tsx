import { BarChartOutlined } from '@ant-design/icons'
import { usePriceConfigurations } from '@api/usePriceConfigurations'
import { Horizontal, NotificationMessage, Vertical } from '@gravitate-js/excalibrr'
import { Form, Tabs } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'

import { DetailHeader } from './components/DetailHeader'
import { Futures } from './components/Futures'
import { VariableCreator } from './components/VariableCreator'
import { Variables } from './components/Variables'

export function PriceConfigurationDetail({ configMeta, selectedProductGroup, priceConfigurations }) {
  const [form] = Form.useForm()
  const [tab, setTab] = useState(0)
  const [create, setCreate] = useState(false)

  const { createUpdatePriceConfigurationMutation } = usePriceConfigurations()
  const marketPlatformInstruments = configMeta?.Data?.MarketPlatformInstrumentList
  useEffect(() => {
    if (marketPlatformInstruments) {
      setTab(marketPlatformInstruments[0]?.Value)
    }
  }, [marketPlatformInstruments])

  const selectedPriceConfiguration = useMemo(
    () =>
      priceConfigurations?.Data?.find(
        (item) =>
          item?.LocationId?.toString() === selectedProductGroup?.locationId &&
          item?.ProductId?.toString() === selectedProductGroup?.productId &&
          item?.MarketPlatformInstrumentId?.toString() === tab
      ),
    [priceConfigurations, selectedProductGroup, tab]
  )

  const handleSave = async () => {
    const formValues = form.getFieldsValue(true)
    const MarketPlatformInstrumentId = marketPlatformInstruments?.find(
      (instrument) => instrument.Value === tab.toString()
    )?.Value

    const newVariable = {
      Name: formValues.Name,
      MarketPlatformPriceConfigurationDetailId: parseInt(Math.random() * 100000),
      PricePublisherId: formValues.PricePublisherId,
      OverridePriceInstrumentId: formValues.OverridePriceInstrumentId,
      PriceTypeCvId: formValues.PriceTypeCvId,
      IsRequired: formValues.IsRequired,
      IsPlaceholder: formValues.IsPlaceholder,
      IsCostComponent: formValues.IsCostComponent,
      Percentage: formValues.Percentage,
      TradeDateRuleCvId: formValues.TradeDateRuleCvId,
    }

    const PriceConfigurationDetails = selectedPriceConfiguration
      ? [...selectedPriceConfiguration.PriceConfigurationDetails, newVariable]
      : [newVariable]

    const newPriceConfiguration = {
      MarketPlatformPriceConfigurationId:
        selectedPriceConfiguration?.MarketPlatformPriceConfigurationId || parseInt(Math.random() * 100000),
      LocationId: selectedProductGroup.locationId,
      ProductId: selectedProductGroup.productId,
      MarketPlatformInstrumentId,
      FuturesOptionId: formValues.FuturesOptionId,
      FuturesOptionRequired: formValues.FuturesOptionRequired,
      PriceConfigurationDetails,
    }
    if (!formValues.FuturesOptionRequired && !PriceConfigurationDetails.some((detail) => detail.IsRequired)) {
      NotificationMessage('Cannot save variable', 'At least one variable or the Futures Price must be required')
      return false
    }
    const response = await createUpdatePriceConfigurationMutation.mutateAsync([newPriceConfiguration])

    if (!response.Validations?.length) {
      NotificationMessage('Variable Saved', 'Variable saved successfully', false)
    } else {
      NotificationMessage('Error Saving Variable', response?.Validations[0]?.Message, true)
    }
    setCreate(false)
    return true
  }

  return (
    <Vertical>
      <DetailHeader selectedProductGroup={selectedProductGroup} />
      <Horizontal className='bg-3' style={{ minHeight: '100%' }}>
        <Vertical>
          <Horizontal className='m-4'>
            <Vertical>
              <Tabs className='bg-1' defaultActiveKey={tab} style={{ minWidth: '100%' }} onChange={setTab}>
                {marketPlatformInstruments?.map((instrument) => {
                  return (
                    <Tabs.TabPane
                      tab={
                        <span>
                          <BarChartOutlined /> {instrument.Text}
                        </span>
                      }
                      key={instrument.Value}
                    >
                      <Vertical style={{ minWidth: '100%' }}>
                        <Form name='PriceConfiguration' form={form} onFinish={handleSave} style={{ minWidth: '100%' }}>
                          <Futures
                            configMeta={configMeta}
                            selectedPriceConfiguration={selectedPriceConfiguration}
                            form={form}
                            selectedProductGroup={selectedProductGroup}
                            tab={tab}
                          />
                          <VariableCreator configMeta={configMeta} create={create} setCreate={setCreate} form={form} />
                          <Variables
                            configMeta={configMeta}
                            create={create}
                            setCreate={setCreate}
                            selectedPriceConfiguration={selectedPriceConfiguration}
                          />
                        </Form>
                      </Vertical>
                    </Tabs.TabPane>
                  )
                })}
              </Tabs>
            </Vertical>
          </Horizontal>
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
