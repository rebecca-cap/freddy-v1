import { GroupEditor } from '@components/shared/GroupEditor/GroupEditor'
import { Horizontal, NothingMessage, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { message } from 'antd'
import React, { useState } from 'react'

import { AddProductGroup } from './AddProductGroup'

export function ManageProductGroups({ metadata, products, canWrite, upsertProductGroup, deleteProductGroup }) {
  const [addingProductGroup, setAddingProductGroup] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState('')
  const [saveDisabled, setSaveDisabled] = useState(false)
  const productGroups = metadata?.Data?.ProductGroups.map((group) => {
    return {
      ...group,
      productCount: products?.Data?.filter((p) => p.ProductGroupId && p.ProductGroupId.toString() === group.Value)
        ?.length,
    }
  })

  const handleEdit = async (values, group) => {
    setSaveDisabled(true)
    const groupName = values?.GroupName
    const groupId = group?.Value

    if (productGroups.some((group) => group.Text === groupName)) {
      NotificationMessage('Error Updating ', 'A product group with that name already exists')
      return
    }

    const updatedGroup = {
      ProductGroupId: groupId,
      ProductGroupName: groupName,
    }
    const response = await upsertProductGroup.mutateAsync(updatedGroup)
    if (!response?.Validations.length) {
      setEditingGroupId('')
    } else {
      message.error(response?.Validations[0]?.Message, 5)
      setSaveDisabled(false)
    }
  }

  const handleDelete = async (groupId) => {
    const response = await deleteProductGroup.mutateAsync(groupId)
    if (!response?.Validations.length) {
      setEditingGroupId('')
    } else {
      message.error(response?.Validations[0]?.Message, 5)
    }
  }

  return (
    <Vertical className='bg-1'>
      <Horizontal className='px-4 pt-3 py-2 bg-2'>
        <Texto category='h3'>Manage Product Groups</Texto>
      </Horizontal>
      <Horizontal className='p-4'>
        <Texto category='heading-small'>PRODUCT GROUPS</Texto>
      </Horizontal>
      {!!productGroups?.length &&
        productGroups.map((group, index) => {
          return (
            <GroupEditor
              index={index}
              group={group}
              editingGroupId={editingGroupId}
              setEditingGroupId={setEditingGroupId}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              setSaveDisabled={setSaveDisabled}
              saveDisabled={saveDisabled}
              groupingTitle='Products'
              groupCount={group.productCount}
            />
          )
        })}
      {!productGroups?.length && !addingProductGroup && (
        <Horizontal className='m-4' verticalCenter horizontalCenter>
          <NothingMessage title='No Product Groups Found' />
        </Horizontal>
      )}
      {canWrite && (
        <AddProductGroup
          addingProductGroup={addingProductGroup}
          setAddingProductGroup={setAddingProductGroup}
          upsertProductGroup={upsertProductGroup}
        />
      )}
    </Vertical>
  )
}
