import { ColumnFilterWithTooltip } from '@components/shared/Grid/ColumnFilterWithTooltip'
import { Quote } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { getUniqueExceptionValues } from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/helpers'

export const exceptionColumnFilterParams = (originalRows: Quote[]) => ({
  filters: [
    {
      filter: 'agSetColumnFilter',
      display: 'subMenu',
      title: 'Filter by Severity',
      filterParams: {
        buttons: ['reset'],
        values: getUniqueExceptionValues(originalRows, 'Severity'),
        keyCreator: (params) => params.value,
        valueFormatter: (params) => params.value,
        valueGetter: (params) => (params?.data?.Exceptions ? params?.data?.Exceptions[0]?.Severity : ''),
      },
    },
    {
      filter: 'agSetColumnFilter',
      display: 'subMenu',
      title: 'Filter by Exception',
      filterParams: {
        buttons: ['reset'],
        values: getUniqueExceptionValues(originalRows, 'Message'),
        keyCreator: (params) => params.value,
        valueFormatter: (params) => params.value,
        valueGetter: (params) => (params?.data?.Exceptions ? params?.data?.Exceptions[0]?.Message : ''),
        cellRenderer: ColumnFilterWithTooltip,
      },
    },
  ],
})
