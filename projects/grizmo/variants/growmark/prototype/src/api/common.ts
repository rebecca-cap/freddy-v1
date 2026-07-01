import { message } from 'antd'

export const toastApiError = (e, duration = 10) => {
  const validationMessages = e.json?.Validations?.map((v) => v.Message).filter(Boolean) ?? []
  const errorMessages = []
  const errors = e.json?.errors

  if (errors) {
    for (const field in errors) {
      if (errors.hasOwnProperty(field)) errorMessages.push(...errors[field])
    }
  }
  const combinedMessage =
    `${validationMessages.join('\n')}${errorMessages.join('\n')}` || 'An unexpected error occurred'
  message.error(combinedMessage, duration)
}
