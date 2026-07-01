import { DeleteOutlined } from '@ant-design/icons'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { CustomInputEditor } from '@components/shared/Grid/cellEditors/CustomInputEditor'
import { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviButton } from '@gravitate-js/excalibrr'
import { IndexOfferFormulaComponent, IndexOfferMetaData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { generateIndexOfferDisplayName } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureIndexPrice/Utils/IndexFormHelpers'
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

function DragRow(): ColDef {
  return {
    rowDrag: true,
    suppressMenu: true,
    lockPosition: true,
    pinned: 'left' as const,
    maxWidth: 40,
    cellStyle: { padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  }
}

function Percent(): ColDef {
  return {
    editable: true,
    field: 'Percentage',
    headerName: '%',
    cellEditor: NumberCellEditor,
    maxWidth: 80,
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
      enableOptionTooltip: true,
      width: '100%',
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
        enableOptionTooltip: true,
        width: '100%',
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
    editable: true,
    field: 'Differential',
    headerName: 'Differential',
    cellEditor: NumberCellEditor,
    cellEditorParams: { allowZero: true },
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
    headerName: 'Display (up to 1,000 characters)',
    cellEditor: CustomInputEditor,
    cellEditorParams: (params) => ({
      maxLength: 1000,
      initialValue: params.data.DisplayName || generateIndexOfferDisplayName(params.data, metadata),
    }),
    editable: true,
    filterValueGetter: (params) => params.data.DisplayName || generateIndexOfferDisplayName(params.data, metadata),
    sortable: false,
    cellStyle: (params) => {
      const autoGen = generateIndexOfferDisplayName(params.data, metadata)
      return isDefinedAndNotNull(params.data.DisplayName) && params.data.DisplayName !== autoGen
        ? { backgroundColor: 'inherit', color: 'inherit' }
        : { backgroundColor: 'var(--bg-2)', color: 'var(--gray-500)' }
    },
    cellRenderer: (params) => {
      const autoGen = generateIndexOfferDisplayName(params.data, metadata)
      if (isDefinedAndNotNull(params.data.DisplayName) && params.data.DisplayName !== autoGen) {
        return params.data.DisplayName
      }
      return autoGen
    },
    valueSetter: (params) => {
      params.data.DisplayName = params.newValue || null
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
