import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { ContractDetails, Detail } from '@modules/ContractManagement/api/types.schema'
import { Popconfirm, Tooltip } from 'antd'
import React from 'react'

interface AllDetailsGridActionButtonsProps {
  hasDetailEdits: boolean
  hasContractEdits: boolean
  rowData: Detail[]
  isFetchingDetailValuation: boolean
  isFetchingContractValuation: boolean
  retrieveValuationData: () => void
  selectedDetails: Detail[]
  deleteDetails: (x: ContractDetails['Details']) => void
  duplicateDetails: (x: ContractDetails['Details']) => void
}

export function AllDetailsGridActionButtons({
  hasDetailEdits,
  hasContractEdits,
  rowData,
  isFetchingDetailValuation,
  isFetchingContractValuation,
  retrieveValuationData,
  selectedDetails,
  deleteDetails,
  duplicateDetails,
}: AllDetailsGridActionButtonsProps) {
  return (
    <Horizontal verticalCenter style={{ gap: 10 }}>
      <Popconfirm
        title={` Are you sure you want to duplicate the selected details?`}
        okText='Duplicate'
        cancelText='Cancel'
        onConfirm={() => {
          duplicateDetails(selectedDetails)
        }}
      >
        <GraviButton
          buttonText={selectedDetails?.length ? `Duplicate (${selectedDetails?.length})` : 'Duplicate'}
          loading={isFetchingDetailValuation || isFetchingContractValuation}
          disabled={isFetchingDetailValuation || isFetchingContractValuation || !selectedDetails?.length}
        />
      </Popconfirm>
      <Popconfirm
        title={` Are you sure you want to delete the selected details?`}
        okText='Delete'
        cancelText='Cancel'
        onConfirm={() => {
          deleteDetails(selectedDetails)
        }}
      >
        <GraviButton
          buttonText={selectedDetails?.length ? `Delete (${selectedDetails?.length})` : 'Delete'}
          error
          loading={isFetchingDetailValuation || isFetchingContractValuation}
          disabled={isFetchingDetailValuation || isFetchingContractValuation || !selectedDetails?.length}
        />
      </Popconfirm>
      <Tooltip title={hasDetailEdits || !rowData ? 'Please save changes to enable valuation refresh.' : ''}>
        <GraviButton
          buttonText='Refresh Values'
          loading={isFetchingDetailValuation || isFetchingContractValuation}
          onClick={() => {
            if (!hasDetailEdits && !hasContractEdits) return retrieveValuationData()
            return null
          }}
          className={hasDetailEdits || hasContractEdits ? 'disabled-gravi-button' : ''}
        />
      </Tooltip>
    </Horizontal>
  )
}
