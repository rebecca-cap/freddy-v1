import { CheckboxColumn } from '@components/shared/Grid/sharedColumnDefs/CheckboxColumn'
import { GroupCell } from '@components/shared/Grid/sharedColumnDefs/GroupCell'
import {
  ExecuteRevaluationRequest,
  ExecuteRevaluationResponse,
  GetMetaDataResponse,
} from '@modules/ContractManagement/ContractRevaluation/api/types'
import { ContractRevaluationActionsColumn } from '@modules/ContractManagement/ContractRevaluation/components/Grid/Columns/actionColumn'
import { UseMutationResult } from '@tanstack/react-query'
import { ColDef } from 'ag-grid-community'
import moment from 'moment'

interface ContractRevaluationColumnsProps {
  revaluationMutation: UseMutationResult<ExecuteRevaluationResponse, unknown, ExecuteRevaluationRequest>
  contractsDateFilter: [moment.Moment, moment.Moment] | null
  hasSelectedRowsWithoutCalenders: boolean
  metadata?: GetMetaDataResponse['Data']
}
export const ContractRevaluationColumns = ({
  revaluationMutation,
  contractsDateFilter,
  metadata,
  hasSelectedRowsWithoutCalenders,
}: ContractRevaluationColumnsProps): ColDef[] => {
  return [
    CheckboxColumn(),
    GroupCell(),
    ContractId(),
    ContractDetailId(),
    Counterparty(),
    OriginLocation(),
    DestinationLocation(),
    Product(),
    ContractType(),
    Calendar(metadata),
    TradeInstrument(),
    ContractRevaluationActionsColumn(revaluationMutation, contractsDateFilter, hasSelectedRowsWithoutCalenders),
  ]
}

const ContractId = (): ColDef => ({
  headerName: 'Contract ID',
  field: 'TradeEntryId',
})

const ContractDetailId = (): ColDef => ({
  headerName: 'Contract Detail ID',
  field: 'TradeEntryDetailId',
})

const Counterparty = (): ColDef => ({
  headerName: 'Counterparty',
  field: 'CounterPartyName',
})

const OriginLocation = (): ColDef => ({
  headerName: 'Origin Location',
  field: 'OriginLocationName',
})

const DestinationLocation = (): ColDef => ({
  headerName: 'Destination Location',
  field: 'DestinationLocationName',
  hide: true,
})

const Product = (): ColDef => ({
  headerName: 'Product',
  field: 'ProductName',
})

const ContractType = (): ColDef => ({
  headerName: 'Contract Type',
  field: 'TradeEntryTypeCodeValueMeaning',
})

function Calendar(metadata) {
  return {
    headerName: 'Calendar',
    field: 'ValuationCalendarId',
    hide: true,
    valueGetter: ({ data }) => {
      return (
        metadata?.PricingCalendars?.find((calendar) => calendar.Value === data?.ValuationCalendarId?.toString())
          ?.Text || ''
      )
    },
  }
}

const TradeInstrument = (): ColDef => ({
  headerName: 'Trade Instrument',
  field: 'TradeInstrumentName',
})
