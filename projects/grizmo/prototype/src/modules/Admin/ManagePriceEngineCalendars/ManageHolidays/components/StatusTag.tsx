import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Badge } from 'antd'

interface StatusTagProps {
  hasErrors: boolean
  errors: string[]
  onErrorClick: () => void
}

function SuccessTag() {
  return (
    <Horizontal className='round-border bg-success p-2' verticalCenter horizontalCenter>
      <CheckCircleFilled style={{ color: 'white', paddingRight: 5, fontSize: 15 }} />
      <Texto style={{ color: 'white', fontSize: 15 }}>Success</Texto>
    </Horizontal>
  )
}

function ErrorTag({ onClick, errorCount }: { onClick: () => void; errorCount: number }) {
  return (
    <Badge count={errorCount}>
      <Horizontal
        className='round-border bg-error p-2'
        verticalCenter
        horizontalCenter
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      >
        <ExclamationCircleFilled style={{ color: 'white', paddingRight: 5, fontSize: 15 }} />
        <Texto style={{ color: 'white', fontSize: 15 }}>ERROR</Texto>
      </Horizontal>
    </Badge>
  )
}

export function StatusTag({ hasErrors, errors, onErrorClick }: StatusTagProps) {
  if (hasErrors) {
    return <ErrorTag onClick={onErrorClick} errorCount={errors.length} />
  }
  return <SuccessTag />
}