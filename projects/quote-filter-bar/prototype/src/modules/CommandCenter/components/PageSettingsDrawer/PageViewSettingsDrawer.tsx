import { DeleteOutlined, EditOutlined, EllipsisOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { AllPageViewResponseData } from '@modules/CommandCenter/api/pageViewTypes.schema'
import {
  DataTypeWithStatus,
  GraviGridRef,
  PageSettingFilters,
  UserDefinedPageView,
  WidgetConfig,
} from '@modules/CommandCenter/api/types.schema'
import { usePageViews } from '@modules/CommandCenter/api/usePageViews'
import { Divider, Drawer, Dropdown, Menu } from 'antd'
import { MutableRefObject, useState } from 'react'

import { createAndSaveNewView, saveViewWithNewName, saveViewWithNewSettings } from './components/pageViewSettingEvents'
import { PageViewSettingsCreateEditForm } from './components/PageViewSettingsCreateEditForm'

interface PageViewSettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
  setCurrentlySelectedPageView: React.Dispatch<React.SetStateAction<string | null>>
  pageViewsData: AllPageViewResponseData[]
  pageViews: UserDefinedPageView[]
  widgets: WidgetConfig[]
  setPageViews: React.Dispatch<React.SetStateAction<UserDefinedPageView[] | null>>
  currentlySelectedPageView: string | null
  widgetStorageKey: { [key: string]: string }
  gridRefs: MutableRefObject<GraviGridRef<DataTypeWithStatus> | undefined>[]
  pageSettingsFilters: PageSettingFilters
  isLoading: boolean
}

