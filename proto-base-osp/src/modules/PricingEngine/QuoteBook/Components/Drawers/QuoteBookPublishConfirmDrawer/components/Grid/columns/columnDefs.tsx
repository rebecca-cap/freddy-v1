import { dateFormat } from '@components/TheArmory/helpers'
import { Horizontal } from '@gravitate-js/excalibrr'
import type { PublicationModes } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { MiddayColumns } from '@modules/PricingEngine/QuoteBook/Components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid/columns/MiddayColumns'
import { PrevPostingColumns } from '@modules/PricingEngine/QuoteBook/Components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid/columns/PrevPostingColumns'
import { PrevToProposedColumn } from '@modules/PricingEngine/QuoteBook/Components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid/columns/PrevToProposedColumn'
import { ProposedPostingColumns } from '@modules/PricingEngine/QuoteBook/Components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid/columns/ProposedPostingColumns'
import dayjs from '@utils/dayjs'
import type { ColDef } from 'ag-grid-community'
import React from 'react'

export const columnDefs = (
  publicationMode: PublicationModes,
  isUsingMarketMove?: boolean,
  showOriginDestinationColumns?: boolean,
  showLocationColumn?: boolean
) => {
  return [
    QuoteConfigurationColumn(),
    ...(showOriginDestinationColumns ? [Origin(), Destination()] : []),
    ...(showLocationColumn ? [LocationName()] : []),
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
function Origin() {
  return {
    field: 'OriginLocationName',
    headerName: 'Origin',
  }
}
function Destination() {
  return {
    field: 'DestinationLocationName',
    headerName: 'Destination',
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
    valueFormatter: ({ value }) => (value ? dayjs(value).format(dateFormat.SHORT_TIME) : ''),
    valueGetter: (params) => {
      return params?.data?.TargetPeriodEffectiveFrom ? dayjs(params.data.TargetPeriodEffectiveFrom) : ''
    },
    filterParams: {
      buttons: ['reset'],
      valueFormatter: (params) => (params.value ? dayjs(params.value).format(dateFormat.SHORT_TIME) : ''),
    },
    cellRenderer: (params) => {
      return (
        <Horizontal fullHeight verticalCenter horizontalCenter>
          {params?.data?.TargetPeriodEffectiveFrom
            ? dayjs(params?.data?.TargetPeriodEffectiveFrom).format(dateFormat.SHORT_TIME)
            : ''}
        </Horizontal>
      )
    },
  }
}
