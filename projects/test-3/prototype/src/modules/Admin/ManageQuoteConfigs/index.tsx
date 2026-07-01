import { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviButton, GraviGrid, Vertical } from '@gravitate-js/excalibrr'
import { QuoteConfigurationCreatePayload } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/types.schema'
import { useQuoteRows } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/useQuoteRows'
import { GridApi } from 'ag-grid-community'
import { message } from 'antd'
import React, { MutableRefObject, useMemo, useRef } from 'react'

import { createColumnDefs } from './columnDefs'
import { CreateConfigurationModal } from './components/CreateConfigurationModal'

export const ManageQuoteConfigs: React.FC = () => {
  const { useConfigurations, useConfigMetadata, updateConfiguration } = useQuoteRows()
  const { data: configurations } = useConfigurations()
  const { data: metadata } = useConfigMetadata()

  const gridAPIRef = useRef() as MutableRefObject<GridApi>
  const columnDefs = useMemo(() => createColumnDefs({ metadata }), [metadata])

  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const openModal = () => setIsModalVisible(true)
  const closeModal = () => setIsModalVisible(false)

  const assertUnique = (values: QuoteConfigurationCreatePayload) => {
    if (!configurations?.Data) return true
    const isDupe = configurations?.Data.some((config) => config.ConfigurationName === values.ConfigurationName)
    if (isDupe) {
      message.error('Configuration name must be unique')
    }
    return !isDupe
  }

  const handleUpdate = async (values: QuoteConfigurationCreatePayload) => {
    try {
      if (assertUnique(values)) {
        await updateConfiguration.mutateAsync(values)
        closeModal()
      }
    } catch (error) {
      console.log({ error })
    }
  }
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data.QuoteConfigurationId,
      frameworkComponents: { SearchableSelect, number: NumberCellEditor },
    }),
    []
  )
  const controlBarProps = useMemo(
    () => ({
      title: 'Quote Configs',
      actionButtons: <GraviButton buttonText='Create Configuration' type='primary' theme2 onClick={openModal} />,
    }),
    []
  )
  return (
    <Vertical>
      <Vertical flex='1'>
        <CreateConfigurationModal visible={isModalVisible} onCancel={closeModal} onCreate={handleUpdate} />
        <GraviGrid
          externalRef={gridAPIRef}
          controlBarProps={controlBarProps}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          updateEP={updateConfiguration.mutateAsync}
          storageKey='QuoteRowsData'
          rowData={configurations?.Data || []}
        />
      </Vertical>
    </Vertical>
  )
}
