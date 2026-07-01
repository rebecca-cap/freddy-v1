import { DollarCircleFilled, StockOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { Contract } from '@api/useContractMeasure/types'
import { GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { getContractMeasureColumnDefs } from '../columnDefs'
import React, { useMemo } from 'react'
import { MeasureAverageStatistic } from './AverageStat'
import { Progress, Skeleton } from 'antd'
import moment from 'moment'

interface IProps {
  contract: Contract
  contractTitle?: string
  isComparison?: boolean
  isLoading?: boolean
}

const GridSummaryHeader = ({
  contract,
  contractTitle,
}: {
  contract: Contract
  contractTitle?: string
  isLoading?: boolean
}) => (
  <Horizontal
    style={{ gap: '1rem', padding: '0.75rem' }}
    alignItems='center'
    justifyContent='flex-end'
    className='bg-1'
  >
    <Texto style={{ flexGrow: 1 }} category='h4' appearance='secondary'>
      {contractTitle ?? contract.contract_id}
    </Texto>
    <Texto appearance='medium'>
      {new Date(contract.effective_from).toLocaleDateString()} - {new Date(contract.effective_to).toLocaleDateString()}
    </Texto>
    <Texto category='h2' weight='lighter' appearance='light'>
      |
    </Texto>
    <Texto category='p2'>
      <UserSwitchOutlined className='mr-2' />
      {contract?.internal_company}
    </Texto>
    <Texto category='h2' weight='lighter' appearance='light'>
      |
    </Texto>
    <Texto category='p2'>
      <UserSwitchOutlined className='mr-2' />
      {contract?.external_company}
    </Texto>
    <Texto category='h2' weight='lighter' appearance='light'>
      |
    </Texto>
    <Horizontal alignItems='center' style={{ gap: '1rem' }}>
      <Texto appearance='medium' category='h5'>
        RATABILITY:{' '}
      </Texto>
      <Progress
        width={50}
        type='circle'
        percent={contract.ratability * 100}
        strokeWidth={8}
        strokeColor={{ '0%': 'var(--theme-color-1)', '100%': 'var(--theme-color-2)' }}
      />
    </Horizontal>
    <Texto category='h2' weight='lighter' appearance='light'>
      |
    </Texto>
    <Texto category='h4' weight='lighter'>
      {fmt.decimal(contract?.volume, 0)} GAL
    </Texto>
  </Horizontal>
)

export const ContractMeasurementGrid: React.FC<IProps> = ({ contract, isLoading, contractTitle, isComparison }) => {
  const comparisonColumnDefs = useMemo(() => getContractMeasureColumnDefs(contract), [contract])

  if (!contract || isLoading)
    return (
      <>
        <Skeleton active />
        <Skeleton active />
      </>
    )

  return (
    <Vertical>
      <GridSummaryHeader contract={contract} contractTitle={contractTitle} isLoading={isLoading} />
      <GraviGrid
        hideQuickSearch
        rowData={contract?.deltas.details}
        loading={!contract || isLoading}
        sideBar={false}
        agPropOverrides={{
          columnDefs: comparisonColumnDefs,
          getRowId: () => crypto.randomUUID(),
          rowGroupPanelShow: 'never',
        }}
        getRow
      />
    </Vertical>
  )
}
