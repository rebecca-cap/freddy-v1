import { BarChartOutlined, DeleteFilled, FileOutlined, FunctionOutlined, LinkOutlined } from '@ant-design/icons'
import { ColumnFilterWithTooltip } from '@components/shared/Grid/ColumnFilterWithTooltip'
import { stopCloseOnEnter, suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { TrueFalseBulkEditableColumn } from '@components/shared/Grid/defaultColumnDefs/TrueFalseBulkEditableColumn'
import { BBDTag, GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import type {
  QuoteConfigurationMappingUpsertPayload,
  QuoteConfigurationMappingUpsertResponse,
  QuoteMappingMetadata,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/types.schema'
import type { useQuoteRowTags } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/useQuoteRowTags'
import type { SelectListItem } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/CompetitorMappings/Api/types.schema'
import { Tags, type TagDefinition } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/columns/Tags'
import { BulkSelectEditor } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/cellEditors/BulkSelectCellEditor'
import { BulkStatusEditor } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/cellEditors/BulkStatusEditor'
import { CostLinkEditor } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/cellEditors/CostLinkPopover'
import { CostTypeEditor } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/cellEditors/CostTypeEditor'
import { RankCategory } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/shared/rankCategoryColumn'
import { NetGrossDefaultRenderer } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/cellRenderers/NetGross'
import {
  getCostLinkDisplay,
  setCostLink,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/columns/util'
import type { UseMutationResult } from '@tanstack/react-query'
import { hiddenColumn } from '@utils/grid'
import { isDefined, toAntOption, toGroupedAntOptions } from '@utils/index'
import type { ColDef } from 'ag-grid-community'
import { Button, Popconfirm, Switch } from 'antd'
import React, { type MutableRefObject } from 'react'

const isMarketMoveEnabled = (
  cvId: number | null | undefined,
  modes: { Text: string; Value: string | number }[] | undefined
) => {
  if (!cvId || !modes) return false
  const disabledOption = modes.find((m) => m.Text === 'Disabled')
  return disabledOption ? String(cvId) !== String(disabledOption.Value) : true
}

const effectiveBool = (mappingValue: boolean | null | undefined, parentValue: boolean | undefined) =>
  mappingValue ?? parentValue ?? false

type MappingMutationRef = MutableRefObject<
  UseMutationResult<QuoteConfigurationMappingUpsertResponse, unknown, QuoteConfigurationMappingUpsertPayload, unknown>
>

// Depending on the selected configuration, some of the counterparty columns may or may not be visible.
// Also, we'll disable row deletion if the selected configuration has generated mappings = true
export const createColumnDefs = ({
  metadata,
  mutationRef,
  canWrite,
  rankCategoryList,
  onUpdateRankCategories,
  tagDefinitions,
  applyAssignmentsMutation,
  createAndAssignMutation,
}: {
  metadata?: QuoteMappingMetadata
  mutationRef: MappingMutationRef
  canWrite: boolean
  rankCategoryList?: SelectListItem[]
  onUpdateRankCategories?: (mappingId: number, categoryIds: number[]) => void
  tagDefinitions: TagDefinition[]
  applyAssignmentsMutation: ReturnType<typeof useQuoteRowTags>['applyAssignmentsMutation']
  createAndAssignMutation: ReturnType<typeof useQuoteRowTags>['createAndAssignMutation']
}): ColDef[] => {
  // Drop the Rank Category column when the tenant has not seeded any
  // QuoteCompetitorCategory rows. Mirrors ConfigurePanel/MatchingForm.tsx.
  const hasRankCategories = (rankCategoryList?.length ?? 0) > 0

  return [
    Id(),
    Active(canWrite, mutationRef),
    Configuration(),
    Counterparty(),
    Region(),
    Area(),
    Terminal(),
    NetGross(metadata),
    Commodity(),
    ProductGroup(),
    Grade(),
    ProductName(),
    ...(hasRankCategories ? [RankCategory(canWrite, rankCategoryList, onUpdateRankCategories)] : []),
    CostType(metadata),
    CostLink(metadata),
    ContractId(),
    Carrier(),
    ExternalCounterparty(),
    InternalCounterparty(),
    AutoPublishEstimates(),
    AdjustmentsArePricePeriodSpecific(),
    UseStartOfDayPriceInEodCurrentAnalytics(),
    ProductOverride(metadata),
    TargetUOM(metadata),
    PriceEffective(metadata),
    Group(metadata),
    Strategy(metadata, canWrite),
    ReferenceStrategy(metadata, canWrite),
    AutoPublishType(metadata),
    MarketMoveMarker(metadata),
    UsesFreight(),
    FreightMarker(metadata),
    UsesTax(),
    TaxMarker(metadata),
    ExcludeFreightAndTaxFromMargin(),
    MarketMoveMode(metadata),
    TermsDiscount(),
    PublishedPriceIncludesTermsDiscount(),
    Tags({ canWrite, tagDefinitions, applyAssignmentsMutation, createAndAssignMutation }),
    ...Actions(canWrite, mutationRef),
  ]
}

const Id = () => hiddenColumn({ title: 'Id', field: 'QuoteConfigurationMappingId' })
const Active = (canWrite: boolean, mutationRef: MappingMutationRef) => ({
  isBulkEditable: true,
  bulkCellEditor: BulkStatusEditor,
  field: 'StatusCvId',
  headerName: 'Active',
  minWidth: 140,
  maxWidth: 140,
  editable: false,
  filterValueGetter: (params) => (params.data?.StatusCvId == 100 ? 'Enabled' : 'Disabled'),
  valueFormatter: (params) => (params.value == 100 ? 'Enabled' : params.value == 101 ? 'Disabled' : params.value),
  cellRenderer: (params) => {
    return (
      <Switch
        onClick={(_, e) => e.stopPropagation()}
        disabled={!canWrite}
        style={{ width: 100 }}
        checkedChildren='Enabled'
        unCheckedChildren='Disabled'
        checked={params?.data?.StatusCvId == 100}
        onChange={async (checked) => {
          await mutationRef.current.mutate({
            rowOrRows: { ...params?.data, StatusCvId: checked ? 100 : 101 },
          })
        }}
      />
    )
  },
})
const Configuration = () => ({
  hide: true,
  rowGroup: true,
  maxWidth: 160,
  field: 'QuoteConfigurationName',
  headerName: 'Configuration',
})
const Counterparty = () => ({
  valueGetter: (props) => {
    const row = props?.data
    if (!row) return ''
    return (
      row.SupplierCounterPartyName ??
      row.CarrierCounterPartyName ??
      row.ExternalCounterPartyName ??
      row.InternalCounterPartyName
    )
  },
  headerName: 'Counterparty',
  editable: false,
  colId: 'Counterparty',
})

const Region = () => hiddenColumn({ title: 'Region' })
const Area = () => hiddenColumn({ title: 'Area' })
const Terminal = () => ({
  field: 'LocationName',
  headerName: 'Terminal',
  editable: false,
})
const NetGross = (metadata: QuoteMappingMetadata | undefined) => ({
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'NetOrGrossCvId',
    placeholder: 'Select Net/Gross',
    options: metadata?.Data?.NetOrGrossTypeCodeValues?.map(toAntOption) ?? [],
  },
  field: 'NetOrGrossCvId',
  headerName: 'Net/Gross',
  cellEditor: 'SearchableSelect',
  suppressKeyboardEvent,
  cellEditorPopup: true,
  cellEditorParams: (params) => ({
    matchOptionId: params?.data?.DefaultNetOrGrossCvId?.toString(),
    showSelectedValue: true,
    showSearch: true,
    onKeyDown: stopCloseOnEnter,
    options: metadata?.Data?.NetOrGrossTypeCodeValues?.map(toAntOption) ?? [],
  }),
  cellStyle: (params) => {
    const backgroundColor =
      params?.data.NetOrGrossCvId &&
      params?.data?.DefaultNetOrGrossCvId &&
      params?.data?.NetOrGrossCvId?.toString() !== params?.data?.DefaultNetOrGrossCvId?.toString()
        ? 'var(--theme-warning-dim)'
        : undefined
    if (backgroundColor)
      return {
        backgroundColor,
      }
  },
  cellRenderer: NetGrossDefaultRenderer,
  valueGetter: (props) => {
    return metadata?.Data?.NetOrGrossTypeCodeValues?.find((option) => option.Value == props?.data?.NetOrGrossCvId)?.Text
  },
})
const Commodity = () => hiddenColumn({ title: 'Commodity' })
const ProductGroup = () => hiddenColumn({ title: 'ProductGroup' })
const Grade = () => hiddenColumn({ title: 'Grade' })
const ProductName = () => ({
  field: 'ProductName',
  headerName: 'Product',
  editable: false,
})
const CostType = (metadata: QuoteMappingMetadata | undefined) => ({
  cellStyle: (params) =>
    params.data.QuoteConfigurationHasGeneratedMappings || params.data.HasValuationsOrPublications
      ? { cursor: 'not-allowed' }
      : { cursor: 'pointer' },
  editable: (params) => !params.data.QuoteConfigurationHasGeneratedMappings && !params.data.HasValuationsOrPublications,
  isBulkEditable: true,
  bulkCellEditor: CostTypeEditor,
  bulkCellEditorParams: {
    metadata,
  },
  minWidth: 240,
  field: 'CostSourceType',
  headerName: 'Cost Type',
  cellEditorPopup: true,
  cellEditor: 'SearchableSelect',
  suppressKeyboardEvent,
  valueGetter: (params) => {
    if (!params?.data?.CostSourceType) return 'No Cost'
    if (params.data?.CostSourceType === 'Marker') {
      const marker = metadata?.Data?.CostSourceTypes?.find((option) => option.Value == params?.data?.CostSourceMarkerId)
      return marker?.Text
    }
    return params?.data?.CostSourceType
  },
  valueSetter: (params) => {
    const newSource = params?.newValue?.toLowerCase()

    // If the source was changed to a marker, we'll propogate a row mutation.
    // (ag-grid expects us to return true if we want to trigger a cell update)
    if (!['contract', 'instrument'].includes(newSource)) {
      setCostLink({ costType: newSource, id: params?.newValue, params })
      return true
      // Otherwise we'll just silently update the cell value and clear out other cost link fields that may have been set
    }
    setCostLink({ costType: newSource, id: null, params })
    params.api.redrawRows({ rowNodes: [params.node] })
    return false
  },

  cellRenderer: (params) => {
    // return params.value

    if (params.value === 'No Cost') {
      return (
        <Horizontal>
          <BBDTag error>NO COST</BBDTag>{' '}
        </Horizontal>
      )
    }

    const types = metadata?.Data?.CostSourceTypes
    if (!types || !params.value) return null
    let option

    if (['contract', 'instrument'].includes(params.value?.toLowerCase())) {
      option = types.find((option) => option.Value == params?.data?.CostSourceType)
    } else {
      option = types.find((option) => option.Text == params?.value)
    }

    return (
      <Texto>
        {option?.IsMarker ? <FunctionOutlined className='mr-2' /> : null}
        {option?.Text}
      </Texto>
    )
  },
  cellEditorParams: (params) => ({
    onKeyDown: stopCloseOnEnter,
    options: metadata?.Data?.CostSourceTypes.map((option) => ({
      value: option.Value,
      label: option.Text,
      icon: (() => {
        if (option?.IsMarker) return <FunctionOutlined />
        if (option.Value === 'Contract') return <FileOutlined />
        if (option.Value === 'Instrument') return <BarChartOutlined />
        return null
      })(),
    })),
    showSearch: true,
  }),
})
const CostLink = (metadata: QuoteMappingMetadata | undefined) => ({
  cellStyle: (params) =>
    !params.data?.CostSourceType ||
    params.data.QuoteConfigurationHasGeneratedMappings ||
    params.data.HasValuationsOrPublications
      ? { cursor: 'not-allowed' }
      : { cursor: 'pointer' },
  editable: (params) =>
    !params.data.QuoteConfigurationHasGeneratedMappings &&
    !params.data.HasValuationsOrPublications &&
    !!params?.data?.CostSourceType &&
    params?.data?.CostSourceType !== 'Marker',
  minWidth: 300,
  field: 'InvisibleCostLinkField',
  headerName: 'Cost Link',
  filterParams: {
    valueGetter: (params) => {
      return getCostLinkDisplay({ costType: params?.data?.CostSourceType, params })
    },
  },
  cellRenderer: (params) => {
    const source = params?.data?.CostSourceType
    const hasCost = isDefined(source)
    const linkDisplay = getCostLinkDisplay({ costType: source, params })

    // return linkDisplay

    if (hasCost && linkDisplay) {
      return (
        <Button
          style={{ textAlign: 'left', ...(source !== 'Marker' && { textDecoration: 'underline' }) }}
          type='link'
          onClick={() => {
            if (linkDisplay === 'N/A') return
            params.api.startEditingCell({
              rowIndex: params.rowIndex,
              colKey: 'InvisibleCostLinkField',
            })
          }}
        >
          <Texto style={{ gap: '0.5rem' }} className='flex items-center'>
            {source !== 'Marker' && <LinkOutlined />}
            {linkDisplay}
          </Texto>
        </Button>
      )
    }

    if (hasCost && !linkDisplay) {
      if (!['contract', 'instrument'].includes(params?.data?.CostSourceType?.toLowerCase())) {
        return <Texto>N/A</Texto>
      }

      return (
        <Button
          style={{ textDecoration: 'underline', textAlign: 'left' }}
          type='link'
          onClick={() =>
            params.api.startEditingCell({
              rowIndex: params.rowIndex,
              colKey: 'InvisibleCostLinkField',
            })
          }
        >
          <LinkOutlined /> Add Link
        </Button>
      )
    }
  },
  cellEditor: CostLinkEditor,
  cellEditorPopup: true,
  cellEditorParams: {
    metadata,
  },
  valueSetter: (params) => {
    const newId = params?.newValue
    if (!newId) return false
    const currentSource = params?.data?.CostSourceType?.toLowerCase()
    setCostLink({ costType: currentSource, id: newId, params })
    return true
  },
})
const ContractId = () => hiddenColumn({ title: 'Contract ID', field: 'CostSourceTradeEntryId' })
const Carrier = () => hiddenColumn({ title: 'Carrier', field: 'CarrierCounterPartyName' })
const ExternalCounterparty = () => hiddenColumn({ title: 'External Counterparty', field: 'ExternalCounterPartyName' })
const InternalCounterparty = () => hiddenColumn({ title: 'Internal Counterparty', field: 'InternalCounterPartyName' })
const AutoPublishEstimates = () => TrueFalseBulkEditableColumn('AutoPublishEstimates', 'Auto Publish Estimates')
const AdjustmentsArePricePeriodSpecific = () =>
  TrueFalseBulkEditableColumn('AdjustmentsArePricePeriodSpecific', 'Period Specific Adjustments')
const UseStartOfDayPriceInEodCurrentAnalytics = () =>
  TrueFalseBulkEditableColumn(
    'UseStartOfDayPriceInEodCurrentAnalytics',
    'Use Start of Day Price in EOD Current Analytics',
    true
  )
const ProductOverride = (metadata: QuoteMappingMetadata | undefined) => ({
  field: 'AlternateValuationProductId',
  headerName: 'Product Override',
  cellEditor: 'SearchableSelect',
  suppressKeyboardEvent,
  hide: true,
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'AlternateValuationProductId',
    placeholder: 'Select Product',
    options: metadata?.Data?.Products?.map(toAntOption) ?? [],
  },
  cellEditorPopup: true,
  cellEditorParams: {
    showSearch: true,
    onKeyDown: stopCloseOnEnter,
    options: metadata?.Data?.Products?.map(toAntOption) ?? [],
  },
  valueGetter: (props) => {
    return metadata?.Data?.Products?.find((option) => option.Value == props?.data?.AlternateValuationProductId)?.Text
  },
})
const TargetUOM = (metadata: QuoteMappingMetadata | undefined) => ({
  field: 'TargetUnitOfMeasureId',
  headerName: 'Target UOM',
  hide: true,
  cellEditor: 'SearchableSelect',
  suppressKeyboardEvent,
  cellEditorPopup: true,
  cellEditorParams: {
    showSearch: true,
    onKeyDown: stopCloseOnEnter,
    options: metadata?.Data?.UnitOfMeasures?.map(toAntOption) ?? [],
  },
  valueGetter: (props) => {
    return metadata?.Data?.UnitOfMeasures?.find((option) => option.Value == props?.data?.TargetUnitOfMeasureId)?.Text
  },
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'TargetUnitOfMeasureId',
    placeholder: 'Select UOM',
    options: metadata?.Data?.UnitOfMeasures?.map(toAntOption) ?? [],
  },
})

const PriceEffective = (metadata: QuoteMappingMetadata | undefined) => ({
  field: 'PricePeriodStartOffset',
  headerName: 'Price Effective',
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    options: toGroupedAntOptions({
      items: metadata?.Data?.PricePeriodStartOffsets,
      groupKey: 'Quick Selections',
      remainderLabel: 'All Times',
    }),
    placeholder: 'Select Type',
    accessor: 'PricePeriodStartOffset',
  },
  cellEditor: 'SearchableSelect',
  cellEditorPopup: true,
  suppressKeyboardEvent,
  cellEditorParams: {
    options: toGroupedAntOptions({
      items: metadata?.Data?.PricePeriodStartOffsets,
      groupKey: 'Quick Selections',
      remainderLabel: 'All Times',
    }),
    showSearch: true,
  },
  valueGetter: (props) => {
    return metadata?.Data?.PricePeriodStartOffsets?.find(
      (option) => option.Value == props?.data?.PricePeriodStartOffset
    )?.Text
  },
})
const Group = (metadata: QuoteMappingMetadata | undefined) => ({
  field: 'QuoteConfigurationMappingGroupId',
  cellEditorPopup: true,
  headerName: 'Group',
  flex: 1,
  cellEditor: 'SearchableSelect',
  suppressKeyboardEvent,
  filterParams: {
    cellRenderer: ColumnFilterWithTooltip,
  },
  filterValueGetter: (params) => params.data?.QuoteConfigurationMappingGroup,
  comparator: (a, b) => {
    const aText = metadata?.Data?.QuoteGroups.find((option) => option.Value == a)?.Text
    const bText = metadata?.Data?.QuoteGroups.find((option) => option.Value == b)?.Text
    if (aText < bText) return -1
    if (aText > bText) return 1
    return 0
  },
  cellRenderer: (params) => {
    const group = params.data?.QuoteConfigurationMappingGroup
    if (!group) return null

    return (
      <Horizontal justifyContent='center'>
        <BBDTag>{group}</BBDTag>
      </Horizontal>
    )
  },
  cellEditorParams: {
    onKeyDown: stopCloseOnEnter,
    options: metadata?.Data?.QuoteGroups?.map(toAntOption) ?? [],
    showSearch: true,
  },
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    options: metadata?.Data?.QuoteGroups?.map(toAntOption) ?? [],
    accessor: 'QuoteConfigurationMappingGroupId',
    placeholder: 'Select Group',
    getChanges: (value: string | undefined) => ({
      QuoteConfigurationMappingGroupId: value,
      QuoteConfigurationMappingGroup: metadata.Data.QuoteGroups.find((g) => g.Value === value)?.Text,
    }),
  },
  valueSetter: ({ oldValue, newValue, data }) => {
    if (oldValue === newValue) return false
    data.QuoteConfigurationMappingGroupId = Number(newValue)
    data.QuoteConfigurationMappingGroup = metadata?.Data?.QuoteGroups.find((option) => option.Value == newValue)?.Text
    return true
  },
  valueGetter: ({ data }) => {
    const ret = metadata?.Data?.QuoteGroups.find(
      (option) => option.Value == data?.QuoteConfigurationMappingGroupId?.toString()
    )?.Value
    return ret
  },
})
const Strategy = (metadata: QuoteMappingMetadata | undefined, canWrite: boolean) => ({
  field: 'UnderlyingStrategyBenchmarkId',
  headerName: 'Strategy',
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'UnderlyingStrategyBenchmarkId',
    placeholder: 'Select Strategy',
    options: getStategyOptions(metadata, null),
    dedupeByValue: true,
    getChanges: (value) => {
      const newValues = JSON.parse(value)
      return {
        StrategyBaseTypeCvId: newValues.StrategyBaseTypeCvId,
        UnderlyingStrategyBenchmarkId: newValues.UnderlyingStrategyBenchmarkId,
      }
    },
  },
  editable: (params) => !params?.data?.SpreadParentMappingId && canWrite,
  valueGetter: (params) => {
    if (params.data?.SpreadParentMappingId) return 'Spread'
    const strategyBaseTypeDisplay = metadata?.Data?.StrategyBaseTypeCodeValues?.find(
      (option) => option.Value == params?.data?.StrategyBaseTypeCvId
    )?.Text
    const benchmarkDisplay = metadata?.Data?.Benchmarks?.find(
      (option) => option.Value == params?.data?.UnderlyingStrategyBenchmarkId
    )?.Text
    return benchmarkDisplay || strategyBaseTypeDisplay || 'Cost'
  },
  valueSetter: (params) => {
    const newValues = JSON.parse(params.newValue)
    params.data.StrategyBaseTypeCvId = newValues.StrategyBaseTypeCvId
    params.data.UnderlyingStrategyBenchmarkId = newValues.UnderlyingStrategyBenchmarkId
    return true
  },
  cellEditor: 'SearchableSelect',
  suppressKeyboardEvent,
  cellEditorPopup: true,
  cellEditorParams: (params) => {
    return {
      showSearch: true,
      onKeyDown: stopCloseOnEnter,
      options: getStategyOptions(metadata, params?.data?.QuoteConfigurationId),
    }
  },
})

