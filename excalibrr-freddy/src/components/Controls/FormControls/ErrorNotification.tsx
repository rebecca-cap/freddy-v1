import { NotificationMessage } from '../../DataDisplay/NotificationMessage'

type ErrorMessage = { errorFields: { errors: any[] }[] }
export const ErrorNotification = (message: ErrorMessage) => {
  let errors = [] as any[]
  const messages = message.errorFields.map((e, i) => {
    const error = e.errors[0]
    if (errors.includes(error)) return
    errors.push(error)
    return <li key={i}>{error}</li>
  })

  NotificationMessage('Oops!', messages)
}
