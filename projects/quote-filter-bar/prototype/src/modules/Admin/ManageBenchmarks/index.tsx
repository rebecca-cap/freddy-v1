import { PlusCircleOutlined } from '@ant-design/icons'
import { useBenchmarks } from '@api/useBenchmarks'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviButton, GraviGrid, Vertical } from '@gravitate-js/excalibrr'
import { CreateModal } from '@modules/Admin/ManageBenchmarks/CreateModal'
import { GridApi } from 'ag-grid-community'
import React, { MutableRefObject, useMemo, useRef, useState } from 'react'

import { createColumnDefs } from './columnDefs'

export const ManageBenchmarks: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { useBenchmarksGetAll, useBenchmarkMetadata, useUpsertBenchmark } = useBenchmarks()
  const { data: benchmarks } = useBenchmarksGetAll()
  const { data: metadata } = useBenchmarkMetadata()

  const gridAPIRef = useRef() as MutableRefObject<GridApi>
  const columnDefs = useMemo(() => createColumnDefs({ metadata }), [metadata])
  const handleUpdate = async (values) => useUpsertBenchmark.mutateAsync([{ ...values }])
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data.QuoteBenchmarkId,
      frameworkComponents: { SearchableSelect },
    }),
    []
  )

  const controlBarProps = useMemo(
    () => ({
      title: 'Benchmarks',
      actionButtons: (
        <GraviButton
          buttonText='Create'
          icon={<PlusCircleOutlined />}
          success
          onClick={() => setIsModalVisible(!isModalVisible)}
          className='mr-2'
        />
      ),
    }),
    []
  )
  return (
    <Vertical>
      <Vertical flex='1'>
        <GraviGrid
          externalRef={gridAPIRef}
          controlBarProps={controlBarProps}
          agPropOverrides={agPropOverrides}
          columnDefs={columnDefs}
          storageKey='BenchmarkData'
          rowData={benchmarks?.Data || []}
          createSelectOptions={metadata}
          updateEP={handleUpdate}
        />
      </Vertical>
      <CreateModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        metadata={metadata}
        createBenchmark={useUpsertBenchmark}
      />
    </Vertical>
  )
}
