import { GraviGrid, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { RecipientData } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/api/schema.types'
import { GridApi } from 'ag-grid-community'
import { MutableRefObject, useMemo, useRef } from 'react'

import { getColumnDefs } from './components/columnDefs'

interface NotificationDestinationsProps {
  counterparties: RecipientData[]
  isLoading: boolean
  canWrite: boolean
}

export function NotificationDestinations({ counterparties, isLoading, canWrite }: NotificationDestinationsProps) {
  const gridAPIRef = useRef() as MutableRefObject<GridApi>
  const storageKey = `PriceNotifications/NotificationDestinations`
  const gridViewManager = useGridViewManager(storageKey)
  const columnDefs = useMemo(() => getColumnDefs({ canWrite }), [canWrite])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data?.CounterPartyId,
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      suppressClickEdit: true,
    }),
    []
  )

  const controlBarProps = useMemo(
    () => ({
      title: 'Notification Destinations',
      hideActiveFilters: false,
    }),
    []
  )

  return (
    <div style={{ height: '85vh', width: '100%' }}>
      <Horizontal className='py-2 ml-2'>
        <Texto category='p2' appearance='medium' className='mb-2'>
          Configure notification types and destinations by counterparty.
        </Texto>
      </Horizontal>

      <GraviGrid
        rowData={counterparties}
        externalRef={gridAPIRef}
        columnDefs={columnDefs}
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        storageKey={storageKey}
        loading={isLoading}
        gridViewManager={gridViewManager}
      />
    </div>
  )
}
