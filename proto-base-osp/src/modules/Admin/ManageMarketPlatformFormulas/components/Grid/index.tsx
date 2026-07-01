import { PlusOutlined } from '@ant-design/icons'
import { GraviButton, GraviGrid } from '@gravitate-js/excalibrr'
import _ from 'lodash'
import React from 'react'

export function MarketPlatformFormulaVariablesGrid({ formulaApi }) {
  return (
    <GraviGrid
      loading={formulaApi?.isMetadataLoading}
      storageKey='MarketPlatformFormulaVariablesGrid'
      updateEP={formulaApi?.canWrite ? formulaApi?.handleVariableChange : undefined}
      controlBarProps={{
        title: 'Variables',
        hideActiveFilters: false,
        actionButtons: formulaApi?.canWrite && (
          <GraviButton
            icon={<PlusOutlined />}
            buttonText='New Variable'
            theme2
            // Insert a blank row on variable create
            onClick={() =>
              formulaApi?.dispatch({
                type: 'ADD_FORMULA_VARIABLE',
                payload: {},
                metadata: formulaApi.metadata!,
              })
            }
          />
        ),
      }}
      agPropOverrides={{
        getRowId: (row) => row?.data?.FormulaVariableId,
      }}
      rowData={_.cloneDeep(formulaApi.selectedFormulaVariablesWithValues) || []}
      columnDefs={formulaApi?.marketPlatformVariableGridColumnDefs}
    />
  )
}
