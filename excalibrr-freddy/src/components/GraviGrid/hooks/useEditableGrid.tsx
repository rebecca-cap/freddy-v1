import moment from 'moment'
import { MutableRefObject, useState } from 'react'

import { CellValueChangedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { dateFormat } from '../../../constants/dateFormat'
import { NotificationMessage } from '../../DataDisplay/NotificationMessage'
import { ChangeMeta } from '../BulkChangeBar'

export const useEditableGrid = <T,>(
  gridRef: MutableRefObject<AgGridReact | null>,
  onUpdate:
    | ((newValues: T | T[], meta?: ChangeMeta<T>) => Promise<any>)
    | undefined,
  onCreate:
    | ((newValues: T | T[], meta?: ChangeMeta<T>) => Promise<any>)
    | undefined,
  spreadCreateResponse: boolean,
  shouldInsertCreated: boolean,
  lastSaved: string | undefined,
  setLastSaved: (lastSaved: string) => void
) => {
  const [saving, setSaving] = useState(false)
  const [viewCreateModal, setViewCreateModal] = useState(false)

  const onCellValueChanged = (event: CellValueChangedEvent) => {
    const meta = {
      // @ts-ignore - we're using colId anyways
      colId: event.column?.colId,
      newValue: event.newValue,
      oldValue: event.oldValue,
      updatedRowIndex: event.rowIndex!,
    }

    setSaving(true)
    if (event.newValue === 'N/A') {
      const { field } = event.colDef
      event.data[field!] = null
      if (onUpdate) onUpdate(event.data, meta)
    } else {
      if (onUpdate) onUpdate(event.data, meta)
    }
    setSaving(false)
    setLastSaved(moment().format(dateFormat.TIME))
  }

  const handleCreate = (newValues: T) => {
    if (onCreate) {
      onCreate(newValues)
        .then((resp) => {
          if (shouldInsertCreated) {
            if (resp) {
              if (gridRef?.current) {
                if (spreadCreateResponse) {
                  newValues = { ...newValues, ...resp.data }
                }
                const { api } = gridRef.current
                api.applyTransaction({
                  add: [newValues],
                  addIndex: 0,
                })
              }
              NotificationMessage('Success', 'New item created.', false)
            } else {
              NotificationMessage(
                'Error',
                'There was an issue creating a new item.',
                true
              )
            }
          }
        })
        .catch((err: any) => console.error(err))
    }
  }

  return {
    saving,
    lastSaved,
    onCellValueChanged,
    viewCreateModal,
    setViewCreateModal,
    handleCreate,
  }
}
