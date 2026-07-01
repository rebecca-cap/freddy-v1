import { useUser } from '@contexts/UserContext'
import { NotificationMessage, Vertical } from '@gravitate-js/excalibrr'
import { TradeEntrySetupVolumeThreshold } from '@modules/Admin/ManageVolumeThresholds/Api/types.schema'
import { useManageVolumeThresholds } from '@modules/Admin/ManageVolumeThresholds/Api/useManageVolumeThresholds'
import { ManageVolumeThresholdsGrid } from '@modules/Admin/ManageVolumeThresholds/Components/Grid/ManageVolumeThresholdsGrid'
import {
  getFirstError,
  prettyFieldFromCategory,
} from '@modules/Admin/ManageVolumeThresholds/Utils/ManageVolumeThresholdsUtils'
import { message } from 'antd'

export function ManageVolumeThresholdsPage() {
  const { getVolumeThresholds, updateVolumeThresholds } = useManageVolumeThresholds()
  const { mutateAsync: updateVolumeThresholdsMutation, isLoading: isSaving } = updateVolumeThresholds()

  const { data, isFetching, isLoading } = getVolumeThresholds()
  const { userPermissions } = useUser()

  const canWrite = !!userPermissions?.TradeEntrySetup?.VolumeThresholds?.Write

  const handleUpdate = async (
    rows: TradeEntrySetupVolumeThreshold | TradeEntrySetupVolumeThreshold[]
  ): Promise<boolean> => {
    try {
      const payload = Array.isArray(rows) ? rows : [rows]

      const response = await updateVolumeThresholdsMutation(payload)

      const hasErrors = (response?.Validations ?? []).some((v) => v.Severity === 'Error')

      if (!hasErrors) {
        NotificationMessage('Save Successful ', `${response?.TotalRecords} record(s) updated successfully.`, false)
      } else {
        const firstErr = getFirstError(response?.Validations)
        const { tradeEntrySetupId, field } = prettyFieldFromCategory(firstErr?.Category)
        const details = `${firstErr?.Message}`
        message.error(
          'Save Failed - ' + 'Trade Entry Setup ID: ' + tradeEntrySetupId + ' - ' + field + ' : ' + details,
          15
        )
      }

      return !hasErrors
    } catch {
      return false
    }
  }

  return (
    <Vertical style={{ height: '94vh' }}>
      <ManageVolumeThresholdsGrid
        isLoading={isFetching || isLoading || isSaving}
        rowData={data?.Data}
        canWrite={canWrite}
        updateEP={handleUpdate}
      />
    </Vertical>
  )
}
