// Someday, the page permissions, or even the pages that exist in a site, will come down to us from the API.
// We might find a fancier way of this, and we should, but each of those have a URL. If that url comes down and contains Entity Report, when we build the page, its component will be an EntityReport WITH ONE PROP.
// That prop is the pages unique key in a string fashion.

// that page will be an instance of EntityReport with the sole prop of the key.
// when that page loads, we will hit an EP that gives us the schema from the key. (always the same EP)
// once we get that response back, we will get the url for the Read EP and hit it with the default filters (if any)

import { EntityActionModal } from '@components/shared/EntityReport/components/EntityAction/components/EntityActionModal'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { EntitySchemaResponse } from '@utils/api/index.types'
import React, { useCallback } from 'react'

import { useChildEntityReport } from '../../../../hooks/useEntityReport'

interface IProps {
  childSchema: EntitySchemaResponse['Data']['DetailSchema']
  parentPK: string
  detailId: string
}

export const ChildEntityReport: React.FC<IProps> = ({ childSchema, parentPK, detailId }) => {
  const {
    primaryKey,
    gridRef,
    dataQuery,
    columnDefs,
    reportKey,
    selectedEntityAction,
    currentItemId,
    isInfoModalOpen,
    setIsInfoModalOpen,
  } = useChildEntityReport({ childSchema, parentPK, detailId })

  const getPKValue = useCallback(
    (row: any) => {
      if (primaryKey) {
        return row.data[primaryKey]
      }
      return JSON.stringify(row.data)
    },
    [primaryKey]
  )

  return (
    <>
      <EntityActionModal
        primaryKey={primaryKey}
        currentItemId={currentItemId}
        schemaData={childSchema}
        selectedEntityAction={selectedEntityAction}
        isInfoModalOpen={isInfoModalOpen}
        setIsInfoModalOpen={setIsInfoModalOpen}
        dataQuery={dataQuery}
      />
      <GraviGrid
        agPropOverrides={{
          getRowId: getPKValue,
          rowGroupPanelShow: 'never',
          domLayout: 'autoHeight',
        }}
        suppressDragLeaveHidesColumns
        sideBar={false}
        rowGroupPanelShow='never'
        detailRowAutoHeight
        externalRef={gridRef}
        storageKey={`EntityReport::${reportKey}::GridConfig`}
        loading={dataQuery.isFetching || !childSchema}
        rowData={dataQuery.data?.Data}
        columnDefs={columnDefs}
        enableRangeSelection={false}
        resetRowDataOnUpdate
      />
    </>
  )
}
