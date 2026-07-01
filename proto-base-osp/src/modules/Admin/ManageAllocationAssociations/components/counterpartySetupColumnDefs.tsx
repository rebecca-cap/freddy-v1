import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { Texto } from '@gravitate-js/excalibrr'
import { AllocationAssociationMetadataResponse } from '@modules/Admin/ManageAllocationAssociations/api/types.schema'
import { toAntOption } from '@utils/index'
import { ColDef } from 'ag-grid-community'

export function createCounterpartySetupColumnDefs({
  canWrite,
  metadata,
}: {
  canWrite: boolean
  metadata?: AllocationAssociationMetadataResponse
}) {
  const refreshFrequencyTypes = metadata?.Data?.FrequencyTypeList

  return [
    {
      headerCheckboxSelection: canWrite,
      checkboxSelection: canWrite,
      headerName: '',
      maxWidth: 50,
      headerCheckboxSelectionFilteredOnly: canWrite,
    },
    {
      field: 'CounterPartyName',
      headerName: 'Counterparty',
    },
    {
      field: 'AuthorizationAllocationSetup.Product',
      headerName: 'Product',
    },
    {
      field: 'AuthorizationAllocationSetup.Location',
      headerName: 'Location',
    },
    {
      field: 'AuthorizationAllocationSetup.MarketPlatformInstrument',
      headerName: 'Instrument',
    },
    {
      field: 'LinkedAllocationId',
      headerName: 'Allocation ID',
    },
    {
      field: 'AuthorizationAllocationLinkId',
      headerName: 'Mapped',
      editable: false,
      filterParams: {
        buttons: ['reset'],
        values: ['Mapped', 'Unmapped'],
      },
      valueGetter: (params) => {
        const isMapped = !!params.data?.AuthorizationAllocationLinkId
        return isMapped ? 'Mapped' : 'Unmapped'
      },
      cellRenderer: (params) => {
        const isMapped = !!params.data?.AuthorizationAllocationLinkId
        return isMapped ? <Texto>Mapped</Texto> : <Texto>Unmapped</Texto>
      },
    },
    {
      field: 'RefreshFrequencyTypeCvId',
      headerName: 'Refresh Frequency',
      editable: (params) => params.data?.AuthorizationAllocationLinkId && canWrite,
      cellEditor: SearchableSelect,
      isBulkEditable: (params) => params.data?.AuthorizationAllocationLinkId && canWrite,
      cellEditorParams: {
        showSearch: true,
        options: refreshFrequencyTypes?.map(toAntOption),
      },
      valueGetter: (params) => {
        const refreshFrequencyTypeCvId = params.data?.RefreshFrequencyTypeCvId
        return refreshFrequencyTypeCvId
          ? refreshFrequencyTypes?.find((type) => type.Value === refreshFrequencyTypeCvId.toString())?.Text
          : ''
      },
    },
  ] as ColDef[]
}
