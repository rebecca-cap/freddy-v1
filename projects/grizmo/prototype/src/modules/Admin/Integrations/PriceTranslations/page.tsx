import { WarningFilled, WarningOutlined } from '@ant-design/icons'
import { NewTranslationPayload, usePriceTranslations } from '@api/usePriceTranslations'
import { useUser } from '@contexts/UserContext'
import { GraviGrid, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import { notification, Switch } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { getPriceTranslationColumnDefs } from './columnDefs'

function convertDuplicatedRowToPayload(row: Record<string, any>): NewTranslationPayload {
  return {
    CounterPartySourceIdentifier: row.CounterPartySourceIdentifier,
    CounterPartySourceDisplay: row.CounterPartySourceDisplay,
    ProductSourceIdentifier: row.ProductSourceIdentifier,
    ProductSourceDisplay: row.ProductSourceDisplay,
    LocationSourceIdentifier: row.LocationSourceIdentifier,
    LocationSourceDisplay: row.LocationSourceDisplay,
    TargetCounterPartyId: row.TargetCounterPartyId,
    TargetCounterPartyName: row.TargetCounterPartyName,
    TargetLocationId: row.TargetLocationId,
    TargetLocationName: row.TargetLocationName,
    TargetProductId: row.TargetProductId,
    TargetProductName: row.TargetProductName,
    TargetPricePublisherId: row.TargetPricePublisherId,
    TargetPricePublisherName: row.TargetPricePublisherName,
  }
}

export const PriceTranslationsPage: React.FC = () => {
  const gridRef = useRef<any>(null)
  const dirtyRef = useRef<any>(null)

  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.PriceTranslations?.Write

  const { value: filterChecked, setValue: setFilterChecked } = useLocalStorage('PriceTranslationsFilterChecked', false)
  const [duplicatedRows, setDuplicatedRows] = useState([])

  const {
    usePriceTranslationsQuery,
    usePriceTranslationEnableMutation,
    usePriceTranslationDisableMutation,
    usePriceTranslationIgnoreConflictsMutation,
    usePriceTranslationRespectConflictsMutation,
    usePriceTranslationDeleteMutation,
    usePriceTranslationCreateMutation,
    useMetadataQuery,
  } = usePriceTranslations(dirtyRef)

  const enableTranslation = usePriceTranslationEnableMutation()
  const disableTranslation = usePriceTranslationDisableMutation()
  const ignoreConflictsTranslation = usePriceTranslationIgnoreConflictsMutation()
  const respectConflictsTranslation = usePriceTranslationRespectConflictsMutation()
  const deleteTranslation = usePriceTranslationDeleteMutation()
  const createTranslations = usePriceTranslationCreateMutation()
  const { data: metadata } = useMetadataQuery()

  const { data: priceTranslations, isLoading } = usePriceTranslationsQuery()

  const duplicateRow = (existingRow) => {
    const newRow = {
      ...existingRow,
      IsUserEntered: true,
      IsDuplicated: true,
      OriginalId: existingRow.PriceImportTranslatedIdentifierId,
      PriceImportTranslatedIdentifierId: crypto.randomUUID(),
    }
    setDuplicatedRows([...duplicatedRows, newRow])
    dirtyRef.current.updateDirtyRow(newRow)
  }

  const removeDuplicatedRow = (row) => {
    setDuplicatedRows(
      duplicatedRows.filter((r) => r.PriceImportTranslatedIdentifierId !== row.PriceImportTranslatedIdentifierId)
    )
  }

  const columnDefs = useMemo(
    () =>
      getPriceTranslationColumnDefs({
        enableTranslation,
        disableTranslation,
        ignoreConflictsTranslation,
        respectConflictsTranslation,
        deleteTranslation,
        filterChecked,
        duplicateRow,
        removeDuplicatedRow,
        metadata,
        canWrite,
      }),
    [enableTranslation, disableTranslation, deleteTranslation, filterChecked]
  )

  const translationsWithConflicts = useMemo(() => {
    return (priceTranslations?.Data || []).filter((translation) => translation.HasConflict)
  }, [priceTranslations?.Data])

  const filteredData = useMemo(() => {
    const existingRows = filterChecked ? translationsWithConflicts : priceTranslations?.Data || []

    const duplicatedRowsMap = new Map()
    duplicatedRows.forEach((row) => {
      const originalId = row.OriginalId
      if (!duplicatedRowsMap.has(originalId)) {
        duplicatedRowsMap.set(originalId, [])
      }
      duplicatedRowsMap.get(originalId).push(row)
    })

    return existingRows.reduce((result, existingRow) => {
      result.push(existingRow)

      const duplicatedRowGroup = duplicatedRowsMap.get(existingRow.PriceImportTranslatedIdentifierId)
      if (duplicatedRowGroup) {
        result.push(...duplicatedRowGroup)
      }

      return result
    }, [])
  }, [filterChecked, priceTranslations?.Data, duplicatedRows, translationsWithConflicts])

  useEffect(() => {
    if (gridRef?.current) {
      gridRef.current.forEachNode((node) => {
        if (node.group) node.setExpanded(filterChecked)
      })
    }
  }, [filterChecked])

  const handleSave = (changes) => {
    const upsertRows = changes.dirtyChanges.map(convertDuplicatedRowToPayload)

    createTranslations.mutate(upsertRows, {
      onSuccess: (response) => {
        setDuplicatedRows([])
        if (response?.Validations.length) {
          notification.open({
            message: 'Warning',
            description: response.Validations[0]?.Message,
            icon: <WarningFilled style={{ color: 'var(--theme-warning)', marginTop: '.5em' }} />,
            duration: 20,
          })
        }
      },
      onError: () => {
        console.log('We have a problem jim')
      },
    })
  }

  return (
    <GraviGrid
      isDirtyEdit
      dirtyChangesRef={dirtyRef}
      onDirtyChangeSave={handleSave}
      onDirtyChangeDiscard={() => {
        setDuplicatedRows([])
      }}
      getRowStyle={({ data }) => (data?.IsDuplicated ? { backgroundColor: 'var(--theme-warning-dim)' } : {})}
      storageKey='PriceTranslations'
      externalRef={gridRef}
      suppressDragLeaveHidesColumns
      agPropOverrides={{
        groupDefaultExpanded: filterChecked ? 3 : 0,
        getRowId: ({ data }) => {
          return data?.PriceImportTranslatedIdentifierId
        },
      }}
      columnDefs={columnDefs}
      controlBarProps={{
        title: 'Price Translations',
        actionButtons: (
          <Horizontal style={{ gap: '1rem' }}>
            <Switch
              checked={filterChecked}
              checkedChildren={<WarningOutlined />}
              onChange={() => setFilterChecked(!filterChecked)}
            />
            <Texto>Filter To Conflicts {translationsWithConflicts && `(${translationsWithConflicts?.length})`}</Texto>
          </Horizontal>
        ),
      }}
      rowData={filteredData}
      loading={isLoading}
    />
  )
}
