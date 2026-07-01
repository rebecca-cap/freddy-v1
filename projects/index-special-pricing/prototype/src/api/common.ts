import { message } from 'antd'

interface ApiError {
  // excalibrr's useApi wraps errors with a .json property
  json?: {
    Validations?: Array<{ Message?: string }>
    errors?: Record<string, string[]>
  }
  // openapi-fetch (useTypedApi) throws the raw error body directly
  Validations?: Array<{ Message?: string }>
  errors?: Record<string, string[]>
  // plain Error objects
  message?: string
}

export const toastApiError = (e: ApiError, duration = 10) => {
  // Support both excalibrr (e.json.Validations) and openapi-fetch (e.Validations) error shapes
  const validations = e.json?.Validations ?? e.Validations
  const validationMessages = validations?.map((v) => v.Message).filter(Boolean) ?? []
  const errorMessages: string[] = []
  const errors = e.json?.errors ?? e.errors

  if (errors) {
    for (const field in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, field)) {
        errorMessages.push(...errors[field])
      }
    }
  }
  const combinedMessage =
    `${validationMessages.join('\n')}${errorMessages.join('\n')}` || e.message || 'An unexpected error occurred'
  message.error(combinedMessage, duration)
}