const getStategyOptions = (metadata: QuoteMappingMetadata | undefined, quoteConfigurationId: number | null) => [
  ...(metadata?.Data?.StrategyBaseTypeCodeValues?.filter((item) => item.Text !== 'Benchmark')?.map((item) => ({
    value: `{"StrategyBaseTypeCvId":${item.Value}}`,
    label: item.Text,
  })) ?? []),
  ...(metadata?.Data?.Benchmarks?.filter((bo) => !quoteConfigurationId || bo.GroupingValue == quoteConfigurationId).map(
    (item) => ({
      value: `{"StrategyBaseTypeCvId":${
        metadata?.Data?.StrategyBaseTypeCodeValues?.find((x) => x.Text === 'Benchmark')?.Value
      }, "UnderlyingStrategyBenchmarkId":${item.Value}}`,
      label: item.Text,
    })
  ) ?? []),
]

const ReferenceStrategy = (metadata: QuoteMappingMetadata | undefined, canWrite: boolean) => ({
  field: 'ReferenceStrategyBenchmarkId',
  headerName: 'Reference Strategy',
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'ReferenceStrategyBenchmarkId',
    placeholder: 'Select Reference Strategy',
    options: metadata?.Data?.Benchmarks?.map(toAntOption) ?? [],
    dedupeByValue: true,
  },
  editable: (params) => !params?.data?.SpreadParentMappingId && canWrite,
  valueGetter: (params) => {
    if (params.data?.SpreadParentMappingId) return 'Spread'
    return (
      metadata?.Data?.Benchmarks?.find((option) => option.Value == params?.data?.ReferenceStrategyBenchmarkId)?.Text ||
      ' '
    )
  },
  cellEditor: 'SearchableSelect',
  suppressKeyboardEvent,
  cellEditorPopup: true,
  cellEditorParams: (params) => {
    return {
      showSearch: true,
      onKeyDown: stopCloseOnEnter,
      options: [
        ...(metadata?.Data?.Benchmarks?.filter((bo) => bo.GroupingValue == params?.data?.QuoteConfigurationId).map(
          toAntOption
        ) ?? []),
      ],
    }
  },
})

