import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { dateFormat } from '@components/TheArmory/helpers'
import { OrderEntryMetadataResponse } from '@contexts/UserContext/types.schema'
import { BBDTag, ManyTag, validateNotEmptyString } from '@gravitate-js/excalibrr'
import {
  checkLimitedImpersonationRole,
  getImpersonationtionCounterPartyList,
  getRolesList,
} from '@modules/Admin/ManageUsers/components/util'
import { toAntOption, toAntOptionParsedNumberValue } from '@utils/index'
import { ColDef } from 'ag-grid-community'
import { Button } from 'antd'
import moment from 'moment'
import React from 'react'

interface colDefProps {
  userMetadata?: OrderEntryMetadataResponse
  sendResetEmail: (user: any) => void
  canWrite: boolean
}
export const getColumnDefs = ({ userMetadata, sendResetEmail, canWrite }: colDefProps) => {
  const defs = [
    firstName(),
    lastName(),
    {
      field: 'Email',
      headerName: 'Email',
    },
    counterparty(userMetadata),
    isActive(),
    isApproved(),
    isLocked(),
    lastLogin(),
    loginCount(),
    isOptedOutOfMarketingNotifications(),
    authentication(userMetadata),
    {
      field: 'ExternalId',
      minWidth: 100,
    },
    preferredContact(userMetadata),
    quoteBookGroups(userMetadata),
    roles(userMetadata),
    limitedImpersonation(userMetadata),
  ]

  if (canWrite) {
    const writeColumn = resetColumn(sendResetEmail)
    defs.push(writeColumn)
  }
  return defs as ColDef[]
}

function firstName() {
  return {
    field: 'FirstName',
    headerName: 'First Name',
    comparator: (valueA, valueB) => {
      return (valueA || '')?.toLowerCase().localeCompare((valueB || '')?.toLowerCase())
    },
    filter: true,
    valueSetter: validateNotEmptyString,
  }
}

function lastName() {
  return {
    field: 'LastName',
    headerName: 'Last Name',
    comparator: (valueA, valueB) => {
      return (valueA || '')?.toLowerCase().localeCompare((valueB || '')?.toLowerCase())
    },
  }
}

function counterparty(userMetadata) {
  return {
    headerName: 'Counterparty',
    field: 'CounterPartyId',
    minWidth: 140,
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    cellEditorParams: {
      options: userMetadata?.Data?.CounterPartyList?.map(toAntOption),
      showSearch: true,
    },
    valueGetter: ({ data }) => {
      return userMetadata?.Data?.CounterPartyList?.find((option) => option.Value === data?.CounterPartyId.toString())
        ?.Text
    },
    isBulkEditable: true,
    bulkCellEditor: BulkSelectEditor,
    bulkCellEditorParams: {
      options: userMetadata?.Data?.CounterPartyList,
      propKey: 'CounterPartyId',
    },
  }
}

function isActive() {
  return {
    field: 'IsActive',
    headerName: 'Is Active',
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    cellEditorPopup: true,
    minWidth: 100,
    isBulkEditable: true,
    filterParams: {
      valueFormatter: (params) => (params.value ? 'Active' : 'Disabled'),
    },
    bulkCellEditorParams: {
      checkedChildren: 'Active',
      unCheckedChildren: 'Inactive',
    },
    valueFormatter: ({ value }) => (value ? 'Active' : 'Disabled'),
    cellRenderer: ({ value }) => (
      <BBDTag theme2={value} error={!value} style={{ textAlign: 'center' }}>
        {!value ? 'Disabled' : 'Active'}
      </BBDTag>
    ),
    cellEditorParams: {
      cellHeight: 50,
      options: [
        {
          value: true,
          label: 'Active',
        },
        {
          value: false,
          label: 'Disabled',
        },
      ],
      showSearch: false,
      allowClear: false,
    },
  }
}

function isApproved() {
  return {
    field: 'IsApproved',
    headerName: 'Is Approved',
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    isBulkEditable: true,
    filterParams: {
      valueFormatter: (params) => (params.value ? 'Approved' : 'Not Approved'),
    },
    bulkCellEditorParams: {
      checkedChildren: 'Approved',
      unCheckedChildren: 'Not Approved',
    },
    cellEditorPopup: true,
    minWidth: 130,
    valueFormatter: ({ value }) => (value ? 'Approved' : 'Not Approved'),
    cellRenderer: ({ value }) => (
      <BBDTag theme2={value} error={!value} style={{ textAlign: 'center' }}>
        {value ? 'Approved' : 'Not Approved'}
      </BBDTag>
    ),
    cellEditorParams: {
      cellHeight: 50,
      options: [
        {
          value: true,
          label: 'Approved',
        },
        {
          value: false,
          label: 'Not Approved',
        },
      ],
      showSearch: false,
      allowClear: false,
    },
  }
}

