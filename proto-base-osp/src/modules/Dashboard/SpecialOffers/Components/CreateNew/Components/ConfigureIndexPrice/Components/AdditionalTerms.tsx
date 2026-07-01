import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { SpecialOfferMetadataResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { SectionTitle } from '@modules/FormulaTemplates/Util/formHelpers'
import { toGroupedAntOptions } from '@utils/index'
import { Form, Input, Select } from 'antd'
import { useMemo } from 'react'

const toStringOption = (str: string) => ({ label: str, value: str })

interface AdditionalTermsProps {
  metadata: SpecialOfferMetadataResponseData | undefined
}

export function AdditionalTerms({ metadata }: AdditionalTermsProps) {
  const effectiveTimeOptions = useMemo(
    () =>
      toGroupedAntOptions({
        items: metadata?.IndexOfferMetaData?.EffectiveTimes,
        groupKey: 'Quick Selections',
        remainderLabel: 'All Times',
      }),
    [metadata?.IndexOfferMetaData?.EffectiveTimes]
  )

  const weekendRuleOptions = useMemo(
    () => metadata?.IndexOfferMetaData?.WeekendRuleOptions?.map(toStringOption) ?? [],
    [metadata?.IndexOfferMetaData?.WeekendRuleOptions]
  )

  const holidayRuleOptions = useMemo(
    () => metadata?.IndexOfferMetaData?.HolidayRuleOptions?.map(toStringOption) ?? [],
    [metadata?.IndexOfferMetaData?.HolidayRuleOptions]
  )

  return (
    <Vertical>
      <SectionTitle title={'Additional Terms'} />
      <Horizontal gap={16}>
        <Vertical flex={1}>
          <Form.Item
            rules={[{ required: true, message: 'Effective Time is required' }]}
            name='PricingEffectiveTimes'
            label='Effective Time'
            style={{ width: '100%' }}
          >
            <Select
              allowClear
              options={effectiveTimeOptions}
              showArrow
              showSearch
              optionFilterProp='label'
              filterOption={(input, option) =>
                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Vertical>
        <Vertical flex={1}>
          <Form.Item
            rules={[{ required: true, message: 'Weekend Rule is required' }]}
            name='PricingWeekendBehavior'
            label='Weekend Rule'
            style={{ width: '100%' }}
          >
            <Select
              allowClear
              options={weekendRuleOptions}
              showArrow
              showSearch
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Vertical>
        <Vertical flex={1}>
          <Form.Item
            rules={[{ required: true, message: 'Holiday Rule is required' }]}
            name='PricingHolidayBehavior'
            label='Holiday Rule'
            style={{ width: '100%' }}
          >
            <Select
              allowClear
              options={holidayRuleOptions}
              showArrow
              showSearch
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Vertical>
      </Horizontal>
      <Vertical className={'mt-4'}>
        <Form.Item name='AdditionalFreetextTerms' label='Terms' initialValue=''>
          <Input.TextArea rows={4} style={{ width: '100%' }} showCount maxLength={1000} />
        </Form.Item>
      </Vertical>
    </Vertical>
  )
}
