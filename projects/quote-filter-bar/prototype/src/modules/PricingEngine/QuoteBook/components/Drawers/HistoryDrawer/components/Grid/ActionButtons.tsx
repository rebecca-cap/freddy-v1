import { LineChartOutlined } from '@ant-design/icons'
import { Horizontal, onExport, Texto } from '@gravitate-js/excalibrr'
import { DownloadButtons } from '@utils/DownloadButtons'
import { Switch } from 'antd'
import React from 'react'

export function ActionButtons({
  showFullBenchmarkPrice,
  setShowFullBenchmarkPrice,
  gridAPIRef,
  fileName,
  isLoadingDownload,
  setIsLoadingDownload,
}) {
  return (
    <Horizontal style={{ gap: '1rem' }} verticalCenter>
      <Horizontal style={{ gap: '0.5rem' }} className='mr-3' verticalCenter>
        <Texto category='label' appearance='medium'>
          Show Full Benchmark Price
        </Texto>
        <Switch
          defaultChecked={showFullBenchmarkPrice}
          onChange={(value) => setShowFullBenchmarkPrice(value)}
          checkedChildren={<LineChartOutlined />}
          unCheckedChildren={<LineChartOutlined />}
        />
      </Horizontal>
      <DownloadButtons
        overrideOptions={[
          { title: 'Export All Columns (Default)', key: 'all' },
          { title: 'Export Only Visible Columns', key: 'visible' },
        ]}
        onDownload={(e: { title: string; key?: 'all' | 'visible'; name?: string }) => {
          setIsLoadingDownload(true)

          const columns =
            e.key === 'all'
              ? gridAPIRef?.current?.columnModel?.columnDefs.map((c) => c.children.map((child) => child)).flat()
              : gridAPIRef?.current?.columnModel?.displayedColumns
          const columnsToExport = columns?.map((c) => c?.field || c?.colDef?.field)

          onExport(gridAPIRef, { fileName, columnKeys: columnsToExport })
          setIsLoadingDownload(false)
        }}
        isLoading={isLoadingDownload}
      />
    </Horizontal>
  )
}
