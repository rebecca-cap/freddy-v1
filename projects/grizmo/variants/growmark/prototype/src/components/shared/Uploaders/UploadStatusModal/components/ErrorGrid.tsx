import { GraviGrid, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { useMemo } from 'react'

export function ErrorGrid({ displayErrors }: { displayErrors: any[] }) {
  const controlBarProps = useMemo(() => ({ title: 'Errors' }), [])
  const agPropOverrides = useMemo(() => ({ getRowId: (row) => row.data.Id, rowHeight: 40 }), [displayErrors])
  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Row Number',
        field: 'RowNumber',
      },
      {
        headerName: 'Errors',
        field: 'Errors',
        cellRenderer: ({ data }) => (
          <Horizontal>
            {data.Errors.map((error, index) => (
              <Texto className='mr-1' key={error + index} style={{ color: 'var(--theme-error)' }}>
                {error}
                {index !== data.Errors.length - 1 ? ', ' : ''}
              </Texto>
            ))}
          </Horizontal>
        ),
      },
    ],
    [displayErrors]
  )
  return (
    <div style={{ height: '300px' }}>
      <GraviGrid
        rowData={displayErrors}
        columnDefs={columnDefs}
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        sideBar={false}
      />
    </div>
  )
}
