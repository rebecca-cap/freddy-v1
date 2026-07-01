import { PlusOutlined } from '@ant-design/icons'
import { HierarchyEditor } from '@components/shared/Hierarchies/components/HierarchyEditor'
import { NewHierarchyForm } from '@components/shared/Hierarchies/components/NewHierarchyForm'
import { HierarchyListItem } from '@components/shared/Hierarchies/types'
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Button, Divider, Skeleton } from 'antd'
import React, { useMemo, useState } from 'react'

interface ManageHierarchyDrawerProps {
  hierarchyList: HierarchyListItem[]
  isLoading: boolean
  onUpsert: (data: { Name: string; HierarchyKey?: number }) => void
}

export const ManageHierarchyDrawer = ({ hierarchyList, isLoading, onUpsert }: ManageHierarchyDrawerProps) => {
  const [editingId, setEditingId] = useState<number | null | string>(null)
  const [saveDisabled, setSaveDisabled] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)

  const upsertHierarchy = ({ Name, HierarchyKey }: { Name: string; HierarchyKey?: number }) => {
    setSaveLoading(true)
    onUpsert({ Name, HierarchyKey })
    setEditingId(null)
    setSaveDisabled(true)
    setSaveLoading(false)
  }

  function handleCancelNewHierarchy() {
    setSaveDisabled(true)
    setEditingId(null)
  }
  const sortedHierarchyList = useMemo(
    () => [...hierarchyList].sort((a, b) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase())),
    [hierarchyList]
  )
  if (isLoading) return <Skeleton active />
  return (
    <Vertical>
      <Vertical flex={1} scroll className='py-4 px-5'>
        {sortedHierarchyList?.map((h) => {
          return (
            <React.Fragment key={h.Key}>
              <HierarchyEditor
                key={h.Key}
                index={h.Key}
                hierarchyItem={h}
                editingId={editingId}
                setEditingId={setEditingId}
                onChange={upsertHierarchy}
                setSaveDisabled={setSaveDisabled}
                saveDisabled={saveDisabled}
              />
              <Divider style={{ margin: '12px auto' }} />
            </React.Fragment>
          )
        })}
      </Vertical>

      {editingId === 'new' ? (
        <NewHierarchyForm
          onCancel={handleCancelNewHierarchy}
          setSaveDisabled={setSaveDisabled}
          saveDisabled={saveDisabled}
          onSave={upsertHierarchy}
          saveLoading={saveLoading}
        />
      ) : (
        <Horizontal justifyContent='center' className={'px-5 py-4 mb-3'}>
          <Button type='link' icon={<PlusOutlined />} onClick={() => setEditingId('new')}>
            ADD HIERARCHY
          </Button>
        </Horizontal>
      )}
    </Vertical>
  )
}
