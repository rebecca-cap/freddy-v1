import { SearchOutlined } from '@ant-design/icons'
import { GroupEditor } from '@components/shared/GroupEditor/GroupEditor'
import { Horizontal, NothingMessage, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Input, message } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'

import { AddVolumeGroup } from './AddVolumeGroup'

export function ManageVolumeSetup({ volumeSetups, volumeGroups, volumeGroupMutation, canWrite }) {
  const [addingVolumeGroup, setAddingVolumeGroup] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState('')
  const [saveDisabled, setSaveDisabled] = useState(false)
  const [searchString, setSearchString] = useState(null)
  const [searchResults, setSearchResults] = useState()

  const volumeGroupsWithCount = useMemo(() => {
    const updatedVolumeGroups = volumeGroups?.map((group) => {
      return {
        ...group,
        volumeGroupCount: volumeSetups?.filter(
          (p) => p.AvailableVolumeId && p.AvailableVolumeId.toString() === group.Value
        )?.length,
      }
    })
    setSearchResults(updatedVolumeGroups)
    return updatedVolumeGroups
  }, [volumeGroups, volumeSetups])

  useEffect(() => {
    searchVolumeGroups(searchString, volumeGroupsWithCount)
  }, [volumeGroups, volumeGroupsWithCount])

  const handleEdit = async (values, group) => {
    setSaveDisabled(true)
    const groupName = values?.GroupName
    const groupId = group?.Value

    if (volumeGroups.some((group) => group.Text === groupName)) {
      NotificationMessage('Error Updating ', 'A volume group with that name already exists')
      return
    }

    const updatedGroup = {
      AvailableVolumeId: parseInt(groupId),
      AvailableVolumeName: groupName,
      IsActive: true,
    }
    const response = await volumeGroupMutation.mutateAsync([updatedGroup])
    if (!response?.Validations.length) {
      setEditingGroupId('')
    } else {
      message.error(response?.Validations[0]?.Message, 5)
      setSaveDisabled(false)
    }
  }

  const handleDelete = async (groupId) => {
    const AvailableVolumeGroup = volumeGroups.find((vg) => vg.Value == groupId)
    const payload = {
      AllocationId: AvailableVolumeGroup?.AllocationId,
      AvailableVolumeId: parseInt(groupId),
      AvailableVolumeName: AvailableVolumeGroup.Text,
      IsActive: false,
    }
    const response = await volumeGroupMutation.mutateAsync([payload])
    if (!response?.Validations.length) {
      setEditingGroupId('')
    } else {
      message.error(response?.Validations[0]?.Message, 5)
    }
  }

  const searchVolumeGroups = (input, searchList?) => {
    const list = searchList || volumeGroupsWithCount
    const searchText = input?.toLowerCase()

    setSearchString(searchText)

    if (!searchText) {
      setSearchResults(list)
      return list
    }

    const matchingGroups = []

    list.forEach((group) => {
      if (group.Text.toLowerCase().includes(searchText)) {
        matchingGroups.push(group)
      }
    })

    setSearchResults(matchingGroups)

    return matchingGroups
  }
  const formHeight = useMemo(() => (addingVolumeGroup ? 250 : 120), [addingVolumeGroup])
  return (
    <Vertical height='86vh'>
      <div className='bg-1'>
        <Horizontal className='px-4 pt-3 py-2 bg-2'>
          <Texto category='h3'>Manage Volume Groups</Texto>
        </Horizontal>
        <Horizontal>
          <Input
            prefix={<SearchOutlined />}
            placeholder='Quick Search'
            value={searchString}
            onChange={(event) => searchVolumeGroups(event.target.value)}
            allowClear
          />
        </Horizontal>
        <Horizontal className='bg-1 p-4'>
          <Texto category='heading-small'>VOLUME GROUPS ({searchResults?.length})</Texto>
        </Horizontal>
      </div>

      <Horizontal className='bg-1' flex={3}>
        <Vertical style={{ overflowY: 'auto' }}>
          {!!searchResults?.length &&
            searchResults.map((group, index) => {
              return (
                <GroupEditor
                  key={group.Value}
                  index={index}
                  group={group}
                  editingGroupId={editingGroupId}
                  setEditingGroupId={setEditingGroupId}
                  handleDelete={handleDelete}
                  setSaveDisabled={setSaveDisabled}
                  saveDisabled={saveDisabled}
                  groupingTitle='Volume setups'
                  groupCount={group.volumeGroupCount}
                  handleEdit={!group.AllocationId && handleEdit}
                  canWrite={canWrite}
                />
              )
            })}
          {!volumeGroups?.length && !addingVolumeGroup && (
            <Horizontal className='m-4' verticalCenter horizontalCenter>
              <NothingMessage title='No Volume Groups Found' message='' />
            </Horizontal>
          )}
        </Vertical>
      </Horizontal>
      {canWrite && (
        <Horizontal
          className='bg-1 border-top'
          style={{ minHeight: formHeight, maxHeight: formHeight, flexShrink: 0 }}
          horizontalCenter
        >
          <AddVolumeGroup
            addingVolumeGroup={addingVolumeGroup}
            setAddingVolumeGroup={setAddingVolumeGroup}
            upsertVolumeGroup={volumeGroupMutation}
          />
        </Horizontal>
      )}
    </Vertical>
  )
}
