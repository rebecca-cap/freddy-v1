import { CheckCircleFilled, ExclamationCircleFilled, WarningFilled } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'

import styles from './StatusTags.module.css'

export function SuccessTag() {
  return (
    <Horizontal className={`round-border bg-success px-3 py-2 ${styles.tag}`} verticalCenter horizontalCenter>
      <CheckCircleFilled className={styles.icon} />
      <Texto textTransform={'capitalize'} className={styles.label}>
        success
      </Texto>
    </Horizontal>
  )
}

interface ErrorTagProps {
  onClick: () => void
}

export function ErrorTag({ onClick }: ErrorTagProps) {
  return (
    <Horizontal
      className={`round-border bg-error px-3 py-2 cursor-pointer ${styles.tag}`}
      verticalCenter
      horizontalCenter
      onClick={onClick}
    >
      <ExclamationCircleFilled className={styles.icon} />
      <Texto textTransform={'capitalize'} className={styles.label}>
        error
      </Texto>
    </Horizontal>
  )
}

export function WarningTag({ onClick }: ErrorTagProps) {
  return (
    <Horizontal
      className={`round-border bg-warning px-3 py-2 cursor-pointer ${styles.tag}`}
      verticalCenter
      horizontalCenter
      onClick={onClick}
    >
      <WarningFilled className={styles.icon} />
      <Texto textTransform={'capitalize'} className={styles.label}>
        warning
      </Texto>
    </Horizontal>
  )
}

export function ConflictTag() {
  return (
    <Horizontal className={`round-border bg-warning px-3 py-2 ${styles.tag}`} verticalCenter horizontalCenter>
      <WarningFilled className={styles.icon} />
      <Texto textTransform={'capitalize'} className={styles.label}>
        conflict
      </Texto>
    </Horizontal>
  )
}
