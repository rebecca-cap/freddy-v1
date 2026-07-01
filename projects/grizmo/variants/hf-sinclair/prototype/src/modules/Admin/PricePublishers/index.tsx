import { useCodeSets } from '@api/useCodeSet'
import { usePricePublishers } from '@api/usePricePublishers'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { useUser } from '@contexts/UserContext'
import { GraviButton, GraviGrid, ManyTag, SelectEditor } from '@gravitate-js/excalibrr'
import { Drawer } from 'antd'
import React, { useMemo, useRef, useState } from 'react'

import { MultiSelectEditor } from './cellEditors'
import { getColumnDefs } from './columnDefs'
import { createPublisherConfig } from './createConfig'
import { ManagePriceTypesDrawer } from './ManagePriceTypesDrawer'

export function PricePublishersPage() {
  const gridRef = useRef()
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.PricePublisher?.Write

  const { usePublishersGetQuery, usePublishersMutation, usePublishersCreateMutation } = usePricePublishers()
  const { useCodeSetQuery } = useCodeSets()

  // Initialize queries
  const { data: publisherData, isFetching: isFetchingPublishers } = usePublishersGetQuery()
  const { data: codeSetData, isFetching: isCodeSetDataFetching } = useCodeSetQuery(['PricePublisherType', 'PriceType'])

  const publisherTypes = useMemo(() => codeSetData?.Data[0], [codeSetData])
  const priceTypes = useMemo(() => {
    codeSetData?.Data[1].CodeValues?.sort((a, b) => a.Display.localeCompare(b.Display))
    return codeSetData?.Data[1]
  }, [codeSetData])

  // Initialize mutations
  const editMutation = usePublishersMutation()
  const createMutation = usePublishersCreateMutation()

  const [showDrawer, setShowDrawer] = useState(false)

  const columnDefs = useMemo(() => getColumnDefs({ publisherTypes, priceTypes }), [publisherTypes, priceTypes])

  const createWrapper = async (newRow) => {
    const selectedPublisherName = newRow.PricePublisherTypeCvId
    const selectedPublisherId = publisherTypes?.CodeValues?.find(
      (cv) => cv.Display === selectedPublisherName
    )?.CodeValueId

    return createMutation.mutateAsync({
      ...newRow,
      PricePublisherTypeCvId: selectedPublisherId,
      IsActive: newRow.IsActive === 'Yes',
      PriceTypes: [],
    })
  }

  const updateWrapper = async (row) => {
    const payload = {
      ...row,
      PriceTypes: row.PriceTypes.map((pt) => {
        if (!pt.PriceTypeCvId) return { PriceTypeCvId: pt, ExtractPrices: true }
        return pt
      }),
    }

    return editMutation.mutateAsync(payload)
  }

  return (
    <>
      <Drawer
        title='Manage Price Types'
        placement='right'
        width='500'
        closable
        onClose={() => setShowDrawer(false)}
        visible={showDrawer}
        className='supply-zone-drawer'
        destroyOnClose
      >
        <ManagePriceTypesDrawer priceTypes={priceTypes} />
      </Drawer>
      <GraviGrid
        controlBarProps={{
          title: 'Manage Publishers',
          actionButtons: canWrite && (
            <GraviButton className='mr-3' buttonText='Manage Price Types' onClick={() => setShowDrawer(!showDrawer)} />
          ),
        }}
        agPropOverrides={{
          groupRowInnerRenderer: (props) => (props?.value === ' ' ? '(Empty)' : props.value),
          // suppressCellSelection: true,
          frameworkComponents: {
            multiSelectEditor: MultiSelectEditor,
            select: SelectEditor,
            manyTag: ManyTag,
            SearchableSelect,
          },
          columnDefaultOverrides: {
            flex: undefined,
            suppressExcelExport: true,
          },
          getRowId: (row) => row?.data?.PricePublisherId,
        }}
        externalRef={gridRef}
        storageKey='ReferenceData/ManagePublishers'
        loading={isCodeSetDataFetching}
        rowData={publisherData?.Data?.map((d) => ({ ...d, id: d.PricePublisherId }))}
        columnDefs={columnDefs}
        enableRangeSelection={false}
        createConfig={createPublisherConfig}
        createSelectOptions={{ publisherTypes }}
        createEP={canWrite ? createWrapper : undefined}
        updateEP={canWrite && updateWrapper}
      />
    </>
  )
}
