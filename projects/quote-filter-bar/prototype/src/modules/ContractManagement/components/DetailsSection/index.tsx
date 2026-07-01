import { FileAddOutlined } from '@ant-design/icons'
import { Footer } from '@components/shared/Navigation/Footer/Footer'
import { useContractManagementContext } from '@contexts/ContractManagement'
import { Vertical } from '@gravitate-js/excalibrr'
import { AllDetailsGrid } from '@modules/ContractManagement/components/DetailsSection/AllDetailsGrid/AllDetailsGrid'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export function AllDetails() {
  const {
    isSubmitting,
    isMakingActive,
    details,
    setActiveTabId,
    hasDetailEdits,
    hasContractEdits,
    isDraftModalVisible,
    setDraftModalVisible,
    contract,
    saveContract,
    canWrite,
  } = useContractManagementContext()
  if (!details.some((detail) => detail)) {
    setActiveTabId('')
  }
  const navigate = useNavigate()

  const handleSaveContract = (Action) => {
    // if user is saving changes
    if (Action === 'SaveChanges') {
      if (!contract) {
        // if this is the first time, preset user with pop up
        return setDraftModalVisible(true)
      }
      // else go ahead and save it
      return saveContract()
    }
    // else making contract active by sending true to function
    return saveContract(true)
  }

  const footerButtonsDisabled =
    (!hasContractEdits && !hasDetailEdits) || isSubmitting || isDraftModalVisible || isMakingActive

  return (
    <Vertical style={{ background: 'var(--gray-100)' }} className='bordered'>
      <Vertical flex={1}>
        <AllDetailsGrid rowData={details} />
      </Vertical>
      <Vertical flex='0 55px'>
        <Footer
          title='Contract View'
          icon={<FileAddOutlined />}
          buttonTitle='Save Changes'
          loading={isSubmitting}
          isMakingActive={isMakingActive}
          contract={contract}
          disabled={footerButtonsDisabled}
          onClick={handleSaveContract}
          onClickCancel={() => {
            navigate('/ContractManagement/Contracts')
          }}
          canWrite={canWrite}
        />
      </Vertical>
    </Vertical>
  )
}
