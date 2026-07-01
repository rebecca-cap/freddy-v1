import { GridConfigFilterState } from '@hooks/useGridViewManager/api/types.schema'
import { getFilterModelsFromConfig } from '@hooks/useGridViewManager/api/util'
import {
  GridConfigSettingsPayload,
  UpsertPageViewPayload,
  WidgetSetting,
} from '@modules/CommandCenter/api/pageViewTypes.schema'
import { GridConfigSettings, UserDefinedPageView, WidgetConfig } from '@modules/CommandCenter/api/types.schema'
import { isDefinedAndNotNull } from '@utils/index'

export function getGridConfigPayloadFromWidget({ storageKey }: { storageKey: string }): GridConfigSettingsPayload {
  const gridState = getNewGridViewContent(storageKey)

  const filters = gridState?.filter
  if (isDefinedAndNotNull(filters)) {
    const filterModels = getFilterModelsFromConfig(filters)
    return { filters: filterModels, columns: gridState?.column }
  }
  return { columns: gridState?.column, filters: [] }
}

export function getNewGridViewContent(gridStorageKey: string): GridConfigSettings {
  const currentGridState = window.localStorage.getItem(`gridConfig::${gridStorageKey}`)
  const gridState = currentGridState ? JSON.parse(currentGridState) : null
  return gridState
}

export function getNewViewForLocalStorage(view: UpsertPageViewPayload): UserDefinedPageView {
  const newViewWidgetSettingsForLocalStorage = view.widgetSettings.map((widget) => {
    const currentGridConfigs = getNewGridViewContent(widget.name)
    const widgetGridSettingsKey = widget.name.replace('CommandCenter-', '')
    const updatedWidgetGridSettings = {
      [widgetGridSettingsKey]: {
        ...widget.widgetGridSettings[widgetGridSettingsKey],
        filters: {
          ...widget.widgetGridSettings[widgetGridSettingsKey].filters,
          LocationIds: widget.widgetGridSettings[widgetGridSettingsKey].filters.LocationIds.map((id) => id.toString()),
          ProductIds: widget.widgetGridSettings[widgetGridSettingsKey].filters.ProductIds.map((id) => id.toString()),
          QuoteConfigurationIds: widget.widgetGridSettings[widgetGridSettingsKey].filters.QuoteConfigurationIds.map(
            (id) => id.toString()
          ),
        },
      },
    }
    return {
      name: widget.name,
      gridConfigSettings: currentGridConfigs,
      widgetGridSettings: updatedWidgetGridSettings,
    }
  })
  return {
    widgetSettings: newViewWidgetSettingsForLocalStorage,
    pageServerSideFilters: view.pageServerSideFilters,
    display: view.display,
    userPreferenceId: view.userPreferenceId || 0,
  }
}

export function getUpsertPayloadFromUserDefinedPageView(view: UserDefinedPageView): UpsertPageViewPayload {
  const transformedWidgetSettings: WidgetSetting[] = view.widgetSettings.map((widget) => {
    const { filter, column } = widget.gridConfigSettings

    const gridConfigSettings: GridConfigSettingsPayload = {
      filters: isDefinedAndNotNull(filter) ? getFilterModelsFromConfig(filter) : [],
      columns: column || [],
    }

    return {
      name: widget.name,
      gridConfigSettings,
      widgetGridSettings: widget.widgetGridSettings,
    }
  })

  return {
    widgetSettings: transformedWidgetSettings,
    pageServerSideFilters: view.pageServerSideFilters,
    display: view.display,
    userPreferenceId: view.userPreferenceId,
  }
}

export function getUserDefinedPageViewForLocalStorage(
  widgets: WidgetConfig[],
  view: UpsertPageViewPayload
): UserDefinedPageView {
  const transformedWidgetSettings = view.widgetSettings.map((widgetSetting) => {
    const { filters, columns } = widgetSetting.gridConfigSettings

    const filterObject: GridConfigFilterState = {}
    filters.forEach((filter) => {
      if (filter.colId) {
        filterObject[filter.colId] = {
          ...filter,
          colId: undefined,
        }
        delete filterObject[filter.colId].colId
      }
    })

    const gridConfigSettings: GridConfigSettings = {
      filter: filterObject,
      column: columns,
    }
    const key = widgetSetting.name.replace('CommandCenter-', '')
    const currentSettings = widgetSetting.widgetGridSettings[key]
    const updatedWidgetGridSettings = {
      [key]: {
        ...currentSettings,
        filters: {
          ...currentSettings.filters,
          LocationIds: currentSettings.filters.LocationIds.map((id) => id.toString()),
          ProductIds: currentSettings.filters.ProductIds.map((id) => id.toString()),
          QuoteConfigurationIds: currentSettings.filters.QuoteConfigurationIds.map((id) => id.toString()),
        },
      },
    }

    return {
      name: widgetSetting.name,
      gridConfigSettings,
      widgetGridSettings: updatedWidgetGridSettings,
    }
  })

  return {
    widgetSettings: transformedWidgetSettings,
    pageServerSideFilters: view.pageServerSideFilters,
    display: view.display,
    userPreferenceId: view.userPreferenceId || 0,
  }
}
