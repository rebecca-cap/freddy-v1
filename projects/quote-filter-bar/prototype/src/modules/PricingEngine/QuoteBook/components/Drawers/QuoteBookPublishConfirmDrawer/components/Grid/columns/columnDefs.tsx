import { dateFormat } from '@components/TheArmory/helpers'
import { Horizontal } from '@gravitate-js/excalibrr'
import { PublicationModes } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { MiddayColumns } from '@modules/PricingEngine/QuoteBook/components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid/columns/MiddayColumns'
import { PrevPostingColumns } from '@modules/PricingEngine/QuoteBook/components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid/columns/PrevPostingColumns'
import { PrevToProposedColumn } from '@modules/PricingEngine/QuoteBook/components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid/columns/PrevToProposedColumn'
import { ProposedPostingColumns } from '@modules/PricingEngine/QuoteBook/components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid/columns/ProposedPostingColumns'
import { ColDef } from 'ag-grid-community'
import moment from 'moment/moment'
import React from 'react'

export const columnDefs = (publicationMode: PublicationModes, isUsingMarketMove?: boolean) => {
  return [
    QuoteConfigurationColumn(),
    LocationName(),
    Product(),
    PriceEffective(),
    ...PrevPostingColumns(publicationMode),
    ...ProposedPostingColumns(publicationMode, isUsingMarketMove),
    ...PrevToProposedColumn(publicationMode),
    ...MiddayColumns(publicationMode),
  ] as ColDef[]
}

function QuoteConfigurationColumn() {
  return {
    field: 'QuoteConfigurationName',
    rowGroup: true,
    hide: true,
  }
}
function LocationName() {
  return {
    field: 'LocationName',
    headerName: 'Location',
    minWidth: 450,
    maxWidth: 650,
  }
}
function Product() {
  return {
    headerName: 'Product',
    field: 'ProductName',
    minWidth: 450,
    maxWidth: 650,
  }
}
function PriceEffective() {
  return {
    field: 'TargetPeriodEffectiveFrom',
    headerName: 'Price Effective',
    editable: false,
    sortable: true,
    valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.SHORT_TIME) : ''),
    valueGetter: (params) => {
      return params?.data?.TargetPeriodEffectiveFrom ? moment(params.data.TargetPeriodEffectiveFrom) : ''
    },
    filterParams: {
      buttons: ['reset'],
      valueFormatter: (params) => (params.value ? moment(params.value).format(dateFormat.SHORT_TIME) : ''),
    },
    cellRenderer: (params) => {
      return (
        <Horizontal verticalCenter horizontalCenter>
          {params?.data?.TargetPeriodEffectiveFrom
            ? moment(params?.data?.TargetPeriodEffectiveFrom).format(dateFormat.SHORT_TIME)
            : ''}
        </Horizontal>
      )
    },
  }
}
