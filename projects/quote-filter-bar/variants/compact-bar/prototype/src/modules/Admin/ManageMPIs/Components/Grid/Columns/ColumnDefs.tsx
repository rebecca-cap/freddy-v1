import { MetadataListResponseItem } from '@api/globalTypes'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { Horizontal } from '@gravitate-js/excalibrr'
import { MarketPlatformInstrument, MPIMetadata } from '@modules/Admin/ManageMPIs/Api/types.schema'
import { toAntOptionParsedNumberValue } from '@utils/index'
import { ColDef } from 'ag-grid-community'
import { Switch } from 'antd'

interface MPIColumnsProps {
  canWrite: boolean
  metadata?: MPIMetadata
}

export function getMPIColumns({ canWrite, metadata }: MPIColumnsProps): ColDef<MarketPlatformInstrument>[] {
  return [
    MPIId(),
    InstrumentName(),
    Marker(),
    TradeType(),
    // Loading numbers
    LoadingNumberBehavior(canWrite, metadata?.LoadingNumberBehaviors),
    InactivateLoadingNumbersOnUse(canWrite),
    // Product/Location associations
    ProductAssociationType(canWrite, metadata?.ProductAssociationTypes),
    LocationAssociationType(canWrite, metadata?.LocationAssociationTypes),
    OriginLocationAssociationType(canWrite, metadata?.LocationAssociationTypes),
    AllowAdditionalLocationSelection(canWrite),
    UseDestinationLocations(canWrite),
    // Calendars
    Calendar(canWrite, metadata?.Calendars),
    PricingCalendar(canWrite, metadata?.Calendars),
    PromptDefaultOrderDurationOffset(canWrite),
    PromptsEffectiveTillEndOfMonth(canWrite),
    // Order types
    InitialOrderStatus(canWrite, metadata?.InitialOrderStatus),
    AllowBid(canWrite),
    AllowMarketOrder(canWrite),
    // TAS
    IsTradeAtSettle(canWrite),
    // Delivery period groups
    HasDeliveryPeriodGroups(canWrite),
    // Override dates
    AllowOverridingDatesOnPromptOrders(canWrite),
    // Allocations
    AllowsAllocations(canWrite),
    RequireAllocationsForPrimaryProducts(canWrite),
    DecrementAllocations(canWrite),
  ]
}

const MPIId = (): ColDef<MarketPlatformInstrument> => ({
  headerName: 'MPI ID',
  field: 'MarketPlatformInstrumentId',
})

const InstrumentName = (): ColDef<MarketPlatformInstrument> => ({
  headerName: 'Instrument Name',
  field: 'InstrumentName',
})

const Marker = (): ColDef<MarketPlatformInstrument> => ({
  headerName: 'Marker',
  field: 'Marker',
})

const TradeType = (): ColDef<MarketPlatformInstrument> => ({
  headerName: 'Trade Type',
  field: 'TradeType',
})

