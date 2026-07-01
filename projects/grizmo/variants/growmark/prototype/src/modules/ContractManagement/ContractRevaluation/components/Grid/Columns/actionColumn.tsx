import '../../../styles.css'

import { DollarOutlined, MoreOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, NotificationMessage } from '@gravitate-js/excalibrr'
import {
  ExecuteRevaluationRequest,
  ExecuteRevaluationResponse,
} from '@modules/ContractManagement/ContractRevaluation/api/types'
import { UseMutationResult } from '@tanstack/react-query'
import { ColDef } from 'ag-grid-community'
import { Menu, Popover } from 'antd'
import moment from 'moment/moment'
import { useState } from 'react'

import { ConfirmRevalueModal } from '../../ConfirmRevalueModal'

export const ContractRevaluationActionsColumn = (
  revaluationMutation: UseMutationResult<ExecuteRevaluationResponse, unknown, ExecuteRevaluationRequest>,
  contractsDateFilter: [moment.Moment, moment.Moment] | null,
  hasSelectedRowsWithoutCalenders: boolean
): ColDef => ({
  headerName: 'Actions',
  field: 'actions',
  maxWidth: 100,
  cellRenderer: ({ data }) => {
    const [popoverVisible, setPopoverVisible] = useState<boolean>(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)

    const handleRevaluate = () => {
      const id = data?.TradeEntryDetailId
      if (!id || !contractsDateFilter) return

      revaluationMutation.mutate(
        {
          TradeEntryDetailIds: [id],
          StartDate: moment(contractsDateFilter[0]).format(dateFormat.ISO),
          EndDate: moment(contractsDateFilter[1]).format(dateFormat.ISO),
        },
        {
          onError: () => {
            NotificationMessage('Error', 'Something went wrong while reevaluating. Please try again later.')
          },
        }
      )
      setIsConfirmModalOpen(false)
    }

    const menu = (
      <Menu>
        <Menu.Item key='reval' icon={<DollarOutlined />} onClick={() => setIsConfirmModalOpen(true)}>
          Revalue
        </Menu.Item>
      </Menu>
    )

    return (
      <Horizontal horizontalCenter>
        <Popover
          visible={popoverVisible}
          onVisibleChange={setPopoverVisible}
          overlayClassName='custom-popover-no-padding'
          placement='bottomRight'
          trigger='click'
          content={menu}
        >
          <GraviButton icon={<MoreOutlined />} />
        </Popover>
        <ConfirmRevalueModal
          isVisible={isConfirmModalOpen}
          onCancel={() => setIsConfirmModalOpen(false)}
          onConfirm={handleRevaluate}
          startDate={contractsDateFilter?.[0]}
          endDate={contractsDateFilter?.[1]}
          hasSelectedRowsWithoutCalenders={hasSelectedRowsWithoutCalenders}
        />
      </Horizontal>
    )
  },
  suppressMovable: true,
  suppressMenu: true,
  sortable: false,
  filter: false,
})
