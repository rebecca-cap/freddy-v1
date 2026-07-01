import { CheckCircleFilled, ExclamationCircleFilled, WarningFilled } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Badge } from 'antd'

import { UploadedModel } from '../api/types.schema'

function SuccessTag() {
  return (
    <Horizontal className='round-border bg-success p-2' verticalCenter horizontalCenter>
      <CheckCircleFilled style={{ color: 'white', paddingRight: 5, fontSize: 15 }} />
      <Texto style={{ color: 'white', fontSize: 15 }}>Success</Texto>
    </Horizontal>
  )
}

function ErrorTag({ onClick }: { onClick: () => void }) {
  return (
    <Horizontal className='round-border bg-error p-2' verticalCenter horizontalCenter onClick={onClick}>
      <ExclamationCircleFilled style={{ color: 'white', paddingRight: 5, fontSize: 15 }} />
      <Texto style={{ color: 'white', fontSize: 15 }}>ERROR</Texto>
    </Horizontal>
  )
}

function ConflictTag() {
  return (
    <Horizontal className='round-border bg-warning p-2' verticalCenter horizontalCenter>
      <WarningFilled style={{ color: 'white', paddingRight: 5, fontSize: 15 }} />
      <Texto style={{ color: 'white', fontSize: 15 }}>CONFLICT</Texto>
    </Horizontal>
  )
}

export function StatusTag(data: UploadedModel, setUploadErrors: React.Dispatch<React.SetStateAction<string[]>>) {
  const errorCount = data?.Model?.ValidationMessages?.length
  const conflictCount = data?.Model?.PriceConflictCount || data?.Model?.PriceConflicts?.length || 0
  const hasConflicts = data?.Model?.IsConflict || conflictCount > 0

  // Priority: Errors > Conflicts > Success
  if (!data || errorCount > 0) {
    return (
      <Badge className='mr-3' count={errorCount}>
        <ErrorTag onClick={() => setUploadErrors(data?.Model?.ValidationMessages)} />
      </Badge>
    )
  }

  if (hasConflicts) {
    return (
      <Badge className='mr-3' count={conflictCount}>
        <ConflictTag />
      </Badge>
    )
  }

  return <SuccessTag />
}
