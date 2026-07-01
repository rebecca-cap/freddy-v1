import { BBDTag } from '@gravitate-js/excalibrr'
import { statusColor } from '@modules/Dashboard/SpecialOffers/utils/Utils/StatusColors'

import styles from './OrderStatusTag.module.css'

type OrderStatusTagProps = {
  status: string
}

export function OrderStatusTag({ status }: OrderStatusTagProps) {
  return (
    <BBDTag className={styles.tag} style={{ '--status-color': statusColor(status) } as React.CSSProperties}>
      {status}
    </BBDTag>
  )
}