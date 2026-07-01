import './styles.css'

import { CloudUploadOutlined, DownloadOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { endpoints, usePriceInstruments } from '@api/usePriceInstruments'
import { useUser } from '@contexts/UserContext'
import {
  GraviButton,
  GraviGrid,
  Horizontal,
  NotificationMessage,
  Texto,
  useApi,
  Vertical,
} from '@gravitate-js/excalibrr'
import { Checkbox, Divider, Drawer, Form, Select } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { getColumnDefs } from './colDefs'

export function ManagePriceInstrumentsPage() {
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.PriceInstrument?.Write

  const gridRef = useRef()
  const columnRef = useRef()
  const hiddenFileInput = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [recordCount, setRecordCount] = useState({ updated: 0, warning: 0, error: 0 })
  const [uploadErrors, setUploadErrors] = useState([])

  const { useMetadataQuery, getTemplateForPublisher } = usePriceInstruments()
  const { data: instrumentMetadata } = useMetadataQuery()
  const api = useApi()
  const [form] = Form.useForm()

  const handleDownload = async () => {
    form.submit()
    const pricePublisherId = form.getFieldValue('pricePublisherId')
    const useOriginLocation = form.getFieldValue('UseOriginLocation')
    if (pricePublisherId) {
      const template = await getTemplateForPublisher(pricePublisherId, useOriginLocation)
      if (template) {
        const url = window.URL.createObjectURL(new Blob([template]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'PriceInstrumentTemplate.xlsx')
        document.body.appendChild(link)
        link.click()
      }
    }
  }
  const handleUploadClick = () => {
    hiddenFileInput.current.click()
  }

  const handleUpload = async (event) => {
    if (event.target.files.length === 0) return
    setIsLoading(true)
    const newFile = event.target.files[0]
    const formData = new FormData()
    formData.append('file', newFile)

    try {
      const response = await api.uploadFile(endpoints.upload, formData, { headers: { Accept: 'application/json' } })
      if (response && response.Data) {
        setRows(response.Data)
        setRecordCount((prev) => {
          return {
            ...prev,
            error: response?.Data?.map((row) => row?.ValidationMessages?.length).reduce((a, b) => a + b, 0) || 0,
          }
        })
      } else {
        NotificationMessage(
          response?.Validations[0]?.Category || 'Error Uploading File',
          response?.Validations[0]?.Message || 'Unable to upload file'
        )
      }
    } catch (error) {
      const message = error?.json?.message || 'Something went wrong. Please try again.'
      NotificationMessage('Error Uploading File', message)
      console.log(error)
    }
    setIsLoading(false)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await api.post(endpoints.submit, rows)

      if (response && !!response.Validations?.length) {
        NotificationMessage('Error', response.Validations[0]?.Message, true)
        setIsLoading(false)
      } else {
        setRows([])
        setIsLoading(false)
        setRecordCount((prev) => {
          return { ...prev, updated: response.TotalRecords || 0 }
        })
        hiddenFileInput.current.value = ''
        NotificationMessage('Success', `${response.TotalRecords} record(s) updated`, false)
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const handleAbort = () => {
    hiddenFileInput.current.value = ''
    setRows([])
    setRecordCount({ updated: 0, warning: 0, error: 0 })
    setUploadErrors([])
    setIsLoading(false)
  }

  const useOriginLocation = useMemo(() => {
    return rows.some((row) => row.OriginLocationId !== null)
  }, [rows])

  useEffect(() => {
    if (columnRef.current) {
      const state = columnRef.current.getColumnState()
      const newState = handleOriginLocationColumn(state)
      columnRef.current.applyColumnState({ state: newState })
    }
  }, [useOriginLocation, columnRef.current])

  const handleOriginLocationColumn = (state) => {
    const newState = state.map((column) => {
      if (column.colId === 'OriginLocationName') {
        column.hide = !useOriginLocation
      }
      return column
    })
    return newState
  }

  const columnDefs = useMemo(() => {
    return getColumnDefs(setUploadErrors, useOriginLocation)
  }, [setUploadErrors, useOriginLocation])

  return (
    <>
      <Drawer visible={uploadErrors?.length > 0} onClose={() => setUploadErrors([])} title='Import Row Errors'>
        {uploadErrors?.map((error) => (
          <>
            <Texto key={error}>{error}</Texto>
            <Divider />
          </>
        ))}
      </Drawer>
      <Form form={form} style={{ height: '100%' }}>
        <Vertical flex={2}>
          <Horizontal className='mt-3' flex={0.2}>
            <Vertical flex={0.5}>
              <Horizontal className='full-height-width' flex={1}>
                <GraviButton
                  className='full-height-width '
                  icon={<DownloadOutlined />}
                  buttonText='Download Template'
                  onClick={handleDownload}
                  appearance='outline'
                />
              </Horizontal>
              <Horizontal flex={1}>
                <GraviButton
                  className='full-height-width'
                  icon={<CloudUploadOutlined />}
                  buttonText='Upload File'
                  onClick={handleUploadClick}
                  appearance='outline'
                  disabled={!canWrite}
                />
              </Horizontal>
            </Vertical>
            <Vertical className='p-3 border-top bg-2' flex={1}>
              <Horizontal>
                <Form.Item
                  name='pricePublisherId'
                  rules={[{ required: true, message: 'Please select a publisher to download a template' }]}
                  style={{ flex: 1 }}
                >
                  <Select
                    placeholder='Select a Publisher'
                    className='full-height-width'
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    showSearch
                    options={instrumentMetadata?.Data?.PricePublisherList.map((item) => {
                      return {
                        label: item.Text,
                        value: item.Value,
                      }
                    })}
                  />
                </Form.Item>
              </Horizontal>
              <Horizontal>
                <Form.Item name='UseOriginLocation' valuePropName='checked' initialValue={false}>
                  <Checkbox style={{ alignContent: 'center' }}>
                    <Texto weight={600}>Use Origin Location</Texto>
                  </Checkbox>
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
                  title: 'Manage Price Instruments',
                }}
                rowData={rows}
                loading={isLoading}
                externalRef={gridRef}
                columnApiRef={columnRef}
                columnDefs={columnDefs}
                agPropOverrides={{
                  getRowId: (row) => row.data.RowIdentifier,
                  maintainColumnOrder: true,
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
