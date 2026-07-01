import './styles.css'

import { CloudUploadOutlined, DownloadOutlined, ExclamationCircleFilled, LoadingOutlined } from '@ant-design/icons'
import { useQuoteRowsUploadTyped } from '@api/useQuoteRowsUpload/useQuoteRowsUploadTyped'
import { GraviButton, GraviGrid, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { UploadedQuoteRow } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/types.schema'
import { useQuoteRowsTyped } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/useQuoteRowsTyped'
import { Divider, Drawer, Form, Select } from 'antd'
import React, { useMemo, useRef, useState } from 'react'

import { getColumnDefs } from './Components/Grid/Columns/colDefs'

interface QuoteRowsUploadProps {
  canWrite: boolean
}

export function QuoteRowsUpload({ canWrite }: QuoteRowsUploadProps) {
  const hiddenFileInput = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [rows, setRows] = useState<UploadedQuoteRow[]>([])
  const [recordCount, setRecordCount] = useState({ updated: 0, warning: 0, error: 0 })
  const [uploadErrors, setUploadErrors] = useState<string[]>([])
  const [downloadingTemplate, setDownloadingTemplate] = useState(false)

  const { useMetadataQuery, getTemplateByQuoteConfig, uploadFile } = useQuoteRowsUploadTyped()
  const { upsertMapping, useConfigurations } = useQuoteRowsTyped()

  const { data: configurations } = useMetadataQuery()
  const { data: configsResponse } = useConfigurations()
  const [form] = Form.useForm()
  const hasOriginAndDestination = useMemo(() => {
    const uploadedConfigId = rows[0]?.Item?.QuoteConfigurationId
    if (!uploadedConfigId) return false
    return (
      configsResponse?.Data?.find((c) => c.QuoteConfigurationId === uploadedConfigId)?.HasOriginAndDestination ?? false
    )
  }, [rows, configsResponse])

  const handleDownload = async () => {
    form.submit()
    const configurationId = form.getFieldValue('ConfigurationId')
    if (configurationId) {
      setDownloadingTemplate(true)
      const template = await getTemplateByQuoteConfig(configurationId)
      if (template) {
        const url = window.URL.createObjectURL(template)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'QuoteRowTemplate.xlsx')
        document.body.appendChild(link)
        link.click()
        setDownloadingTemplate(false)
      }
    }
  }
  const handleUploadClick = () => {
    clearFile()
    if (hiddenFileInput?.current) {
      hiddenFileInput.current.click()
    }
  }

  const clearFile = () => {
    if (hiddenFileInput?.current) {
      hiddenFileInput.current.value = ''
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return

    setIsLoading(true)
    const newFile = event.target.files[0]

    const formData = new FormData()
    formData.append('file', newFile)

    try {
      const response = await uploadFile(false, formData)
      if (response?.Data) {
        setRows(response.Data)
        setRecordCount((prev) => ({
          ...prev,
          error: response.Data?.filter((row) => row?.HasErrors).length ?? 0,
        }))
      } else {
        NotificationMessage(
          response?.Validations?.[0]?.Category || 'Error Uploading File',
          response?.Validations?.[0]?.Message || 'Unable to upload file',
          true
        )
      }
    } catch {
      NotificationMessage('Error Uploading File', 'Unable to upload file', true)
    }
    setIsLoading(false)
  }

  const handleSave = async () => {
    setIsLoading(true)
    const payload = rows.flatMap((row) => (row.Item ? [row.Item] : []))
    try {
      await upsertMapping.mutateAsync({ rowOrRows: payload })
      setRows([])
      setRecordCount((prev) => ({ ...prev, updated: rows?.length || 0 }))
      clearFile()
      NotificationMessage('Success', `${payload?.length} record(s) updated`, false)
    } catch {
      // onError in the mutation already shows an error notification
    } finally {
      setIsLoading(false)
    }
  }

  const handleAbort = () => {
    clearFile()
    setRows([])
    setRecordCount({ updated: 0, warning: 0, error: 0 })
    setUploadErrors([])
    setIsLoading(false)
  }

  const columnDefs = useMemo(() => getColumnDefs(setUploadErrors, hasOriginAndDestination), [hasOriginAndDestination])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data.RowNumber,
    }),
    []
  )

  return (
    <>
      <Drawer open={uploadErrors?.length > 0} onClose={() => setUploadErrors([])} title='Import Row Errors'>
        {uploadErrors?.map((error) => (
          <>
            <Texto key={error}>{error}</Texto>
            <Divider />
          </>
        ))}
      </Drawer>
      <Form form={form} style={{ height: '100%' }}>
        <Vertical flex={2}>
          <Horizontal flex={0.2}>
            <Vertical flex={0.5}>
              <Horizontal className='full-height-width' flex={1} verticalCenter horizontalCenter>
                <GraviButton
                  className='full-height-width'
                  icon={downloadingTemplate ? <LoadingOutlined /> : <DownloadOutlined />}
                  buttonText='Download Template'
                  onClick={handleDownload}
                  appearance='outlined'
                  style={{ borderRadius: 0 }}
                />
              </Horizontal>
              {canWrite && (
                <Horizontal flex={1}>
                  <GraviButton
                    className='full-height-width'
                    icon={<CloudUploadOutlined />}
                    buttonText='Upload File'
                    onClick={handleUploadClick}
                    appearance='outlined'
                    style={{ borderRadius: 0 }}
                  />
                </Horizontal>
              )}
            </Vertical>
            <Vertical className='p-3 border-top bg-2' flex={1}>
              <Horizontal>
                <Form.Item
                  name='ConfigurationId'
                  rules={[{ required: true, message: 'Please select a configuration to download a template' }]}
                  style={{ flex: 1 }}
                >
                  <Select
                    placeholder='Select quote configuration'
                    className='full-height-width'
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    showSearch
                    options={configurations?.ValidConfigurations?.map((item) => {
                      return {
                        label: item.Text,
                        value: item.Value,
                      }
                    })}
                  />
                </Form.Item>
              </Horizontal>
            </Vertical>
            <Vertical className='p-2 border-top border-right bg-2' flex={1}>
              <Horizontal justifyContent='flex-end' className='p-2'>
                <input type='file' onChange={handleUpload} ref={hiddenFileInput} style={{ display: 'none' }} />
              </Horizontal>
            </Vertical>
            <Vertical className='p-3' flex={0.5}>
              <Horizontal
                verticalCenter
                className='p-3 border-error full-height-width'
                style={{ backgroundColor: recordCount?.error > 0 ? 'var(--theme-error-dim)' : '' }}
              >
                <Vertical height='auto'>
                  <Texto category='h5'> {recordCount?.error} </Texto>
                  <Texto> Record Errors</Texto>
                </Vertical>
                <ExclamationCircleFilled className='text-error text-size-8' />
              </Horizontal>
            </Vertical>
          </Horizontal>
          <Horizontal flex={1.7}>
            <Vertical>
              <GraviGrid
                enableFilterContextMenu
                controlBarProps={{
                  title: 'Manage Quote Rows',
                }}
                rowData={rows}
                loading={isLoading}
                storageKey='QuoteRowsUploader'
                columnDefs={columnDefs}
                agPropOverrides={agPropOverrides}
              />
            </Vertical>
          </Horizontal>
          {canWrite && (
            <Horizontal className='justify-end pr-5 py-2' gap={50} flex={0.1}>
              <GraviButton buttonText='Abort' onClick={handleAbort} appearance='outlined' style={{ borderRadius: 0 }} />
              <GraviButton
                buttonText='Save All'
                onClick={handleSave}
                className='gravi-button-success'
                appearance='outlined'
                style={{ borderRadius: 0 }}
                disabled={recordCount.error > 0}
              />
            </Horizontal>
          )}
        </Vertical>
      </Form>
    </>
  )
}
