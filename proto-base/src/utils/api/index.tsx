import { EntityActionMenu } from '@components/shared/EntityReport/components/EntityAction/components/EntityActionMenu'
import { ColumnFilterWithTooltip } from '@components/shared/Grid/ColumnFilterWithTooltip'
import { dateFilterParams } from '@components/shared/Grid/dateFilterParams'
import { QueryClient, UseQueryResult } from '@tanstack/react-query'
import { message } from 'antd'
import dayjs from '@utils/dayjs'

import { isDefined } from '..'
import { EntitySchemaResponse, EntityViewColumn, PageComponent } from './index.types'

const defaultDateFormatter = (params) => (params?.value ? dayjs(params?.value).format('L LTS') : '')
// const defaultDateFormatter = (params) => params.value

function getDefaultValueFormatter(column: EntityViewColumn) {
  // Not sure why, but `Trade From` and `Updated` have a missing DataTypeDisplay on the `All Prices` report
  // So we're forcing those to use the same default date formatter for now.
  if (isDateOrTimeColumn(column)) {
    return defaultDateFormatter
  }

  switch (column.DataTypeDisplay) {
    case 'decimal':
      return fmt.decimal
    case 'currency':
      return fmt.currency
    default:
      return (params) => params?.value ?? ''
  }
}

function getDefaultSorter(column: EntityViewColumn) {
  if (isDateOrTimeColumn(column)) {
    return (a, b) => {
      const ma = a ? dayjs(a) : dayjs().set('year', 1900)
      const mb = b ? dayjs(b) : dayjs().set('year', 1900)
      return ma.isAfter(mb) ? 1 : -1
    }
  }
  if (column.DataTypeDisplay === 'decimal') {
    return (a, b) => a - b
  }
  return (a, b) => {
    const getFixedValue = (value: string | number) => (typeof value === 'number' ? value.toLocaleString() : value)
    const _a = isDefined(a) ? getFixedValue(a) : ''
    const _b = isDefined(b) ? getFixedValue(b) : ''
    return _a?.localeCompare(_b)
  }
}

// Helper function to make sure we capture all date / time columns correctly.
const isDateOrTimeColumn = (column: EntityViewColumn) => column.DataTypeMeaning === 'System.DateTime'

const isDecimalColumn = (column: EntityViewColumn) => column.DataTypeDisplay?.toLowerCase().trim() === 'decimal'

const valuationStatusCellStyleFn = (params) => {
  if (['estimate', 'estimated'].includes(params.value?.toLowerCase())) {
    return { backgroundColor: 'var(--theme-color-1-dim)' }
  }
}

/**
 *
 * @description Returns a normalized list of column defs used by GraviGrid.
 */
export const getEntityReportColumnDefs = (
  response: EntitySchemaResponse['Data']['Schema'],
  primaryKey: string,
  setIsInfoModalOpen: (isInfoModalOpen: boolean) => void,
  setCurrentItemId: (currentItemId: number) => void,
  setIsDeleteModalOpen: (isDeleteModalOpen: boolean) => void,
  setSelectedEntityAction: any,
  dataQuery?: UseQueryResult<any, unknown>,
  hasDetailSchema = false
) => {
  if (!response) return []

  let cols = [
    ...response.EntityView.EntityViewColumns.filter((c) => c.IsVisible).map((column) => {
      const def = {
        field: column.ColumnName,
        headerName: column.DisplayName,
        filterParams: {
          cellRenderer: ColumnFilterWithTooltip,
        },
        ...(isDecimalColumn(column) && { type: 'rightAligned' }),
        ...(isDecimalColumn(column) && { filter: 'agNumberColumnFilter' }),
        ...(isDateOrTimeColumn(column) && {
          filter: 'agDateColumnFilter',
          filterParams: { cellRenderer: ColumnFilterWithTooltip, ...dateFilterParams },
        }),
        ...(column.ColumnName === 'ValuationStatus' && {
          cellStyle: valuationStatusCellStyleFn,
        }),
      }

      const defaultFormatter = getDefaultValueFormatter(column)
      const defaultSorter = getDefaultSorter(column)

      if (defaultFormatter) {
        def.valueFormatter = defaultFormatter
      }

      if (defaultSorter) {
        def.comparator = defaultSorter
      }

      return def
    }),
  ]

  if (hasDetailSchema) {
    cols = [
      {
        field: primaryKey,
        cellRenderer: 'agGroupCellRenderer',
        valueFormatter: () => '',
        headerName: '',
        maxWidth: 50,
      },
      ...cols,
    ]
  }

  const actionColumn = {
    field: '',
    headerName: 'Actions',
    filter: false,
    pinned: 'right',
    width: 140,
    cellRendererParams: {
      schema: response,
      primaryKey: response.EntityView.PrimaryKeyField,
      setIsInfoModalOpen,
      setCurrentItemId,
      setIsDeleteModalOpen,
      setSelectedEntityAction,
      dataQuery,
    },
    cellRenderer: EntityActionMenu,
  }
  if (response?.PageSetupEntityActions.length) {
    cols.push(actionColumn)
  }
  return cols
}

