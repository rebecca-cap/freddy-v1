import { ThunderboltOutlined } from '@ant-design/icons'
import { GraviButton, Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

import type {
  CompetitorMappingQuoteRow,
  CompetitorMappingsMetadata,
  FindMatchingCompetitorsRequest,
  SelectListItem,
} from '../../Api/types.schema'
import styles from '../../styles.module.css'

type Props = {
  canWrite: boolean
  selectedRows: CompetitorMappingQuoteRow[]
  metadata: CompetitorMappingsMetadata | undefined
  isFinding: boolean
  onFindMatching: (request: FindMatchingCompetitorsRequest) => void
}

type FormValues = {
  PricePublisherId?: number
  ProductHierarchyCvId?: number
  LocationHierarchyCvId?: number
  QuoteCompetitorCategoryId?: number
}

const toAntOptions = (items: SelectListItem[] | undefined) =>
  items?.map((i) => ({ label: i.Text, value: Number(i.Value) })) ?? []

const labelFor = (items: SelectListItem[] | undefined, value: number | undefined) =>
  items?.find((i) => Number(i.Value) === value)?.Text ?? ''

type SectionProps = {
  label: string
  description: string
  name: keyof FormValues
  placeholder: string
  options: { label: string | null | undefined; value: number }[]
  disabled: boolean
}

function Section({ label, description, name, placeholder, options, disabled }: SectionProps) {
  return (
    <div className={styles.configSection}>
      <div className={styles.configLabel}>{label}</div>
      <div className={styles.configDesc}>{description}</div>
      <Form.Item name={name} rules={[{ required: true, message: `${label} is required` }]} style={{ marginBottom: 0 }}>
        <Select
          placeholder={placeholder}
          options={options}
          disabled={disabled}
          showSearch
          optionFilterProp='label'
          style={{ width: '100%' }}
        />
      </Form.Item>
    </div>
  )
}

export function MatchingForm({ canWrite, selectedRows, metadata, isFinding, onFindMatching }: Props) {
  const [form] = Form.useForm<FormValues>()

  // PE-5456: Rank Category dropdown is only rendered when the tenant has seeded
  // QuoteCompetitorCategory rows. Per spec line 619 ("No Default Category Seed"),
  // categories are tenant-seeded, so they may legitimately be empty. The BE's
  // FindMatchingCompetitorsRequest already treats QuoteCompetitorCategoryId as
  // nullable (int?), so submitting without one is safe — every match is tagged
  // null and the bulk-create path persists null per spec line 269.
  const hasRankCategories = (metadata?.QuoteCompetitorCategoryList?.length ?? 0) > 0

  const onFinish = (values: FormValues) => {
    if (
      values.PricePublisherId == null ||
      values.ProductHierarchyCvId == null ||
      values.LocationHierarchyCvId == null ||
      (hasRankCategories && values.QuoteCompetitorCategoryId == null)
    )
      return
    onFindMatching({
      QuoteConfigurationMappingIds: selectedRows
        .map((r) => r.QuoteConfigurationMappingId)
        .filter((id): id is number => id != null),
      PricePublisherId: values.PricePublisherId,
      ProductHierarchyCvId: values.ProductHierarchyCvId,
      LocationHierarchyCvId: values.LocationHierarchyCvId,
      QuoteCompetitorCategoryId: hasRankCategories ? values.QuoteCompetitorCategoryId : undefined,
    })
  }

  return (
    <Form form={form} layout='vertical' onFinish={onFinish} requiredMark={false}>
      <Section
        label='Price Publisher'
        description='Select the competitor pricing source.'
        name='PricePublisherId'
        placeholder='Select a price publisher...'
        options={toAntOptions(metadata?.PricePublisherList)}
        disabled={!canWrite}
      />
      <Section
        label='Product Hierarchy'
        description='Choose which product hierarchy to use for matching.'
        name='ProductHierarchyCvId'
        placeholder='Select product hierarchy...'
        options={toAntOptions(metadata?.ProductHierarchyList)}
        disabled={!canWrite}
      />
      <Section
        label='Location Hierarchy'
        description='Choose which location hierarchy to use for matching.'
        name='LocationHierarchyCvId'
        placeholder='Select location hierarchy...'
        options={toAntOptions(metadata?.LocationHierarchyList)}
        disabled={!canWrite}
      />
      {hasRankCategories && (
        <Section
          label='Rank Category'
          description='Tags the created mappings. Does not filter which competitors are returned — every match is tagged with this category.'
          name='QuoteCompetitorCategoryId'
          placeholder='Select rank category...'
          options={toAntOptions(metadata?.QuoteCompetitorCategoryList)}
          disabled={!canWrite}
        />
      )}
      <div className={styles.configSection}>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const values = form.getFieldsValue()
            const enabled =
              canWrite &&
              !!values.PricePublisherId &&
              !!values.ProductHierarchyCvId &&
              !!values.LocationHierarchyCvId &&
              (!hasRankCategories || !!values.QuoteCompetitorCategoryId) &&
              selectedRows.length > 0
            const publisherLabel = labelFor(metadata?.PricePublisherList, values.PricePublisherId)
            const productHierarchyLabel = labelFor(metadata?.ProductHierarchyList, values.ProductHierarchyCvId)
            const locationHierarchyLabel = labelFor(metadata?.LocationHierarchyList, values.LocationHierarchyCvId)
            const rankCategoryLabel = labelFor(metadata?.QuoteCompetitorCategoryList, values.QuoteCompetitorCategoryId)
            return (
              <>
                <GraviButton
                  className='gravi-button-success'
                  htmlType='submit'
                  buttonText='Find Matching Competitors'
                  icon={<ThunderboltOutlined />}
                  disabled={!enabled}
                  loading={isFinding}
                  style={{ width: '100%', justifyContent: 'center' }}
                />
                <Texto appearance='medium' className={styles.findHelperText}>
                  {enabled ? (
                    <>
                      Searches for price instruments within <strong>{publisherLabel}</strong> matching by{' '}
                      <strong>{productHierarchyLabel}</strong> and <strong>{locationHierarchyLabel}</strong>
                      {hasRankCategories ? (
                        <>
                          . Results will be tagged <strong>{rankCategoryLabel}</strong>.
                        </>
                      ) : (
                        '.'
                      )}
                    </>
                  ) : (
                    'Select all options above to search for matching competitors.'
                  )}
                </Texto>
              </>
            )
          }}
        </Form.Item>
      </div>
    </Form>
  )
}
