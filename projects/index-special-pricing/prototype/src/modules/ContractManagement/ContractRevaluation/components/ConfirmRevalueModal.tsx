import { ExclamationCircleOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Modal } from 'antd'
import moment from 'moment'

interface ConfirmRevalueModalProps {
  onConfirm: () => void
  onCancel: () => void
  isVisible: boolean
  hasSelectedRowsWithoutCalenders: boolean
  startDate?: moment.Moment | null
  endDate?: moment.Moment | null
}
export function ConfirmRevalueModal({
  onConfirm,
  onCancel,
  isVisible,
  startDate,
  endDate,
  hasSelectedRowsWithoutCalenders,
}: ConfirmRevalueModalProps) {
  return (
    <Modal
      visible={isVisible}
      onCancel={onCancel}
      title={
        <Horizontal alignItems='center'>
          <ExclamationCircleOutlined className='mr-2' style={{ color: 'var(--theme-error)' }} />
          <Texto category='h6'>Confirm Revaluation</Texto>
        </Horizontal>
      }
      footer={
        <Horizontal justifyContent='flex-end' style={{ gap: 10 }}>
          <GraviButton buttonText='Cancel' onClick={onCancel} />
          <GraviButton
            buttonText='Confirm Revaluation'
            theme1
            onClick={() => {
              onConfirm()
            }}
          />
        </Horizontal>
      }
    >
      <Vertical style={{ fontSize: '12px' }}>
        {hasSelectedRowsWithoutCalenders && (
          <Texto category='p2' style={{ fontStyle: 'italic' }} className='mb-2'>
            A selected contract detail does not have an associated pricing calendar. Quote configuration calendar
            default will be used in revaluation.
          </Texto>
        )}
        <Texto category='h6' className='mb-2'>
          Are you sure you want to revalue the selected contract detail(s)?
        </Texto>
        <Horizontal style={{ gap: 10 }}>
          <Texto category='p2'>Start date: </Texto>
          <Texto category='p2'>{moment(startDate).format(dateFormat.SHORT_DATE_YEAR_TIME)}</Texto>
        </Horizontal>
        <Horizontal style={{ gap: 15 }} className='mb-2'>
          <Texto category='p2'>End date: </Texto>
          <Texto category='p2'>{moment(endDate).format(dateFormat.SHORT_DATE_YEAR_TIME)}</Texto>
        </Horizontal>
        <Texto category='p2'>This action cannot be undone.</Texto>
      </Vertical>
    </Modal>
  )
}