function isLocked() {
  return {
    field: 'IsLocked',
    headerName: 'Is Locked',
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    filterParams: {
      valueFormatter: (params) => (params.value ? 'Locked' : 'Not Locked'),
    },
    isBulkEditable: true,
    bulkCellEditorParams: {
      checkedChildren: 'Locked',
      unCheckedChildren: 'Not Locked',
      initialValue: false,
    },
    cellEditorPopup: true,
    minWidth: 120,
    valueFormatter: ({ value }) => (value ? 'Locked' : 'Not Locked'),
    cellRenderer: ({ value }) => (
      <BBDTag theme1={!value} warning={value} style={{ textAlign: 'center' }}>
        {value ? 'Locked' : 'Not Locked'}
      </BBDTag>
    ),
    cellEditorParams: {
      cellHeight: 50,
      options: [
        {
          value: true,
          label: 'Locked',
        },
        {
          value: false,
          label: 'Not Locked',
        },
      ],
      showSearch: false,
      allowClear: false,
    },
  }
}

function lastLogin() {
  return {
    field: 'LastLoginDateTime',
    headerName: 'Last Login',
    minWidth: 100,
    filter: 'agDateColumnFilter',
    valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.MONTH_DATE_YEAR_TIME) : ''),
  }
}

function loginCount() {
  return {
    field: 'LoginCount',
    headerName: 'Login Count',
    minWidth: 80,
    filter: 'agNumberColumnFilter',
    valueFormatter: fmt.integer,
  }
}

function isOptedOutOfMarketingNotifications() {
  return {
    field: 'IsOptedOutOfMarketingNotifications',
    headerName: 'Marketing Emails',
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    filterParams: {
      valueFormatter: (params) => (params.value ? 'Opted Out' : 'Subscribed'),
    },
    isBulkEditable: true,
    bulkCellEditorParams: {
      checkedChildren: 'Opted Out',
      unCheckedChildren: 'Subscribed',
      initialValue: false,
    },
    cellEditorPopup: true,
    minWidth: 150,
    valueFormatter: ({ value }) => (value ? 'Opted Out' : 'Subscribed'),
    cellRenderer: ({ value }) => (
      <BBDTag theme1={!value} warning={value} style={{ textAlign: 'center' }}>
        {value ? 'Opted Out' : 'Subscribed'}
      </BBDTag>
    ),
    cellEditorParams: {
      cellHeight: 50,
      options: [
        {
          value: true,
          label: 'Opted Out',
        },
        {
          value: false,
          label: 'Subscribed',
        },
      ],
      showSearch: false,
      allowClear: false,
    },
  }
}

function authentication(userMetadata) {
  return {
    headerName: 'Authentication',
    field: 'IdentityProviderId',
    minWidth: 125,
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    cellEditorParams: {
      options: userMetadata?.Data?.IdentityProvidersList?.map(toAntOption),
    },
    valueGetter: ({ data }) =>
      userMetadata?.Data?.IdentityProvidersList.find((item) => item.Value === data.IdentityProviderId.toString()).Text,
    isBulkEditable: true,
    bulkCellEditor: BulkSelectEditor,
    bulkCellEditorParams: {
      options: userMetadata?.Data?.IdentityProvidersList,
      propKey: 'IdentityProviderId',
    },
  }
}
function preferredContact(userMetadata) {
  return {
    headerName: 'Preferred Contact Method',
    field: 'PreferredContactMethodCvId',
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    cellEditorParams: {
      options: userMetadata?.Data?.ContactMethodsList?.map(toAntOption),
    },
    valueGetter: ({ data }) =>
      userMetadata?.Data?.ContactMethodsList.find((item) => item.Value === data.PreferredContactMethodCvId.toString())
        .Text,
    isBulkEditable: true,
    bulkCellEditor: BulkSelectEditor,
    bulkCellEditorParams: {
      options: userMetadata?.Data?.ContactMethodsList,
      propKey: 'PreferredContactMethodCvId',
    },
  }
}

