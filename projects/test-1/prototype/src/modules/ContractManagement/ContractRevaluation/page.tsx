import '../styles.css'

import { FormulaBreakdownAndValuationDrawer } from '@components/shared/Drawers/FormulaBreakdownAndValuationDrawer'
import { dateFormat } from '@components/TheArmory/helpers'
import { useLocalStorage, Vertical } from '@gravitate-js/excalibrr'
import { useContractRevaluation } from '@modules/ContractManagement/ContractRevaluation/api/useContractRevaluation'
import { ContractRevaluationGrid } from '@modules/ContractManagement/ContractRevaluation/components/Grid/ContractRevaluationGrid'
import { ManualRevaluationModal } from '@modules/ContractManagement/ContractRevaluation/components/ManualRevaluation/ManualRevaluationModal'
import moment from 'moment/moment'
import React, { useState } from 'react'

const DEFAULT_FROM_DATE = moment().startOf('day')
const DEFAULT_TO_DATE = moment().endOf('day')

export const ContractRevaluation: React.FC = () => {
  const defaultDateFilter: [moment.Moment, moment.Moment] = [moment().subtract(6, 'days'), moment()]

  const { value: contractsDateFilter, setValue: setContractsDateFilter } = useLocalStorage<
    [moment.Moment, moment.Moment] | null
  >('ContractRevaluationDateFilter', defaultDateFilter)

  const [isValuationDrawerOpen, setIsValuationDrawerOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedRowToViewBuildup, setSelectedRowToViewBuildup] = useState<number | null>(null)

  const { getMetaData, getContractValuations, executeRevaluation } = useContractRevaluation()
  const { data: metadata, isLoading: isMetaLoading } = getMetaData()

  const revaluationMutation = executeRevaluation()
  const FromDate = contractsDateFilter?.[0] ?? DEFAULT_FROM_DATE
  const ToDate = contractsDateFilter?.[1] ?? DEFAULT_TO_DATE
  const { data: valuationData, isLoading: isValuationLoading } = getContractValuations({
    FromDate: moment(FromDate).format(dateFormat.ISO),
    ToDate: moment(ToDate).format(dateFormat.ISO),
    TradeEntryIds: [],
    TradeEntryDetailIds: [],
    PriceInstrumentIds: [],
  })

  return (
    <Vertical flex={1}>
      <ContractRevaluationGrid
        metadata={metadata?.Data}
        valuations={valuationData?.Data ?? []}
        isLoading={isValuationLoading || isMetaLoading}
        contractsDateFilter={contractsDateFilter}
        setContractsDateFilter={setContractsDateFilter}
        isValuationDrawerOpen={isValuationDrawerOpen}
        setIsValuationDrawerOpen={setIsValuationDrawerOpen}
        setSelectedRowToViewBuildup={setSelectedRowToViewBuildup}
        revaluationMutation={revaluationMutation}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <FormulaBreakdownAndValuationDrawer
        selectedValuationId={selectedRowToViewBuildup}
        isFormulaBreakdownAndValuationDrawerOpen={isValuationDrawerOpen}
        setIsFormulaBreakdownAndValuationDrawerOpen={setIsValuationDrawerOpen}
      />
      <ManualRevaluationModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} metadata={metadata?.Data} />
    </Vertical>
  )
}
