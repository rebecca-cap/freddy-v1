import { TagsOutlined, TeamOutlined } from '@ant-design/icons'
import { ManageGroupsTab } from '@components/shared/ManageGroupsTab/ManageGroupsTab'
import { TabbedManagementPanel } from '@components/shared/TabbedManagementPanel/TabbedManagementPanel'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import { useQuoteRowsTyped } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/useQuoteRowsTyped'
import { useQuoteRowTags } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/useQuoteRowTags'
import { type ReactNode, useCallback, useMemo } from 'react'

const panelStorageKey = 'manageQuoteRowsPanel'
const quoteGroupsTabKey = 'quoteGroups'
const tagsTabKey = 'tags'

interface ManageQuoteRowsPanelProps {
  leftPane: ReactNode
  isOpen: boolean
  onClose: () => void
  canWrite: boolean
}

export function ManageQuoteRowsPanel({ leftPane, isOpen, onClose, canWrite }: ManageQuoteRowsPanelProps) {
  const { useGroups, useMappings, upsertGroup } = useQuoteRowsTyped()
  const { useTagDefinitions, upsertMutation: upsertTagMutation, deleteMutation: deleteTagMutation } = useQuoteRowTags()
  const { data: groupsResponse } = useGroups()
  const { data: mappingsResponse } = useMappings()
  const { data: tagsResponse } = useTagDefinitions()
  const groupsData = groupsResponse?.Data
  const mappingsData = mappingsResponse?.Data
  const tagsData = tagsResponse?.Data

  const { value: activeTabKey, setValue: setActiveTabKey } = useLocalStorage(
    `${panelStorageKey}-active-tab`,
    quoteGroupsTabKey
  )

  const groups = useMemo(() => {
    const groupRows = groupsData ?? []
    const mappingRows = mappingsData ?? []
    const countByGroupId = new Map<number, number>()
    for (const row of mappingRows) {
      const groupId = row?.QuoteConfigurationMappingGroupId
      if (groupId == null) continue
      countByGroupId.set(groupId, (countByGroupId.get(groupId) ?? 0) + 1)
    }
    return groupRows
      .filter((g): g is { QuoteConfigurationMappingGroupId: number; GroupName: string; GroupDescription?: string } =>
        g.QuoteConfigurationMappingGroupId != null
      )
      .map((g) => ({
        id: g.QuoteConfigurationMappingGroupId,
        name: g.GroupName ?? '',
        assignmentCount: countByGroupId.get(g.QuoteConfigurationMappingGroupId) ?? 0,
      }))
  }, [groupsData, mappingsData])

  const handleUpsert = useCallback(
    async ({ id, name }: { id?: number; name: string }) => {
      const existing = id ? groupsData?.find((g) => g.QuoteConfigurationMappingGroupId === id) : undefined
      await upsertGroup.mutateAsync({
        QuoteConfigurationMappingGroupId: id ?? 0,
        GroupName: name,
        GroupDescription: existing?.GroupDescription ?? name,
      })
    },
    [groupsData, upsertGroup]
  )

  const tags = useMemo(() => {
    const tagRows = tagsData ?? []
    const mappingRows = mappingsData ?? []
    const countByTagId = new Map<number, number>()
    for (const row of mappingRows) {
      for (const tagId of row?.AssignedQuoteRowTagIds ?? []) {
        if (tagId == null) continue
        countByTagId.set(tagId, (countByTagId.get(tagId) ?? 0) + 1)
      }
    }
    return tagRows
      .filter((t): t is { QuoteRowTagId: number; TagName: string } => t.QuoteRowTagId != null && t.TagName != null)
      .map((t) => ({
        id: t.QuoteRowTagId,
        name: t.TagName,
        assignmentCount: countByTagId.get(t.QuoteRowTagId) ?? 0,
      }))
  }, [tagsData, mappingsData])

  const handleTagUpsert = useCallback(
    async ({ id, name }: { id?: number; name: string }) => {
      await upsertTagMutation.mutateAsync([{ QuoteRowTagId: id ?? 0, TagName: name }])
    },
    [upsertTagMutation]
  )

  const handleTagDelete = useCallback(
    async (id: number) => {
      await deleteTagMutation.mutateAsync({ QuoteRowTagId: id })
    },
    [deleteTagMutation]
  )

  const isLoading = !groupsResponse
  const isTagsLoading = !tagsResponse
  const tabs = useMemo(
    () => [
      {
        key: quoteGroupsTabKey,
        label: 'Quote Groups',
        icon: <TeamOutlined />,
        content: (
          <ManageGroupsTab
            groups={groups}
            isLoading={isLoading}
            title='Manage Quote Groups'
            listLabel='Quote Groups'
            groupingTitle='Quote Rows'
            addButtonLabel='Add Quote Group'
            canWrite={canWrite}
            onUpsert={handleUpsert}
            errorMessages={{ duplicateName: 'A Quote Group with that name already exists.' }}
          />
        ),
      },
      {
        key: tagsTabKey,
        label: 'Tags',
        icon: <TagsOutlined />,
        content: (
          <ManageGroupsTab
            groups={tags}
            isLoading={isTagsLoading}
            title='Manage Tags'
            listLabel='Tags'
            groupingTitle='Quote Rows'
            addButtonLabel='Add Tag'
            canWrite={canWrite}
            onUpsert={handleTagUpsert}
            onDelete={handleTagDelete}
            errorMessages={{
              duplicateName: 'A tag with this name already exists.',
              deleteBlocked: 'Unable to delete tag. This tag is assigned to one or more quote rows.',
            }}
          />
        ),
      },
    ],
    [groups, isLoading, canWrite, handleUpsert, tags, isTagsLoading, handleTagUpsert, handleTagDelete]
  )

  return (
    <TabbedManagementPanel
      leftPane={leftPane}
      tabs={tabs}
      activeTabKey={activeTabKey || quoteGroupsTabKey}
      onTabChange={setActiveTabKey}
      isOpen={isOpen}
      onClose={onClose}
      storageKey={panelStorageKey}
    />
  )
}