const AutoPublishType = (metadata: QuoteMappingMetadata | undefined) => ({
  field: 'AutomaticQuotePublicationTypeCvId',
  headerName: 'Auto Publish Type',
  cellEditor: SearchableSelect,
  cellEditorPopup: true,
  cellEditorParams: {
    showSearch: true,
    onkeydown: stopCloseOnEnter,
    options: metadata?.Data?.AutomaticQuotePublicationTypes?.map(toAntOption),
  },
  valueSetter: (params) => {
    const id = params.newValue
    const selected = metadata?.Data?.AutomaticQuotePublicationTypes?.find((c) => c.Value === id)
    if (!selected) return false
    params.data.AutomaticQuotePublicationTypeCvId = Number(selected.Value)
    params.data.AutomaticQuotePublicationTypeCodeValue = selected.Text
    return true
  },
  valueGetter: (props) => {
    return metadata?.Data?.AutomaticQuotePublicationTypes?.find(
      (option) => option.Value == props?.data?.AutomaticQuotePublicationTypeCvId
    )?.Text
  },
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    getChanges: (value: string | undefined) => ({
      AutomaticQuotePublicationTypeCvId: value,
      AutomaticQuotePublicationTypeCodeValue: metadata.Data.AutomaticQuotePublicationTypes.find(
        (g) => g.Value === value
      )?.Text,
    }),

    options: metadata?.Data?.AutomaticQuotePublicationTypes?.map(toAntOption) ?? [],
    accessor: 'AutomaticQuotePublicationTypeCvId',
    placeholder: 'Select Type',
  },
})

