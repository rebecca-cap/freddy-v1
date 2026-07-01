import {
  BulkNumberCellEditor,
  type BulkNumberCellEditorProps,
} from '@components/shared/Grid/bulkChange/BulkNumberCellEditor'
import type { ColDef, ColGroupDef, ValueSetterParams } from 'ag-grid-community'

import { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor'
import { NotificationMessage } from '@gravitate-js/excalibrr'
import type { GetForConfigurationResponse, GetMetaDataResponse } from '../../../Api/usePriceExceptionsTyped'
import { type ThresholdBound, boundLabels, thresholdBounds } from '../../../utils/constants'
import { findThresholdViolation } from '../../../utils/helpers'

type ThresholdRow = NonNullable<GetForConfigurationResponse['Data']>[number]
type ThresholdEntry = NonNullable<ThresholdRow['Thresholds']>[number]
type ComponentMeta = NonNullable<GetMetaDataResponse['Components']>[number]

type GraviColDef = ColDef<ThresholdRow> & {
  isBulkEditable?: boolean
  bulkCellEditor?: any
  bulkCellEditorParams?: Partial<BulkNumberCellEditorProps<ThresholdRow>>
}

export function getPriceExceptionColumnDefs(
  canWrite: boolean,
  componentMetaData: ComponentMeta[]
): (ColDef | ColGroupDef)[] {
  return [
    QuoteConfiguration(),
    Product(),
    Location(),
    ...componentMetaData.map((meta) => createComponentGroup(meta, canWrite)),
  ]
}

const QuoteConfiguration = (): ColDef<ThresholdRow> => ({
  field: 'QuoteConfigurationName',
  headerName: 'Quote Configuration',
  rowGroup: true,
  editable: false,
  hide: true,
})

const Product = (): ColDef<ThresholdRow> => ({
  field: 'ProductName',
  headerName: 'Product',
  editable: false,
})

const Location = (): ColDef<ThresholdRow> => ({
  field: 'LocationName',
  headerName: 'Location',
  editable: false,
})

function getCellStyle(bound: ThresholdBound) {
  if (bound === 'CriticalBelow' || bound === 'CriticalAbove') {
    return { backgroundColor: 'var(--theme-error-dim)' }
  }
  if (bound === 'WarningBelow' || bound === 'WarningAbove') {
    return { backgroundColor: 'var(--theme-warning-dim)' }
  }
  return undefined
}

function findEntry(row: ThresholdRow | undefined, cvId: number): ThresholdEntry | undefined {
  return row?.Thresholds?.find((t) => t.PricingExceptionComponentCvId === cvId)
}

function createValueSetter(cvId: number, bound: ThresholdBound) {
  return (params: ValueSetterParams<ThresholdRow>) => {
    const newValue = params.newValue == null || params.newValue === '' ? null : parseFloat(params.newValue)
    if (newValue !== null && Number.isNaN(newValue)) return false
    if (newValue !== null && (newValue > 10 || newValue < -10)) {
      NotificationMessage('Could not save', 'Value must be between 10 and -10.', true)
      return false
    }
    if (!params.data.Thresholds) params.data.Thresholds = []
    let entry = params.data.Thresholds.find((t) => t.PricingExceptionComponentCvId === cvId)

    if (!entry) {
      entry = { PricingExceptionComponentCvId: cvId } as ThresholdEntry
      params.data.Thresholds.push(entry)
    }

    const proposed = { ...entry, [bound]: newValue }
    const violation = findThresholdViolation(proposed)
    if (violation) {
      NotificationMessage(
        'Could not save',
        `${boundLabels[violation.lower]} must be \u2264 ${boundLabels[violation.upper]}`,
        true
      )
      return false
    }

    entry[bound] = newValue
    return true
  }
}

function createThresholdColumn(meta: ComponentMeta, bound: ThresholdBound, canWrite: boolean): GraviColDef {
  const cvId = parseInt(meta.Value ?? '0', 10)
  const colId = `${cvId}.${bound}`
  let lastWarnedVal: number | null | undefined

  return {
    colId,
    field: colId,
    headerName: `${meta.Text} ${boundLabels[bound]}`,
    headerValueGetter: () => boundLabels[bound],
    valueGetter: (params) => findEntry(params.data, cvId)?.[bound] ?? null,
    valueSetter: createValueSetter(cvId, bound),
    editable: canWrite,
    filter: 'agNumberColumnFilter',
    cellEditor: NumberCellEditor,
    cellEditorParams: {
      precision: fmt.currentPrecision,
      allowZero: true,
    },
    cellStyle: getCellStyle(bound),
    valueFormatter: ({ value }) => (value == null ? '' : fmt.decimal(value)),
    isBulkEditable: canWrite,
    bulkCellEditor: BulkNumberCellEditor,
    bulkCellEditorParams: {
      allowZero: true,
      step: 0.0001,
      min: -10,
      max: 10,
      precision: fmt.currentPrecision,
      getChanges: (val: number | null, row: ThresholdRow) => {
        const thresholds = [...(row.Thresholds ?? [])]
        const idx = thresholds.findIndex((t) => t.PricingExceptionComponentCvId === cvId)
        if (idx >= 0) {
          thresholds[idx] = { ...thresholds[idx], [bound]: val }
        } else {
          thresholds.push({ PricingExceptionComponentCvId: cvId, [bound]: val } as ThresholdEntry)
        }
        return { Thresholds: thresholds }
      },
    },
  }
}

function createComponentGroup(meta: ComponentMeta, canWrite: boolean): ColGroupDef {
  return {
    headerName: meta.Text ?? '',
    marryChildren: true,
    children: thresholdBounds.map((bound) => createThresholdColumn(meta, bound, canWrite)),
  }
}
