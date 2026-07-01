import { FileSyncOutlined, LoadingOutlined } from '@ant-design/icons'
import { Dropdown, Tooltip } from 'antd'
import type { MenuProps } from 'antd'
import React from 'react'

/**
 * ⚠️ Unlike the existing UploadDownloadButtons component, this component is truly dumb and is just a piece of UI
 * with a click handler. You are reponsible for handling the click event (which provides the selected format)
 * and calling the apprioate loader code to download the file.
 */
export type DownloadOptions = { title: string; key?: 'all' | 'visible'; name?: string }[]
export type DownloadButtonProps = {
  additionalFormats?: { title: string; name: string }[]
  onDownload: (format: { title: string; name?: string; key?: 'all' | 'visible' }) => void
  isLoading: boolean
  overrideOptions?: DownloadOptions | null
}
export function DownloadButtons({
  additionalFormats = [],
  onDownload,
  isLoading,
  overrideOptions = null,
}: DownloadButtonProps) {
  const downloadOptions: DownloadOptions = overrideOptions || [
    { title: 'Download Excel (.xlsx)', name: 'excel' },
    ...additionalFormats,
  ]
  const getOptionKey = (option) => option.key ?? option.name ?? option.title
  const dropdownMenu: MenuProps = {
    items: downloadOptions.map((option) => ({
      key: getOptionKey(option),
      label: option.title,
    })),
    onClick: ({ key }) => {
      const selectedOption = downloadOptions.find((option) => getOptionKey(option) === key)
      if (selectedOption) onDownload(selectedOption)
    },
  }
  return (
    <Tooltip title='Export to XLSX'>
      <Dropdown.Button
        className='excel-button mx-3'
        menu={dropdownMenu}
        onClick={() => onDownload(downloadOptions[0])}
        disabled={isLoading}
      >
        {isLoading ? (
          <LoadingOutlined style={{ fontSize: '1.2em' }} />
        ) : (
          <FileSyncOutlined style={{ fontSize: '1.2em' }} />
        )}
      </Dropdown.Button>
    </Tooltip>
  )
}
