export interface ManageGroupsTabGroup {
  id: number
  name: string
  assignmentCount: number
}

export interface ManageGroupsTabErrorMessages {
  duplicateName: string
  deleteBlocked?: string
}

export interface ManageGroupsTabProps {
  groups: ManageGroupsTabGroup[]
  isLoading?: boolean
  title: string
  listLabel: string
  groupingTitle: string
  addButtonLabel: string
  canWrite: boolean
  onUpsert: (group: { id?: number; name: string }) => Promise<void> | void
  onDelete?: (id: number) => Promise<void> | void
  errorMessages: ManageGroupsTabErrorMessages
}
