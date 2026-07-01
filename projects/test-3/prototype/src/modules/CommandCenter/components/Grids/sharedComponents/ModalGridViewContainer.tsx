import { WidgetConfig, WidgetTitle } from '@modules/CommandCenter/api/types.schema'
import { Modal } from 'antd'

import { WidgetContainer } from '../../WidgetContainer'

interface ModalGridViewContainerProps {
  isModalOpen: boolean
  closeModal: () => void
  widget: WidgetConfig
  alertsOnly: boolean
}
export function ModalGridViewContainer({ isModalOpen, closeModal, widget, alertsOnly }: ModalGridViewContainerProps) {
  return (
    <Modal
      visible={isModalOpen}
      onCancel={closeModal}
      title={null}
      footer={null}
      bodyStyle={{ height: '95vh', padding: '0px', fontSize: '12px' }}
      width='95vw'
      centered
    >
      <div style={{ width: '100%', height: '100%' }}>
        <WidgetContainer
          title={widget.title as WidgetTitle}
          columnDefs={widget.columnDefs}
          gridDataWithStatus={widget.data}
          isLoading={widget.isLoading}
          gridSettings={widget.settings}
          setGridSettings={widget.setSettings}
          storageKey={widget.storageKey}
          gridApiRef={widget.gridApiRef}
          columnHeadersByColumnId={widget.columnHeadersByColumnId}
          alertsOnly={alertsOnly}
        />
      </div>
    </Modal>
  )
}
