import { NotificationMessage } from '@gravitate-js/excalibrr'
import {
  UpsertPageViewPayload,
  UpsertPageViewResponse,
  WidgetSetting,
} from '@modules/CommandCenter/api/pageViewTypes.schema'
import { PageSettingFilters, UserDefinedPageView, WidgetConfig } from '@modules/CommandCenter/api/types.schema'
import { UseMutationResult } from '@tanstack/react-query'
import React from 'react'

import {
  getGridConfigPayloadFromWidget,
  getUpsertPayloadFromUserDefinedPageView,
  getUserDefinedPageViewForLocalStorage,
} from './util'

export async function saveViewWithNewName(
  view: UserDefinedPageView,
  editingName: string,
  editingId: number,
  setPageViews: React.Dispatch<React.SetStateAction<UserDefinedPageView[] | null>>,
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>,
  setEditingName: React.Dispatch<React.SetStateAction<string>>,
  useSavePageViewMutation: UseMutationResult<UpsertPageViewResponse, Error, UpsertPageViewPayload, unknown>
) {
  try {
    const newName = editingName.trim()
    const updatedView = {
      ...view,
      display: newName,
    }
    const payloadForBackend = getUpsertPayloadFromUserDefinedPageView(updatedView)
    await useSavePageViewMutation.mutateAsync(payloadForBackend)
    setPageViews((prev) =>
      prev ? prev.map((v) => (v.userPreferenceId === editingId ? updatedView : v)) : [updatedView]
    )
    setEditingId(null)
    setEditingName('')

    NotificationMessage('Success.', `Page view renamed to ${newName}.`, false)
  } catch (error) {
    console.error('Error renaming page view:', error)
    NotificationMessage('Error.', `Page view could not be renamed.`, true)
  }
}

export async function saveViewWithNewSettings(
  view: UserDefinedPageView,
  widgets: WidgetConfig[],
  pageSettingsFilters: PageSettingFilters,
  setPageViews: React.Dispatch<React.SetStateAction<UserDefinedPageView[] | null>>,
  useSavePageViewMutation: UseMutationResult<UpsertPageViewResponse, Error, UpsertPageViewPayload, unknown>,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
  setNewViewName: React.Dispatch<React.SetStateAction<string>>
) {
  const newViewWidgetSettingsPayload: WidgetSetting[] = widgets.map((widget) => {
    const currentGridConfigs = getGridConfigPayloadFromWidget({ storageKey: widget.storageKey })
    const widgetGridSettingsKey = widget.storageKey.replace('CommandCenter-', '')
    return {
      name: widget.storageKey,
      gridConfigSettings: currentGridConfigs,
      widgetGridSettings: { [widgetGridSettingsKey]: widget.settings },
    }
  })
  const newView: UpsertPageViewPayload = {
    display: view.display,
    widgetSettings: newViewWidgetSettingsPayload,
    pageServerSideFilters: {
      LocationHierarchyTypeCvId: pageSettingsFilters.LocationHierarchyTypeCvId as number,
      ProductHierarchyTypeCvId: pageSettingsFilters.ProductHierarchyTypeCvId as number,
    },
    userPreferenceId: view.userPreferenceId,
  }
  try {
    const resp = await useSavePageViewMutation.mutateAsync(newView)
    const newViewForLocalStorage = getUserDefinedPageViewForLocalStorage(widgets, resp.Data)
    setPageViews((prev) =>
      prev
        ? prev.map((v) => (v.userPreferenceId === view.userPreferenceId ? newViewForLocalStorage : v))
        : [newViewForLocalStorage]
    )
    setIsEditing(false)
    setNewViewName('')
    NotificationMessage('Success.', `${view.display} saved.`, false)
  } catch (error) {
    console.error('Error saving page view:', error)
    NotificationMessage('Error.', `Page view could not be saved.`, true)
  }
}

export async function createAndSaveNewView(
  newTitle: string,
  pageSettingsFilters: PageSettingFilters,
  widgets: WidgetConfig[],
  setPageViews: React.Dispatch<React.SetStateAction<UserDefinedPageView[] | null>>,
  useSavePageViewMutation: UseMutationResult<UpsertPageViewResponse, Error, UpsertPageViewPayload, unknown>,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
  setNewViewName: React.Dispatch<React.SetStateAction<string>>
) {
  const newGridViewSettings: WidgetSetting[] = getNewViewSettings(widgets)
  const newView: UpsertPageViewPayload = {
    display: newTitle,
    widgetSettings: newGridViewSettings,
    pageServerSideFilters: {
      LocationHierarchyTypeCvId: pageSettingsFilters.LocationHierarchyTypeCvId as number,
      ProductHierarchyTypeCvId: pageSettingsFilters.ProductHierarchyTypeCvId as number,
    },
  }
  try {
    const resp = await useSavePageViewMutation.mutateAsync(newView)
    if (resp.Data?.userPreferenceId) {
      newView.userPreferenceId = resp.Data.userPreferenceId
      const newViewForLocalStorage = getUserDefinedPageViewForLocalStorage(widgets, resp.Data)
      setPageViews((prev) => (prev ? [...prev, newViewForLocalStorage] : [newViewForLocalStorage]))
      setIsEditing(false)
      setNewViewName('')
      NotificationMessage('Success.', `${newTitle} created.`, false)
    }
  } catch (error) {
    console.error('Error saving page view:', error)
    NotificationMessage('Error.', `Page view could not be saved.`, true)
  }
}

function getNewViewSettings(widgets: WidgetConfig[]) {
  const newViewWidgetSettingsPayload: WidgetSetting[] = widgets.map((widget) => {
    const currentGridConfigs = getGridConfigPayloadFromWidget({ storageKey: widget.storageKey })
    const widgetGridSettingsKey = widget.storageKey.replace('CommandCenter-', '')
    return {
      name: widget.storageKey,
      gridConfigSettings: currentGridConfigs,
      widgetGridSettings: { [widgetGridSettingsKey]: widget.settings },
    }
  })
  return newViewWidgetSettingsPayload
}
