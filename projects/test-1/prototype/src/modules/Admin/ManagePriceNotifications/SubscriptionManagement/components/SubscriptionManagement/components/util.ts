import { PriceNotificationSubscriptions } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/api/schema.types'

interface isRowEditableProps {
  row: PriceNotificationSubscriptions
  isBulkEditMode: boolean
  canWrite: boolean
  bulkEditRows: PriceNotificationSubscriptions[]
}
export function getIsRowEditable({ row, isBulkEditMode, canWrite, bulkEditRows }: isRowEditableProps) {
  if (!canWrite) return false
  if (!isBulkEditMode) return true
  return bulkEditRows.some((bulkRow) => bulkRow?.Id === row.Id)
}

export function getCellStyle({ row, isBulkEditMode, canWrite, bulkEditRows }: isRowEditableProps) {
  const hasDisabledStyles = isBulkEditMode ? !getIsRowEditable({ row, isBulkEditMode, canWrite, bulkEditRows }) : false
  return !hasDisabledStyles
    ? {}
    : {
        opacity: 0.6,
      }
}
