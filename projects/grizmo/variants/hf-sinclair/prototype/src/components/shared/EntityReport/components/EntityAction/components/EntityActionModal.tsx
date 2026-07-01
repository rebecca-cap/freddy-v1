import './styles.css'

import { RollBackExtract } from '@components/shared/EntityReport/components/EntityAction/components/RollBackExtract'
import { ViewOnlineOrderDetails } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails'
import { Texto } from '@gravitate-js/excalibrr'
import { Modal } from 'antd'
import React, { useMemo } from 'react'
import { FormulaBreakdownAndValuationDrawer } from 'src/components/shared/Drawers/FormulaBreakdownAndValuationDrawer'

export function EntityActionModal({
  primaryKey,
  currentItemId,
  schemaData,
  selectedEntityAction,
  isInfoModalOpen,
  setIsInfoModalOpen,
  dataQuery,
}) {
  const actionComponents = useMemo(() => {
    return {
      ViewValuationBuildup: {
        component: (
          <FormulaBreakdownAndValuationDrawer
            selectedValuationId={currentItemId}
            isFormulaBreakdownAndValuationDrawerOpen={isInfoModalOpen}
            setIsFormulaBreakdownAndValuationDrawerOpen={setIsInfoModalOpen}
          />
        ),
        config: {
          type: 'drawer',
          className: 'quoteBook-drawer',
          title: 'Cost Valuation Details',
          placement: 'right',
          onClose: () => setIsInfoModalOpen(false),
          width: '50vw',
          visible: isInfoModalOpen,
        },
      },
      RollBackExtract: {
        component: (
          <RollBackExtract
            currentItemId={currentItemId}
            setIsInfoModalOpen={setIsInfoModalOpen}
            dataQuery={dataQuery}
          />
        ),
        config: {
          type: 'modal',
          title: <Texto>{selectedEntityAction}</Texto>,
          destroyOnClose: true,
          visible: isInfoModalOpen,
          style: {
            minWidth: '30vw',
          },
          footer: null,
          onCancel: () => setIsInfoModalOpen(false),
        },
      },
      OnlineOrdersViewDetails: {
        component: (
          <ViewOnlineOrderDetails
            setIsInfoModalOpen={setIsInfoModalOpen}
            primaryKey={primaryKey}
            currentItemId={currentItemId}
            dataQuery={dataQuery}
            refetchData={dataQuery.refetch}
            isAdmin={false}
          />
        ),
        config: {
          type: 'modal',
          title: <Texto>View Details</Texto>,
          destroyOnClose: true,
          className: 'no-ant-modal-body-padding',
          visible: isInfoModalOpen,
          style: {
            minWidth: '50vw',
          },
          footer: null,
          onCancel: () => setIsInfoModalOpen(false),
        },
      },
    }
  }, [isInfoModalOpen])

  const SelectedComponent = () => {
    return actionComponents[selectedEntityAction].component
  }
  const selectedComponentConfig = () => {
    return actionComponents[selectedEntityAction]?.config
  }

  const configType = actionComponents[selectedEntityAction]?.config?.type

  if (configType === 'drawer') {
    return (
      <FormulaBreakdownAndValuationDrawer
        selectedValuationId={currentItemId}
        isFormulaBreakdownAndValuationDrawerOpen={isInfoModalOpen}
        setIsFormulaBreakdownAndValuationDrawerOpen={setIsInfoModalOpen}
      />
    )
  }
  return (
    <Modal {...selectedComponentConfig()}>
      <SelectedComponent />
    </Modal>
  )
}
