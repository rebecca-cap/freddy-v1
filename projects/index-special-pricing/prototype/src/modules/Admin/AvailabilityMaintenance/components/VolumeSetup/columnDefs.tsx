import { ItemDetails } from '@api/useAvailabilityMaintenance/types'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { toAntOption } from '@utils/index'
import { ColDef } from 'ag-grid-community'

import { BulkVolumeGroupEditor } from './BulkVolumeGroupEditor'

interface IProps {
  canWrite: boolean
  volumeGroups?: ItemDetails[]
}

export const getVolumeSetupColumnDefs = ({ volumeGroups, canWrite }: IProps) => {
  const volumeGroupOptions = volumeGroups?.map(toAntOption) ?? []

  return [
    {
      field: 'ProductName',
      editable: false,
    },
    {
      field: 'LocationName',
      editable: false,
    },
    {
      field: 'LocationGroup',
      editable: false,
    },
    {
      field: 'ProductGroup',
      editable: false,
    },
    {
      field: 'MarketPlatformInstrumentInstrumentName',
      headerName: 'Instrument',
      editable: false,
    },
    {
      headerName: 'Volume Group',
      field: 'AvailableVolumeId',
      bulkCellEditor: BulkVolumeGroupEditor,
      bulkCellEditorParams: {
        volumeGroupOptions,
      },
      editable: canWrite,
      isBulkEditable: canWrite,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        showSearch: true,
        options: volumeGroupOptions,
      },
      valueGetter: (props) => {
        return props?.data?.AvailableVolumeId
          ? volumeGroups?.find((option) => option.Value === props?.data?.AvailableVolumeId.toString())?.Text
          : 'None'
      },
    },
  ] as ColDef[]
}
