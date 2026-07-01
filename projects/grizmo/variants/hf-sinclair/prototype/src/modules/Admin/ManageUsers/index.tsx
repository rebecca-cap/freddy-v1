import { PlusCircleOutlined } from '@ant-design/icons'
import { useUsers } from '@api/useUsers'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { DownloadButton } from '@components/shared/Grid/sharedActionButtons/DownloadButton'
import { useUser } from '@contexts/UserContext'
import { GraviButton, GraviGrid, Horizontal, NotificationMessage, Texto } from '@gravitate-js/excalibrr'
import { CustomBulkEditorProps } from '@gravitate-js/excalibrr/dist/components/GraviGrid/BulkChangeBar'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { ColDef, GridApi } from 'ag-grid-community'
import { Drawer } from 'antd'
import React, { MutableRefObject, useMemo, useRef, useState } from 'react'

import { getColumnDefs } from './components/colDefs'
import { CreateUserForm } from './components/CreateUserForm'
import { defaultCreateUserOptions, getImpersonationtionCounterPartyList } from './components/util'

export type CreateUserOptions = {
  Name: string
  Selected: boolean
  Value: string
}
export function ManageUsers() {
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.Users?.Write

  const { useMetadataQuery, useUsersQuery, createUpdateUserMutation, sendResetEmailRequest } = useUsers()
  const { data: userMetadata } = useMetadataQuery()
  const { data: usersData, isLoading: isUsersDataLoading } = useUsersQuery()

  const gridAPIRef = useRef() as MutableRefObject<GridApi>
  const storageKey = 'ReferenceData/ManageUsers'
  const gridViewManager = useGridViewManager(storageKey)

  const [creatingUser, setCreatingUser] = useState(false)
  const [isBulkChangeVisible, setIsBulkChangeVisible] = React.useState(false)

  const [createUserOptions, setCreateUserOptions] = useState<CreateUserOptions[]>(defaultCreateUserOptions)

  const updateUser = async (user) => {
    const saveData = Array.isArray(user) ? user : [user]

    const payload = saveData.map((userData) => {
      const counterParty = userMetadata?.Data?.CounterPartyList.find(
        (item) => item.Value === user?.CounterPartyId?.toString()
      )

      const QuoteConfigurationMappingGroups = userData.QuoteConfigurationMappingGroups.map((group) => {
        const quoteGroup = userMetadata?.Data?.QuoteConfigurationMappingGroups.find(
          (metaGroup) => metaGroup.Value === (group?.Id?.toString() ?? group?.toString())
        )
        return {
          Id: quoteGroup.Value,
          Name: quoteGroup.Text,
        }
      })
      const Roles = userData.Roles.map((role) => {
        const rolesList = userMetadata?.Data.InternalRolesList.concat(userMetadata?.Data.ExternalRolesList)
        const foundRole = rolesList.find((metaRole) => metaRole.Value === (role?.Id?.toString() ?? role?.toString()))
        return {
          Id: foundRole.Value,
          Name: foundRole.Text,
        }
      })

      const CounterPartyAssociations = userData.CounterPartyAssociations.map((ImpersonationCounterParty) => {
        const foundCounterParty = getImpersonationtionCounterPartyList(userMetadata).find(
          (counterParty) => counterParty.Value == ImpersonationCounterParty.Id
        )
        return {
          Id: Number(foundCounterParty?.Value),
        }
      })
      return {
        ...userData,
        QuoteConfigurationMappingGroups,
        ...(counterParty && { CounterPartyId: counterParty.Value }),
        ...(counterParty && { CounterPartyName: counterParty.Text }),
        Roles,
        CounterPartyAssociations,
      }
    })

    await createUpdateUserMutation.mutateAsync(payload)
  }

  const sendResetEmail = (row) => {
    const { Email } = row
    if (!Email) {
      NotificationMessage(
        'User Email Missing',
        `Unable to send password reset for user. Please add an email first.`,
        true
      )
    } else {
      try {
        sendResetEmailRequest.mutate(Email)
        NotificationMessage('Password Reset Email Sent', `A password reset email has been sent to ${Email}`, false)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const columnDefs = useMemo(() => getColumnDefs({ userMetadata, sendResetEmail, canWrite }), [userMetadata, canWrite])

  const agPropOverrides = useMemo(
    () => ({
      getRowHeight: (params) =>
        params.data?.Roles?.length ||
        params.data?.CounterPartyAssociations?.length ||
        params?.data?.QuoteConfigurationMappingGroups?.length > 2
          ? 170
          : 50,
      getRowId: (row) => row.data?.ColleagueId,
      frameworkComponents: { SearchableSelect },
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
    }),
    []
  )

  const bulkChangePropertiesComparator = (
    a: ColDef<T> & CustomBulkEditorProps<T>,
    b: ColDef<T> & CustomBulkEditorProps<T>
  ): number => {
    const nameA = a.headerName || a.field || ''
    const nameB = b.headerName || b.field || ''

    return nameA.localeCompare(nameB)
  }
  const controlBarProps = useMemo(
    () => ({
      title: 'Manage Users',
      hideActiveFilters: false,
      actionButtons: (
        <Horizontal>
          <DownloadButton gridAPIRef={gridAPIRef} pageTitle={'Manage Users'} />
          {canWrite && (
            <GraviButton
              icon={<PlusCircleOutlined />}
              buttonText='Create User'
              className='mr-4'
              success
              onClick={() => setCreatingUser(!creatingUser)}
            />
          )}
        </Horizontal>
      ),
    }),
    [canWrite, creatingUser]
  )
  return (
    <div style={{ height: '92vh', width: '100%' }}>
      <GraviGrid
        rowData={usersData?.Data}
        isBulkChangeVisible={isBulkChangeVisible}
        setIsBulkChangeVisible={canWrite ? setIsBulkChangeVisible : undefined}
        bulkChangePropertiesComparator={bulkChangePropertiesComparator}
        key={canWrite}
        externalRef={gridAPIRef}
        columnDefs={columnDefs}
        gridViewManager={gridViewManager}
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        storageKey={storageKey}
        updateEP={canWrite ? updateUser : undefined}
        loading={isUsersDataLoading}
        showColumnsToolbar={false}
      />
      <Drawer
        title={
          <div className='flex justify-sb'>
            <Texto category='h6'>Create New User</Texto>
          </div>
        }
        placement='right'
        width={500}
        destroyOnClose
        onClose={() => setCreatingUser(!creatingUser)}
        visible={creatingUser}
      >
        <CreateUserForm
          setCreatingUser={setCreatingUser}
          creatingUser={creatingUser}
          metadata={userMetadata}
          createUserOptions={createUserOptions}
          setCreateUserOptions={setCreateUserOptions}
        />
      </Drawer>
    </div>
  )
}