function quoteBookGroups(userMetadata) {
  return {
    headerName: 'Quote Book Groups',
    field: 'QuoteConfigurationMappingGroups',
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    required: true,
    minWidth: 300,
    filterParams: {
      valueGetter: (params) => {
        return params.data.QuoteConfigurationMappingGroups.map((option) => option.Name)
      },
    },
    cellEditorParams: ({ data, value }) => {
      return {
        mode: 'multiple',
        options: userMetadata?.Data?.QuoteConfigurationMappingGroups.map(toAntOptionParsedNumberValue),
        value: value?.map((item) => Number(item.Id)),
      }
    },
    valueSetter: (params) => {
      params.data[params.colDef.field] = params.newValue?.map((id) => {
        return {
          Id: id,
          Name: userMetadata?.Data?.QuoteConfigurationMappingGroups.find((role) => role.Value === id.toString())?.Text,
        }
      })
    },
    valueFormatter: ({ value }) =>
      Array.isArray(value)
        ? value
            .map((r) => r?.Name)
            .filter(Boolean)
            .join(', ')
        : '',
    cellRenderer: ({ value }) => {
      if (value?.length) {
        return <ManyTag tagItems={value?.map((item) => item.Name)} maxCount={5} />
      }
      return ''
    },
    isBulkEditable: true,
    bulkCellEditor: BulkSelectEditor,
    bulkCellEditorParams: {
      options: userMetadata?.Data?.QuoteConfigurationMappingGroups,
      propKey: 'QuoteConfigurationMappingGroups',
      selectEditorProps: {
        mode: 'multiple',
      },
      selectEditorStyle: {
        width: 400,
      },
    },
  }
}

function roles(userMetadata) {
  return {
    headerName: 'User Roles',
    field: 'Roles',
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    required: true,
    minWidth: 300,
    filterParams: {
      valueGetter: (params) => {
        return params.data.Roles.map((role) => role.Name)
      },
    },
    cellEditorParams: ({ data, value }) => {
      const rolesList = getRolesList(userMetadata, data)
      return {
        mode: 'multiple',
        options: rolesList?.map(toAntOptionParsedNumberValue),
        value: value?.map((item) => Number(item.Id)),
      }
    },
    valueSetter: (params) => {
      const rolesList = getRolesList(userMetadata, params.data)
      params.data[params.colDef.field] = params.newValue.map((id) => {
        return { Id: id, Name: rolesList.find((role) => role.Value === id.toString())?.Text }
      })
      if (!params?.newValue?.find((id) => checkLimitedImpersonationRole(id))) {
        params.data.CounterPartyAssociations = []
      }
    },
    valueFormatter: ({ value }) =>
      Array.isArray(value)
        ? value
            .map((r) => r?.Name)
            .filter(Boolean)
            .join(', ')
        : '',
    cellRenderer: ({ value }) => {
      return <ManyTag tagItems={value?.map((item) => item.Name)} maxCount={5} />
    },
  }
}

function limitedImpersonation(userMetadata) {
  const toNames = (value: any) =>
    Array.isArray(value) ? value.map((x) => x?.Name ?? x?.CounterPartyName).filter(Boolean) : []
  return {
    headerName: 'Impersonation Assignments',
    field: 'CounterPartyAssociations',
    editable: (params) =>
      params?.data?.Roles?.find((role: { Id: number; Name: string }) => checkLimitedImpersonationRole(role.Id)),
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    required: true,
    minWidth: 300,
    filterParams: {
      valueGetter: (params) => {
        return params.data.CounterPartyAssociations.map(
          (CounterPartyAssociations) => CounterPartyAssociations.CounterPartyName
        )
      },
    },
    cellEditorParams: ({ data, value }) => {
      const ImpersonationCounterPartyList = getImpersonationtionCounterPartyList(userMetadata)
      return {
        mode: 'multiple',
        options: ImpersonationCounterPartyList?.map(toAntOptionParsedNumberValue),
        value: value?.map((item) => item.Id),
      }
    },
    valueSetter: (params) => {
      const ImpersonationCounterPartyList = getImpersonationtionCounterPartyList(userMetadata)
      params.data[params.colDef.field] = params.newValue.map((id) => {
        return { Id: id, Name: ImpersonationCounterPartyList.find((cp) => cp.Value === id.toString())?.Text }
      })
    },
    valueFormatter: ({ value }) => toNames(value).join(', '),
    cellRenderer: ({ value }) => {
      return <ManyTag tagItems={value?.map((item) => item.Name)} maxCount={2} />
    },
  }
}

function resetColumn(sendResetEmail) {
  return {
    headerName: 'Password',
    menuTabs: [],
    sortable: false,
    enableRowGroup: false,
    minWidth: 180,
    editable: false,
    filter: false,
    cellRenderer: ({ data }) => {
      if (data.IsDisabled) return null
      return (
        <Button className='mr-3' onClick={() => sendResetEmail(data)}>
          Reset Password
        </Button>
      )
    },
  }
}
