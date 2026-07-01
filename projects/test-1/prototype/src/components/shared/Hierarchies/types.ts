export interface HierarchyListItem {
  Key: number
  Name: string
  Levels: string[]
}

export interface UpsertHierarchyInput {
  Name: string
  HierarchyKey?: number
}

export interface HierarchyItemsResponse {
  Level: string
  BreadCrumbs: string[]
  ChildrenKeys: number[]
  SiblingKeys: number[]
}

export interface MovePayload {
  KeysToMove: number[]
  TargetKey: number
  HierarchyKey: number
}
