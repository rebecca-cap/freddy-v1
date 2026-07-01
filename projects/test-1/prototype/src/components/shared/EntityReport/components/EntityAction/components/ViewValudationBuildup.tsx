import { CloseOutlined, LoadingOutlined } from '@ant-design/icons'
import { BBDTag, GraviButton, GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useApi } from '@gravitate-js/excalibrr'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export function ViewValuationBuildup({ currentItemId, setIsInfoModalOpen }) {
  const api = useApi()

  const { data: viewBuildupQuery, status } = useQuery(
    [`EntityReport::${currentItemId}::ViewBuildup`, currentItemId],
    () => api.post(`FormulaResultDetails/GetDetailsByCurvePointPriceId`, { CurvePointPriceId: currentItemId })
  )

  function columnDefinitions(queryData) {
    const columnConfig = {
      resizable: false,
      suppressMenu: true,
      suppressColumnsToolPanel: true,
      filter: false,
      sortable: false,
    }
    const columnDefs = [
      {
        headerName: 'Name',
        field: 'ComponentDisplayName',
        valueGetter: (params) => `${params.data.ComponentDisplayName ?? params.data.ComponentName}`,
        minWidth: 300,
        ...columnConfig,
      },
      {
        headerName: 'Description',
        field: 'PriceInstrumentName',
        valueGetter: (params) => `${params.data.PriceInstrumentName ?? 'N/A'}`,
        minWidth: 300,
        ...columnConfig,
      },
      {
        headerName: 'Type',
        field: 'PriceTypeCodeValueDisplay',
        ...columnConfig,
      },
      {
        headerName: 'Value',
        field: 'ComponentResult',
        valueFormatter: fmt.decimal,
        type: 'rightAligned',
        ...columnConfig,
      },
      {
        headerName: 'UOM',
        field: 'UnitOfMeasureName',
        ...columnConfig,
      },
      {
        headerName: 'Target UOM Value',
        field: 'TargetUnitOfMeasureName',
        valueGetter: (params) =>
          `${
            params.data.UnitOfMeasureName === queryData.TargetUnitOfMeasureName
              ? 'UOM Matches'
              : queryData.TargetUnitOfMeasureName
          }`,
        ...columnConfig,
      },
      {
        headerName: 'As Of Date',
        field: 'EffectiveAsOfDate',
        ...columnConfig,
      },
      {
        headerName: 'Status',
        field: 'ComponentStatus',
        maxWidth: 125,
        cellRenderer: ({ data }) => {
          if (data) return getStatus(data.ComponentStatus)
          return ''
        },
        ...columnConfig,
      },
    ]

    return columnDefs
  }

  const getStatus = (status) => {
    switch (status) {
      case 'A':
        return (
          <BBDTag success style={{ textAlign: 'center' }}>
            Priced
          </BBDTag>
        )
      case 'O':
        return (
          <BBDTag warning style={{ textAlign: 'center' }}>
            Priced (Old)
          </BBDTag>
        )
      case 'M':
        return (
          <BBDTag className='full-height-width' error style={{ textAlign: 'center' }}>
            Missing!
          </BBDTag>
        )
      default:
        return <BBDTag theme1> {status} </BBDTag>
    }
  }
  if (status === 'loading') {
    return (
      <Horizontal verticalCenter horizontalCenter className='p-5 full-height-width'>
        <LoadingOutlined style={{ fontSize: 50, color: 'var(--gray-400)' }} spin />
      </Horizontal>
    )
  }

  if (status === 'error' || !viewBuildupQuery?.Data) {
    return (
      <Horizontal verticalCenter horizontalCenter className='p-5 full-height-width'>
        {status === 'error' ? (
          <>
            <Texto category='h5'> Error loading data</Texto>
            <Texto category='p2'>
              Please try again later, or if this problem persists, please contact support staff.
            </Texto>
          </>
        ) : (
          <>
            <Texto category='h5'> No buildup data found </Texto>
            <Texto category='p2'>No buildup data was found for this item. </Texto>
          </>
        )}
      </Horizontal>
    )
  }

  return (
    <Vertical verticalCenter className='p-3'>
      <Horizontal className='p-3 border-bottom full-height-width'>
        <Texto
          category='heading'
          textTransform='uppercase'
          appearance='theme1'
          style={{ color: 'var(--theme-color-1)' }}
        >
          {viewBuildupQuery?.Data?.ForCounterPartyName} - {viewBuildupQuery?.Data?.ForProductName} @{' '}
          {viewBuildupQuery?.Data.ForLocationName}
        </Texto>
      </Horizontal>
      <Horizontal className='p-3 border-bottom full-height-width ml-3'>
        <Vertical flex={0.5}>
          <Texto category='h5'>Value:</Texto>
        </Vertical>
        <Vertical flex={2}>
          <Texto category='p2'> {viewBuildupQuery?.Data?.Result} </Texto>
        </Vertical>
      </Horizontal>
      <Horizontal className='p-3 border-bottom full-height-width ml-3'>
        <Vertical flex={0.5}>
          <Texto category='h5'>Calculation:</Texto>
        </Vertical>
        <Vertical flex={2}>
          <Texto category='p2'> {viewBuildupQuery?.Data?.Formula} </Texto>
        </Vertical>
      </Horizontal>
      <Horizontal className='p-3 border-bottom full-height-width ml-3'>
        <Vertical flex={0.5}>
          <Texto category='h5'>Valuation:</Texto>
        </Vertical>
        <Vertical flex={2}>
          <Texto category='p2'> {viewBuildupQuery?.Data?.FilledFormula} </Texto>
        </Vertical>
      </Horizontal>
      <div className='p-3' style={{ minWidth: '100%', height: 515 }}>
        <GraviGrid
          controlBarProps={{
            title: 'Variables',
          }}
          agPropOverrides={{
            columnDefs: columnDefinitions(viewBuildupQuery?.Data),
            getRowId: (row) => row.data?.FormulaResultComponentId,
          }}
          rowGroupPanelShow='never'
          sideBar={false}
          storageKey='valuation-variables'
          rowData={viewBuildupQuery?.Data?.ResultComponents}
        />
      </div>
      <Horizontal className='justify-end full-height-width mt-3'>
        <GraviButton icon={<CloseOutlined />} buttonText='Close' default onClick={() => setIsInfoModalOpen(false)} />
      </Horizontal>
    </Vertical>
  )
}
