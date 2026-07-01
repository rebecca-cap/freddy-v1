import { MetadataListResponseItem } from '@api/globalTypes'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { FormInstance } from 'antd'

type SendReminderFooterProps = {
  onClose: () => void
  currentValue: MetadataListResponseItem[]
  form: FormInstance
  isLoading: boolean
}

export function SendReminderFooter({ isLoading, onClose, form, currentValue }: SendReminderFooterProps) {
  return (
    <Horizontal className={'send-reminder-footer-container'}>
      <GraviButton buttonText={'Cancel'} onClick={onClose} disabled={isLoading} />
      <GraviButton
        buttonText={`Send Reminders (${currentValue?.length})`}
        disabled={currentValue?.length < 1}
        onClick={() => form.submit()}
        loading={isLoading}
      />
    </Horizontal>
  )
}
