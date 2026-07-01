import { GroupEditor } from '@components/shared/GroupEditor/GroupEditor'
import { Horizontal, NothingMessage, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { message } from 'antd'
import React, { useState } from 'react'

import { AddLocationGroup } from './AddLocationGroup'

export function ManageLocationGroups({ metadata, locations, canWrite, upsertLocationGroup, deleteLocationGroup }) {
  const [addingLocationGroup, setAddingLocationGroup] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState('')
  const [saveDisabled, setSaveDisabled] = useState(false)
  const locationGroups = metadata?.Data?.LocationGroups.map((group) => {
    return {
      ...group,
      locationCount: locations?.Data?.filter((p) => p.LocationGroupId && p.LocationGroupId.toString() === group.Value)
        ?.length,
    }
  })

  const handleEdit = async (values, group) => {
    setSaveDisabled(true)
    const groupName = values?.GroupName
    const groupId = group?.Value

    if (locationGroups.some((group) => group.Text === groupName)) {
      NotificationMessage('Error Updating ', 'A location group with that name already exists')
      return
    }

    const updatedGroup = {
      LocationGroupId: groupId,
      LocationGroupName: groupName,
    }
    const response = await upsertLocationGroup.mutateAsync(updatedGroup)
    if (!response?.Validations.length) {
      setEditingGroupId('')
    } else {
      message.error(response?.Validations[0]?.Message, 5)
      setSaveDisabled(false)
    }
  }

  const handleDelete = async (groupId) => {
    const response = await deleteLocationGroup.mutateAsync(groupId)
    if (!response?.Validations.length) {
      setEditingGroupId('')
    } else {
      message.error(response?.Validations[0]?.Message, 5)
    }
  }

  return (
    <Vertical className='bg-1'>
      <Horizontal className='px-4 pt-3 py-2 bg-2'>
        <Texto category='h3'>Manage Location Groups</Texto>
      </Horizontal>
      <Horizontal className='p-4'>
        <Texto category='heading-small'>LOCATION GROUPS</Texto>
      </Horizontal>
      {!!locationGroups?.length &&
        locationGroups.map((group, index) => {
          return (
            <GroupEditor
              key={group.Value ?? index}
              index={index}
              group={group}
              editingGroupId={editingGroupId}
              setEditingGroupId={setEditingGroupId}
              handleEdit={canWrite && handleEdit}
              handleDelete={canWrite && handleDelete}
              setSaveDisabled={setSaveDisabled}
              saveDisabled={saveDisabled}
              groupingTitle='Location'
              groupCount={group.locationCount}
            />
          )
        })}
      {!locationGroups?.length && !addingLocationGroup && (
        <Horizontal className='m-4' verticalCenter horizontalCenter>
          <NothingMessage title='No Location Groups Found' />
        </Horizontal>
      )}
      {canWrite && (
        <AddLocationGroup
          addingLocationGroup={addingLocationGroup}
          setAddingLocationGroup={setAddingLocationGroup}
          upsertLocationGroup={upsertLocationGroup}
        />
      )}
    </Vertical>
  )
}
