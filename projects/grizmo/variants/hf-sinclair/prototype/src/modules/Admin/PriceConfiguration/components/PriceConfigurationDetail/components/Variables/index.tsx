import { DeleteFilled } from '@ant-design/icons'
import { usePriceConfigurations } from '@api/usePriceConfigurations'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { BBDTag, GraviButton, GraviGrid, Horizontal, NotificationMessage } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

export function Variables({ create, setCreate, configMeta, selectedPriceConfiguration }) {
  const { createUpdatePriceConfigurationMutation } = usePriceConfigurations()

  const handleUpdate = async (rowData) => {
    const updatedRow = rowData.IsPlaceholder ? { ...rowData, IsRequired: false } : rowData

    const OverridePriceInstrumentId = configMeta?.Data?.PriceInstrumentList?.find(
      (item) =>
        item.Value === updatedRow.OverridePriceInstrumentId?.toString() &&
        item.GroupingValue === updatedRow.PricePublisherId?.toString()
    )?.Value

    const PriceConfigurationDetails = selectedPriceConfiguration?.PriceConfigurationDetails?.map((detail) => {
      if (detail.MarketPlatformPriceConfigurationDetailId === updatedRow.MarketPlatformPriceConfigurationDetailId) {
        return { ...updatedRow, OverridePriceInstrumentId }
      }
      return detail
    })

    const payload = { ...selectedPriceConfiguration, PriceConfigurationDetails }
    const response = await createUpdatePriceConfigurationMutation.mutateAsync([payload])

    if (!response.Validations?.length) {
      NotificationMessage('Variable Saved', 'Variable saved successfully', false)
      setCreate(false)
    } else {
      NotificationMessage('Error Saving Variable', response?.Validations[0]?.Message, true)
    }
    return true
  }

  const handleDelete = async (value) => {
    const { PriceConfigurationDetails } = selectedPriceConfiguration

    const indexToDelete = value
      ? PriceConfigurationDetails.findIndex(
          (item) => item.MarketPlatformPriceConfigurationDetailId.toString() === value.toString()
        )
      : PriceConfigurationDetails.findIndex((item) => !item.MarketPlatformPriceConfigurationDetailId)

    const updatedPriceConfigurationDetails = PriceConfigurationDetails.filter(
      (detail, index) => index !== indexToDelete
    )
    if (updatedPriceConfigurationDetails.length === 0) {
      return NotificationMessage('Cannot Delete', 'At least one variable is required')
    }

    const payload = { ...selectedPriceConfiguration, PriceConfigurationDetails: updatedPriceConfigurationDetails }
    return createUpdatePriceConfigurationMutation.mutateAsync([payload])
  }

  const columnDefs = useMemo(
    () => getColumnDefinitions(configMeta, handleDelete, selectedPriceConfiguration),
    [configMeta, selectedPriceConfiguration]
  )

  return (
    <Horizontal>
      <div style={{ minWidth: '100%', height: 450, overflow: 'auto' }}>
        <GraviGrid
          controlBarProps={{
            title: 'Variables',
            actionButtons: (
              <GraviButton
                buttonText='Create'
                success
                disabled={create}
                style={{ borderRadius: 20, minWidth: 100 }}
                onClick={() => setCreate(true)}
              />
            ),
          }}
          agPropOverrides={{
            columnDefs,
            frameworkComponents: { SearchableSelect, number: NumberCellEditor },
            getRowId: (row) => row.data?.MarketPlatformPriceConfigurationDetailId,
          }}
          storageKey='PriceConfigurationVariablesGrid'
          rowData={selectedPriceConfiguration?.PriceConfigurationDetails || []}
          sideBar={false}
          updateEP={handleUpdate}
          rowGroupPanelShow='never'
          headerHeight={25}
        />
      </div>
    </Horizontal>
  )
}

