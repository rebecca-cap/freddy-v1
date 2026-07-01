import { ForwardsPricesResponse } from '@api/useForwards/useForwardsTyped'
import { getItemFromRow } from '@modules/SellingPlatform/BuyNow/Forwards/Components/Grid/utils'
import { ColDef } from 'ag-grid-community'
import _ from 'lodash'
interface ColDefWithData extends ColDef {
  sourceData?: any
}

type ItemGroups = NonNullable<NonNullable<ForwardsPricesResponse['Data']>['ItemGroups']>

export function getColumnDefs(data: ItemGroups): ColDefWithData[] {
  const columnDefs: ColDefWithData[] = [...staticColumns]

  const periodData = data?.flatMap((x) =>
    x.MarketPlatformItems?.map((y) => ({
      DisplayName: y.DisplayName,
      FuturesMonth: y.FuturesMonth,
      DeliveryPeriodGroupId: y.ItemKey?.DeliveryPeriodGroupId,
      DeliveryPeriodConfigurationId: y.ItemKey?.DeliveryPeriodConfigurationId,
      ColumnKey: `${y.ItemKey?.DeliveryPeriodGroupId}_${y.ItemKey?.DeliveryPeriodConfigurationId}`,
      DeliveryPeriodFromDate: y.DeliveryPeriodFromDate,
    }))
  )

  const uniquePeriodData = _.chain(periodData)
    .uniqBy((item) => item.ColumnKey)
    .sortBy((x) => x.DeliveryPeriodFromDate)
    .value()

  uniquePeriodData.forEach((x) => {
    columnDefs.push({
      field: x.ColumnKey,
      headerName: x.DisplayName,
      minWidth: 125,
      sourceData: x,
      // disable cell select if no price is available
      cellStyle: (params) => {
        if (!params?.value) return { pointerEvents: 'none' }
      },
      valueFormatter: (params) => fmt.decimal(params.value) || 'X',
      valueGetter: (params) => {
        const { cell } = getItemFromRow(params.data, x)
        return !cell ? null : cell.Price
      },
    })
  })

  return columnDefs
}

export const staticColumns: ColDefWithData[] = [
  {
    field: 'LocationName',
    headerName: 'Location',
    minWidth: 100,
    pinned: 'left',
    sort: 'asc',
    sortIndex: 0,
    cellClass: 'no-range-highlight',
  },
  {
    sort: 'asc',
    sortIndex: 1,
    field: 'ProductName',
    headerName: 'Product',
    minWidth: 100,
    pinned: 'left',
    cellClass: 'no-range-highlight',
  },
  {
    headerName: 'Currency',
    field: 'CurrencyName',
    hide: true,
    cellClass: 'no-range-highlight',
  },
  {
    headerName: 'UOM',
    field: 'UnitofMeasurementName',
    hide: true,
    cellClass: 'no-range-highlight',
  },
]
