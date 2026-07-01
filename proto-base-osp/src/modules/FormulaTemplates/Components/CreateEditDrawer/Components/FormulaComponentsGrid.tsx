import { GraviGrid } from '@gravitate-js/excalibrr'
import { FormulaTemplateMetadata } from '@modules/FormulaTemplates/Api/types.schema'
import {
  FormulaComponent,
  FormulaComponentsColumnDefs,
} from '@modules/FormulaTemplates/Components/CreateEditDrawer/Components/FormulaComponentsColumnDefs'
import { FormulaComponentRow } from '@modules/FormulaTemplates/Util/formConstants'
import { ColDef } from 'ag-grid-community'
import type { FormInstance } from 'antd'
import { useMemo } from 'react'

export interface FormulaComponentsGridProps {
  metadata?: Partial<FormulaTemplateMetadata>
  formulaComponents: FormulaComponentRow[]
  setFormulaComponents: React.Dispatch<React.SetStateAction<FormulaComponentRow[]>>
  form: FormInstance
  columnDefs?: ColDef[]
}
export function FormulaComponentsGrid({
  formulaComponents,
  setFormulaComponents,
  metadata,
  form,
  columnDefs: customColumnDefs,
}: FormulaComponentsGridProps) {
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params) => params.data.FormulaTemplateVariableId ?? params.data.IdForGrid,
      rowDragManaged: true,
      rowDragEntireRow: true,
      onRowDragEnd: (event: any) => {
        const newOrder: any[] = []
        event.api.forEachNode((node: any) => newOrder.push(node.data))
        setFormulaComponents(newOrder)
      },
    }),
    [formulaComponents]
  )
  const onCellValueChanged = (params) => {
    const changedField = params.column.getColId()
    setFormulaComponents((prev) =>
      prev.map((row) => {
        const isMatchingRow = row.FormulaTemplateVariableId
          ? row.FormulaTemplateVariableId === params.data.FormulaTemplateVariableId
          : row.IdForGrid === params.data.IdForGrid

        if (isMatchingRow) {
          if (changedField === 'DisplayName') {
            const isCleared = !params.newValue || params.newValue.trim() === ''
            return {
              ...params.data,
              DisplayName: isCleared ? null : params.newValue,
            }
          } else if (changedField === 'PricePublisherId') {
            return {
              ...params.data,
              PriceInstrumentId: null,
              PriceTypeCvId: null,
            }
          } else {
            return { ...params.data }
          }
        }
        return row
      })
    )
    form.setFieldsValue({ FormulaTemplateVariables: formulaComponents })

    if (changedField !== 'DisplayName') {
      params.api.refreshCells({ rowNodes: [params.node], columns: ['DisplayName'], force: true })
    }
  }
  const handleDelete = (data: FormulaComponent) => {
    setFormulaComponents(
      formulaComponents.filter((row) => {
        if (data.FormulaTemplateVariableId) {
          return row.FormulaTemplateVariableId !== data.FormulaTemplateVariableId
        } else return row.IdForGrid !== data.IdForGrid
      })
    )
    form.setFieldsValue({ FormulaTemplateVariables: formulaComponents })
  }
  const columnDefs = useMemo(
    () => customColumnDefs ?? FormulaComponentsColumnDefs({ metadata, handleDelete }),
    [customColumnDefs, metadata, handleDelete, formulaComponents]
  )
  return (
    <GraviGrid
      agPropOverrides={agPropOverrides}
      columnDefs={columnDefs}
      rowData={formulaComponents}
      // @ts-expect-error - GraviGrid types issue
      onCellValueChanged={onCellValueChanged}
    />
  )
}