export function PageViewSettingsDrawer({
  isOpen,
  onClose,
  setCurrentlySelectedPageView,
  currentlySelectedPageView,
  widgets,
  pageViews,
  gridRefs,
  pageSettingsFilters,
  setPageViews,
  isLoading,
}: PageViewSettingsDrawerProps) {
  const { useSavePageViewMutation, useDeletePageViewMutation } = usePageViews()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [newViewName, setNewViewName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleViewSelect = (view: UserDefinedPageView) => {
    setIsSaving(true)
    setCurrentlySelectedPageView(view.display)
    widgets.forEach((widget) => {
      const configKey = widget.storageKey.replace('CommandCenter-', '')
      const widgetSetting = view.widgetSettings.find((w) => w.name === widget.storageKey)
      if (widgetSetting) {
        const viewToSet = {
          id: view.userPreferenceId || 0,
          name: view.display,
          gridKey: widget.storageKey,
          state: widgetSetting.gridConfigSettings,
        }
        widget.gridApiRef?.current?.applyGridView(viewToSet)
        const gridSettings = widgetSetting.widgetGridSettings[configKey]
        if (gridSettings) {
          widget.setSettings(gridSettings)
        }
      }
    })

    setIsSaving(false)
  }

  const handleResetToDefault = () => {
    setIsSaving(true)
    setCurrentlySelectedPageView(null)
    gridRefs.forEach((gridRef) => {
      gridRef.current?.resetGridToDefault()
    })
    setIsSaving(false)
  }

  const handleEditStart = (view: UserDefinedPageView) => {
    if (!view.userPreferenceId) return
    setEditingId(view.userPreferenceId)
    setEditingName(view.display)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditingName('')
    setNewViewName('')
    setIsEditing(false)
  }

  const handleCreateNew = () => {
    setIsEditing(true)
    setNewViewName('')
    setEditingId(null)
  }

  const handleDelete = async (view: UserDefinedPageView) => {
    try {
      setIsSaving(true)
      if (view.userPreferenceId) {
        await useDeletePageViewMutation.mutateAsync(view.userPreferenceId)
        setPageViews((prev) => (prev ? prev.filter((v) => v.userPreferenceId !== view.userPreferenceId) : []))
        NotificationMessage('Success.', `Page view deleted.`, false)
      }
    } catch (error) {
      console.error('Error deleting page view:', error)
      NotificationMessage('Error.', `Page view could not be deleted.`, true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditSave = async (view: UserDefinedPageView) => {
    // has id and new name to be saved
    if (!editingId || !editingName.trim()) return
    setIsSaving(true)
    await saveViewWithNewName(
      view,
      editingName,
      editingId,
      setPageViews,
      setEditingId,
      setEditingName,
      useSavePageViewMutation
    )
    setIsSaving(false)
  }

  const handleSaveCurrentView = async (view: UserDefinedPageView) => {
    if (!view.userPreferenceId) return
    setIsSaving(true)
    await saveViewWithNewSettings(
      view,
      widgets,
      pageSettingsFilters,
      setPageViews,
      useSavePageViewMutation,
      setIsEditing,
      setNewViewName
    )
    setCurrentlySelectedPageView(view.display)
    setIsSaving(false)
  }

  const handleCreateSave = async () => {
    setIsSaving(true)
    const newTitle = newViewName.trim()
    if (!newTitle) return
    await createAndSaveNewView(
      newTitle,
      pageSettingsFilters,
      widgets,
      setPageViews,
      useSavePageViewMutation,
      setIsEditing,
      setNewViewName
    )
    setCurrentlySelectedPageView(newTitle)
    setIsSaving(false)
  }

  const getDropdownMenu = (view: UserDefinedPageView) => (
    <Menu>
      <Menu.Item key='edit' icon={<EditOutlined />} onClick={() => handleEditStart(view)}>
        Edit
      </Menu.Item>
      <Menu.Item key='save' icon={<SaveOutlined />} onClick={() => handleSaveCurrentView(view)}>
        Save Current View
      </Menu.Item>
      <Menu.Item key='delete' icon={<DeleteOutlined />} onClick={() => handleDelete(view)}>
        Delete
      </Menu.Item>
    </Menu>
  )

  return (
    <Drawer
      title='Page Views'
      visible={isOpen}
      onClose={onClose}
      bodyStyle={{
        padding: '0px',
      }}
      footer={
        <PageViewSettingsCreateEditForm
          isEditing={isEditing}
          newViewName={newViewName}
          setNewViewName={setNewViewName}
          handleSave={handleCreateSave}
          handleCancel={handleCancel}
          handleCreateNew={handleCreateNew}
          editingId={editingId}
          isFooter
          pageViews={pageViews}
          isSaving={isSaving}
          isLoading={isLoading}
        />
      }
    >
      <Vertical>
        <Horizontal className='p-2'>
          <GraviButton
            buttonText='Reset To Default'
            onClick={handleResetToDefault}
            icon={<ReloadOutlined />}
            data-testid='page-views-panel-reset-to-default-button'
            className='ghost-gravi-button'
            style={{
              textAlign: 'left',
            }}
          />
        </Horizontal>
        <Divider className='my-1' />

        {/* Grid Views List */}
        <div style={{ overflowY: 'auto', height: 'fit-content', maxHeight: 'calc(100vh - 100px)' }}>
          {pageViews?.map((view) => (
            <Horizontal
              justifyContent='space-between'
              verticalCenter
              style={{ width: '100%' }}
              key={view.userPreferenceId}
              className={`cursor-pointer p-2 border-bottom`}
            >
              <Horizontal style={{ width: '100%' }}>
                {editingId === view.userPreferenceId ? (
                  <PageViewSettingsCreateEditForm
                    isEditing={true}
                    newViewName={editingName}
                    setNewViewName={setEditingName}
                    handleSave={() => handleEditSave(view)}
                    handleCancel={handleCancel}
                    handleCreateNew={handleCreateNew}
                    editingId={editingId}
                    pageViews={pageViews}
                    isSaving={isSaving}
                    view={view}
                    isLoading={isLoading}
                  />
                ) : (
                  <>
                    <GraviButton
                      disabled={isSaving || isEditing}
                      className='ghost-gravi-button'
                      buttonText={
                        <Texto
                          className='text-truncate'
                          appearance={view.display === currentlySelectedPageView ? 'secondary' : 'default'}
                        >
                          {view.display}
                        </Texto>
                      }
                      onClick={() => {
                        if (isSaving || isEditing) return
                        handleViewSelect(view)
                      }}
                      style={{
                        fontWeight: 'normal',
                        color: view.display === currentlySelectedPageView ? 'var(--theme-option)' : 'inherit',
                        maxWidth: '80%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    />
                  </>
                )}
              </Horizontal>

              {editingId !== view.userPreferenceId && (
                <Dropdown overlay={() => getDropdownMenu(view)} trigger={['click']} placement='bottomRight'>
                  <GraviButton
                    disabled={isSaving}
                    className='ghost-gravi-button'
                    icon={<EllipsisOutlined />}
                    onClick={(e) => e.stopPropagation()}
                    success
                    style={{
                      color: view.display === currentlySelectedPageView ? 'var(--theme-option)' : 'inherit',
                    }}
                  />
                </Dropdown>
              )}
            </Horizontal>
          ))}
        </div>
      </Vertical>
    </Drawer>
  )
}
