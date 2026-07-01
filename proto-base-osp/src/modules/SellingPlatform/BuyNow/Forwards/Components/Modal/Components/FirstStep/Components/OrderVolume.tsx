import { useForwardsCreation } from '@contexts/ForwardsContext'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, InputNumber, Radio } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'

import { VolumeErrorDisplay } from './VolumeErrorDisplay'

export function OrderVolume({
  form,
  periodCount,
  selectedSubtype,
  volumePeriod,
  setVolumePeriod,
  constraints,
  deliveryPeriods,
  setDeliveryPeriods,
  totalVolume,
  setTotalVolume,
}) {
  const [volumeValue, setVolumeValue] = useState(form.getFieldValue('Volume'))

  const [monthlyVolume, setMonthlyVolume] = useState(0)
  const [monthlyDisabled, setMonthlyDisabled] = useState(false)

  const { orderEntryInfo, error } = useForwardsCreation()

  useEffect(() => {
    calculateVolumes(volumeValue)
  }, [])

  useEffect(() => {
    const isMonthlyDisabled =
      selectedSubtype?.VolumeDistributionTypeMeaning === 'Weighted' ||
      selectedSubtype?.VolumeDistributionTypeMeaning === 'PullAnytime'
    setMonthlyDisabled(isMonthlyDisabled)

    if (isMonthlyDisabled) {
      form.setFieldsValue({ Period: 'Total' })
    }
    calculateVolumes(volumeValue)
  }, [selectedSubtype])

  const onPeriodChange = (event) => {
    const selectedValue = event.target.value
    setVolumePeriod(selectedValue)
    calculateVolumes(volumeValue)
  }
  const onVolumeChange = (value) => {
    setVolumeValue(value)
    calculateVolumes(value)
  }

  const PeriodOptions = useMemo(() => {
    const options = [
      { label: 'Monthly', value: 'Monthly' },
      { label: 'Total', value: 'Total' },
    ]
    return options
  }, [selectedSubtype])

  const calculateVolumes = (newVolume) => {
    setMonthlyDisabled(
      selectedSubtype?.VolumeDistributionTypeMeaning === 'Weighted' ||
        selectedSubtype?.VolumeDistributionTypeMeaning === 'PullAnytime'
    )
    const newTotalVolume = form.getFieldValue('Period') === 'Total' ? newVolume : newVolume * periodCount
    const newMonthlyVolume = Math.floor(newTotalVolume / periodCount)

    setTotalVolume(newTotalVolume)
    setMonthlyVolume(newMonthlyVolume)

    let newDeliveryPeriods = []

    if (selectedSubtype?.VolumeDistributionTypeMeaning === 'Rateable') {
      newDeliveryPeriods = deliveryPeriods.map((item) => ({
        ...item,
        orderVolume: newMonthlyVolume,
        Price: item.salePrice,
      }))
    } else if (selectedSubtype?.VolumeDistributionTypeMeaning === 'Weighted') {
      newDeliveryPeriods = deliveryPeriods.map((item, i) => ({
        ...item,
        orderVolume: Math.floor(
          newTotalVolume *
            orderEntryInfo.Data.SelectedItems.map((weight) => weight.QuantityDistributionWeightPercentage)[i]
        ),
        Price: item.salePrice,
      }))
    } else {
      newDeliveryPeriods = deliveryPeriods
    }

    const floorSum = newDeliveryPeriods?.map((p) => Math.floor(p.orderVolume)).reduce((a, b) => a + b, 0)
    let differenceToDistribute = newTotalVolume - floorSum
    const step = Math.sign(differenceToDistribute)

    while (Number.isFinite(differenceToDistribute) && differenceToDistribute !== 0) {
      newDeliveryPeriods[Math.abs(differenceToDistribute) % newDeliveryPeriods.length].orderVolume += step
      differenceToDistribute -= step
    }
    const calculateWeightedAverage = (weighted: boolean) => {
      const total = newDeliveryPeriods
        ?.map((item) => (!weighted ? 1 : item.orderVolume))
        .reduce((acc, curr) => acc + curr, 0)

      const totalPrice = newDeliveryPeriods
        .map((item) => (!weighted ? 1 : item.orderVolume) * item.Price)
        .reduce((acc, curr) => acc + curr, 0)
      const average = totalPrice / total

      return fmt.decimal(average)
    }
    if (selectedSubtype?.ContractPricingMethodMeaning === 'WeightedAverage') {
      const price = calculateWeightedAverage(true)
      form.setFieldsValue({ Price: price })
      form.setFieldsValue({ OverridePrice: price })
    }
    if (selectedSubtype?.ContractPricingMethodMeaning === 'DeliveryPeriod') {
      const price = calculateWeightedAverage(false)
      form.setFieldsValue({ Price: price })
      form.setFieldsValue({ OverridePrice: price })
    }
    if (selectedSubtype?.ContractPricingMethodMeaning === 'HighPrice') {
      const price = Math.max(...newDeliveryPeriods.map((item) => item.Price))
      form.setFieldsValue({ Price: price })
      form.setFieldsValue({ OverridePrice: price })
    }

    if (newDeliveryPeriods?.length > 0) {
      setDeliveryPeriods(newDeliveryPeriods)
    }
  }

  return (
    <Vertical flex={2}>
      <Horizontal className='pb-1 justify-sb' style={{ borderBottom: 'solid 1px var(--gray-500)' }} verticalCenter>
        <Texto category='h5' style={{ color: 'var(--theme-option)' }}>
          ORDER VOLUME
        </Texto>
        <Texto category='p2' weight={600} appearance='secondary'>
          {periodCount} Delivery Periods Selected
        </Texto>
      </Horizontal>
      <Horizontal className='mx-4 mt-4 justify-sb' verticalCenter>
        <Texto category='p2' style={{ flex: 1 }}>
          APPLY VOLUME BY:
        </Texto>
        <Form.Item name='Period' noStyle initialValue='Total'>
          <Radio.Group
            data-testid='period-radio-group'
            value={volumePeriod}
            onChange={onPeriodChange}
            optionType='button'
            buttonStyle='solid'
            style={{ flex: 1 }}
          >
            {PeriodOptions.map((option) => (
              <Radio.Button
                style={{ minWidth: '50%', textAlign: 'center' }}
                value={option.label}
                key={option.value}
                disabled={monthlyDisabled}
              >
                {option.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
      </Horizontal>
      <Horizontal className='mx-4 mt-3' verticalCenter>
        <Texto category='p2' style={{ flex: 1 }}>
          VOLUME:
        </Texto>
        <Form.Item name='Volume' rules={[{ required: true, message: 'Volume is required' }]} style={{ flex: '1' }}>
          <InputNumber
            autoFocus
            data-testid='volume-input'
            style={{ width: '100%' }}
            min={0}
            max={999999999}
            step='1'
            onChange={onVolumeChange}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>
      </Horizontal>
      <Horizontal className='mx-0 mt-3'>
        <VolumeErrorDisplay
          form={form}
          volumeValue={volumeValue}
          constraints={constraints}
          deliveryPeriods={deliveryPeriods}
          selectedSubtype={selectedSubtype}
        />
      </Horizontal>
      <Horizontal className='mx-4 mt-3 pt-2'>
        {!monthlyDisabled && (
          <Vertical flex={1} gap={5}>
            <Texto category='h5' weight={500}>
              Monthly Volume
            </Texto>
            <Texto category='h4'>{fmt.decimal(monthlyVolume, 0)}</Texto>
          </Vertical>
        )}

        <Vertical flex={1} gap={5}>
          <Texto category='h5' weight={500} align='right'>
            Total Volume
          </Texto>
          <Texto category='h4' align='right'>
            {fmt.decimal(totalVolume, 0)}
          </Texto>
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