const MarketMoveMarker = (metadata: QuoteMappingMetadata | undefined) => ({
  field: 'MarketMoveMarkerId',
  headerName: 'Market Move Marker',
  editable: ({ data }) => isMarketMoveEnabled(data?.MarketMoveModeCvId, metadata?.Data?.MarketMoveModes),
  cellEditor: SearchableSelect,
  cellEditorPopup: true,
  cellEditorParams: {
    showSearch: true,
    onkeydown: stopCloseOnEnter,
    options: metadata?.Data?.Markers?.map(toAntOption),
  },
  valueSetter: (params) => {
    const id = params.newValue
    const selected = metadata?.Data?.Markers?.find((c) => c.Value === id)
    if (!selected) return false
    params.data.MarketMoveMarkerId = Number(selected.Value)
    params.data.MarketMoveMarker = selected.Text
    return true
  },
  valueGetter: (props) => {
    return metadata?.Data?.Markers?.find((option) => option.Value == props?.data?.MarketMoveMarkerId)?.Text
  },
  isBulkEditable: ({ data }) => isMarketMoveEnabled(data?.MarketMoveModeCvId, metadata?.Data?.MarketMoveModes),
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    getChanges: (value: string | undefined) => ({
      MarketMoveMarkerId: value,
      MarketMoveMarker: metadata?.Data?.Markers?.find((g) => g.Value === value)?.Text,
    }),

    options: metadata?.Data?.Markers?.map(toAntOption) ?? [],
    accessor: 'MarketMoveMarkerId',
    placeholder: 'Select Type',
  },
})

