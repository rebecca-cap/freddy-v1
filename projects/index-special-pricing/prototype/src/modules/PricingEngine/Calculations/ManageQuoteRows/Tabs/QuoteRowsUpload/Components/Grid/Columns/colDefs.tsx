import { UploadStatusCell, getSeverity } from '@components/shared/Grid/cellRenderers/UploadStatusCell/UploadStatusCell'
import { BBDTag } from '@gravitate-js/excalibrr'
import type { UploadedQuoteRow } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/types.schema'
import type { ColDef } from 'ag-grid-community'

type SetUploadErrors = (messages: string[]) => void

export const getColumnDefs = (setUploadErrors: SetUploadErrors, useOriginLocation: boolean): ColDef[] => [
  Status(setUploadErrors),
  CounterParty(),
  ProductName(),
  ...(useOriginLocation ? [OriginLocationName()] : []),
  LocationName(useOriginLocation),
  PricePeriodStartOffset(),
  UnitOfMeasureName(),
  IsActive(),
  StatusCvId(),
]

const Status = (setUploadErrors: SetUploadErrors): ColDef<UploadedQuoteRow> => ({
  colId: 'HasErrors',
  headerName: 'Status',
  valueGetter: (params) => getSeverity(params.data),
  cellRenderer: ({ data }) => <UploadStatusCell data={data} onErrorClick={setUploadErrors} />,
})

const CounterParty = (): ColDef<UploadedQuoteRow> => ({
  colId: 'CounterParty',
  headerName: 'CounterParty',
  valueGetter: (params) =>
    params.data?.Item?.SupplierCounterPartyName ??
    params.data?.Item?.CarrierCounterPartyName ??
    params.data?.Item?.InternalCounterPartyName ??
    params.data?.Item?.ExternalCounterPartyName,
})

const ProductName = (): ColDef<UploadedQuoteRow> => ({
  field: 'Item.ProductName',
  headerName: 'Product Name',
})

const OriginLocationName = (): ColDef<UploadedQuoteRow> => ({
  field: 'Item.OriginLocationName',
  headerName: 'Origin Location',
})

const LocationName = (useOriginLocation: boolean): ColDef<UploadedQuoteRow> => ({
  field: 'Item.LocationName',
  headerName: useOriginLocation ? 'Destination Location' : 'Location',
})

const PricePeriodStartOffset = (): ColDef<UploadedQuoteRow> => ({
  field: 'Item.PricePeriodStartOffset',
  headerName: 'Price Period Start Offset',
})

const UnitOfMeasureName = (): ColDef<UploadedQuoteRow> => ({
  field: 'Item.UnitOfMeasureName',
  headerName: 'Unit Of Measure Name',
})

const IsActive = (): ColDef<UploadedQuoteRow> => ({
  colId: 'IsActive',
  headerName: 'Is Active',
  valueGetter: (params) => (params.data?.Item?.IsActive ? 'Active' : 'Inactive'),
  cellRenderer: ({ value }) =>
    value === 'Active' ? (
      <BBDTag success style={{ textAlign: 'center', width: 80 }}>
        Active
      </BBDTag>
    ) : (
      <BBDTag error style={{ textAlign: 'center', width: 80 }}>
        Inactive
      </BBDTag>
    ),
})

const StatusCvId = (): ColDef<UploadedQuoteRow> => ({
  colId: 'StatusCvId',
  headerName: 'Status Cv Id',
  valueGetter: (params) => (params.data?.Item?.StatusCvId === 100 ? 'Enabled' : 'Disabled'),
  cellRenderer: ({ value }) => (
    <BBDTag success={value === 'Enabled'} error={value !== 'Enabled'} style={{ textAlign: 'center', width: 80 }}>
      {value}
    </BBDTag>
  ),
})
