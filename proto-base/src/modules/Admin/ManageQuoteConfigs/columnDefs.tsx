import { FunctionOutlined, LockFilled } from '@ant-design/icons'
import { stopCloseOnEnter } from '@components/shared/Grid/cellEditors'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { TrueFalseEditableColumn } from '@components/shared/Grid/defaultColumnDefs/TrueFalseEditableColumn'
import { Texto } from '@gravitate-js/excalibrr'
import { QuoteConfigurationMetadata } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/types.schema'
import { toAntOption } from '@utils/index'
import { ColDef } from 'ag-grid-community'
import React from 'react'

type CreateColDefProps = {
  metadata?: QuoteConfigurationMetadata
}

export const createColumnDefs = ({ metadata }: CreateColDefProps): ColDef[] => {
  return [
    {
      field: 'HasGeneratedMappings',
      headerName: '',
      suppressMenu: true,
      maxWidth: 60,
      cellRenderer: (params) => params?.data?.HasGeneratedMappings && <LockFilled />,
      editable: false,
    },
    {
      editable: false,
      field: 'QuoteConfigurationId',
      headerName: 'Id',
      maxWidth: 65,
      cellRenderer: (params) => <Texto>{params?.data?.QuoteConfigurationId}</Texto>,
    },
    {
      editable: (params) => !params?.data?.HasGeneratedMappings,
      field: 'ConfigurationName',
      headerName: 'Name',
      cellRenderer: (params) => <Texto>{params?.data?.ConfigurationName}</Texto>,
    },
    {
      editable: (params) => !params?.data?.HasGeneratedMappings,
      field: 'DefaultCostSourceMarker',
      headerName: 'Default Cost Type',
      cellEditor: SearchableSelect,
      cellEditorPopup: true,
      cellEditorParams: {
        showSearch: true,
        onkeydown: stopCloseOnEnter,
        options:
          metadata?.CostSources.filter((cst) => cst.IsMarker)
            .map(toAntOption)
            .map((o) => ({ ...o, icon: <FunctionOutlined /> })) || [],
      },
      valueSetter: (params) => {
        const { newValue } = params
        const selectedMarker = metadata?.CostSources.find((cst) => cst.Value == newValue)
        if (!selectedMarker) return false
        // hacky - only supports markers right now
        params.data.DefaultCostSourceCvId = Number(selectedMarker.CostSourceTypeCvId)
        params.data.DefaultCostSourceMarkerId = Number(selectedMarker.Value)
        params.data.DefaultCostSourceMarker = selectedMarker.Text
        return true
      },
    },
    // Bring back if we ever need to support non-marker cost sources
    // {
    //   field: 'BaseCostPriceType',
    //   headerName: 'Base Price Type',
    // },
    // {
    //   field: 'MappingSourceType',
    //   editable: false,
    // },

    {
      field: 'BaseCostCounterPartyComparisonType',
      headerName: 'Base Counterparty Type',
      cellEditor: SearchableSelect,
      cellEditorPopup: true,
      cellEditorParams: {
        showSearch: true,
        onkeydown: stopCloseOnEnter,
        options: metadata?.CounterPartyComparisonTypes.map(toAntOption),
      },
      valueSetter: (params) => {
        const id = params.newValue
        const selected = metadata?.CounterPartyComparisonTypes.find((c) => c.Value == id)
        if (!selected) return false
        params.data.BaseCostCounterPartyComparisonTypeCvId = Number(selected.Value)
        params.data.BaseCostCounterPartyComparisonType = selected.Text
        return true
      },
    },
    {
      field: 'OutputCounterPartyComparisonType',
      headerName: 'Output Counterparty Type',
      cellEditor: SearchableSelect,
      cellEditorPopup: true,
      cellEditorParams: {
        showSearch: true,
        onkeydown: stopCloseOnEnter,
        options: metadata?.CounterPartyComparisonTypes.map(toAntOption),
      },
      valueSetter: (params) => {
        const id = params.newValue
        const selected = metadata?.CounterPartyComparisonTypes.find((c) => c.Value == id)
        if (!selected) return false
        params.data.OutputCounterPartyComparisonTypeCvId = Number(selected.Value)
        params.data.OutputCounterPartyComparisonType = selected.Text
        return true
      },
    },

    {
      // Not editable after created based on AC as of Nov, 16, 2023 (PE-504)
      field: 'Calendar',
      editable: false,
    },
    {
      editable: false,
      field: 'OutputPricePublisher',
      headerName: 'Output Publisher',
    },
    {
      field: 'DefaultAutomaticQuotePublicationType',
      headerName: 'Automatic Publication Type',
      cellEditor: SearchableSelect,
      cellEditorPopup: true,
      cellEditorParams: {
        showSearch: true,
        onkeydown: stopCloseOnEnter,
        options: metadata?.AutomaticQuotePublicationTypes.map(toAntOption),
      },
      valueSetter: (params) => {
        const id = params.newValue
        const selected = metadata?.AutomaticQuotePublicationTypes.find((c) => c.Value === id)
        if (!selected) return false
        params.data.DefaultAutomaticQuotePublicationTypeCvId = Number(selected.Value)
        params.data.DefaultAutomaticQuotePublicationType = selected.Text

        return true
      },
    },
    {
      field: 'MarketMoveMarker',
      headerName: 'Market Move Marker',
      editable: ({ data }) => data?.UsesMarketMove,
      cellEditor: SearchableSelect,
      cellEditorPopup: true,
      cellEditorParams: {
        showSearch: true,
        onkeydown: stopCloseOnEnter,
        options: metadata?.Markers.map(toAntOption),
      },
      valueSetter: (params) => {
        const id = params.newValue
        const selected = metadata?.Markers.find((c) => c.Value === id)
        if (!selected) return false
        params.data.MarketMoveMarkerId = Number(selected.Value)
        params.data.MarketMoveMarker = selected.Text

        return true
      },
    },
    TrueFalseEditableColumn('AutoPublishEstimates', 'Auto Publish Estimates'),
    TrueFalseEditableColumn('AdjustmentsArePricePeriodSpecific', 'Period Specific Adjustments'),
    TrueFalseEditableColumn('UsesMarketMove', 'Use Market Move'),
    {
      headerName: 'Terms Discount',
      field: 'TermsDiscount',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        max: 100,
        precision: 2,
      },
      valueFormatter: (params) => {
        if (params.value == null) return ''
        return `${fmt.decimal(params.value, 2)}%`
      },
      valueSetter: (params) => {
        const newValue = params.newValue
        if (newValue === '' || newValue == null) {
          params.data.TermsDiscount = null
          return true
        }
        
        const numValue = parseFloat(newValue)
        if (isNaN(numValue)) {
          return false
        }
        
        if (numValue < 0 || numValue > 100) {
          return false
        }
        
        params.data.TermsDiscount = numValue
        return true
      },
      maxWidth: 150,
    },
    TrueFalseEditableColumn('PublishedPriceIncludesTermsDiscount', 'Published Price Includes Terms Discount'),
    {
      editable: false,
      field: 'QuoteRowCount',
      maxWidth: 160,
      headerName: 'Linked Quote Rows',
      filterParams: {
        valueFormatter: (params) => (params.value ? "Yes" : "No"),
      },
      valueFormatter: fmt.integer,
    },
  ]
}
