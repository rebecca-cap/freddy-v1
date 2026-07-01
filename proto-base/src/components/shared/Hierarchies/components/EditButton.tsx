import { EditFilled } from '@ant-design/icons'
import { GraviButton } from '@gravitate-js/excalibrr'
import React from 'react'

interface EditButtonProps {
  onClick: () => void
}

export function EditButton({ onClick }: EditButtonProps) {
  return <GraviButton icon={<EditFilled onClick={onClick} />} />
}
