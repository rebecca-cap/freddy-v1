import { MetadataListResponseItem } from '@api/globalTypes'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { Horizontal } from '@gravitate-js/excalibrr'
import { MarketPlatformInstrumentSubtypeWithParent, MPIMetadata } from '@modules/Admin/ManageMPIs/Api/types.schema'
import { toAntOptionParsedNumberValue } from '@utils/index'
import { ColDef } from 'ag-grid-community'
import { Switch } from 'antd'

const DropdownColumn = (
  headerName: string,
  field: keyof MarketPlatformInstrumentSubtypeWithParent,
  displayField: keyof MarketPlatformInstrumentSubtypeWithParent,
  canWrite: boolean,
  metadata?: MetadataListResponseItem[]
): ColDef<MarketPlatformInstrumentSubtypeWithParent> => ({
  headerName,
  field,
  editable: canWrite,
  cellEditor: SearchableSelect,
  suppressKeyboardEvent,
  // Return display text for rendering (following DTN pattern)
  valueGetter: ({ data }) => {
    // First try to get the display text from the displayField in the data
    const displayText = data?.[displayField]
    if (displayText && typeof displayText === 'string') {
      return displayText
    }
    // Otherwise look up from metadata
    const idValue = data?.[field]
    if (idValue != null && metadata) {
      const option = metadata.find((m) => parseInt(m.Value) === idValue)
      return option?.Text || ''
    }
    return ''
  },
  cellEditorParams: {
    options: metadata?.map(toAntOptionParsedNumberValue) ?? [],
    allowClear: true,
  },
})

const BooleanColumn = (
  headerName: string,
  field: keyof MarketPlatformInstrumentSubtypeWithParent,
  canWrite: boolean
): ColDef<MarketPlatformInstrumentSubtypeWithParent> => ({
  headerName,
  field,
  editable: false,
  filterParams: {
    valueFormatter: (params: any) => (params.value ? 'Yes' : 'No'),
  },
  cellRenderer: (params) => {
    return (
      <Horizontal className='justify-center'>
        <Switch
          disabled={!canWrite}
          className={!canWrite ? 'disabled-gravi-button-row' : ''}
          checked={!!params.value}
          checkedChildren='Yes'
          unCheckedChildren='No'
          style={{ width: 80 }}
          onChange={(checked) => {
            if (params.node && canWrite) {
              params.node.setDataValue(field, checked)
            }
          }}
        />
      </Horizontal>
    )
  },
})

export const getSubtypeColumnDefs = (
  metadata: MPIMetadata | undefined,
  canWrite: boolean
): ColDef<MarketPlatformInstrumentSubtypeWithParent>[] => {
  return [
    {
      headerName: 'Subtype ID',
      field: 'MarketPlatformInstrumentSubtypeId',
      editable: false,
      headerClass: 'identity-column',
    },
    {
      headerName: 'Parent Instrument',
      field: 'ParentInstrumentName',
      editable: false,
      headerClass: 'identity-column',
    },
    {
      headerName: 'Name',
      field: 'Name',
      editable: canWrite,
      headerClass: 'editable-column',
    },
    {
      headerName: 'Description',
      field: 'Description',
      editable: canWrite,
      headerClass: 'editable-column',
    },
    BooleanColumn('Is Active', 'IsActive', canWrite),
    DropdownColumn(
      'Volume Distribution Type',
      'VolumeDistributionTypeCvId',
      'VolumeDistributionType',
      canWrite,
      metadata?.VolumeDistributionTypes
    ),
    DropdownColumn(
      'Contract Pricing Method',
      'ContractPricingMethodCvId',
      'ContractPricingMethod',
      canWrite,
      metadata?.ContractPricingMethods
    ),
    BooleanColumn('Allow Bid', 'AllowBid', canWrite),
    BooleanColumn('Allow Market', 'AllowMarket', canWrite),
    BooleanColumn('Allow Volume Edits', 'AllowVolumeEdits', canWrite),
  ]
}