const UsesFreight = () => TrueFalseBulkEditableColumn('UsesFreight', 'Uses Freight', true)

const FreightMarker = (metadata: QuoteMappingMetadata | undefined) => ({
  field: 'FreightMarkerId',
  headerName: 'Freight Marker',
  editable: ({ data }) => effectiveBool(data?.UsesFreight, data?.QuoteConfigurationUsesFreight),
  cellEditor: SearchableSelect,
  cellEditorPopup: true,
  cellEditorParams: {
    showSearch: true,
    onkeydown: stopCloseOnEnter,
    options: metadata?.Data?.Markers?.map(toAntOption),
  },
  valueSetter: (params) => {
    const id = params.newValue
    const selected = metadata?.Data?.Markers?.find((c) => c.Value === id)
    if (!selected) return false
    params.data.FreightMarkerId = Number(selected.Value)
    params.data.FreightMarker = selected.Text
    return true
  },
  valueGetter: (props) => metadata?.Data?.Markers?.find((option) => option.Value == props?.data?.FreightMarkerId)?.Text,
  isBulkEditable: ({ data }) => effectiveBool(data?.UsesFreight, data?.QuoteConfigurationUsesFreight),
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    getChanges: (value: string | undefined) => ({
      FreightMarkerId: value,
      FreightMarker: metadata?.Data?.Markers?.find((g) => g.Value === value)?.Text,
    }),
    options: metadata?.Data?.Markers?.map(toAntOption) ?? [],
    accessor: 'FreightMarkerId',
    placeholder: 'Select Marker',
  },
})

