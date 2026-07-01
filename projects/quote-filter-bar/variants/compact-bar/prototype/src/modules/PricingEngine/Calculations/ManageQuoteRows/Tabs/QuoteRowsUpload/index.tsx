import './styles.css'

import { CloudUploadOutlined, DownloadOutlined, ExclamationCircleFilled, LoadingOutlined } from '@ant-design/icons'
import { useQuoteRowsUpload } from '@api/useQuoteRowsUpload'
import { GraviButton, GraviGrid, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useQuoteRows } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/useQuoteRows'
import { Divider, Drawer, Form, Select } from 'antd'
import React, { useMemo, useRef, useState } from 'react'

import { getColumnDefs } from './colDefs'

export function QuoteRowsUpload({ canWrite }) {
  const hiddenFileInput = useRef<HTMLInputElement>()
  const [isLoading, setIsLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [recordCount, setRecordCount] = useState({ updated: 0, warning: 0, error: 0 })
  const [uploadErrors, setUploadErrors] = useState([])
  const [downloadingTemplate, setDownloadingTemplate] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  const { useMetadataQuery, getTemplateByQuoteConfig, uploadFile } = useQuoteRowsUpload()
  const { upsertMapping } = useQuoteRows()

  const { data: configurations } = useMetadataQuery()
  const [form] = Form.useForm()

  const handleDownload = async () => {
    form.submit()
    const configurationId = form.getFieldValue('ConfigurationId')
    if (configurationId) {
      setDownloadingTemplate(true)
      const template = await getTemplateByQuoteConfig(configurationId)
      if (template) {
        const url = window.URL.createObjectURL(new Blob([template]))
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

  const handleUpload = async (event) => {
    if (event.target.files.length === 0) return

    setIsLoading(true)
    const newFile = event.target.files[0]

    const formData = new FormData()
    formData.append('file', newFile)
    setUploadedFile(formData)

    try {
      const response = await uploadFile(false, formData)
      if (response && response.Data) {
        setRows(response.Data)
        setRecordCount((prev) => {
          return {
            ...prev,
            error: response?.Data?.filter((row) => row?.HasErrors).length,
          }
        })
      } else {
        NotificationMessage(
          response?.Validations[0]?.Category || 'Error Uploading File',
          response?.Validations[0]?.Message || 'Unable to upload file'
        )
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const handleSave = () => {
    setIsLoading(true)

    const payload = rows.map((row) => row.Item)
    const response = upsertMapping.mutate({ rowOrRows: payload })

    setRows([])
    setIsLoading(false)
    setRecordCount((prev) => {
      return { ...prev, updated: rows?.length || 0 }
    })
    clearFile()
    setUploadedFile(null)
    NotificationMessage('Success', `${payload?.length} record(s) updated`, false)
  }

  const handleAbort = () => {
    clearFile()
    setRows([])
    setRecordCount({ updated: 0, warning: 0, error: 0 })
    setUploadErrors([])
    setIsLoading(false)
  }

  const columnDefs = useMemo(() => getColumnDefs(setUploadErrors), [setUploadErrors])

  return (
    <>
      <Drawer visible={uploadErrors?.length > 0} onClose={() => setUploadErrors([])} title='Import Row Errors'>
        {uploadErrors?.map((error) => (
          <>
            <Texto key={error?.Message}>{error?.Message}</Texto>
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
                  className='full-height-width '
                  icon={downloadingTemplate ? <LoadingOutlined /> : <DownloadOutlined />}
                  buttonText='Download Template'
                  onClick={handleDownload}
                  appearance='outline'
                />
              </Horizontal>
              {canWrite && (
                <Horizontal flex={1}>
                  <GraviButton
                    className='full-height-width'
                    icon={<CloudUploadOutlined />}
                    buttonText='Upload File'
                    onClick={handleUploadClick}
                    appearance='outline'
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
                    placeholder='Select quote configuration '
                    className='full-height-width'
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    showSearch
                    options={configurations?.ValidConfigurations.map((item) => {
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
                controlBarProps={{
                  title: 'Manage Quote Rows',
                }}
                rowData={rows}
                loading={isLoading}
                storageKey='QuoteRowsUploader'
                agPropOverrides={{
                  columnDefs,
                  getRowId: (row) => row.data.RowNumber,
                }}
              />
            </Vertical>
          </Horizontal>
          {canWrite && (
            <Horizontal className='justify-end pr-5 py-2' style={{ gap: 50 }} flex={0.1}>
              <GraviButton buttonText='Abort' onClick={handleAbort} />
              <GraviButton buttonText='Save All' onClick={handleSave} success disabled={recordCount.error > 0} />
            </Horizontal>
          )}
        </Vertical>
      </Form>
    </>
  )
}
