// Someday, the page permissions, or even the pages that exist in a site, will come down to us from the API.
// We might find a fancier way of this, and we should, but each of those have a URL. If that url comes down and contains Entity Report, when we build the page, its component will be an EntityReport WITH ONE PROP.
// That prop is the pages unique key in a string fashion.

// that page will be an instance of EntityReport with the sole prop of the key.
// when that page loads, we will hit an EP that gives us the schema from the key. (always the same EP)
// once we get that response back, we will get the url for the Read EP and hit it with the default filters (if any)

import './styles.css'

import { EntityActionModal } from '@components/shared/EntityReport/components/EntityAction/components/EntityActionModal'
import { GraviButton, GraviGrid, RangePicker } from '@gravitate-js/excalibrr'
import { useEntityReport } from '@hooks/useEntityReport'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { DownloadButton } from '@modules/Admin/NetGrossDefaults/components/DownloadButton'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ChildEntityReport } from './ChildEntityReport'

interface IProps {
  reportKey: string // the entity report key 'AllPrices',.. etc
  childSchema?: any
  additionalActionButtons?: () => React.ReactNode
}

export const EntityReport: React.FC<IProps> = ({ reportKey, additionalActionButtons }) => {
  const {
    gridRef,
    dataQuery,
    schemaQuery,
    detailSchema,
    isFetching,
    isLoading,
    columnDefs,
    filters,
    setFilters,
    serverParams,
    primaryKey,
    primaryFilter,
    hiddenFilterKeys,
    selectedEntityAction,
    currentItemId,
    isInfoModalOpen,
    setIsInfoModalOpen,
  } = useEntityReport({ reportKey })

  const navigate = useNavigate()
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (detailSchema && gridRef.current) {
      // refresh the grid
      const api = gridRef.current
      const rowNodes = api.getRenderedNodes() // Get all rendered row nodes
      api.refreshCells({ rowNodes })
    }
  }, [detailSchema, gridRef?.current])

  const DetailView = useMemo(
    () =>
      function (params: any) {
        return (
          <div style={{ minHeight: 0 }}>
            <ChildEntityReport childSchema={detailSchema} parentPK={primaryKey} detailId={params.data[primaryKey]} />
          </div>
        )
      },
    [detailSchema, primaryKey]
  )
  const storageKey = useMemo(() => {
    return `EntityReport::${reportKey}::GridConfig`
  }, [reportKey])

  const gridViewManager = useGridViewManager(storageKey)

  return (
    <>
      <EntityActionModal
        primaryKey={primaryKey}
        currentItemId={currentItemId}
        schemaData={schemaQuery.data}
        selectedEntityAction={selectedEntityAction}
        isInfoModalOpen={isInfoModalOpen}
        setIsInfoModalOpen={setIsInfoModalOpen}
        dataQuery={dataQuery}
      />
      <GraviGrid
        controlBarProps={{
          serverParams: serverParams?.length ? serverParams.slice(1, serverParams.length) : undefined,
          title: schemaQuery?.data?.Data?.Schema?.Display,
          filters,
          setFilters,
          hiddenFilterKeys,
          actionButtons: (
            <>
              {additionalActionButtons && additionalActionButtons()}
              {reportKey === 'ContractManagement' &&
                (() => {
                  return (
                    <GraviButton
                      buttonText='Create Contract'
                      success
                      className='mr-3'
                      onClick={() => {
                        navigate('/ContractManagement/createContract')
                      }}
                    />
                  )
                })()}
              <DownloadButton gridAPIRef={gridRef} pageTitle={reportKey} setter={setIsDownloading} />
              {primaryFilter && (
                <RangePicker
                  inputKey={primaryFilter.filter_column}
                  dates={filters[primaryFilter.filter_column]}
                  onChange={(dates) => setFilters({ ...filters, [primaryFilter.filter_column]: dates })}
                  placement='bottomRight'
                />
              )}
            </>
          ),
        }}
        agPropOverrides={{
          getRowId: (params) => params?.data?.[primaryKey],
          pagination: dataQuery.data?.Data?.length >= 10000,
          paginationPageSize: 1000,
          paginateChildRows: true,
          columnDefaultOverrides: {
            flex: undefined,
            suppressExcelExport: true,
          },
        }}
        masterDetail
        isRowMaster={(rowData) => rowData.HideDetails != null && !rowData.HideDetails}
        detailCellRenderer={DetailView}
        detailRowAutoHeight
        externalRef={gridRef}
        storageKey={storageKey}
        loading={isFetching || isLoading || isDownloading}
        rowData={dataQuery.data?.Data ?? []}
        columnDefs={columnDefs}
        enableRangeSelection={false}
        resetRowDataOnUpdate
        gridViewManager={gridViewManager}
      />
    </>
  )
}
