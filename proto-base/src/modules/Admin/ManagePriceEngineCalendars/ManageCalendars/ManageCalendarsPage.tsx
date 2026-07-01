import { APIResponse, MetadataListResponseItem } from '@api/globalTypes'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { colDefs } from '@modules/Admin/ManagePriceEngineCalendars/ManageCalendars/components/colDefs'
import { GridApi } from 'ag-grid-community'
import { MutableRefObject, useMemo, useRef } from 'react'

import { usePriceEngineCalendars } from '../api'
import { CalendarMetadata, UpsertCalendarsRequest } from '../api/types'
import { newCalendarCreateConfig } from './components/createConfig'

export function ManageCalendarsPage({ metadata }: { metadata?: APIResponse<CalendarMetadata> }) {
  const gridRef = useRef() as MutableRefObject<GridApi<MetadataListResponseItem>>
  const { upsertCalendars } = usePriceEngineCalendars()

  const agPropOverrides = useMemo(() => {
    return { getRowId: (row) => row.data.Value }
  }, [])
  const controlBarProps = useMemo(() => {
    return {
      title: 'Manage Calendars',
      hideActiveFilters: false,
    }
  }, [])
  const columnDefs = useMemo(() => colDefs(), [])
  const createEP = async (data: { CalendarName: string }) => {
    const payload = {
      CalendarName: data.CalendarName,
      SourceExtractedDateTime: new Date().toISOString(),
    } as UpsertCalendarsRequest
    await upsertCalendars.mutateAsync([payload])
  }
  return (
    <GraviGrid
      agPropOverrides={agPropOverrides}
      controlBarProps={controlBarProps}
      rowData={metadata?.Data?.CalendarList}
      columnDefs={columnDefs}
      createEP={createEP}
      createConfig={newCalendarCreateConfig}
      externalRef={gridRef}
      createSelectOptions={[]}
    />
  )
}
