import { DollarOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, NotificationMessage, RangePicker } from '@gravitate-js/excalibrr'
import { Tooltip } from 'antd'
import moment from 'moment'
import React, { useMemo, useState } from 'react'

import { ConfirmRevalueModal } from '../ConfirmRevalueModal'

interface ActionButtonsProps {
  contractsDateFilter: [moment.Moment, moment.Moment] | null
  setContractsDateFilter: (val: [moment.Moment, moment.Moment]) => void
  selectedIdsToRevaluate: number[]
  handleContractRevaluation: () => void
  isLoading: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  hasSelectedRowsWithoutCalenders: boolean
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  contractsDateFilter,
  setContractsDateFilter,
  selectedIdsToRevaluate,
  handleContractRevaluation,
  isLoading,
  setIsModalOpen,
  hasSelectedRowsWithoutCalenders,
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
  const buttonText = useMemo(() => {
    if (selectedIdsToRevaluate?.length) {
      return `Bulk Revalue (${selectedIdsToRevaluate?.length})`
    }
    return 'Bulk Revalue'
  }, [selectedIdsToRevaluate])

  const popConfirmTitle = contractsDateFilter
    ? `Are you sure you want to revaluate ${selectedIdsToRevaluate?.length} details from ${moment(
        contractsDateFilter[0]
      ).format(dateFormat.SHORT_DATE_YEAR_TIME)} to ${moment(contractsDateFilter[1]).format(
        dateFormat.SHORT_DATE_YEAR_TIME
      )}?`
    : ''

  const toolTipTitle = !selectedIdsToRevaluate?.length ? 'Select rows to revaluate details' : ''

  return (
    <Horizontal style={{ gap: '1em' }}>
      <Tooltip title={toolTipTitle}>
        <GraviButton
          buttonText={buttonText}
          icon={<DollarOutlined />}
          disabled={!selectedIdsToRevaluate?.length}
          loading={isLoading}
          onClick={() => setIsConfirmModalOpen(true)}
        />
      </Tooltip>
      <RangePicker
        dates={contractsDateFilter?.map((d) => moment(d))}
        inputKey='dates'
        placement='bottomRight'
        onChange={(dates) => {
          if (!dates || dates.length !== 2) return

          const [start, end] = dates

          const from = moment.isMoment(start) ? start : moment(start)
          const to = moment.isMoment(end) ? end : moment(end)

          if (to.diff(from, 'days') > 6) {
            NotificationMessage('Error', 'You can only select up to 7 days.')

            const fallback: [moment.Moment, moment.Moment] = [
              moment().subtract(6, 'days').startOf('day'),
              moment().endOf('day'),
            ]

            setContractsDateFilter(fallback)
            return
          }

          setContractsDateFilter([from.startOf('day'), to.endOf('day')])
        }}
      />

      <GraviButton buttonText={'Revaluation Wizard'} onClick={() => setIsModalOpen(true)} />
      <ConfirmRevalueModal
        onConfirm={() => {
          handleContractRevaluation()
          setIsConfirmModalOpen(false)
        }}
        onCancel={() => {
          setIsConfirmModalOpen(false)
        }}
        isVisible={isConfirmModalOpen}
        startDate={contractsDateFilter?.[0]}
        endDate={contractsDateFilter?.[1]}
        hasSelectedRowsWithoutCalenders={hasSelectedRowsWithoutCalenders}
      />
    </Horizontal>
  )
}
