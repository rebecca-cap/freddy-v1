import { DeleteOutlined } from '@ant-design/icons'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { CustomInputEditor } from '@components/shared/Grid/cellEditors/CustomInputEditor'
import { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviButton } from '@gravitate-js/excalibrr'
import { generateIndexOfferDisplayName } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureIndexPrice/Utils/IndexFormHelpers'
import { FormulaTemplateMetadata } from '@modules/FormulaTemplates/Api/types.schema'
import { placeholderText } from '@modules/FormulaTemplates/Util/formConstants'
import { generateVariableDisplayName, placeholderCellStyle } from '@modules/FormulaTemplates/Util/formHelpers'
import { isDefinedAndNotNull, toAntOption } from '@utils/index'
import { ColDef } from 'ag-grid-community'

interface FormulaComponentsColumnDefsProps {
  handleDelete: (data: FormulaComponent) => void
  metadata?: Partial<FormulaTemplateMetadata>
}

export interface FormulaComponent {
  Percentage: number
  PricePublisherId: number
  PriceInstrumentId: number
  TradeDateRuleCvId: number
  PriceTypeCvId: number
  DisplayName: string
  IdForGrid?: number
  FormulaTemplateVariableId?: number
}

export function FormulaComponentsColumnDefs({ handleDelete, metadata }: FormulaComponentsColumnDefsProps): ColDef[] {
  return [
    DragRow(),
    Percent(),
    Publisher(metadata),
    Instrument(metadata),
    DateRule(metadata),
    Type(metadata),
    Display(metadata),
    Actions(handleDelete),
  ]
}
function DragRow() {
  return {
    rowDrag: true,
    maxWidth: 40,
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
    maxWidth: 80,
    valueFormatter: (props) => {
      if (!isDefinedAndNotNull(props.data.Percentage)) return placeholderText['Percentage']
      return props.data.Percentage ? `${props.data.Percentage}%` : ''
    },
    cellClass: (params) => placeholderCellStyle(params.data.Percentage),
  }
}

function Publisher(metadata?: Partial<FormulaTemplateMetadata>): ColDef {
  return {
    editable: true,
    field: 'PricePublisherId',
    headerName: 'Publisher',
    suppressKeyboardEvent,
    cellEditor: SearchableSelect,
    cellEditorParams: {
      showSearch: true,
      options: metadata?.Publishers?.map(toAntOption),
      allowClear: true,
      width: '100%',
      enableOptionTooltip: true,
    },
    valueGetter: (props) => {
      if (!isDefinedAndNotNull(props.data.PricePublisherId)) return placeholderText['PricePublisherId']
      return metadata?.Publishers?.find((option) => option.Value == props?.data?.PricePublisherId)?.Text
    },
    cellClass: (params) => placeholderCellStyle(params.data.PricePublisherId),
  }
}

function Instrument(metadata?: Partial<FormulaTemplateMetadata>): ColDef {
  return {
    suppressKeyboardEvent,
    editable: true,
    field: 'PriceInstrumentId',
    headerName: 'Instrument',
    cellEditor: SearchableSelect,
    cellEditorParams: (params) => {
      // Filter instruments by the selected publisher
      const publisherId = params?.data?.PricePublisherId
      const filteredInstruments = metadata?.Instruments?.filter(
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
      return metadata?.Instruments?.find((option) => option.Value == props?.data?.PriceInstrumentId)?.Text
    },
    cellClass: (params) => placeholderCellStyle(params.data.PriceInstrumentId),
  }
}

function DateRule(metadata?: Partial<FormulaTemplateMetadata>): ColDef {
  return {
    suppressKeyboardEvent,
    editable: true,
    field: 'PriceValuationRuleId',
    headerName: 'Date Rule',
    cellEditor: SearchableSelect,
    cellEditorParams: {
      showSearch: true,
      options: metadata?.DateRules?.map(toAntOption),
      allowClear: true,
      width: '100%',
    },
    valueGetter: (props) => {
      if (!isDefinedAndNotNull(props.data.PriceValuationRuleId)) return placeholderText['PriceValuationRuleId']
      return metadata?.DateRules?.find((option) => option.Value == props?.data?.PriceValuationRuleId)?.Text
    },
    cellClass: (params) => placeholderCellStyle(params.data.PriceValuationRuleId),
  }
}

function Type(metadata?: Partial<FormulaTemplateMetadata>): ColDef {
  return {
    suppressKeyboardEvent,
    editable: true,
    field: 'PriceTypeCvId',
    headerName: 'Type',
    cellEditor: SearchableSelect,
    cellEditorParams: {
      showSearch: true,
      options: metadata?.PriceTypes?.map(toAntOption) || [],
      allowClear: true,
      width: '100%',
    },
    valueGetter: (props) => {
      if (!isDefinedAndNotNull(props.data.PriceTypeCvId)) return placeholderText['PriceTypeCvId']
      return metadata?.PriceTypes?.find((option) => option.Value == props?.data?.PriceTypeCvId)?.Text
    },
    cellClass: (params) => placeholderCellStyle(params.data.PriceTypeCvId),
  }
}

function Display(metadata?: Partial<FormulaTemplateMetadata>): ColDef {
  return {
    field: 'DisplayName',
    headerName: 'Display (up to 1,000 characters)',
    cellEditor: CustomInputEditor,
    cellEditorParams: (params) => ({
      maxLength: 1000,
      initialValue: params.data.DisplayName || generateVariableDisplayName(params.data, metadata),
    }),
    editable: true,
    filterValueGetter: (params) => params.data.DisplayName || generateVariableDisplayName(params.data, metadata),
    sortable: false,
    cellStyle: (params) => {
      const autoGen = generateVariableDisplayName(params.data, metadata)
      return isDefinedAndNotNull(params.data.DisplayName) && params.data.DisplayName !== autoGen
        ? { backgroundColor: 'inherit', color: 'inherit' }
        : { backgroundColor: 'var(--bg-2)', color: 'var(--gray-500)' }
    },
    cellRenderer: (params) => {
      const autoGen = generateVariableDisplayName(params.data, metadata)
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

function Actions(handleDelete: (data: FormulaComponent) => void): ColDef {
  return {
    filter: false,
    sortable: false,
    field: 'Actions',
    headerName: 'Actions',
    maxWidth: 100,
    cellRenderer: ({ data }: { data: FormulaComponent }) => {
      return (
        <GraviButton className={'ghost-gravi-button'} icon={<DeleteOutlined />} onClick={() => handleDelete(data)} />
      )
    },
  }
}
