import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { type Group, GroupEditor } from '@components/shared/GroupEditor/GroupEditor'
import { GraviButton, NothingMessage, NotificationMessage, Vertical } from '@gravitate-js/excalibrr'
import { Input, Spin } from 'antd'
import { useMemo, useState } from 'react'

import { AddGroupForm } from './AddGroup'
import styles from './styles.module.css'
import type { ManageGroupsTabGroup, ManageGroupsTabProps } from './types'

export function ManageGroupsTab({
  groups,
  isLoading = false,
  title,
  listLabel,
  groupingTitle,
  addButtonLabel,
  canWrite,
  onUpsert,
  onDelete,
  errorMessages,
}: ManageGroupsTabProps) {
  const [addingGroup, setAddingGroup] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState('')
  const [searchText, setSearchText] = useState('')

  const groupsAsEditorShape = useMemo<Array<Group & ManageGroupsTabGroup>>(
    () =>
      groups.map((group) => ({
        Value: group.id.toString(),
        Text: group.name,
        id: group.id,
        name: group.name,
        assignmentCount: group.assignmentCount,
      })),
    [groups]
  )

  const filteredGroups = useMemo(() => {
    const trimmed = searchText.trim().toLowerCase()
    if (!trimmed) return groupsAsEditorShape
    return groupsAsEditorShape.filter((group) => group.name.toLowerCase().includes(trimmed))
  }, [groupsAsEditorShape, searchText])

  const handleEdit = async (values: { GroupName: string }, group: Group) => {
    const newName = values?.GroupName?.trim()
    const groupId = Number(group.Value)

    if (!newName) {
      NotificationMessage('Error', 'Group name is required')
      throw new Error('invalid')
    }

    const isDuplicate = groups.some((g) => g.name.toLowerCase() === newName.toLowerCase() && g.id !== groupId)
    if (isDuplicate) {
      NotificationMessage('Error', errorMessages.duplicateName)
      throw new Error('duplicate')
    }

    await onUpsert({ id: groupId, name: newName })
    setEditingGroupId('')
  }

  const handleDelete = async (groupId: string) => {
    if (!onDelete) return
    await onDelete(Number(groupId))
    setEditingGroupId('')
  }

  const handleAdd = async (newName: string) => {
    const trimmed = newName?.trim()
    if (!trimmed) {
      NotificationMessage('Error', 'Group name is required')
      throw new Error('invalid')
    }

    const isDuplicate = groups.some((g) => g.name.toLowerCase() === trimmed.toLowerCase())
    if (isDuplicate) {
      NotificationMessage('Error', errorMessages.duplicateName)
      throw new Error('duplicate')
    }

    await onUpsert({ name: trimmed })
    setAddingGroup(false)
  }

  return (
    <Vertical className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.titleActions}>
            <span className={styles.titleCount}>
              {filteredGroups.length} {filteredGroups.length === 1 ? 'item' : 'items'}
            </span>
            {canWrite && !addingGroup && (
              <GraviButton
                buttonText={addButtonLabel}
                icon={<PlusOutlined />}
                onClick={() => setAddingGroup(true)}
                color='primary'
              />
            )}
          </div>
        </div>
        {canWrite && addingGroup && <AddGroupForm onSave={handleAdd} onCancel={() => setAddingGroup(false)} />}
        <Input
          className={styles.searchInput}
          prefix={<SearchOutlined />}
          placeholder='Quick Search'
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          allowClear
        />
        <div className={styles.sectionLabel}>
          {listLabel} ({filteredGroups.length})
        </div>
      </div>

      <div className={styles.list}>
        {isLoading && !groups.length && (
          <div className={styles.emptyState}>
            <Spin />
          </div>
        )}

        {!isLoading && !groups.length && !addingGroup && (
          <div className={styles.emptyState}>
            <NothingMessage title={`No ${listLabel} Found`} message='' />
          </div>
        )}

        {filteredGroups.map((group, index) => (
          <GroupEditor
            key={group.Value}
            index={index}
            group={group}
            editingGroupId={editingGroupId}
            setEditingGroupId={setEditingGroupId}
            handleDelete={onDelete ? handleDelete : false}
            groupingTitle={groupingTitle}
            groupCount={group.assignmentCount}
            handleEdit={handleEdit}
            canWrite={canWrite}
            deleteTooltip={errorMessages.deleteBlocked}
          />
        ))}
      </div>
    </Vertical>
  )
}
