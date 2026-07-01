import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import moment from 'moment'

import { PriceUploadData, UploadedModel } from '../api/types.schema'
import { StatusTag } from './Status'

function ConflictButton({
  data,
  onConflictClick,
}: {
  data: UploadedModel
  onConflictClick: (conflicts: UploadedModel['Model']['PriceConflicts'], uploadedRow: UploadedModel) => void
}) {
  const conflictCount = data?.Model?.PriceConflictCount || data?.Model?.PriceConflicts?.length || 0
  const hasConflicts = data?.Model?.IsConflict || conflictCount > 0

  if (!hasConflicts) {
    return <Texto appearance='hint'>No Conflicts</Texto>
  }

  return (
    <Horizontal>
      <GraviButton
        buttonText={`View ${conflictCount} Conflict${conflictCount !== 1 ? 's' : ''}`}
        onClick={() => onConflictClick(data?.Model?.PriceConflicts || [], data)}
        appearance='outline'
        size='small'
      />
    </Horizontal>
  )
}

export function getColumnDefs(
  sheetData: PriceUploadData | null,
  selectedUploadType: string,
  setUploadErrors: React.Dispatch<React.SetStateAction<string[]>>,
  onConflictClick: (conflicts: UploadedModel['Model']['PriceConflicts'], uploadedRow: UploadedModel) => void
): ColDef[] {
  const defs: ColDef[] = [
    {
      field: 'Model.HasValidationErrors',
      headerName: 'Status',
      valueGetter: ({ data }) => (data.Model.HasValidationErrors ? 'Error' : 'Success'),
      cellRenderer: ({ data }) => StatusTag(data, setUploadErrors),
    },
    {
      field: 'Model.PriceConflictCount',
      headerName: 'Conflicts',
      cellRenderer: ({ data }: ICellRendererParams) => <ConflictButton data={data} onConflictClick={onConflictClick} />,
      comparator: (valueA: number, valueB: number, _nodeA, _nodeB, isDescending: boolean) => {
        if (valueA > valueB) {
          return isDescending ? -1 : 1
        }
        if (valueA < valueB) {
          return isDescending ? 1 : -1
        }
        return 0
      },
      minWidth: 110,
    },
    {
      headerName: 'Price Instrument ID',
      field: 'Model.PriceInstrumentId',
    },
    {
      headerName: 'Instrument Name',
      field: 'Model.InstrumentName',
    },
    {
      headerName: 'Location Name',
      field: 'Model.LocationName',
    },
    {
      headerName: 'Product Name',
      field: 'Model.ProductName',
    },
    {
      headerName: 'Is Estimate',
      field: 'Model.IsEstimate',
      valueGetter: ({ data }) => data.Model.IsEstimate,
    },
  ]

  if (selectedUploadType) {
    const uploadTypeColumns = PriceUploadTypeColumns[selectedUploadType]

    if (uploadTypeColumns) {
      uploadTypeColumns.forEach((column) => {
        defs.push({
          field: `Model.${column.field}`,
          headerName: column.headerName,
          valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.DATE_TIME) : value),
        })
      })
    }
  }

  if (sheetData) {
    sheetData.PriceTypes.forEach((priceType) => {
      const newField = {
        field: priceType.Display,
        valueGetter: ({ data }) => data.Model.NewPoints[priceType.PriceTypeCvId.toString()],
      }
      defs.push(newField)
    })
  }

  return defs
}

const PriceUploadTypeColumns: Record<string, { field: string; headerName: string }[]> = {
  PostingWithTradePeriod: [
    { field: 'TradePeriodFromDateTime', headerName: 'Trade Period From' },
    { field: 'TradePeriodToDateTime', headerName: 'Trade Period To' },
  ],
  EffectiveStart: [{ field: 'EffectiveFromDateTime', headerName: 'Effective From' }],
  EffectiveStartWithTradePeriods: [
    { field: 'EffectiveFromDateTime', headerName: 'Effective From' },
    { field: 'TradePeriodFromDateTime', headerName: 'Trade Period From' },
    { field: 'TradePeriodToDateTime', headerName: 'Trade Period To' },
  ],
  EffectiveDates: [
    { field: 'EffectiveFromDateTime', headerName: 'Effective From' },
    { field: 'EffectiveToDateTime', headerName: 'Effective To' },
  ],
  EffectiveDatesWithTradePeriod: [
    { field: 'EffectiveFromDateTime', headerName: 'Effective From' },
    { field: 'EffectiveToDateTime', headerName: 'Effective To' },
    { field: 'TradePeriodFromDateTime', headerName: 'Trade Period From' },
    { field: 'TradePeriodToDateTime', headerName: 'Trade Period To' },
  ],
}
