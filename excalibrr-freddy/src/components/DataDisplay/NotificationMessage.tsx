// @ts-nocheck
import { notification } from 'antd'
import { CheckCircleFilled, WarningFilled } from '@ant-design/icons'

/**
 * @deprecated
 * Do not use this component. It has been flagged as 'unused' and will be removed in the future.
 */
export const NotificationMessage = (
  message,
  description,
  showErrorMessage = true
) => {
  notification.open({
    message: message,
    description: description,
    icon: showErrorMessage ? (
      <WarningFilled
        style={{ color: 'var(--theme-error)', marginTop: '.5em' }}
      />
    ) : (
      <CheckCircleFilled
        style={{ color: 'var(--theme-success)', marginTop: '.5em' }}
      />
    ),
  })
}
