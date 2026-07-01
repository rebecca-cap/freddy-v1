import { ClockCircleFilled, CloseCircleFilled, ExclamationCircleFilled, LineChartOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { getReportingAttributesColumns } from '@components/shared/Grid/sharedColumnDefs/ReportingAttributesColumns'
import { BBDTag, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { Quote, QuoteBookMetadataResponse } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { exceptionColumnFilterParams } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/filters/exceptionColumnFilterParams'
import { getNetGrossIcon } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/helpers'
import { Tags } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/Tags'
import dayjs from '@utils/dayjs'
import { hiddenColumn } from '@utils/grid'
import { Button, Popover, Tooltip } from 'antd'
import type React from 'react'

interface PriceInfoColumnsProps {
  setQuoteHistoryHeaderInfo: React.Dispatch<React.SetStateAction<Quote>>
  setSelectedRowId: React.Dispatch<React.SetStateAction<number | null>>
  setIsQuoteHistoryDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  originalRows?: Quote[]
  showOriginDestinationColumns: boolean
  showLocationColumn: boolean
  quoteRowTags?: QuoteBookMetadataResponse['QuoteRowTags']
}

export function PriceInfoColumns({
  setQuoteHistoryHeaderInfo,
  setSelectedRowId,
  setIsQuoteHistoryDrawerOpen,
  originalRows,
  showOriginDestinationColumns,
  showLocationColumn,
  quoteRowTags,
}: PriceInfoColumnsProps) {
  const rows = originalRows ?? []
  return {
    headerName: 'Price Info',
    marryChildren: true,
    children: [
      hiddenColumn({ title: 'Id', field: 'QuoteConfigurationMappingId' }),
      ContractId({}),
      hiddenColumn({ title: 'Region' }),
      hiddenColumn({ title: 'Area' }),
      QuoteHistoryButton({ setQuoteHistoryHeaderInfo, setSelectedRowId, setIsQuoteHistoryDrawerOpen }),
      NetOrGrossDisplay(),
      Exceptions(rows),
      PriceEffective(),
      LastPublication(),
      LastEffective(),
      CounterParty(),
      ...(showOriginDestinationColumns ? [Origin(showLocationColumn), Destination()] : []),
      ...(showLocationColumn ? [Location()] : []),
      hiddenColumn({ title: 'Commodity' }),
      hiddenColumn({ title: 'ProductGroup' }),
      hiddenColumn({ title: 'Grade' }),
      Product(),
      ...getReportingAttributesColumns(rows),
      Tags({ quoteRowTags }),
    ],
  }
}
const ContractId = ({}) => ({
  ...hiddenColumn({ title: 'Contract ID', field: 'CostSourceTradeEntryId' }),
  valueFormatter: (params) => (params.value == 0 ? '' : params.value),
})

const QuoteHistoryButton = ({ setQuoteHistoryHeaderInfo, setSelectedRowId, setIsQuoteHistoryDrawerOpen }) => ({
  field: '$quote_history_button',
  headerName: '',
  maxWidth: 40,
  cellRenderer: (params) => (
    <Tooltip title='Quote History'>
      <Button
        className='quoteBook-view-history-button'
        ghost
        onClick={() => {
          setQuoteHistoryHeaderInfo(params?.data)
          setSelectedRowId(params?.data?.QuoteConfigurationMappingId)
          setIsQuoteHistoryDrawerOpen(true)
        }}
        style={{ padding: 0 }}
      >
        <Horizontal verticalCenter>
          <LineChartOutlined style={{ color: 'inherit', fontSize: 'inherit' }} />
        </Horizontal>
      </Button>
    </Tooltip>
  ),
  editable: false,
  sortable: false,
  filter: false,
  suppressMenu: true,
})
const NetOrGrossDisplay = () => ({
  field: 'NetOrGrossDisplay',
  headerName: '',
  maxWidth: 100,
  cellRenderer: (params) => {
    const secondaryBasis = params?.data?.NetOrGrossDisplay === 'Net' ? 'Gross' : 'Net'
    const secondaryPrice = params.data.TCIIsMultiplication
      ? params.data.ProposedPrice * (params?.data?.TCIValue || 0)
      : params.data.TCIValue !== 0
        ? params.data.ProposedPrice / params.data.TCIValue
        : 0
    const showTCIPopover = params?.data?.PublishesNetAndGross && !!params?.data?.TCIValue

    return (
      <Horizontal style={{ minHeight: 22 }} verticalCenter>
        <Vertical verticalCenter>
          <Tooltip
            title={
              params?.data?.LatestQuoteDate
                ? `Published ${dayjs(params?.data?.LatestQuoteDate).format(dateFormat.DATE_TIME)}`
                : 'No Date Available'
            }
          >
            <BBDTag
              error={dayjs(params.data.LatestQuoteDate).isBefore(dayjs().subtract(3, 'd'))}
              success={
                params?.data?.LatestQuoteDate &&
                dayjs(params.data.LatestQuoteDate).isAfter(dayjs().subtract(2, 'h')) &&
                dayjs(params.data.LatestQuoteDate).isBefore(dayjs().add(2, 'h'))
              }
              style={{ width: 30 }}
            >
              <Horizontal verticalCenter>
                <ClockCircleFilled style={{ color: 'inherit', fontSize: 'inherit' }} />
              </Horizontal>
            </BBDTag>
          </Tooltip>
        </Vertical>
        <Vertical verticalCenter>
          <Horizontal verticalCenter style={{ width: 30 }}>
            {showTCIPopover && (
              <Popover
                className='action-popover'
                placement='top'
                content={() => {
                  return (
                    <Vertical verticalCenter style={{ width: 200 }}>
                      <Horizontal justifyContent='space-between'>
                        <Texto>
                          Secondary{' '}
                          <span
                            style={{
                              color: secondaryBasis === 'Gross' ? 'var(--theme-success)' : 'var(--theme-color-3)',
                            }}
                          >
                            {secondaryBasis}
                          </span>{' '}
                          Price{' '}
                        </Texto>
                        <Texto weight={600}>{fmt.currency(secondaryPrice)}</Texto>
                      </Horizontal>
                      <Horizontal justifyContent='space-between'>
                        <Texto>TCI Factor</Texto>
                        <Texto>{fmt.decimal(params?.data?.TCIValue)}</Texto>
                      </Horizontal>
                      <Texto className='my-3'>
                        Note: Value based on row proposed period price and currently effective TCI conversion
                      </Texto>
                    </Vertical>
                  )
                }}
              >
                <div style={{ fontSize: 13, width: 20, display: 'flex' }}>
                  {getNetGrossIcon(params?.data?.NetOrGrossDisplay)}
                </div>
              </Popover>
            )}
            {!showTCIPopover && (
              <Tooltip title={params?.data?.NetOrGrossDisplay}>
                <div style={{ fontSize: 13, width: 20, display: 'flex' }}>
                  {getNetGrossIcon(params?.data?.NetOrGrossDisplay)}
                </div>
              </Tooltip>
            )}
          </Horizontal>
        </Vertical>
      </Horizontal>
    )
  },
  editable: false,
})
const Exceptions = (originalRows: Quote[]) => ({
  field: 'Exceptions',
  editable: false,
  sortable: true,
  filter: 'agMultiColumnFilter',
  filterParams: exceptionColumnFilterParams(originalRows),
  valueGetter: (params) => (params?.data?.Exceptions ? params?.data?.Exceptions[0]?.Severity : ''),
  cellRenderer: (params) => {
    const exceptions = !!params?.data?.Exceptions
    if (exceptions) {
      const firstException = params?.data?.Exceptions[0]
      const toolTipTitle = firstException?.Message

      return (
        <div>
          <Tooltip title={toolTipTitle}>
            {firstException?.Severity === 'Warning' && (
              <ExclamationCircleFilled style={{ color: 'var(--theme-warning)', fontSize: 15 }} />
            )}
            {firstException?.Severity === 'Error' && (
              <CloseCircleFilled style={{ color: 'var(--theme-error)', fontSize: 15 }} />
            )}
          </Tooltip>
        </div>
      )
    }
    return ''
  },
})

const PriceEffective = () => ({
  field: 'TargetPeriodEffectiveFrom',
  headerName: 'Price Effective',
  editable: false,
  sortable: true,
  hide: true,
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
      <Horizontal verticalCenter>
        {params?.data?.TargetPeriodEffectiveFrom
          ? dayjs(params?.data?.TargetPeriodEffectiveFrom).format(dateFormat.SHORT_TIME)
          : ''}
      </Horizontal>
    )
  },
})
const LastPublication = () => ({
  field: 'LatestQuoteDate',
  headerName: 'Latest Publication',
  filter: 'agDateColumnFilter',
  editable: false,
  hide: true,
  sortable: true,
  valueFormatter: ({ value }) => (value ? dayjs(value).format(dateFormat.SHORT_DATE_YEAR_TIME) : ''),
  valueGetter: (params) => {
    return params?.data?.LatestQuoteDate ? dayjs(params.data.LatestQuoteDate) : ''
  },
  filterParams: {
    buttons: ['reset'],
  },
})
const LastEffective = () => ({
  field: 'LatestQuoteEffective',
  headerName: 'Latest Effective',
  filter: 'agDateColumnFilter',
  editable: false,
  hide: true,
  sortable: true,
  valueFormatter: ({ value }) => (value ? dayjs(value).format(dateFormat.SHORT_DATE_YEAR_TIME) : ''),
  valueGetter: (params) => {
    return params?.data?.LatestQuoteEffective ? dayjs(params.data.LatestQuoteEffective) : ''
  },
  filterParams: {
    buttons: ['reset'],
  },
})
const CounterParty = () => ({
  flex: 1,
  headerName: 'Counterparty',
  field: 'Counterparty',
  editable: false,
  hide: true,
  valueGetter: (params) => {
    return (
      params.data?.SupplierCounterPartyName ??
      params.data?.CarrierCounterPartyName ??
      params.data?.InternalCounterPartyName ??
      params.data?.ExternalCounterPartyName ??
      ''
    )
  },
  cellRenderer: (params) => (
    <Texto className='flex items-center' style={{ gap: '0.5rem' }}>
      {params.data?.SupplierCounterPartyName ??
        params.data?.CarrierCounterPartyName ??
        params.data?.InternalCounterPartyName ??
        params.data?.ExternalCounterPartyName ??
        ''}
    </Texto>
  ),
})
const Location = () => ({
  headerName: 'Location',
  rowGroup: true,
  rowGroupIndex: 1,
  sort: 'asc',
  field: 'LocationName',
  editable: false,
})

const Origin = (showLocationColumn: boolean) => ({
  headerName: 'Origin',
  rowGroup: true,
  rowGroupIndex: showLocationColumn ? 2 : 1,
  sort: 'asc',
  field: 'OriginLocationName',
  editable: false,
})

const Destination = () => ({
  headerName: 'Destination',
  field: 'DestinationLocationName',
  editable: false,
})

const Product = () => ({
  headerName: 'Product',
  field: 'ProductName',
  editable: false,
})