const UsesTax = () => TrueFalseBulkEditableColumn('UsesTax', 'Uses Tax', true)

const TaxMarker = (metadata: QuoteMappingMetadata | undefined) => ({
  field: 'TaxMarkerId',
  headerName: 'Tax Marker',
  editable: ({ data }) => effectiveBool(data?.UsesTax, data?.QuoteConfigurationUsesTax),
  cellEditor: SearchableSelect,
  cellEditorPopup: true,
  cellEditorParams: {
    showSearch: true,
    onkeydown: stopCloseOnEnter,
    options: metadata?.Data?.Markers?.map(toAntOption),
  },
  valueSetter: (params) => {
    const id = params.newValue
    const selected = metadata?.Data?.Markers?.find((c) => c.Value === id)
    if (!selected) return false
    params.data.TaxMarkerId = Number(selected.Value)
    params.data.TaxMarker = selected.Text
    return true
  },
  valueGetter: (props) => metadata?.Data?.Markers?.find((option) => option.Value == props?.data?.TaxMarkerId)?.Text,
  isBulkEditable: ({ data }) => effectiveBool(data?.UsesTax, data?.QuoteConfigurationUsesTax),
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    getChanges: (value: string | undefined) => ({
      TaxMarkerId: value,
      TaxMarker: metadata?.Data?.Markers?.find((g) => g.Value === value)?.Text,
    }),
    options: metadata?.Data?.Markers?.map(toAntOption) ?? [],
    accessor: 'TaxMarkerId',
    placeholder: 'Select Marker',
  },
})

