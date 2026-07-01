import { useUsers } from '@api/useUsers'
import { OrderEntryMetadataResponse } from '@contexts/UserContext/types.schema'
import {
  CheckCard,
  CheckCardGroup,
  ErrorNotification,
  GraviButton,
  Horizontal,
  NotificationMessage,
  Vertical,
} from '@gravitate-js/excalibrr'
import { CreateUserOptions } from '@modules/Admin/ManageUsers'
import {
  checkLimitedImpersonationRole,
  defaultCreateUserOptions,
  getImpersonationtionCounterPartyList,
  getRolesList,
} from '@modules/Admin/ManageUsers/components/util'
import { toAntOption } from '@utils/index'
import { Form, Input, Popconfirm, Select } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'

interface CreateUserFormProps {
  setCreatingUser: (value: boolean) => void
  creatingUser: boolean
  metadata?: OrderEntryMetadataResponse
  createUserOptions: CreateUserOptions[]
  setCreateUserOptions: (options: CreateUserOptions[]) => void
}
export function CreateUserForm({
  setCreatingUser,
  creatingUser,
  metadata,
  createUserOptions,
  setCreateUserOptions,
}: CreateUserFormProps) {
  const { createUpdateUserMutation } = useUsers()
  const [userRoles, setUserRoles] = useState<{ label: string; value: string }[] | []>([])
  const [showImpersonationAssignments, setShowImpersonationAssignments] = useState(false)
  const [showApprovePopconfirm, setShowApprovePopconfirm] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ IdentityProviderId: '1' })
    form.setFieldsValue({ PreferredContactMethodCvId: '3601' })
  }, [])

  const isApproved = useMemo(() => {
    return createUserOptions.find((item) => item.Name === 'Approved')?.Selected
  }, [createUserOptions])

  const handleToggle = (name) => {
    const updatedOptions = [...createUserOptions]
    const index = updatedOptions.findIndex((option) => option.Name === name)
    updatedOptions[index] = { ...updatedOptions[index], Selected: !updatedOptions[index].Selected }
    setCreateUserOptions(updatedOptions)
    if (name === 'Approved' && !updatedOptions[index].Selected) {
      form.resetFields(['roles', 'CounterPartyAssociations'])
      setShowImpersonationAssignments(false)
    }
  }

  const updateRoles = (value) => {
    const selectedCounterParty = metadata?.Data.CounterPartyList.find((party) => party.Value === value)
    form.resetFields(['roles', 'CounterPartyAssociations'])
    if (selectedCounterParty && selectedCounterParty.IsInternal) {
      const internalRoles = metadata?.Data?.InternalRolesList.map((item) => {
        return {
          label: item.Text,
          value: item.Value,
        }
      })
      return setUserRoles(internalRoles)
    }

    const externalRoles = metadata?.Data?.ExternalRolesList.map((item) => {
      return {
        label: item.Text,
        value: item.Value,
      }
    })
    return setUserRoles(externalRoles)
  }

  const createUser = async (formValues) => {
    const Roles =
      formValues.roles?.map((selectedRole) => {
        const rolesList = getRolesList(metadata, formValues)
        const selectedRoleObject = rolesList.find((role) => role.Value === selectedRole)
        return { Id: selectedRoleObject?.Value, Name: selectedRoleObject?.Text }
      }) || []
    let CounterPartyAssociations = []
    if (showImpersonationAssignments) {
      CounterPartyAssociations = formValues.CounterPartyAssociations.map((selectedImpersonationCounterParties) => {
        const counterPartyImpersionationList = getImpersonationtionCounterPartyList(metadata)
        const selectedImpersonationCounterPartyObject = counterPartyImpersionationList.find(
          (cp) => cp.Value === selectedImpersonationCounterParties
        )
        return { Id: selectedImpersonationCounterPartyObject?.Value }
      })
    }
    const { roles, ...otherFormValues } = formValues
    const payload = [
      {
        ...otherFormValues,
        ...createUserOptions.reduce((acc, option) => {
          acc[option.Value] = option.Selected
          return acc
        }, {}),
        Roles,
        CounterPartyAssociations,
      },
    ]
    try {
      const response = await createUpdateUserMutation.mutateAsync(payload)
      if (response?.Validations.length) {
        NotificationMessage('Error', response.Validations[0]?.Message)
      } else {
        NotificationMessage(
          'User created',
          `User ${formValues.FirstName} ${formValues.LastName} has been created`,
          false
        )
        setCreatingUser(!creatingUser)
        form.resetFields()
        setUserRoles([])
        setShowImpersonationAssignments(false)
        setCreateUserOptions(defaultCreateUserOptions)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkAndSetFields = (changedValues) => {
    if (changedValues.roles) {
      const newValue = changedValues.roles.find((stringId) => checkLimitedImpersonationRole(parseInt(stringId)))
      setShowImpersonationAssignments(newValue)
      if (!newValue) {
        form.setFieldsValue({ CounterPartyAssociations: [] })
      }
    }
  }

  const filterOptionAsLowercase = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
  const selectRolesPlaceholder = useMemo(() => {
    if (!isApproved) return "Check 'Approved' to select roles."
    return userRoles?.length > 0 ? 'User Roles' : 'Please select a counterparty'
  }, [userRoles, isApproved])

  return (
    <Form
      layout='vertical'
      form={form}
      onFinish={createUser}
      onFinishFailed={ErrorNotification}
      onValuesChange={checkAndSetFields}
    >
      <Vertical style={{ gap: '1em' }}>
        <Horizontal style={{ gap: '1em' }}>
          <Vertical flex={1}>
            <Form.Item
              label='First Name'
              name='FirstName'
              rules={[{ required: true, message: 'Please enter first name' }]}
              hasFeedback
            >
              <Input placeholder='Enter First Name' />
            </Form.Item>
          </Vertical>
          <Vertical flex={1}>
            <Form.Item
              label='Last Name'
              name='LastName'
              rules={[{ required: true, message: 'Please enter last name' }]}
              hasFeedback
            >
              <Input placeholder='Enter Last Name' />
            </Form.Item>
          </Vertical>
        </Horizontal>
        <Horizontal style={{ gap: 10 }}>
          <Vertical flex={1}>
            <Form.Item
              label='Email'
              name='Email'
              rules={[{ required: true, message: 'Please enter an email' }]}
              hasFeedback
            >
              <Input placeholder='Enter Email Address' />
            </Form.Item>
          </Vertical>
        </Horizontal>
        <Horizontal>
          <Vertical>
            <Form.Item
              label='Counterparty'
              name='CounterPartyId'
              rules={[{ required: true, message: 'Please select a counterparty' }]}
              hasFeedback
            >
              <Select
                optionFilterProp='children'
                filterOption={filterOptionAsLowercase}
                showSearch
                onChange={updateRoles}
                options={metadata?.Data?.CounterPartyList.map(toAntOption)}
                placeholder='Select Counterparty'
              />
            </Form.Item>
          </Vertical>
        </Horizontal>
        <Horizontal style={{ gap: '1em' }}>
          <Vertical flex={1}>
            <Form.Item
              label='Authentication'
              name='IdentityProviderId'
              rules={[{ required: true, message: 'Please select authentication method' }]}
              hasFeedback
            >
              <Select
                optionFilterProp='children'
                filterOption={filterOptionAsLowercase}
                showSearch
                showArrow
                options={metadata?.Data?.IdentityProvidersList.map(toAntOption)}
                placeholder='Select authentication'
                allowClear
              />
            </Form.Item>
          </Vertical>
          <Vertical flex={1}>
            <Form.Item label='Preferred Contact Method' name='PreferredContactMethodCvId' hasFeedback>
              <Select
                optionFilterProp='children'
                filterOption={filterOptionAsLowercase}
                showSearch
                showArrow
                options={metadata?.Data?.ContactMethodsList.map(toAntOption)}
                placeholder='Select preferred contact method'
                allowClear
              />
            </Form.Item>
          </Vertical>
        </Horizontal>
        <Horizontal>
          <Vertical>
            <Form.Item
              label='User Roles'
              name='roles'
              rules={[
                {
                  type: 'array',
                  required: createUserOptions.find((item) => item.Name === 'Approved')?.Selected,
                  message: 'Please select 1 or more role(s)',
                },
              ]}
            >
              <Select
                optionFilterProp='children'
                filterOption={filterOptionAsLowercase}
                showSearch
                showArrow
                mode='multiple'
                options={userRoles}
                placeholder={selectRolesPlaceholder}
                allowClear
                disabled={
                  userRoles?.length === 0 || !createUserOptions.find((item) => item.Name === 'Approved')?.Selected
                }
              />
            </Form.Item>
          </Vertical>
        </Horizontal>
        <Horizontal style={{ minHeight: '59px' }}>
          {showImpersonationAssignments && (
            <Vertical>
              <Form.Item
                label='Impersonation Assignments'
                name='CounterPartyAssociations'
                rules={[
                  {
                    type: 'array',
                    required: showImpersonationAssignments,
                    message: 'Please select 1 or more Counterparties',
                  },
                ]}
              >
                <Select
                  optionFilterProp='children'
                  filterOption={filterOptionAsLowercase}
                  showSearch
                  showArrow
                  mode='multiple'
                  options={metadata?.Data?.CounterPartyList.map(toAntOption)}
                  placeholder='Counterparties'
                  allowClear
                  disabled={!showImpersonationAssignments}
                />
              </Form.Item>
            </Vertical>
          )}
        </Horizontal>
        <Horizontal className='justify-center'>
          <CheckCardGroup>
            {createUserOptions.map((option, i) => {
              if (option.Name === 'Approved') {
                return (
                  <Popconfirm
                    key={`${option.Name}-checkbox`}
                    title='Are you sure?  No roles may be assigned if the user is not approved.'
                    onConfirm={() => {
                      handleToggle(option.Name)
                      setShowApprovePopconfirm(false)
                    }}
                    onCancel={() => setShowApprovePopconfirm(false)}
                    visible={showApprovePopconfirm}
                  >
                    <CheckCard
                      onToggle={() => {
                        if (option.Selected) {
                          setShowApprovePopconfirm(true)
                        } else {
                          handleToggle(option.Name)
                        }
                      }}
                      label={option.Name}
                      value={option.Selected}
                      span={8}
                      boxHeight={20}
                      boxWidth='100px'
                    />
                  </Popconfirm>
                )
              }
              return (
                <CheckCard
                  key={`${option.Name}-checkbox`}
                  label={option.Name}
                  value={option.Selected}
                  onToggle={() => handleToggle(option.Name)}
                  span={8}
                  boxHeight={20}
                  boxWidth='100px'
                />
              )
            })}
          </CheckCardGroup>
        </Horizontal>
        <Horizontal className='justify-end mt-3' style={{ gap: 20 }}>
          <GraviButton buttonText='Cancel' className='mr-2' onClick={() => setCreatingUser(!creatingUser)} />
          <GraviButton className='border-radius-5' success buttonText='Save' htmlType='submit' />
        </Horizontal>
      </Vertical>
    </Form>
  )
}
