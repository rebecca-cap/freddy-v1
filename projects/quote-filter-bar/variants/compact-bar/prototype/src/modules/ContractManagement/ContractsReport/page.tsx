import '../styles.css'

import { PlusOutlined } from '@ant-design/icons'
import { useContractsReport } from '@api/useContractsReport'
import { ContractGetAllResponse } from '@api/useContractsReport/types'
import { useUser } from '@contexts/UserContext'
import { GraviButton, GraviGrid, Horizontal, RangePicker, useLocalStorage } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { useContracts } from '@modules/ContractManagement/api/useContracts'
import {
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import moment from 'moment'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getContractReportColumnDefs } from './columnDefs'
import { ContractDetailRow } from './components/ContractDetailRow'

const defineds = {
  startOfWeek: startOfWeek(new Date()),
  endOfWeek: endOfWeek(new Date()),
  startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
  endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),
  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),
  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
}

const staticRanges = [
  {
    label: 'This Week',
    range: () => ({
      startDate: defineds.startOfWeek,
      endDate: defineds.endOfWeek,
    }),
  },
  {
    label: 'Last Week',
    range: () => ({
      startDate: defineds.startOfLastWeek,
      endDate: defineds.endOfLastWeek,
    }),
  },
  {
    label: 'This Month',
    range: () => ({
      startDate: defineds.startOfMonth,
      endDate: defineds.endOfMonth,
    }),
  },
  {
    label: 'Last Month',
    range: () => ({
      startDate: defineds.startOfLastMonth,
      endDate: defineds.endOfLastMonth,
    }),
  },
  {
    label: 'Next 12 months',
    range: () => ({
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 12)),
    }),
  },
  {
    label: 'Last 12 months',
    range: () => ({
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 12)),
      endDate: new Date(),
    }),
  },
]
const staticRangeHandler = {
  range: {},
  isSelected(range) {
    const definedRange = this.range
    return isSameDay(range.startDate, definedRange.startDate) && isSameDay(range.endDate, definedRange.endDate)
  },
}

const customStaticRanges = staticRanges.map((range) => ({ ...staticRangeHandler, ...range }))

export const ContractsReport: React.FC = () => {
  const gridRef = useRef()
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.ContractManagement?.Write

  const storageKey = 'ContractsReport'
  const gridViewManager = useGridViewManager(storageKey)

  const { useContractsOverviewQuery } = useContractsReport()
  const { cancelContract } = useContracts()
  const cancelContractMutation = cancelContract()
  const overviewQuery = useContractsOverviewQuery()
  const { data: response, isLoading } = overviewQuery
  const navigate = useNavigate()

  const [currentTab, setCurrentTab] = useState('All')
  const defaultDateFilter = [moment(), moment().add(7, 'days')]
  const { value: contractsDateFilter, setValue: setContractsDateFilter } = useLocalStorage(
    'ContractsReportDateFilter',
    defaultDateFilter
  )
  const columnDefs = useMemo(() => getContractReportColumnDefs(overviewQuery, cancelContractMutation), [])

  const tabFilter = useCallback(
    (row: ContractGetAllResponse['Data'][number]) => {
      if (currentTab === 'All') return true
      return row.Type === currentTab
    },
    [currentTab]
  )

  const dateRangeFilter = (row: ContractGetAllResponse['Data'][number]) => {
    const fromDate = new Date(row?.FromDateTime)
    const toDate = new Date(row?.ToDateTime)
    const rangeStartDate = moment(contractsDateFilter[0]).toDate()
    const rangeEndDate = moment(contractsDateFilter[1]).toDate()

    // if from date on contract is less than or eq to the end of  the range
    // and the to date on contract is greater than or eq to the start of the range

    return fromDate <= rangeEndDate && toDate >= rangeStartDate
  }

  const onTabChange = (key) => {
    setCurrentTab(key)
  }

  const tabs = useMemo(
    () => ['All', ...new Set(response?.Data?.filter(dateRangeFilter).map((d) => d.Type))].filter((t) => !!t),
    [response?.Data, contractsDateFilter]
  )

  const filteredData = useMemo(
    () => response?.Data?.filter(dateRangeFilter).filter(tabFilter),
    [response?.Data, contractsDateFilter, currentTab]
  )

  const controlBarProps = useMemo(() => {
    return {
      title: 'Contracts',
      actionButtons: (
        <Horizontal style={{ gap: '1em' }}>
          <RangePicker
            inputKey='dates'
            dates={contractsDateFilter.map((d) => moment(d)) || defaultDateFilter}
            onChange={(dates) => setContractsDateFilter(dates.map((d) => moment(d)))}
            placement='bottomRight'
            staticRanges={customStaticRanges}
            format='MM/DD/YYYY'
          />
          {canWrite && (
            <GraviButton
              icon={<PlusOutlined className='pr-2' />}
              success
              buttonText='Create Contract'
              size='large'
              className='mr-3'
              onClick={() => {
                navigate('/ContractManagement/createContract')
              }}
            />
          )}
        </Horizontal>
      ),
    }
  }, [contractsDateFilter, canWrite])

  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (params) => params?.data?.TradeEntryId,
    }
  }, [])
  return (
    // <Vertical flex={1}>
    //   <Vertical flex='0 55px'>
    //     <Tabs
    //       style={{ fontWeight: 'bold' }}
    //       activeKey={currentTab}
    //       onChange={onTabChange}
    //       className='bg-1 p-2 px-4 bordered'
    //     >
    //       {tabs.map((tab) => (
    //         <Tabs.TabPane tab={tab} key={tab} />
    //       ))}
    //     </Tabs>
    //   </Vertical>
    //   <Vertical flex={1}>
    <GraviGrid
      storageKey={storageKey}
      masterDetail
      detailRowAutoHeight
      detailCellRenderer={ContractDetailRow}
      externalRef={gridRef}
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      columnDefs={columnDefs}
      rowData={filteredData}
      loading={!response?.Data || isLoading}
      className='contracts-grid'
      gridViewManager={gridViewManager}
    />
    //   </Vertical>
    // </Vertical>
  )
}