function getColumnDefinitions(configMeta, handleDelete, selectedPriceConfiguration) {
  const columns = [
    {
      field: 'Name',
      required: true,
      valueSetter: ({ newValue, data }) => {
        if (!newValue) {
          return false
        }
        data.Name = newValue
        return true
      },
    },
    {
      headerName: 'Publisher',
      field: 'PricePublisherId',
      maxWidth: 250,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        options: configMeta?.Data?.PricePublisherList?.map((option) => ({
          value: option.Value,
          label: option.Text,
        })),
      },
      valueGetter: (params) =>
        configMeta?.Data?.PricePublisherList.find((item) => item.Value === params.data.PricePublisherId.toString())
          ?.Text,
    },
    {
      headerName: 'Type',
      field: 'PriceTypeCvId',
      maxWidth: 150,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        options: configMeta?.Data?.PriceTypeList?.map((option) => ({
          value: option.Value,
          label: option.Text,
        })),
        showSearch: true,
      },
      valueGetter: (params) =>
        configMeta?.Data?.PriceTypeList.find((item) => item.Value === params.data.PriceTypeCvId.toString())?.Text,
    },
    {
      headerName: '%',
      field: 'Percentage',
      cellEditor: 'number',
      maxWidth: 70,
      valueFormatter: ({ value }) => `${value} %`,
    },
    {
      headerName: 'Instrument Override',
      field: 'OverridePriceInstrumentId',
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      editable: (params) => {
        return !params.data.IsPlaceholder
      },
      cellEditorParams: ({ data }) => {
        return {
          options: configMeta?.Data?.PriceInstrumentList?.filter(
            (item) => item.GroupingValue === data.PricePublisherId.toString()
          ).map((option) => ({
            value: option.Value,
            label: option.Text,
          })),
          showSearch: true,
          allowClear: true,
        }
      },
      valueGetter: (params) => {
        if (params.data.OverridePriceInstrumentId) {
          return (
            configMeta?.Data?.PriceInstrumentList.find(
              (item) =>
                item.Value === params.data.OverridePriceInstrumentId.toString() &&
                item.GroupingValue === params.data.PricePublisherId.toString()
            )?.Text || 'None'
          )
        }
        return 'None'
      },
    },
    {
      headerName: 'Trade Period Pref',
      field: 'TradeDateRuleCvId',
      maxWidth: 130,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      editable: (params) => {
        return !params.data.IsPlaceholder
      },
      cellEditorParams: {
        options: configMeta?.Data?.TradeDateRuleList?.map((option) => ({
          value: option.Value,
          label: option.Text,
        })),
      },
      valueGetter: (params) => {
        if (params.data?.TradeDateRuleCvId && !params.data?.IsPlaceholder) {
          return (
            configMeta?.Data?.TradeDateRuleList.find(
              (item) => item.Value === params.data?.TradeDateRuleCvId?.toString()
            )?.Text || 'None'
          )
        }
        return 'None'
      },
    },
    {
      headerName: 'Cost Component',
      maxWidth: 125,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      editable: (params) => {
        return !params.data.IsPlaceholder
      },
      cellEditorParams: {
        options: [
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
        ],
      },
      field: 'IsCostComponent',
      cellRenderer: ({ value }) =>
        value ? (
          <BBDTag success style={{ textAlign: 'center' }}>
            Yes
          </BBDTag>
        ) : (
          <BBDTag error style={{ textAlign: 'center' }}>
            No
          </BBDTag>
        ),
    },
    {
      headerName: 'Required',
      maxWidth: 125,
      field: 'IsRequired',
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        options: [
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
        ],
      },
      valueSetter: ({ newValue, data }) => {
        const row = { ...data, IsRequired: newValue }
        const copyPriceConfig = { ...selectedPriceConfiguration }
        const PriceConfigurationDetails = copyPriceConfig?.PriceConfigurationDetails?.map((detail) => {
          if (detail.MarketPlatformPriceConfigurationDetailId === row.MarketPlatformPriceConfigurationDetailId) {
            return row
          }
          return detail
        })

        if (!copyPriceConfig?.FuturesOptionRequired && !PriceConfigurationDetails.some((detail) => detail.IsRequired)) {
          NotificationMessage('Cannot save variable', 'At least one variable or the Futures Price must be required')
          return false
        }
        if (newValue) {
          data.IsPlaceholder = !newValue
        }

        data.IsRequired = newValue
        return true
      },
      cellRenderer: ({ data, value }) => {
        if (value) {
          return (
            <BBDTag success style={{ textAlign: 'center' }}>
              Yes
            </BBDTag>
          )
        }
        return (
          <BBDTag error style={{ textAlign: 'center' }}>
            No
          </BBDTag>
        )
      },
    },
    {
      headerName: 'PLACEHOLDER',
      maxWidth: 125,
      field: 'IsPlaceholder',
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        options: [
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
        ],
      },
      valueSetter: ({ newValue, data }) => {
        if (newValue) {
          data.IsRequired = !newValue
          data.TradeDateRuleCvId = null
          data.IsCostComponent = false
          data.OverridePriceInstrumentId = null
        }

        data.IsPlaceholder = newValue
        return true
      },
      cellRenderer: ({ data, value }) => {
        if (value) {
          return (
            <BBDTag success style={{ textAlign: 'center' }}>
              Yes
            </BBDTag>
          )
        }
        return (
          <BBDTag error style={{ textAlign: 'center' }}>
            No
          </BBDTag>
        )
      },
    },
    {
      headerName: '',
      field: 'MarketPlatformPriceConfigurationDetailId',
      maxWidth: 40,
      pinned: 'right',
      editable: false,
      cellRenderer: ({ value }) => (
        <DeleteFilled style={{ color: 'var(--theme-error)', fontSize: 15 }} onClick={() => handleDelete(value)} />
      ),
    },
  ]
  return columns
}
