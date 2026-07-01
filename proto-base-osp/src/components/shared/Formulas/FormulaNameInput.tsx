import { Input, InputRef } from 'antd'
import React, { useEffect } from 'react'

interface IProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFinish: () => void
  isQuickSearchFocused: boolean
  isFormulaEditorFocused: boolean
}

export function FormulaNameInput({ value, onChange, onFinish, isQuickSearchFocused, isFormulaEditorFocused }: IProps) {
  const formulaNameInputRef = React.useRef<InputRef>(null)

  useEffect(() => {
    if (isQuickSearchFocused || isFormulaEditorFocused) return

    if (formulaNameInputRef?.current) formulaNameInputRef?.current.focus()
  })

  const proxyOnFinish = () => {
    if (formulaNameInputRef?.current && (!value || value.length === 0)) {
      formulaNameInputRef?.current.focus()
    } else {
      onFinish()
    }
  }

  return (
    <Input
      minLength={1}
      onBlur={proxyOnFinish}
      style={{ width: 300 }}
      value={value}
      onChange={onChange}
      ref={formulaNameInputRef}
      onPressEnter={proxyOnFinish}
      placeholder='New Formula'
    />
  )
}
