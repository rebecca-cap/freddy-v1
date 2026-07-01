import {
  BulkNumberCellEditor,
  BulkNumberCellEditorProps,
} from '@components/shared/Grid/bulkChange/BulkNumberCellEditor'
import { BBDTag, Horizontal } from '@gravitate-js/excalibrr'
import { TradeEntrySetupVolumeThreshold } from '@modules/Admin/ManageVolumeThresholds/Api/types.schema'
import { ColDef } from 'ag-grid-community'
import React from 'react'

type GraviColDef<TData = any, TValue = any> = ColDef<TData, TValue> & {
  isBulkEditable?: boolean
  bulkCellEditor?: any
  bulkCellEditorParams?: Partial<BulkNumberCellEditorProps>
}
interface VolumeThresholdColumnsProps {
  canWrite: boolean
}

export const getManageVolumeThresholdColumns = ({
  canWrite,
}: VolumeThresholdColumnsProps): ColDef<TradeEntrySetupVolumeThreshold>[] => {
  return [
    TradeEntrySetupId(),
    Instrument(),
    Product(),
    Location(),
    Status(),
    MinVolume(canWrite),
    MaxVolume(canWrite),
    MinIncrement(canWrite),
    MonthlyMin(canWrite),
    MonthlyMax(canWrite),
    WarningThreshold(canWrite),
  ]
}

const TradeEntrySetupId = (): ColDef<TradeEntrySetupVolumeThreshold> => ({
  headerName: 'Id',
  field: 'TradeEntrySetupId',
  editable: false,
  hide: true,
})

const Instrument = (): ColDef<TradeEntrySetupVolumeThreshold> => ({
  headerName: 'Instrument',
  field: 'InstrumentName',
  editable: false,
})

const Product = (): ColDef<TradeEntrySetupVolumeThreshold> => ({
  headerName: 'Product',
  field: 'ProductName',
  editable: false,
})

const Location = (): ColDef<TradeEntrySetupVolumeThreshold> => ({
  headerName: 'Location',
  field: 'LocationName',
  editable: false,
})

const Status = (): ColDef<TradeEntrySetupVolumeThreshold> => ({
  headerName: 'Status',
  field: 'IsActive',
  editable: false,
  valueGetter: ({ data }) => (data?.IsActive ? 'Active' : 'Inactive'),
  cellRenderer: ({ value, data }) => {
    const active = !!data?.IsActive
    return (
      <Horizontal width='100%' horizontalCenter>
        <BBDTag className='columns-bbd-tag' success={active} error={!active}>
          {value}
        </BBDTag>
      </Horizontal>
    )
  },
})

const MinVolume = (canWrite: boolean): GraviColDef<TradeEntrySetupVolumeThreshold> => ({
  headerName: 'Min Volume',
  field: 'MinimumVolume',
  editable: canWrite,
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
  cellEditor: 'agNumberCellEditor',
  isBulkEditable: canWrite,
  bulkCellEditor: BulkNumberCellEditor,
  bulkCellEditorParams: {
    field: 'MinimumVolume',
    min: 0,
    step: 1,
    precision: 0,
    allowZero: true,
  },
  valueFormatter: ({ value }) => (value == null ? '' : `${fmt.integer(value, 0)}`),
})

const MaxVolume = (canWrite: boolean): GraviColDef<TradeEntrySetupVolumeThreshold> => ({
  headerName: 'Max Volume',
  field: 'MaximumVolume',
  editable: canWrite,
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
  cellEditor: 'agNumberCellEditor',
  isBulkEditable: canWrite,
  bulkCellEditor: BulkNumberCellEditor,
  bulkCellEditorParams: {
    field: 'MaximumVolume',
    min: 0,
    step: 1,
    precision: 0,
    allowZero: true,
  },
  valueFormatter: ({ value }) => (value == null ? '' : `${fmt.integer(value, 0)} `),
})

const MinIncrement = (canWrite: boolean): GraviColDef<TradeEntrySetupVolumeThreshold> => ({
  headerName: 'Min Increment',
  field: 'MinimumVolumeIncrement',
  editable: canWrite,
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
  cellEditor: 'agNumberCellEditor',
  isBulkEditable: canWrite,
  bulkCellEditor: BulkNumberCellEditor,
  bulkCellEditorParams: {
    field: 'MinimumVolumeIncrement',
    min: 0,
    step: 1,
    precision: 0,
    allowZero: true,
  },
  valueFormatter: ({ value }) => (value == null ? '' : `${fmt.integer(value, 0)} `),
})

const MonthlyMin = (canWrite: boolean): GraviColDef<TradeEntrySetupVolumeThreshold> => ({
  headerName: 'Monthly Min',
  field: 'MonthlyMinimumVolume',
  editable: canWrite,
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
  cellEditor: 'agNumberCellEditor',
  isBulkEditable: canWrite,
  bulkCellEditor: BulkNumberCellEditor,
  bulkCellEditorParams: {
    field: 'MonthlyMinimumVolume',
    min: 0,
    step: 1,
    precision: 0,
    allowZero: true,
  },
  valueFormatter: ({ value }) => (value == null ? '' : `${fmt.integer(value)}`),
})

const MonthlyMax = (canWrite: boolean): GraviColDef<TradeEntrySetupVolumeThreshold> => ({
  headerName: 'Monthly Max',
  field: 'MonthlyMaximumVolume',
  editable: canWrite,
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
  cellEditor: 'agNumberCellEditor',
  isBulkEditable: canWrite,
  bulkCellEditor: BulkNumberCellEditor,
  bulkCellEditorParams: {
    field: 'MonthlyMaximumVolume',
    min: 0,
    step: 1,
    precision: 0,
    allowZero: true,
  },
  valueFormatter: ({ value }) => (value == null ? '' : `${fmt.integer(value, 0)}`),
})

const WarningThreshold = (canWrite: boolean): GraviColDef<TradeEntrySetupVolumeThreshold> => ({
  headerName: 'Warning Threshold',
  field: 'WarningVolumeThreshold',
  editable: canWrite,
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
  cellEditor: 'agNumberCellEditor',
  isBulkEditable: canWrite,
  bulkCellEditor: BulkNumberCellEditor,
  bulkCellEditorParams: {
    field: 'WarningVolumeThreshold',
    min: 0,
    step: 1,
    precision: 0,
    allowZero: true,
  },
  valueFormatter: ({ value }) => (value == null ? '' : `${fmt.integer(value, 0)}`),
})
