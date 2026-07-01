import React from 'react'
import { EntitySchemaResponse } from './index.types'

export type ActionClickHandler = (props: {
  schema: EntitySchemaResponse
  primaryKey: string
  label: string
  data: any
}) => void

export const createEntityAction = (label: string, icon: React.ReactNode, onClick: ActionClickHandler) => ({
  key: label,
  icon,
  label,
  onClick,
})
