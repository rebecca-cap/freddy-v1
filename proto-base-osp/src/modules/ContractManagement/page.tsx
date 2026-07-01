import './styles.css'

import { LoadingOutlined } from '@ant-design/icons'
import { useContractManagementContext } from '@contexts/ContractManagement'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Modal } from 'antd'
import React from 'react'

import { DetailsView } from './components/DetailsView'
import { HeaderEntryView } from './components/HeaderEntry'
import { SaveAsModal } from './components/SaveAsModal'

export function ContractManagementPage() {
  const { pageMode, header, metadata, isLoadingContract, isDraftModalVisible, setDraftModalVisible, saveContract } =
    useContractManagementContext()
  const saveAsModalTitle =
    !header?.TradeEntryId || header?.OrderStatusCodeValueDisplay === 'Draft' ? 'Save As...' : 'Activate Draft Contract'

  if (isLoadingContract) {
    return (
      <Vertical verticalCenter horizontalCenter>
        <Texto category='h1' appearance='secondary'>
          <LoadingOutlined />
        </Texto>
      </Vertical>
    )
  }

  if (pageMode === 'details') {
    return (
      <>
        <Modal
          visible={isDraftModalVisible}
          title={<Texto category='p1'>{saveAsModalTitle}</Texto>}
          destroyOnClose
          style={{ minWidth: '20vw' }}
          className='save-as-modal'
          footer={null}
          onCancel={() => setDraftModalVisible(false)}
        >
          <SaveAsModal header={header} saveContract={saveContract} setDraftModalVisible={setDraftModalVisible} />
        </Modal>
        <DetailsView />
      </>
    )
  }

  if (pageMode === 'header') {
    return <HeaderEntryView header={header} metadata={metadata} />
  }
  return pageMode
}

export const pageStyles = {
  gridSpacing: '1rem',
  section: {
    padding: '2rem',
    backgroundColor: 'var(--gray-100)',
    border: '1px solid var(--gray-200)',
    flex: 1,
  },
  heading: {
    marginBottom: '2rem',
  },
}
