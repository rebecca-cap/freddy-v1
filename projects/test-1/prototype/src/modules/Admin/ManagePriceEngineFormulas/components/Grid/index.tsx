import { GraviButton, GraviGrid } from '@gravitate-js/excalibrr'
import _ from 'lodash'
import React, { useMemo } from 'react'

export function PriceEngineFormulaVariablesGrid({ formulaApi }) {
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row?.data?.FormulaVariableId,
      suppressDragLeaveHidesColumns: true,
    }),
    [formulaApi?.selectedFormulaVariablesWithValues]
  )
  const controlBarProps = useMemo(
    () => ({
      title: 'Variables',
      actionButtons: formulaApi?.canWrite && (
        <GraviButton
          buttonText='Create Variable'
          theme2
          // Insert a blank row on variable create
          onClick={() =>
            formulaApi.metadata &&
            formulaApi?.dispatch({
              type: 'ADD_FORMULA_VARIABLE',
              payload: {},
              metadata: formulaApi.metadata,
            })
          }
        />
      ),
    }),
    [formulaApi?.canWrite, formulaApi?.metadata]
  )

  return (
    <GraviGrid
      loading={formulaApi?.isMetadataLoading}
      updateEP={formulaApi?.canWrite ? formulaApi?.handleVariableChange : undefined}
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      columnDefs={formulaApi?.variableGridColumnDefs}
      rowData={_.cloneDeep(formulaApi?.selectedFormulaVariablesWithValues)}
    />
  )
}
