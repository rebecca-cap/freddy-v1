import { Texto } from '@gravitate-js/excalibrr'
import { RecipientData } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/api/schema.types'
import { Input, Tag } from 'antd'
import React, { useRef, useState } from 'react'
import { usePriceNotifications } from 'src/modules/Admin/ManagePriceNotifications/SubscriptionManagement/api'

interface SiteIdInputProps {
  initialIds: string[] // Array of site IDs
  readOnly: boolean
  row: RecipientData
}

export function SiteIdInput({ initialIds, readOnly, row }: SiteIdInputProps) {
  const [siteIds, setSiteIds] = useState<string[]>(initialIds || [])
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const { upsertRecipientDataMutation } = usePriceNotifications()

  const updateSiteIds = async (counterparty: RecipientData) => {
    try {
      await upsertRecipientDataMutation.mutateAsync([
        {
          ...counterparty,
          SiteIds: counterparty.SiteIds,
        },
      ])
      setSiteIds(counterparty.SiteIds)
      setInputValue('')
    } catch (error) {
      console.error('Error updating site IDs:', error)
    }
  }
  // Only trigger onChange when user interacts with the field
  const handleChange = (newIds: string[]) => {
    updateSiteIds({
      ...row,
      SiteIds: newIds,
    }).then()
  }

  // Focus input when clicking on the container
  const handleContainerClick = () => {
    if (!readOnly && inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setInputValue(value)
    // Check if the input ends with a comma, add tag if it does
    if (value.endsWith(',')) {
      const newId = value.slice(0, -1).trim()
      if (newId && !siteIds.includes(newId)) {
        handleChange([...siteIds, newId])
        setInputValue(() => value.slice(0, -1)) // Remove the comma
      } else {
        setInputValue('')
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle enter to add new tag
    if (e.key === 'Enter' && inputValue.trim()) {
      const newId = inputValue.trim()
      if (!siteIds?.includes(newId)) {
        handleChange([...siteIds, newId])
      }
      e.preventDefault()
    }

    // Handle backspace to remove the last tag when input is empty
    if (e.key === 'Backspace' && !inputValue && siteIds.length > 0) {
      handleChange(siteIds.slice(0, -1))
    }
    if (e.key === 'Tab' && inputValue.trim()) {
      const newId = inputValue.trim()
      if (!siteIds?.includes(newId)) {
        handleChange([...siteIds, newId])
      }
    }
  }

  const handleRemoveTag = (removedTag: string) => {
    const newTags = siteIds.filter((tag) => tag !== removedTag)
    handleChange(newTags)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text')

    // Handle paste by splitting on commas
    if (pasteData) {
      const pastedIds = pasteData
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id && !siteIds.includes(id))

      if (pastedIds.length > 0) {
        handleChange([...siteIds, ...pastedIds])
      }
    }
  }

  if (readOnly) {
    return (
      <div className='flex flex-wrap gap-1'>
        {siteIds?.map((id) => (
          <Tag key={id} className='bg-blue-100 text-blue-800 py-1 px-2 m-0'>
            {id}
          </Tag>
        ))}
        {siteIds?.length === 0 && (
          <Texto category='p2' appearance='hint'>
            No site IDs configured
          </Texto>
        )}
      </div>
    )
  }

  return (
    <div
      className='flex flex-wrap items-center gap-1 p-1 border border-gray-300 rounded-md bg-white min-h-[32px]'
      onClick={handleContainerClick}
      style={{ width: '100%', flexWrap: 'wrap' }}
    >
      {siteIds?.map((id) => (
        <Tag
          key={`${row.CounterPartyId}-${id}`}
          closable
          onClose={() => handleRemoveTag(id)}
          className='bg-blue-100 text-blue-800 py-1 px-2 m-0'
        >
          {id}
        </Tag>
      ))}
      <Input
        ref={inputRef}
        type='text'
        size='small'
        style={{
          border: 'none',
          boxShadow: 'none',
          minWidth: 90,
          maxWidth: '100%',
          width: 'auto',
          flex: 1,
        }}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={siteIds?.length ? '' : 'Enter site IDs...'}
      />
    </div>
  )
}
