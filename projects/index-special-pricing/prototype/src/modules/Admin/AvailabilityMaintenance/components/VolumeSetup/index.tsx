import { ExclamationCircleOutlined, FileSyncOutlined } from '@ant-design/icons'
import { AvailableVolumeRow } from '@api/useAvailabilityMaintenance/types'
import { useAvailabilityMaintenance } from '@api/useAvailabilityMaintenance/useAvailabilityMaintenance'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviButton, GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { GridApi } from 'ag-grid-community'
import { Modal } from 'antd'
import React, { MutableRefObject, useMemo, useRef, useState } from 'react'

import { getVolumeSetupColumnDefs } from './columnDefs'
import VolumeSetupManagementPane from './ManagementPane'

export function VolumeSetup({ canWrite }) {
  const gridRef = useRef() as MutableRefObject<GridApi>
  const { confirm } = Modal

  const [isLoading, setIsLoading] = useState(false)
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)

  const {
    useVolumeSetupQuery,
    useVolumeSetupMetadataQuery,
    useVolumeSetupUpsert,
    useVolumeSetupGroupUpsert,
    autoAssignSetupsToVolumes,
  } = useAvailabilityMaintenance()
  const { data: volumeSetups, isLoading: isVolumeSetupsLoading, isFetching } = useVolumeSetupQuery()
  const { data: volumeGroups } = useVolumeSetupMetadataQuery()

  const storageKey = 'Availability/VolumeSetup'
  const gridViewManager = useGridViewManager(storageKey)

  const volumeSetupMutation = useVolumeSetupUpsert()
  const volumeGroupMutation = useVolumeSetupGroupUpsert()

  const columnDefs = useMemo(
    () => getVolumeSetupColumnDefs({ canWrite, volumeGroups: volumeGroups?.AvailableVolumeList }),
    [volumeGroups]
  )

  const isMultipleChanges = (change: AvailableVolumeRow | AvailableVolumeRow[]): change is AvailableVolumeRow[] =>
    Array.isArray(change)

  const handleUpdate = async (changeOrChanges) => {
    const payload = isMultipleChanges(changeOrChanges) ? changeOrChanges : [changeOrChanges]

    volumeSetupMutation.mutate(payload)
  }

  const showConfirm = () => {
    confirm({
      centered: true,
      title: 'Automatically Assign Volume Setups to Volume Groups?',
      icon: <ExclamationCircleOutlined />,
      content:
        'This action will automatically assign or create available volume groups for active volume setups that do not have a volume group assigned.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setIsLoading(true)
        autoAssignSetupsToVolumes().then((response) => {
          setIsLoading(false)
        })
      },
    })
  }

  return (
    <Horizontal style={{ height: '88vh' }}>
      <Vertical>
        <GraviGrid
          storageKey={storageKey}
          gridViewManager={gridViewManager}
          externalRef={gridRef}
          updateEP={handleUpdate} // Don't remove: need this to make inline cell editing work
          controlBarProps={{
            title: 'Volume Setup',
            hideActiveFilters: false,
            actionButtons: (
              <GraviButton
                icon={<FileSyncOutlined className='mt-1' style={{ fontSize: 13 }} />}
                className='mr-3'
                buttonText='Auto-Create Volume Groups'
                theme1
                onClick={() => showConfirm()}
                disabled={!canWrite}
              />
            ),
          }}
          agPropOverrides={{
            rowSelection: 'multiple',
            getRowId: (r) => r.data?.TradeEntrySetupId?.toString(),
            frameworkComponents: { SearchableSelect },
          }}
          isBulkChangeVisible={canWrite ? isBulkChangeVisible : undefined}
          setIsBulkChangeVisible={canWrite ? setIsBulkChangeVisible : undefined}
          bulkDrawerTitle='VOLUME SETUP'
          columnDefs={columnDefs}
          rowData={volumeSetups}
          loading={isLoading || isFetching || isVolumeSetupsLoading}
        />
      </Vertical>
      {!isBulkChangeVisible && (
        <Vertical style={{ maxWidth: 500 }}>
          <VolumeSetupManagementPane
            volumeSetups={volumeSetups}
            volumeGroups={volumeGroups?.AvailableVolumeList}
            volumeGroupMutation={volumeGroupMutation}
            canWrite={canWrite}
          />
        </Vertical>
      )}
    </Horizontal>
  )
}