const ExcludeFreightAndTaxFromMargin = () =>
  TrueFalseBulkEditableColumn('ExcludeFreightAndTaxFromMargin', 'Exclude Freight & Tax From Margin', true)

const TermsDiscount = () => ({
  title: 'Terms Discount',
  field: 'TermsDiscount',
  editable: true,
  hide: true,
  cellEditor: 'agNumberCellEditor',
  cellEditorParams: {
    min: 0,
    max: 100,
    precision: 2,
  },
  valueFormatter: (params) => {
    if (params.value == null) return ''
    return `${fmt.decimal(params.value, 2)}%`
  },
  valueSetter: (params) => {
    const newValue = params.newValue
    if (newValue === '' || newValue == null) {
      params.data.TermsDiscount = null
      return true
    }

    const numValue = parseFloat(newValue)
    if (isNaN(numValue)) {
      return false
    }

    if (numValue < 0 || numValue > 100) {
      return false
    }

    params.data.TermsDiscount = numValue
    return true
  },
  maxWidth: 150,
})

const PublishedPriceIncludesTermsDiscount = () => ({
  ...TrueFalseBulkEditableColumn('PublishedPriceIncludesTermsDiscount', 'Published Price Includes Terms Discount'),
  title: 'Published Price Includes Terms Discount',
  hide: true,
})

