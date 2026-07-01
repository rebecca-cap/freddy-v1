import { CheckCircleFilled, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Texto } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

import { FormulaStatusSpinner } from './FormulaEditor/components/StatusLoader'

export type FormulaStatus = 'good' | 'draft' | 'error' | 'unchanged' | 'ready'

interface IProps {
  status: FormulaStatus
  isLoading?: boolean
}

interface IGetStatusTextReturn {
  icon: React.ReactNode
  text: string
  color:
    | 'error'
    | 'white'
    | 'light'
    | 'hint'
    | 'default'
    | 'medium'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'theme3'
    | 'optimal'
}

const getStatusText = (status: FormulaStatus): IGetStatusTextReturn => {
  switch (status) {
    case 'good':
      return { text: 'Saved', color: 'success', icon: <CheckCircleOutlined /> }
    case 'draft':
      return { text: 'Unsaved Changes', color: 'optimal', icon: <WarningOutlined /> }
    case 'error':
      return { text: 'Error', color: 'error', icon: <WarningOutlined /> }
    case 'unchanged':
      return { text: 'Unchanged', color: 'primary', icon: null }
    case 'ready':
      return { text: 'Ready', color: 'primary', icon: <CheckCircleFilled style={{ color: 'var(--theme-success)' }} /> }

    default:
      return { text: 'Unchanged', color: 'primary', icon: null }
  }
}

export function FormulaStatus({ status, isLoading = false }: IProps) {
  const statusAttributes = useMemo(() => getStatusText(status), [status])

  return (
    <div>
      <Texto appearance={isLoading ? 'hint' : statusAttributes.color}> Status </Texto>
      {isLoading ? (
        <FormulaStatusSpinner />
      ) : (
        <Texto category='h5' appearance={statusAttributes.color}>
          {statusAttributes.icon} {statusAttributes.text}
        </Texto>
      )}
    </div>
  )
}
