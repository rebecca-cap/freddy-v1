import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  IntradayCompetitorMovementWidgetSettings,
  MarginSummaryWidgetSettings,
  StrategyMissWidgetSettings,
  VolumePaceWidgetSettings,
  WidgetGridSettings,
} from '@modules/CommandCenter/api/pageViewTypes.schema'
import { Metadata, WidgetTitle } from '@modules/CommandCenter/api/types.schema'
import { Drawer, Form, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import { setupInitialIntradayMovementValues } from '../intradayUtil'
import { setupInitialMarginSummaryValues } from '../marginSummaryUtil'
import { setupInitialStrategyMissValues } from '../strategyMissUtil'
import { setupInitialVolumePaceValues } from '../volumePaceUtil'
import { CheckboxFilter } from './components/CheckboxFilter'
import { IntradayCompetitorMovementThresholds } from './components/IntradayCompetitorMovementThresholds'
import { MarginSummaryThresholds } from './components/MarginSummaryThresholds'
import { StrategyDeltaThresholds } from './components/StrategyDeltaThresholds'
import { VolumePaceThresholdTabs } from './components/VolumePaceThresholdTabs'

interface GridSettingsDrawerProps {
  title: WidgetTitle
  isDrawerOpen: boolean
  closeDrawer: () => void
  updateWidgetSettings: (title: WidgetTitle, settings: WidgetGridSettings) => void
  storageKey: string
  metadata?: Metadata
}

export function GridSettingsDrawer({
  title,
  isDrawerOpen,
  closeDrawer,
  updateWidgetSettings,
  storageKey,
  metadata,
}: GridSettingsDrawerProps) {
  const [form] = Form.useForm()
  const [checkedLocationIds, setCheckedLocationIds] = useState<string[]>([])
  const [checkedProductIds, setCheckedProductIds] = useState<string[]>([])
  const [checkedQuoteConfigurationIds, setCheckedQuoteConfigurationIds] = useState<string[]>([])

  function closeDrawerAndClearSelections() {
    setCheckedLocationIds([])
    setCheckedProductIds([])
    setCheckedQuoteConfigurationIds([])
    form.resetFields()
    closeDrawer()
  }
  const onFinish = (values: any) => {
    values.LocationIds = checkedLocationIds
    values.ProductIds = checkedProductIds
    values.QuoteConfigurationIds = checkedQuoteConfigurationIds
    updateWidgetSettings(title, values)
    closeDrawerAndClearSelections()
  }

  const getInitialValues = () => {
    const gridSettings = window.localStorage.getItem(`gridSettings::${storageKey}`)
    const settings = JSON.parse(gridSettings || '{}')

    if (settings && settings.filters) {
      setCheckedLocationIds(settings.filters.LocationIds)
      setCheckedProductIds(settings.filters.ProductIds)
      setCheckedQuoteConfigurationIds(settings.filters.QuoteConfigurationIds)

      if (title === 'Volume Pace') {
        return setupInitialVolumePaceValues(settings as VolumePaceWidgetSettings)
      }
      if (title === 'Intraday Competitor Movement') {
        return setupInitialIntradayMovementValues(settings as IntradayCompetitorMovementWidgetSettings)
      }
      if (title === 'Strategy Delta Report') {
        return setupInitialStrategyMissValues(settings as StrategyMissWidgetSettings)
      }
      if (title === 'Margin Summary') {
        return setupInitialMarginSummaryValues(settings as MarginSummaryWidgetSettings)
      }
    }
    return { DateRange: 'OneDay', LocationIds: [], ProductIds: [], QuoteConfigurations: [] } as any
  }

  const timeFilterOptions = useMemo(() => {
    if (title === 'Volume Pace' || title === 'Intraday Competitor Movement') {
      return [{ label: 'Current Period', value: 'OneDay' }]
    }
    return [
      { label: 'Latest Price', value: 'LatestPrice' },
      { label: 'Last 24 Hours', value: 'OneDay' },
      { label: 'Last 7 Days', value: 'SevenDays' },
      { label: 'Last 30 Days', value: 'ThirtyDays' },
    ]
  }, [title])

  useEffect(() => {
    if (isDrawerOpen) {
      form.setFieldsValue(getInitialValues())
    }
  }, [isDrawerOpen, form])
  return (
    <Drawer
      title={title ? `Configure ${title}` : 'Settings'}
      visible={isDrawerOpen}
      onClose={closeDrawer}
      width={400}
      footer={
        <Horizontal justifyContent='space-between' className='w-full'>
          <GraviButton onClick={closeDrawerAndClearSelections} buttonText='Cancel' />
          <GraviButton type='primary' onClick={() => form.submit()} buttonText='Apply Changes' />
        </Horizontal>
      }
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Vertical>
          <Texto category='h6' className='mb-2' textTransform='uppercase'>
            Filters
          </Texto>

          <Texto category='h6' className='mb-2'>
            Time Range
          </Texto>
          <Form.Item name='DateRange'>
            <Select options={timeFilterOptions} disabled={timeFilterOptions?.length === 1} />
          </Form.Item>

          {title === 'Volume Pace' && (
            <Texto appearance='medium' className='mt-2'>
              Volume pace tracks current period performance only.
            </Texto>
          )}

          <CheckboxFilter
            sectionTitle={'Locations'}
            formItemName='LocationIds'
            checkedKeys={checkedLocationIds}
            setCheckedKeys={setCheckedLocationIds}
            options={metadata?.LocationTree}
          />

          <CheckboxFilter
            sectionTitle={'Products'}
            formItemName='ProductIds'
            checkedKeys={checkedProductIds}
            setCheckedKeys={setCheckedProductIds}
            options={metadata?.ProductTree}
          />

          <CheckboxFilter
            sectionTitle={'Quote Configurations'}
            formItemName='QuoteConfigurationIds'
            checkedKeys={checkedQuoteConfigurationIds}
            setCheckedKeys={setCheckedQuoteConfigurationIds}
            options={metadata?.QuoteConfigurations}
          />
          {title === 'Volume Pace' && <VolumePaceThresholdTabs />}
          {title === 'Intraday Competitor Movement' && <IntradayCompetitorMovementThresholds />}
          {title === 'Strategy Delta Report' && <StrategyDeltaThresholds />}
          {title === 'Margin Summary' && <MarginSummaryThresholds />}
        </Vertical>
      </Form>
    </Drawer>
  )
}