const MarketMoveMode = (metadata: QuoteMappingMetadata | undefined) => ({
  field: 'MarketMoveModeCvId',
  headerName: 'Market Move Mode',
  cellEditor: 'SearchableSelect',
  suppressKeyboardEvent,
  cellEditorPopup: true,
  cellEditorParams: () => ({
    showSelectedValue: true,
    showSearch: true,
    onKeyDown: stopCloseOnEnter,
    options: metadata?.Data?.MarketMoveModes?.map(toAntOption) ?? [],
  }),
  valueGetter: (props) => {
    return metadata?.Data?.MarketMoveModes?.find((option) => option.Value == props?.data?.MarketMoveModeCvId)?.Text
  },
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'MarketMoveModeCvId',
    placeholder: 'Select Mode',
    options: metadata?.Data?.MarketMoveModes?.map(toAntOption) ?? [],
  },
})

const Actions = (canWrite: boolean, mutationRef: MappingMutationRef) => {
  if (canWrite) {
    return [
      {
        colId: 'actions',
        headerName: 'Actions',
        maxWidth: 160,
        filter: false,
        cellRenderer: (params) => {
          return (
            <Horizontal>
              <Popconfirm
                title='Are you sure you want to delete this quote?'
                onConfirm={() => mutationRef?.current?.mutate({ rowOrRows: { ...params?.data, IsActive: false } })}
                okText='Yes'
                cancelText='No'
              >
                <GraviButton appearance='text' color='danger' icon={<DeleteFilled />} aria-label='Delete' />
              </Popconfirm>
            </Horizontal>
          )
        },
      },
    ]
  }

  return []
}
