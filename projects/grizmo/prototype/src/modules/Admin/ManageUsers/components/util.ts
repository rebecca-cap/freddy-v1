import { CreateUserOptions } from '@modules/Admin/ManageUsers'

export function getRolesList(userMetaData, data) {
  const isInternal = userMetaData?.Data.CounterPartyList.find(
    (party) => party.Value === data.CounterPartyId.toString()
  )?.IsInternal
  const rolesList = isInternal ? userMetaData?.Data.InternalRolesList ?? [] : userMetaData?.Data.ExternalRolesList ?? []
  return rolesList
}
export function getImpersonationtionCounterPartyList(userMetaData) {
  return userMetaData?.Data.CounterPartyList ?? []
}

export function checkLimitedImpersonationRole(id: number) {
  // Hard coded value: { Id: 25, Name: 'LimitedImpersonation' }
  return id === 25
}

export const defaultCreateUserOptions: CreateUserOptions[] = [
  { Name: 'Active', Selected: true, Value: 'IsActive' },
  { Name: 'Approved', Selected: true, Value: 'IsApproved' },
  { Name: 'Locked', Selected: false, Value: 'IsLocked' },
]
