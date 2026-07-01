import { FileTextOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons'
import { usePriceHolderManagement } from '@api/usePriceManagement'
import { Placeholder, PlaceholderUpdate, PlaceholderUpdateResponse } from '@api/usePriceManagement/types'
import { GraviButton, GraviGrid, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { customOnCellKeyDown } from '@utils/grid'
import { GridApi } from 'ag-grid-community'
import moment from 'moment/moment'
import React, { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getPlaceholderColumnDefs } from './colDefs'
import { PlaceholderManagementActionButtons } from './components/GridActionButtons'

export function PlaceholderManagement() {
  const gridRef = useRef() as MutableRefObject<GridApi>
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)

  const startDate = moment().startOf('month').toDate()
  const endDate = moment().add('2', 'year').toDate()
  const [effectiveDates, setEffectiveDates] = useState([startDate, endDate])
  const [placeholderMode, setPlaceHolderMode] = useState('OnlyPending')

  const [placeHolders, setPlaceholders] = useState<Placeholder[]>()
  const [dirtyPlaceholders, setDirtyPlaceholders] = React.useState<Placeholder[]>([])

  const { usePriceHoldersQuery, usePlaceholdersUpdate } = usePriceHolderManagement()
  const updatePlaceholders = usePlaceholdersUpdate()

  const {
    data: placeHolderData,
    isLoading,
    refetch: refetchPlaceholders,
    isRefetching,
  } = usePriceHoldersQuery(effectiveDates[0], effectiveDates[1], placeholderMode)

  const columnDefs = useMemo(() => getPlaceholderColumnDefs(dirtyPlaceholders), [placeHolders, dirtyPlaceholders])

  useEffect(() => {
    setPlaceholders(placeHolderData?.Data)
  }, [placeHolderData])

  const handleSave = async () => {
    const payload = dirtyPlaceholders.map((dp) => {
      return {
        FormulaResultComponentId: dp.FormulaResultComponentId,
        Price: dp.Price,
      } as PlaceholderUpdate
    })

    const response = (await updatePlaceholders.mutateAsync(payload)) as PlaceholderUpdateResponse
    if (response.Validations.length) {
      const err = response.Validations[0]
      NotificationMessage(err.Category, err.Message, true)
    } else {
      setDirtyPlaceholders([])
      gridRef.current?.deselectAll()
      NotificationMessage('Success', `${response.TotalRecords} record(s) updated`, false)
    }
  }

  const isMultipleChanges = (change: Quote | Quote[]): change is Quote[] => Array.isArray(change)

  const handlePriceUpdate = useCallback(
    async (changeOrChanges) => {
      const changes = isMultipleChanges(changeOrChanges) ? changeOrChanges : [changeOrChanges]

      // make a copy of the placeholders we have, so we can update it and apply to the gird
      // go through each change, and put it in dirty list
      changes.forEach((change) => {
        const existingDirtyPlaceHolderIndex = dirtyPlaceholders.findIndex(
          (ph) => ph.FormulaResultComponentId === change.FormulaResultComponentId
        )
        // if it's in the list, update it, if not, add it
        if (existingDirtyPlaceHolderIndex === -1) {
          setDirtyPlaceholders((prev) => [...prev, change])
        } else {
          setDirtyPlaceholders((prev) => prev.map((q, index) => (index === existingDirtyPlaceHolderIndex ? change : q)))
        }
      })

      // apply the changes to the grid
      gridRef?.current?.applyTransaction({ update: changes })
    },
    [dirtyPlaceholders, setDirtyPlaceholders]
  )

  const handleGridReset = () => {
    if (!dirtyPlaceholders.length || !gridRef?.current) return

    setIsBulkChangeVisible(false)
    setDirtyPlaceholders([])

    // having to set placeholder to empty to force refresh the grid
    setPlaceholders([])
    gridRef.current?.deselectAll()

    refetchPlaceholders().then((response) => {
      setPlaceholders(response?.data?.Data)
    })
  }

  return (
    <Vertical className='flex-1 vertical-flex'>
      <GraviGrid
        storageKey='MarketPlatform/PlaceholderManagement'
        externalRef={gridRef}
        onDirtyChangeSave={handleSave}
        isBulkChangeVisible={isBulkChangeVisible}
        setIsBulkChangeVisible={setIsBulkChangeVisible}
        hideSaveDisplay
        hideBulkSaveButtons
        columnDefs={columnDefs}
        updateEP={handlePriceUpdate}
        agPropOverrides={{
          getRowId: (row) => row.data?.FormulaResultComponentId?.toString(),
          rowSelection: 'multiple',
          suppressRowClickSelection: true,
          onCellKeyDown: (params) => customOnCellKeyDown(params),
        }}
        controlBarProps={{
          title: 'Placeholder Management',
          actionButtons: (
            <PlaceholderManagementActionButtons
              effectiveDates={effectiveDates}
              setEffectiveDates={setEffectiveDates}
              placeHolderMode={placeholderMode}
              setPlaceholderMode={setPlaceHolderMode}
            />
          ),
        }}
        rowData={placeHolders || []}
        loading={isLoading || isRefetching}
      />
      <div className='py-4 px-3 bg-2 bordered' style={{ display: 'flex', alignItems: 'center' }}>
        <Horizontal flex={1} style={{ gap: '2rem' }} alignItems='center'>
          <Texto appearance='secondary' className='flex items-center' style={{ gap: '0.5rem' }} category='h4'>
            <FileTextOutlined /> Placeholder Management
          </Texto>
        </Horizontal>
        <Horizontal>
          <GraviButton
            className='mr-3'
            buttonText='Reset Changes'
            icon={<SyncOutlined />}
            size='large'
            onClick={() => handleGridReset()}
            disabled={!dirtyPlaceholders.length}
          />

          <GraviButton
            className='mr-3'
            theme2
            buttonText='Save Changes'
            icon={<SaveOutlined />}
            size='large'
            onClick={handleSave}
            disabled={!dirtyPlaceholders.length}
          />
        </Horizontal>
      </div>
    </Vertical>
  )
}
