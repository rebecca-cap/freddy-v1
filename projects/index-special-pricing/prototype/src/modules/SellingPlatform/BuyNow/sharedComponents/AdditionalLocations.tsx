import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Checkbox, Tooltip } from 'antd'
import React, { useEffect, useMemo } from 'react'

export function AdditionalLocations({ form, selectedItemMeta }) {
  useEffect(() => {
    if (!Array.isArray(form.getFieldValue('SelectedItems'))) {
      form.setFieldsValue({ SelectedItems: [] })
    }
  }, [form])

  const additionalLocations = useMemo(() => {
    return selectedItemMeta?.AdditionalItems.filter((item) => item.ItemType === 'AdditionalLocation')
  }, [selectedItemMeta])

  const handleCheckboxChange = (key) => {
    const selectedFormItems = form.getFieldsValue(true)?.SelectedItems
    if (selectedFormItems.includes(key)) {
      const updatedItems = selectedFormItems.filter((item) => item !== key)
      form.setFieldsValue({ SelectedItems: updatedItems })
    } else {
      const updatedItems = [...selectedFormItems, key]

      form.setFieldsValue({ SelectedItems: updatedItems })
    }
  }

  return (
    <div className='mx-4 my-3 justify-sb py-2 flex-row additional-options-grid'>
      {additionalLocations.map((location) => {
        return (
          <CheckButton key={location.key} location={location} form={form} handleCheckboxChange={handleCheckboxChange} />
        )
      })}
    </div>
  )
}

function CheckButton({ location, form, handleCheckboxChange }) {
  const [isSelected, setIsSelected] = React.useState(form.getFieldValue('SelectedItems')?.includes(location.key))
  const [isEllipsized, setIsEllipsized] = React.useState(false)
  const textRef = React.useRef<HTMLSpanElement | null>(null)

  React.useEffect(() => {
    const checkEllipsis = () => {
      if (textRef?.current) {
        setIsEllipsized(textRef.current.scrollWidth > textRef.current.clientWidth)
      }
    }
    checkEllipsis()

    window.addEventListener('resize', checkEllipsis)
    return () => window.removeEventListener('resize', checkEllipsis)
  }, [])

  return (
    <Tooltip title={isEllipsized ? location.LocationName : ''} style={{ width: '100%' }}>
      <GraviButton
        className={`checkable-button ${isSelected ? 'checkable-success-button' : 'checkable-unchecked-button '}`}
        onClick={(event) => {
          event.stopPropagation()
          setIsSelected(!isSelected)
          handleCheckboxChange(location.key)
        }}
        children={
          <Horizontal verticalCenter gap={5}>
            <Checkbox
              onClick={(event) => {
                event.stopPropagation()
                setIsSelected(!isSelected)
                handleCheckboxChange(location.key)
              }}
              checked={isSelected}
              key={location.key}
            />
            <Texto ref={textRef} className={`checkable-button-text ${isSelected ? 'selected-text' : ''}`}>
              {location.LocationName}
            </Texto>
          </Horizontal>
        }
      />
    </Tooltip>
  )
}