/**
 *
 * @description Some entity report filters are 'invisible' and not intended to be accesible by the user. Think of these as hidden form inputs
 */
const isVisibleComponent = (component: PageComponent) =>
  typeof component?.ViewName !== 'undefined' && component?.ViewName !== null

/**
 *
 * @description Returns a normalized server filter config used by GraviGrid to build the filter drawer.
 */
export const getServerParams = (response: EntitySchemaResponse['Data']) => {
  if (!response) return []
  return response.Schema.PageComponents.filter(isVisibleComponent).map((component) => {
    const defaultValueKeys = component.PageComponentFields.map((field) => field.Name)
    const def = {
      _component: { ...component }, // keep a copy of the original component incase we need it in excalibrr land.
      datatype: filterParamConversion(component.ViewName),
      title: component.Display,
      filter_column: component.Display,
      component_name: component.Name,
      inputNames: component.PageComponentFields.map((field) => field.Name),
      customFilterOption: (input, option) => option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0,
      ...(defaultValueKeys.some((k) => isDefined(component.ComponentData[k])) && {
        defaultValues:
          component.ViewName === 'DateRangeSlider'
            ? component.IsPrimary
              ? defaultValueKeys.map((k) => new Date(component.ComponentData[k]))
              : null
            : component.ComponentData[defaultValueKeys[0]],
      }),
    }

    if (component.ViewName === 'DropDown') {
      def.options = component.ComponentData.Items.filter((option) => !!option.Value).map((option) => {
        return {
          value: option.Value,
          text: option.Text,
        }
      })
    }
    return def
  })
}

/**
 *
 * @description Returns a normalized array of filter inputs for server-side filtering on entity report read endpoints
 */
export const getFilterInputs = (
  filters: Array<Record<string, object>>,
  serverParams: ReturnType<typeof getServerParams>
) =>
  Object.entries(filters).flatMap(([k, v]) => {
    const matchingDef = serverParams.find((p) => p.filter_column === k)

    if (Array.isArray(v)) {
      return v.map((subValue, i) => {
        const ret = {
          Value: subValue,
          // ComponentName: k,
          ComponentName: matchingDef?.component_name,
          ComponentField: matchingDef?._component.PageComponentFields[i]?.Name,
        }
        return ret
      })
    }

    return [
      {
        Value: v,
        // ComponentName: k,
        ComponentName: matchingDef?.component_name,
        ComponentField: matchingDef?._component.PageComponentFields[0]?.Name,
      },
    ]
  })

/**
 *
 * @description A simple lookup table for converting GNET component names to what GraviGrid is expecting
 */
const filterParamConversion = (param: string) => {
  switch (param) {
    case 'DropDown':
      return 'dropdown'
    case 'DateRangePicker':
      return 'daterangepicker'
    case 'DateRangeSlider':
      return 'daterangeslider'
    case 'TextBox':
    default:
      return 'text'
  }
}

export const eagerlyUpdateRowData = <T extends Record<string, any>>(
  updatedOrInserted: T,
  cacheKey: string,
  primaryKey: keyof T,
  queryClient: QueryClient,
  removeInactive = false,
  insertPosition: 'top' | 'bottom' = 'top'
) => {
  queryClient.setQueriesData<{ TotalRecords: number; Data: T[]; Query: {} }>({ queryKey: [cacheKey] }, (cache) => {
    if (!cache) return

    const existingConfig = cache.Data.some((c) => c[primaryKey] === updatedOrInserted[primaryKey])
    const newConfig = insertPosition === 'top' ? [updatedOrInserted, ...cache.Data] : [...cache.Data, updatedOrInserted]

    let updatedData = existingConfig
      ? cache.Data.map((row) => (row[primaryKey] === updatedOrInserted[primaryKey] ? updatedOrInserted : row))
      : newConfig

    if (removeInactive) {
      updatedData = updatedData.filter((row) => row.IsActive !== false)
    }

    return {
      ...cache,
      Data: updatedData,
    }
  })
}

export const alertIfErr = <T extends { Validations: { Message: string }[] }>(
  resp: T,
  fallbackErrorMessage?: string
) => {
  const isErr = resp.Validations?.length > 0

  if (isErr) {
    const firstError = resp?.Validations[0]?.Message
    message.error(firstError || fallbackErrorMessage || 'Whoops - something went wrong')
    console.error(resp.Validations)
  }

  return isErr
}
