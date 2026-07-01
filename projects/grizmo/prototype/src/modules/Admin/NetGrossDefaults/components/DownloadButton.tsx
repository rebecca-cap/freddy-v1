import { onExport } from '@gravitate-js/excalibrr'
import { DownloadButtons } from '@utils/DownloadButtons'
import { Menu } from 'antd'
import moment from 'moment/moment'
import React, { Dispatch, SetStateAction, useState } from 'react'

type DownloadButtonType = {
  gridAPIRef: any
  pageTitle: string
  tabTitle?: string
  setter?: Dispatch<SetStateAction<boolean>>
}

export function DownloadButton({ gridAPIRef, pageTitle, tabTitle = '', setter }: DownloadButtonType) {
  const [isLoading, setIsLoading] = useState(false)

  const DefaultExportConfig = {
    fileName: `${pageTitle}${tabTitle ? `_${tabTitle}` : ''}_${moment().format('YYYY-MM-DD')}.xlsx`,
    sheetName: `${tabTitle || pageTitle}`,
  }

  const handleMenuClick = (e) => {
    setIsLoading(true)
    if (setter) {
      setter(true)
    }
    const exportDataAfterTimeout = () => {
      const columns =
        e.key === 'all'
          ? gridAPIRef?.current?.columnModel?.columnDefs
          : gridAPIRef?.current?.columnModel?.displayedColumns

      const columnsToExport = columns?.map((c) => c?.field || c?.colDef?.field)

      onExport(gridAPIRef, { ...DefaultExportConfig, columnKeys: columnsToExport })
      setIsLoading(false)
      if (setter) {
        setter(false)
      }
    }

    setTimeout(exportDataAfterTimeout, 100)
  }

  return (
    <DownloadButtons
      overrideOptions={[
        { title: 'Export All Columns (Default)', key: 'all' },
        { title: 'Export Only Visible Columns', key: 'visible' },
      ]}
      onDownload={handleMenuClick}
      isLoading={isLoading}
    />
  )
}
