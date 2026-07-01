import { useLoadingNumber } from '@api/useLoadingNumber'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { useUser } from '@contexts/UserContext'
import { GraviGrid, Horizontal, NotificationMessage, Vertical } from '@gravitate-js/excalibrr'
import React, { useMemo, useRef, useState } from 'react'

import { DownloadButton } from '../NetGrossDefaults/components/DownloadButton'
import { getColumnDefs } from './components/columnDefs'
import { newLoadingNumberCreateConfig } from './components/createConfig'

export function ManageLoadingNumbers() {
  const { useLoadingNumberMetadataQuery, useLoadingNumberQuery, createOrUpdateLoadingNumberMutation } =
    useLoadingNumber()
  const { data: metadata, isLoading: metadataLoading } = useLoadingNumberMetadataQuery()
  const { data: loadingNumbers, isLoading: loadingNumbersLoading } = useLoadingNumberQuery()
  const { userPermissions } = useUser()
  const canWrite = userPermissions?.LoadingNumbers?.Write

  const gridRef = useRef(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const columnDefs = useMemo(() => getColumnDefs(metadata, canWrite), [metadata?.Data, canWrite])

  const handleSaveChanges = async (data) => {
    if (!canWrite) {
      return null
    }
    return createOrUpdateLoadingNumberMutation.mutateAsync([data])
  }

  const handleCreate = async (formValues) => {
    const CustomerCounterPartyId =
      metadata?.Data?.CounterParties?.find((item) => item.Text === formValues.CustomerCounterParty)?.Value || null
    const SupplierCounterPartyId =
      metadata?.Data?.CounterParties?.find((item) => item.Text === formValues.SupplierCounterParty)?.Value || null
    const CarrierCounterPartyId =
      metadata?.Data?.CounterParties?.find((item) => item.Text === formValues.CarrierCounterParty)?.Value || null
    const ProductId = metadata?.Data?.Products?.find((item) => item.Text === formValues.Product)?.Value || null
    const OriginLocationId =
      metadata?.Data?.Locations?.find((item) => item.Text === formValues.OriginLocation)?.Value || null
    const DestinationLocationId =
      metadata?.Data?.Locations?.find((item) => item.Text === formValues.DestinationLocation)?.Value || null
    const TaxLocationId = metadata?.Data?.Locations?.find((item) => item.Text === formValues.TaxLocation)?.Value || null
    const TradeTypeCvId = metadata?.Data?.TradeTypes?.find((item) => item.Text === formValues.TradeType)?.Value || null
    const IsActive = formValues?.IsActive === 'Active'

    const payload = {
      ...formValues,
      CarrierCounterPartyId,
      CustomerCounterPartyId,
      SupplierCounterPartyId,
      ProductId,
      OriginLocationId,
      DestinationLocationId,
      TaxLocationId,
      TradeTypeCvId,
      IsActive,
    }
    try {
      const response = await createOrUpdateLoadingNumberMutation.mutateAsync([payload])
      if (response?.Validations.length) {
        NotificationMessage('Error', response.Validations[0]?.Message)
      } else {
        NotificationMessage('Loading Number Created', `Loading number ${formValues.Display} has been created`, false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Horizontal fullHeight>
      <Vertical>
        <GraviGrid
          externalRef={gridRef}
          controlBarProps={{
            actionButtons: (
              <Horizontal style={{ marginRight: 15 }}>
                <DownloadButton gridAPIRef={gridRef} pageTitle='LoadingNumbers' setter={setIsDownloading} />
              </Horizontal>
            ),
            title: 'Manage Loading Numbers',
          }}
          agPropOverrides={{
            frameworkComponents: { SearchableSelect },
            getRowId: (row) => row.data?.LoadingNumberId?.toString(),
            rowSelection: 'multiple',
            rowHeight: 70,
          }}
          columnDefs={columnDefs}
          storageKey='ReferenceData/ManageLoadingNumbers'
          rowData={loadingNumbers?.Data}
          updateEP={canWrite && handleSaveChanges}
          createConfig={newLoadingNumberCreateConfig}
          createSelectOptions={metadata?.Data}
          createEP={canWrite && handleCreate}
          loading={loadingNumbersLoading || metadataLoading}
        />
      </Vertical>
    </Horizontal>
  )
}
