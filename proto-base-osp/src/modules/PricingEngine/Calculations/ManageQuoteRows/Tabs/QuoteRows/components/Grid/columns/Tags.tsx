import { BulkMultiSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'
import { stopCloseOnEnter, suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { ManyTag } from '@gravitate-js/excalibrr'
import type { components } from '@hooks/useTypedApi'
import type { useQuoteRowTags } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/useQuoteRowTags'
import React from 'react'

const UNTAGGED_FILTER_KEY = '(Untagged)'

export type TagDefinition = components['schemas']['CoreModel.DtoClasses.QuoteRowTagDDTO']

export type TagsColumnArgs = {
  canWrite: boolean
  tagDefinitions: TagDefinition[]
  applyAssignmentsMutation: ReturnType<typeof useQuoteRowTags>['applyAssignmentsMutation']
  createAndAssignMutation: ReturnType<typeof useQuoteRowTags>['createAndAssignMutation']
}

export const Tags = ({
  canWrite,
  tagDefinitions,
  applyAssignmentsMutation,
  createAndAssignMutation,
}: TagsColumnArgs) => {
  const populatedTags = tagDefinitions.filter(
    (t): t is { QuoteRowTagId: number; TagName: string } => t.QuoteRowTagId != null && t.TagName != null
  )
  const tagsById = new Map(populatedTags.map((t) => [t.QuoteRowTagId, t]))
  const tagOptions = populatedTags.map((t) => ({ value: t.QuoteRowTagId, label: t.TagName }))
  const tagIdValues = populatedTags.map((t) => t.QuoteRowTagId)

  const getTagName = (id: number) => tagsById.get(id)?.TagName ?? ''

  return {
    field: 'AssignedQuoteRowTagIds',
    headerName: 'Tags',
    minWidth: 220,
    editable: canWrite,
    autoHeight: true,
    cellEditor: 'SearchableSelect',
    cellEditorPopup: true,
    suppressKeyboardEvent,
    cellEditorParams: (params) => ({
      mode: 'multiple',
      placeholder: 'Select tags',
      onKeyDown: stopCloseOnEnter,
      options: tagOptions,
      showSearch: true,
      allowClear: true,
      enableSelectAllFromSearch: true,
      inlineCreate: canWrite
        ? {
            placeholder: 'New tag name…',
            buttonLabel: 'Create',
            onCreate: async (name: string) => {
              const mappingId = params.data?.QuoteConfigurationMappingId
              if (mappingId == null) return undefined
              const result = await createAndAssignMutation.mutateAsync({
                QuoteConfigurationMappingId: mappingId,
                TagName: name,
              })
              const newTag = result?.Data
              if (!newTag?.QuoteRowTagId || !newTag.TagName) return undefined
              return { value: newTag.QuoteRowTagId, label: newTag.TagName }
            },
          }
        : undefined,
    }),
    isBulkEditable: canWrite,
    bulkCellEditor: BulkMultiSelectEditor,
    bulkCellEditorParams: {
      propKey: 'AssignedQuoteRowTagIds',
      defaultMode: 'increment',
      options: tagOptions,
    },
    valueGetter: ({ data }) => data?.AssignedQuoteRowTagIds ?? [],
    valueSetter: (params) => {
      const next: number[] = Array.isArray(params.newValue) ? params.newValue.map(Number) : []
      const prev: number[] = params.data?.AssignedQuoteRowTagIds ?? []
      if (next.length === prev.length && next.every((id) => prev.includes(id))) return false

      params.data.AssignedQuoteRowTagIds = next
      applyAssignmentsMutation.mutate({
        Rows: [
          {
            QuoteConfigurationMappingId: params.data.QuoteConfigurationMappingId,
            QuoteRowTagIds: next,
          },
        ],
      })
      return true
    },
    cellRenderer: ({ value }: { value: number[] }) => {
      if (!Array.isArray(value) || value.length === 0) return null
      const tagItems = value
        .map(getTagName)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))
      return <ManyTag tagItems={tagItems} maxCount={3} />
    },
    comparator: (valueA: number[], valueB: number[], _nodeA, _nodeB, isInverted) => {
      const projectForSort = (arr: number[] | undefined) => {
        if (!arr || arr.length === 0) return ''
        if (arr.length > 1) return 'multiple'
        return getTagName(arr[0]).toLowerCase()
      }

      const a = projectForSort(valueA)
      const b = projectForSort(valueB)

      if (a === '' && b === '') return 0
      if (a === '') return isInverted ? -1 : 1
      if (b === '') return isInverted ? 1 : -1
      return a.localeCompare(b)
    },
    filter: 'agSetColumnFilter',
    filterValueGetter: (params) => {
      const ids: number[] = params.data?.AssignedQuoteRowTagIds ?? []
      return ids.length === 0 ? [UNTAGGED_FILTER_KEY] : ids
    },
    filterParams: {
      values: [UNTAGGED_FILTER_KEY, ...tagIdValues],
      valueFormatter: (params: { value: number | string }) => {
        if (params.value === UNTAGGED_FILTER_KEY) return UNTAGGED_FILTER_KEY
        return getTagName(Number(params.value))
      },
    },
  }
}
