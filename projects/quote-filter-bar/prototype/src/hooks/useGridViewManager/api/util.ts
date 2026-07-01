import {
  GridConfigFilterState,
  GridView,
  GridViewPayload,
  GridViewPayloadFilter,
  GridViewResponse,
  ViewPayload,
} from '@hooks/useGridViewManager/api/types.schema'
import { isDefinedAndNotNull } from '@utils/index'

export function getFilterModelsFromConfig(filters: GridConfigFilterState): GridViewPayloadFilter[] {
  const filterKeys: string[] = Object.keys(filters)
  const filterValues: GridConfigFilterState[] = Object.values(filters)
  const filterModels: GridViewPayloadFilter[] = filterValues.map((filterValue: GridConfigFilterState, index) => {
    const filterKey = filterKeys[index]
    const returnValue = { ...filterValue }
    returnValue.filterModels?.forEach((item) => {
      delete item?.condition1
      delete item?.condition2
    })
    delete returnValue.condition1
    delete returnValue.condition2
    return {
      ...returnValue,
      colId: filterKey,
    }
  })
  return filterModels
}

export function changeConfigToPayload(config: ViewPayload): GridViewPayload {
  const filters = config?.state?.filter
  if (isDefinedAndNotNull(filters)) {
    const filterModels = getFilterModelsFromConfig(filters)
    const payload: GridViewPayload = {
      Display: config.name,
      Name: config.gridKey,
      Columns: config.state?.column,
      Filters: filterModels,
    }
    if (config.id !== undefined) {
      payload.UserPreferenceId = Number(config.id)
    }
    return payload
  }

  const payload: GridViewPayload = {
    Columns: config.state?.column,
    Name: config.gridKey,
    Display: config.name,
  }
  if (config.id !== undefined) {
    payload.UserPreferenceId = Number(config.id)
  }
  return payload
}
export function changeResponseToConfig(response: GridViewResponse): GridView {
  const filters = response.Filters
  if (isDefinedAndNotNull(filters)) {
    const filterValues: GridViewPayloadFilter[] = Object.values(filters)
    const models = {}
    filterValues.forEach((filterValue: GridViewPayloadFilter): GridConfigFilterState => {
      const filterKey = filterValue.colId
      const values: GridConfigFilterState = { ...filterValue, colId: undefined }
      delete values.colId
      if (values.conditions) {
        values.condition1 = values.conditions[0]
        values.condition2 = values.conditions[1]
      }
      if (values.filterModels?.some((item) => item?.conditions)) {
        values.filterModels = values.filterModels.map((item) => {
          if (item?.conditions) {
            item.condition1 = item.conditions[0]
            item.condition2 = item.conditions[1]
          }
        })
      }
      models[filterKey] = values
    })
    return {
      name: response.Display,
      gridKey: response.Name,
      id: response.UserPreferenceId,
      state: {
        column: response.Columns,
        filter: models,
      },
    }
  }
  return {
    name: response.Display,
    gridKey: response.Name,
    id: response.UserPreferenceId,
    state: {
      column: response.Columns,
    },
  }
}
