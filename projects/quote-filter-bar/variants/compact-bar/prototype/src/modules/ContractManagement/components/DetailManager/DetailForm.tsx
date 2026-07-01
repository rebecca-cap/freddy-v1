import { HighlightOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { useContractManagementContext } from '@contexts/ContractManagement'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { ContractDetails, Price } from '@modules/ContractManagement/api/types.schema'
import { DateChangeConfirmContent } from '@modules/ContractManagement/components/DateChangeConfirm/DateChangeConfirmContent'
import { DetailEffectiveDatesFormValidator } from '@modules/ContractManagement/utils'
import { toAntOption } from '@utils/index'
import { DatePicker, Form, Popover, Select, Tooltip } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'

import { ActionMenu } from '../DetailsSection/DetailCard/ActionMenu'

const { RangePicker } = DatePicker

interface ContractDetailFormProps {
  managedDetail: ContractDetails['Details'][number]
  setManagedDetail: React.Dispatch<React.SetStateAction<any>>
  form: FormInstance
  dateDiffs: number[]
}

export function DetailForm({ managedDetail, form, setManagedDetail, dateDiffs }: ContractDetailFormProps) {
  const { metadata, openTab, newTab, deleteDetail, header, disableFields, canWrite, getUpdatedQuantities } =
    useContractManagementContext()
  const [isShowingDateConfirm, setIsShowingDateConfirm] = useState(false)
  const effectiveDates = Form.useWatch('EffectiveDates', form) as [moment.Moment, moment.Moment]

  useEffect(() => {
    form.setFieldsValue({ ...managedDetail })
    setTimeout(() => {
      validateDetailEffectiveDates()
      validateContractCalendar()
    }, 100)
  }, [managedDetail])

  const calendarOptions = useMemo(() => {
    if (!metadata?.PricingCalendars) return []

    const headerCalendarId = header?.ValuationCalendarId?.toString()
    const hasDetailCalendar = Boolean(managedDetail?.ValuationCalendarId)

    return metadata.PricingCalendars.map((c) => {
      const base = toAntOption(c)

      if (!hasDetailCalendar && headerCalendarId && c.Value === headerCalendarId) {
        return {
          ...base,
          label: `${base.label} (Default)`,
        }
      }

      return base
    })
  }, [metadata?.PricingCalendars, header?.ValuationCalendarId, managedDetail?.ValuationCalendarId])

  const validateContractCalendar = async () => {
    const contractCalendarId = managedDetail?.ValuationCalendarId
    const defaultHeaderCalendarId = header?.ValuationCalendarId

    if (!contractCalendarId && defaultHeaderCalendarId) {
      form.setFieldsValue({ ValuationCalendarId: defaultHeaderCalendarId?.toString() })
    }

    if (!contractCalendarId && !defaultHeaderCalendarId) {
      form.setFields([
        {
          name: 'ValuationCalendarId',
          errors: ['select a contract calendar'],
        },
      ])

      try {
        return await form.validateFields(['ValuationCalendarId'])
      } catch (error) {
        return console.error('Validation failed:', error)
      }
    }
  }

  const validateDetailEffectiveDates = async () => {
    const contractFromDate = moment(header?.EffectiveDates?.[0])
    const contractToDate = moment(header?.EffectiveDates?.[1])
    const detailFromDate = moment(managedDetail.FromDateTime)
    const detailToDate = moment(managedDetail.ToDateTime)

    if (detailFromDate.isBefore(contractFromDate) || detailToDate.isAfter(contractToDate)) {
      form.setFields([
        {
          name: 'EffectiveDates',
          errors: ['Date range must be within contract dates'],
        },
      ])

      try {
        await form.validateFields(['EffectiveDates'])
      } catch (error) {
        console.error('Validation failed:', error)
      }
    }
  }

  const isDisabled = useMemo(() => {
    return (disableFields && managedDetail?.TradeEntryDetailId) || !canWrite
  }, [disableFields, managedDetail?.TradeEntryDetailId, canWrite])

  const updateCascadeDates = (pricesWithUpdatedDates?: Price[]) => {
    const newEffectiveDates = form.getFieldValue('EffectiveDates')

    if (managedDetail.Prices.length === 1) {
      const updatedQuantities = getUpdatedQuantities(managedDetail, newEffectiveDates)
      const newTotalQuantity = updatedQuantities?.reduce((sum, q) => sum + q.Quantity, 0) || 0

      setManagedDetail((oldDetail) => ({
        ...oldDetail,
        Quantity: newTotalQuantity, // Update the main quantity field
        Quantities: updatedQuantities,
        Prices: oldDetail.Prices?.map((price) => ({
          ...price,
          FromDate: newEffectiveDates[0],
          ToDate: newEffectiveDates[1],
        })),
      }))
    }
    if (managedDetail.Prices.length > 1 && pricesWithUpdatedDates) {
      setManagedDetail((oldDetail) => ({
        ...oldDetail,
        Prices: pricesWithUpdatedDates,
      }))
    }
  }

  const updateDetail = (value: any, option: any, propertyName: string | null = null) => {
    const copy = { ...managedDetail }
    if (value === undefined) {
      copy[`${propertyName}Id`] = null
      copy[`${propertyName}Name`] = null
    } else {
      const { label } = option
      if (propertyName === 'Frequency') {
        copy.FrequencyCvId = value
        copy.FrequencyCodeValueDisplay = label
      } else if (propertyName === 'PricePeriodStartOffset') {
        copy.PricePeriodStartOffset = value
      } else {
        copy[`${propertyName}Id`] = value
        copy[`${propertyName}Name`] = label
      }
    }

    setManagedDetail(copy)
  }

  return (
    <Horizontal className='bg-1 bordered round-border py-3 px-2'>
      <Vertical flex={1} className='ml-4 mr-2'>
        <Horizontal className='mb-1 h-25' verticalCenter>
          <Texto category='label' appearance='hint'>
            Effective Dates
          </Texto>
        </Horizontal>
        <Form.Item
          className={'mb-3'}
          hasFeedback
          name='EffectiveDates'
          rules={[
            { required: true, message: 'Effective Dates are Required' },
            {
              validator: (rule, value) => DetailEffectiveDatesFormValidator(rule, value, header),
            },
          ]}
        >
          <RangePicker
            disabledDate={(current) =>
              current &&
              (current < moment(header?.EffectiveDates?.[0]).startOf('day') ||
                current > moment(header?.EffectiveDates?.[1]).endOf('day'))
            }
            size='large'
            style={{ width: '100%' }}
            disabled={!canWrite}
            format={dateFormat.DATE_SLASH}
          />
        </Form.Item>
        <Horizontal className='mb-1 h-25' verticalCenter>
          <Texto category='label' appearance='hint'>
            Contract Calendar
          </Texto>
        </Horizontal>
        <Form.Item
          hasFeedback
          name='ValuationCalendarId'
          rules={[{ required: true, message: 'Please select contract calendar' }]}
        >
          <Select
            size='large'
            allowClear
            showSearch
            style={{ width: '100%', color: 'var(--theme-color-2)', fontWeight: 'bold' }}
            placeholder='Contract Calendar'
            onChange={(value, option) => updateDetail(value, option, 'ValuationCalendar')}
            optionFilterProp='label'
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={calendarOptions}
          />
        </Form.Item>
      </Vertical>
      <Vertical flex={0.15} className='mr-2' horizontalCenter>
        {managedDetail?.Prices?.length > 0 && (
          <>
            <Horizontal className='mb-1 h-25' verticalCenter>
              <Texto category='label' appearance='hint'>
                Set All
              </Texto>
            </Horizontal>
            <Form.Item name='CascadeDetailHeaderDates' valuePropName='checked' className={'mb-3'}>
              <Popover
                title='Change All Price Dates?'
                content={
                  <DateChangeConfirmContent
                    setIsShowingDateConfirm={setIsShowingDateConfirm}
                    updateCascadeDates={updateCascadeDates}
                    prices={managedDetail.Prices}
                    dateDiffs={dateDiffs}
                    effectiveDates={effectiveDates}
                  />
                }
                visible={isShowingDateConfirm}
                destroyTooltipOnHide
              >
                <Tooltip trigger='hover' title='Set all price dates.'>
                  <GraviButton
                    className='m-0'
                    size='large'
                    icon={<HighlightOutlined />}
                    onClick={() => {
                      if (managedDetail.Prices.some((price) => price?.FromDate || price?.ToDate))
                        setIsShowingDateConfirm(true)
                      else updateCascadeDates()
                    }}
                  />
                </Tooltip>
              </Popover>
            </Form.Item>
          </>
        )}
      </Vertical>
      <Vertical flex={1} className='mr-2'>
        <Horizontal className='mb-1 h-25' verticalCenter>
          <Texto category='label' appearance='hint'>
            Effective Time
          </Texto>
        </Horizontal>
        <Form.Item hasFeedback name='PricePeriodStartOffset'>
          <Select
            allowClear
            showSearch
            style={{ width: '100%', color: 'var(--theme-color-2)', fontWeight: 'bold' }}
            placeholder='Effective Time'
            disabled={isDisabled}
            onChange={(value, option) => updateDetail(value, option, 'PricePeriodStartOffset')}
            size='large'
            optionFilterProp='children'
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={metadata?.PricePeriodStartOffsets?.map(toAntOption)}
          />
        </Form.Item>
      </Vertical>
      <Vertical flex={1} className={'mr-2'}>
        <Horizontal verticalCenter justifyContent='space-between' className='mb-1 h-25'>
          <Texto category='label' appearance='hint'>
            Origin Location
          </Texto>
        </Horizontal>
        <Form.Item
          className={'mb-3'}
          hasFeedback
          name='FromLocationId'
          rules={[{ required: true, message: 'Origin Location is required' }]}
        >
          <Select
            allowClear
            showSearch
            style={{ width: '100%', color: 'var(--theme-color-2)', fontWeight: 'bold' }}
            placeholder='Origin Location'
            onChange={(value, option) => updateDetail(value, option, 'FromLocation')}
            size='large'
            optionFilterProp='children'
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            disabled={isDisabled}
            options={metadata?.LocationList?.map(toAntOption)}
          />
        </Form.Item>
        <Horizontal verticalCenter justifyContent='space-between' className='mb-1 h-25'>
          <Texto category='label' appearance='hint'>
            Destination Location
          </Texto>
        </Horizontal>
        <Form.Item
          hasFeedback
          name='ToLocationId'
          rules={[{ required: false, message: 'Destination Location is required' }]}
        >
          <Select
            size='large'
            allowClear
            showSearch
            style={{ width: '100%', color: 'var(--theme-color-2)', fontWeight: 'bold' }}
            placeholder='Destination Location'
            onChange={(value, option) => updateDetail(value, option, 'ToLocation')}
            optionFilterProp='children'
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            disabled={isDisabled}
            options={metadata?.LocationList?.map(toAntOption)}
          />
        </Form.Item>
      </Vertical>
      <Vertical flex={1} className='mr-2'>
        <Horizontal verticalCenter className='mb-1 h-25'>
          <Texto category='label' appearance='hint'>
            Product
          </Texto>
        </Horizontal>
        <Form.Item hasFeedback name='ProductId' rules={[{ required: true, message: 'Product is required' }]}>
          <Select
            size='large'
            allowClear
            showSearch
            style={{ width: '100%', color: 'var(--theme-color-2)' }}
            placeholder='Product'
            onChange={(value, option) => updateDetail(value, option, 'Product')}
            optionFilterProp='children'
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            disabled={isDisabled}
            options={metadata?.ProductList?.map(toAntOption)}
          />
        </Form.Item>
      </Vertical>
      <Vertical flex={0} style={{ minWidth: '20px', maxWidth: '20px' }}>
        <ActionMenu detail={managedDetail} openTab={openTab} newTab={newTab} deleteDetail={deleteDetail} hideViewEdit />
      </Vertical>
    </Horizontal>
  )
}
