import { DeleteOutlined } from '@ant-design/icons'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviButton } from '@gravitate-js/excalibrr'
import { IndexOfferFormulaComponent, IndexOfferMetaData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { placeholderText } from '@modules/FormulaTemplates/Util/formConstants'
import { placeholderCellStyle } from '@modules/FormulaTemplates/Util/formHelpers'
import { isDefinedAndNotNull, toAntOption } from '@utils/index'
import { ColDef } from 'ag-grid-community'

interface IndexOfferComponentsColumnDefsProps {
  handleDelete: (data: IndexOfferFormulaComponent) => void
  metadata?: IndexOfferMetaData
}

export function IndexOfferComponentsColumnDefs({
  handleDelete,
  metadata,
}: IndexOfferComponentsColumnDefsProps): ColDef[] {
  return [
    DragRow(),
    Percent(),
    Publisher(metadata),
    Instrument(metadata),
    DateRule(metadata),
    Type(metadata),
    Diff(),
    Display(metadata),
    Actions(handleDelete),
  ]
}

export function generateIndexOfferDisplayName(
  component: IndexOfferFormulaComponent,
  metadata?: IndexOfferMetaData
): string {
  const percent = isDefinedAndNotNull(component.Percentage) ? `${component.Percentage}%` : placeholderText['Percentage']
  const publisher = isDefinedAndNotNull(component.PricePublisherId)
    ? metadata?.PricePublishers?.find((item) => item.Value == component.PricePublisherId?.toString())?.Text
    : placeholderText['PricePublisherId']
  const instrument = isDefinedAndNotNull(component.PriceInstrumentId)
    ? metadata?.PriceInstruments?.find((item) => item.Value == component.PriceInstrumentId?.toString())?.Text
    : placeholderText['PriceInstrumentId']
  // Flatten all publisher price types to find the display text (allows displaying types not valid for current publisher)
  const allPriceTypes = Object.values(metadata?.PublisherPriceTypes || {}).flat()
  const type = isDefinedAndNotNull(component.PriceTypeCvId)
    ? allPriceTypes.find((item) => item.Value == component.PriceTypeCvId?.toString())?.Text ||
      placeholderText['PriceTypeCvId']
    : placeholderText['PriceTypeCvId']
  const dateRule = isDefinedAndNotNull(component.PriceValuationRuleId)
    ? metadata?.TradePriceValuationRules?.find((item) => item.Value == component.PriceValuationRuleId?.toString())?.Text
    : placeholderText['PriceValuationRuleId']
  return `${percent} ${publisher} ${instrument} ${dateRule} ${type}`
}

function DragRow(): ColDef {
  return {
    rowDrag: true,
    width: 40,
    suppressMenu: true,
    lockPosition: true,
    pinned: 'left' as const,
  }
}

function Percent(): ColDef {
  return {
    editable: true,
    field: 'Percentage',
    headerName: '%',
    cellEditor: NumberCellEditor,
    valueFormatter: (props) => {
      if (!isDefinedAndNotNull(props.data.Percentage)) return placeholderText['Percentage']
      return `${props.data.Percentage}%`
    },
    cellClass: (params) => placeholderCellStyle(params.data.Percentage),
  }
}

function Publisher(metadata?: IndexOfferMetaData): ColDef {
  return {
    editable: true,
    field: 'PricePublisherId',
    headerName: 'Publisher',
    suppressKeyboardEvent,
    cellEditor: SearchableSelect,
    cellEditorParams: {
      showSearch: true,
      options: metadata?.PricePublishers?.map(toAntOption),
      allowClear: true,
      width: '100%',
      enableOptionTooltip: true,
    },
    valueGetter: (props) => {
      if (!isDefinedAndNotNull(props.data.PricePublisherId)) return placeholderText['PricePublisherId']
      return metadata?.PricePublishers?.find((option) => option.Value == props?.data?.PricePublisherId)?.Text
    },
    cellClass: (params) => placeholderCellStyle(params.data.PricePublisherId),
  }
}

function Instrument(metadata?: IndexOfferMetaData): ColDef {
  return {
    suppressKeyboardEvent,
    editable: true,
    field: 'PriceInstrumentId',
    headerName: 'Instrument',
    cellEditor: SearchableSelect,
    cellEditorParams: (params) => {
      const publisherId = params?.data?.PricePublisherId
      const filteredInstruments = metadata?.PriceInstruments?.filter(
        (instrument) => instrument.GroupingValue === publisherId?.toString()
      )
      return {
        showSearch: true,
        options: filteredInstruments?.map(toAntOption),
        allowClear: true,
        width: '100%',
        enableOptionTooltip: true,
      }
    },
    valueGetter: (props) => {
      if (!isDefinedAndNotNull(props.data.PriceInstrumentId)) return placeholderText['PriceInstrumentId']
      return metadata?.PriceInstruments?.find((option) => option.Value == props?.data?.PriceInstrumentId)?.Text
    },
    cellClass: (params) => placeholderCellStyle(params.data.PriceInstrumentId),
  }
}

function DateRule(metadata?: IndexOfferMetaData): ColDef {
  return {
    suppressKeyboardEvent,
    editable: true,
    field: 'PriceValuationRuleId',
    headerName: 'Date Rule',
    cellEditor: SearchableSelect,
    cellEditorParams: {
      showSearch: true,
      options: metadata?.TradePriceValuationRules?.map(toAntOption),
      allowClear: true,
      width: '100%',
    },
    valueGetter: (props) => {
      if (!isDefinedAndNotNull(props.data.PriceValuationRuleId)) return placeholderText['PriceValuationRuleId']
      return metadata?.TradePriceValuationRules?.find((option) => option.Value == props?.data?.PriceValuationRuleId)
        ?.Text
    },
    cellClass: (params) => placeholderCellStyle(params.data.PriceValuationRuleId),
  }
}

function Type(metadata?: IndexOfferMetaData): ColDef {
  return {
    suppressKeyboardEvent,
    editable: true,
    field: 'PriceTypeCvId',
    headerName: 'Type',
    cellEditor: SearchableSelect,
    cellEditorParams: (params) => {
      const publisherId = params?.data?.PricePublisherId
      const priceTypes = metadata?.PublisherPriceTypes?.[publisherId] || []
      return {
        showSearch: true,
        options: priceTypes.map(toAntOption),
        allowClear: true,
        width: '100%',
      }
    },
    valueGetter: (props) => {
      if (!isDefinedAndNotNull(props.data.PriceTypeCvId)) return placeholderText['PriceTypeCvId']
      // Flatten all publisher price types to find the display text (allows displaying types not valid for current publisher)
      const allPriceTypes = Object.values(metadata?.PublisherPriceTypes || {}).flat()
      return (
        allPriceTypes.find((opt) => opt.Value == props?.data?.PriceTypeCvId?.toString())?.Text ||
        placeholderText['PriceTypeCvId']
      )
    },
    cellClass: (params) => placeholderCellStyle(params.data.PriceTypeCvId),
  }
}

function Diff(): ColDef {
  return {
    suppressKeyboardEvent,
    editable: true,
    field: 'Differential',
    headerName: 'Differential',
    cellEditor: NumberCellEditor,
    valueFormatter: (props) => {
      if (!isDefinedAndNotNull(props.data.Differential)) return placeholderText['Differential']
      return fmt.decimal(props.data.Differential)
    },
    cellClass: (params) => placeholderCellStyle(params.data.Differential),
  }
}

function Display(metadata?: IndexOfferMetaData): ColDef {
  return {
    field: 'DisplayName',
    headerName: 'Display',
    cellEditor: 'agTextCellEditor',
    editable: true,
    cellStyle: (params) => {
      return params.data.isDisplayNameCustomized ? null : { backgroundColor: 'var(--bg-2)' }
    },
    valueGetter: (params) => {
      if (params.data.isDisplayNameCustomized && isDefinedAndNotNull(params.data.DisplayName)) {
        return params.data.DisplayName
      }
      return generateIndexOfferDisplayName(params.data, metadata)
    },
    valueSetter: (params) => {
      params.data.DisplayName = params.newValue
      params.data.isDisplayNameCustomized = !!isDefinedAndNotNull(params.newValue)
      return true
    },
  }
}

function Actions(handleDelete: (data: IndexOfferFormulaComponent) => void): ColDef {
  return {
    filter: false,
    sortable: false,
    field: 'Actions',
    headerName: 'Actions',
    maxWidth: 100,
    cellRenderer: ({ data }: { data: IndexOfferFormulaComponent }) => {
      return (
        <GraviButton className={'ghost-gravi-button'} icon={<DeleteOutlined />} onClick={() => handleDelete(data)} />
      )
    },
  }
}