const DropdownColumn = (
  headerName: string,
  field: keyof MarketPlatformInstrument,
  displayField: keyof MarketPlatformInstrument,
  canWrite: boolean,
  metadata?: MetadataListResponseItem[]
): ColDef<MarketPlatformInstrument> => ({
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
  field: keyof MarketPlatformInstrument,
  canWrite: boolean
): ColDef<MarketPlatformInstrument> => ({
  headerName,
  field,
  editable: false,
  filterParams: {
    valueFormatter: (params) => (params.value ? 'Yes' : 'No'),
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

const LoadingNumberBehavior = (
  canWrite: boolean,
  metadata?: MetadataListResponseItem[]
): ColDef<MarketPlatformInstrument> =>
  DropdownColumn(
    'Loading Number Behavior',
    'LoadingNumberBehaviorCvId',
    'LoadingNumberBehaviorCvId',
    canWrite,
    metadata
  )

const InactivateLoadingNumbersOnUse = (canWrite: boolean): ColDef<MarketPlatformInstrument> =>
  BooleanColumn('Inactivate Loading Numbers On Use', 'InactivateLoadingNumbersOnUse', canWrite)

const ProductAssociationType = (
  canWrite: boolean,
  metadata?: MetadataListResponseItem[]
): ColDef<MarketPlatformInstrument> =>
  DropdownColumn(
    'Product Association Type',
    'ProductAssociationTypeCvId',
    'PriceAdjustmentProductHierarchyType',
    canWrite,
    metadata
  )

const LocationAssociationType = (
  canWrite: boolean,
  metadata?: MetadataListResponseItem[]
): ColDef<MarketPlatformInstrument> =>
  DropdownColumn(
    'Location Association Type',
    'LocationAssociationTypeCvId',
    'LocationGroupLocationHierarchyType',
    canWrite,
    metadata
  )

const OriginLocationAssociationType = (
  canWrite: boolean,
  metadata?: MetadataListResponseItem[]
): ColDef<MarketPlatformInstrument> =>
  DropdownColumn(
    'Origin Location Association Type',
    'OriginLocationAssociationTypeCvId',
    'OriginLocationAssociationType',
    canWrite,
    metadata
  )

const AllowAdditionalLocationSelection = (canWrite: boolean): ColDef<MarketPlatformInstrument> =>
  BooleanColumn('Allow Additional Location Selection', 'AllowAdditionalLocationSelection', canWrite)

const UseDestinationLocations = (canWrite: boolean): ColDef<MarketPlatformInstrument> =>
  BooleanColumn('Use Destination Locations', 'UseDestinationLocations', canWrite)

const Calendar = (canWrite: boolean, metadata?: MetadataListResponseItem[]): ColDef<MarketPlatformInstrument> =>
  DropdownColumn('Calendar', 'CalendarId', 'Calendar', canWrite, metadata)

const PricingCalendar = (canWrite: boolean, metadata?: MetadataListResponseItem[]): ColDef<MarketPlatformInstrument> =>
  DropdownColumn('Pricing Calendar', 'PricingCalendarId', 'Calendar', canWrite, metadata)

const PromptDefaultOrderDurationOffset = (canWrite: boolean): ColDef<MarketPlatformInstrument> => ({
  headerName: 'Prompt Default Order Duration Offset',
  field: 'PromptDefaultOrderDurationOffset',
  editable: canWrite,
  filter: 'agTextColumnFilter',
  cellEditor: 'agTextCellEditor',
})

const PromptsEffectiveTillEndOfMonth = (canWrite: boolean): ColDef<MarketPlatformInstrument> =>
  BooleanColumn('Prompts Effective Till End Of Month', 'PromptsEffectiveTillEndOfMonth', canWrite)

const InitialOrderStatus = (
  canWrite: boolean,
  metadata?: MetadataListResponseItem[]
): ColDef<MarketPlatformInstrument> =>
  DropdownColumn('Initial Order Status', 'InitialOrderStatusCvId', 'InitialOrderStatus', canWrite, metadata)

const AllowBid = (canWrite: boolean): ColDef<MarketPlatformInstrument> =>
  BooleanColumn('Allow Bid', 'AllowBid', canWrite)

const AllowMarketOrder = (canWrite: boolean): ColDef<MarketPlatformInstrument> =>
  BooleanColumn('Allow Market Order', 'AllowMarketOrder', canWrite)

const IsTradeAtSettle = (canWrite: boolean): ColDef<MarketPlatformInstrument> =>
  BooleanColumn('Is Trade At Settle', 'IsTradeAtSettle', canWrite)

const HasDeliveryPeriodGroups = (canWrite: boolean): ColDef<MarketPlatformInstrument> =>
  BooleanColumn('Has Delivery Period Groups', 'HasDeliveryPeriodGroups', canWrite)

const AllowOverridingDatesOnPromptOrders = (canWrite: boolean): ColDef<MarketPlatformInstrument> =>
  BooleanColumn('Allow Overriding Dates On Prompt Orders', 'AllowOverridingDatesOnPromptOrders', canWrite)

// Allocation columns
const AllowsAllocations = (canWrite: boolean): ColDef<MarketPlatformInstrument> =>
  BooleanColumn('Allows Allocations', 'AllowsAllocations', canWrite)

const RequireAllocationsForPrimaryProducts = (canWrite: boolean): ColDef<MarketPlatformInstrument> =>
  BooleanColumn('Require Allocations For Primary Products', 'RequireAllocationsForPrimaryProducts', canWrite)

const DecrementAllocations = (canWrite: boolean): ColDef<MarketPlatformInstrument> =>
  BooleanColumn('Decrement Allocations', 'DecrementAllocations', canWrite)
