import { NotificationMessage } from '@gravitate-js/excalibrr'
import { Form, Modal, Select } from 'antd'
import React, { useMemo } from 'react'

import { useCompetitorMappingsTyped } from '../../Api/useCompetitorMappingsTyped'
import type {
  CompetitorAssociation,
  CompetitorMappingQuoteRow,
  CompetitorMappingsMetadata,
} from '../../Api/types.schema'

type Props = {
  open: boolean
  onClose: () => void
  quoteRow: CompetitorMappingQuoteRow
  metadata: CompetitorMappingsMetadata | undefined
  existingAssociations: CompetitorAssociation[] | undefined
}

type FormValues = {
  PricePublisherId?: number
  PriceInstrumentId?: number
  QuoteCompetitorCategoryId?: number
}

export function AddCompetitorModal({ open, onClose, quoteRow, metadata, existingAssociations }: Props) {
  const [form] = Form.useForm<FormValues>()
  const { useAddSingleAssociationMutation } = useCompetitorMappingsTyped()
  const addAssociation = useAddSingleAssociationMutation()

  const selectedPublisherId = Form.useWatch('PricePublisherId', form)
  const hasRankCategories = (metadata?.QuoteCompetitorCategoryList?.length ?? 0) > 0

  const mappedInstrumentIds = useMemo(
    () =>
      new Set(
        (existingAssociations ?? [])
          .map((a) => a.PriceInstrumentId)
          .filter((id): id is number => id != null)
      ),
    [existingAssociations]
  )

  const publisherOptions =
    metadata?.PricePublisherList?.map((p) => ({ label: p.Text, value: Number(p.Value) })) ?? []

  const instrumentOptions =
    selectedPublisherId != null
      ? (metadata?.PublisherPriceInstruments?.[selectedPublisherId] ?? []).map((i) => {
          const value = Number(i.Value)
          const isAlreadyMapped = mappedInstrumentIds.has(value)
          return {
            label: isAlreadyMapped ? `${i.Text} (already mapped)` : i.Text,
            value,
            disabled: isAlreadyMapped,
          }
        })
      : []

  const rankCategoryOptions =
    metadata?.QuoteCompetitorCategoryList?.map((c) => ({ label: c.Text, value: Number(c.Value) })) ?? []

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  const onFinish = async (values: FormValues) => {
    if (values.PriceInstrumentId == null) return
    if (hasRankCategories && values.QuoteCompetitorCategoryId == null) return
    if (quoteRow.QuoteConfigurationMappingId == null) return
    if (mappedInstrumentIds.has(values.PriceInstrumentId)) {
      NotificationMessage(
        'Already Mapped',
        'This competitor is already mapped to this row.',
        true
      )
      return
    }
    try {
      await addAssociation.mutateAsync({
        QuoteConfigurationMappingId: quoteRow.QuoteConfigurationMappingId,
        PriceInstrumentId: values.PriceInstrumentId,
        QuoteCompetitorCategoryId: hasRankCategories ? (values.QuoteCompetitorCategoryId ?? null) : null,
        IsHiddenByDefault: false,
      })
      handleClose()
    } catch {
      // Error toast surfaced by mutation's onError; modal stays open so user can retry.
    }
  }

  const contextLine = [
    quoteRow.SelectedCounterPartyName,
    quoteRow.LocationName,
    quoteRow.ProductName,
  ]
    .filter(Boolean)
    .join(' | ')

  return (
    <Modal
      title={
        <div>
          <div>Add Competitor</div>
          {contextLine && (
            <div style={{ fontSize: 12, fontWeight: 400, color: 'var(--theme-text-secondary, #666)', marginTop: 2 }}>
              {contextLine}
            </div>
          )}
        </div>
      }
      open={open}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okText='Add'
      width={720}
      confirmLoading={addAssociation.isPending}
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Form.Item
          label='Publisher'
          name='PricePublisherId'
          rules={[{ required: true, message: 'Publisher is required' }]}
        >
          <Select
            placeholder='Select publisher'
            options={publisherOptions}
            showSearch
            optionFilterProp='label'
            onChange={() => form.setFieldsValue({ PriceInstrumentId: undefined })}
          />
        </Form.Item>

        <Form.Item
          label='Price Instrument'
          name='PriceInstrumentId'
          rules={[{ required: true, message: 'Price Instrument is required' }]}
        >
          <Select
            placeholder={selectedPublisherId == null ? 'Select a publisher first' : 'Select price instrument'}
            options={instrumentOptions}
            disabled={selectedPublisherId == null}
            showSearch
            optionFilterProp='label'
          />
        </Form.Item>

        {hasRankCategories && (
          <Form.Item
            label='Rank Category'
            name='QuoteCompetitorCategoryId'
            rules={[{ required: true, message: 'Rank Category is required' }]}
          >
            <Select
              placeholder='Select rank category'
              options={rankCategoryOptions}
              showSearch
              optionFilterProp='label'
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}
