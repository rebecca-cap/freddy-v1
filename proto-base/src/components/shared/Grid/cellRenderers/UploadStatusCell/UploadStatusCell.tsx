import { ErrorTag, SuccessTag, WarningTag } from '@components/shared/Grid/cellRenderers/StatusTags/StatusTags'
import { Horizontal } from '@gravitate-js/excalibrr'
import type { components } from '@hooks/useTypedApi'
import { Badge } from 'antd'

import styles from './UploadStatusCell.module.css'

type ValidationResult = components['schemas']['Library.Validation.ValidationResult']

export interface UploadRow {
  Validations?: ValidationResult[] | null
  RowNumber?: number
}

export function getSeverity(row: UploadRow | undefined): 'Error' | 'Warning' | 'Success' {
  if (row?.Validations?.some((v) => v.Severity === 'Error')) return 'Error'
  if (row?.Validations?.some((v) => v.Severity === 'Warning')) return 'Warning'
  return 'Success'
}

interface UploadStatusCellProps {
  data: UploadRow | undefined
  onErrorClick: (messages: string[]) => void
  className?: string
}

export function UploadStatusCell({ data, onErrorClick, className }: UploadStatusCellProps) {
  const severity = getSeverity(data)

  if (severity === 'Error') {
    const errors = data?.Validations?.filter((v) => v.Severity === 'Error') ?? []
    return (
      <Horizontal className={`${styles.wrapper} ${className ?? ''}`} verticalCenter horizontalCenter>
        <Badge count={errors.length}>
          <ErrorTag onClick={() => onErrorClick(errors.map((e) => `Row ${data?.RowNumber}: ${e.Message}`))} />
        </Badge>
      </Horizontal>
    )
  }

  if (severity === 'Warning') {
    const warnings = data?.Validations?.filter((v) => v.Severity === 'Warning') ?? []
    return (
      <Horizontal className={`${styles.wrapper} ${className ?? ''}`} verticalCenter horizontalCenter>
        <Badge count={warnings.length} color='var(--theme-warning)'>
          <WarningTag onClick={() => onErrorClick(warnings.map((w) => `Row ${data?.RowNumber}: ${w.Message}`))} />
        </Badge>
      </Horizontal>
    )
  }

  return (
    <Horizontal className={className} verticalCenter horizontalCenter>
      <SuccessTag />
    </Horizontal>
  )
}
