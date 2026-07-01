import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { ICellEditorParams } from 'ag-grid-community'
import { Button, Divider, Input, Popconfirm, Select, SelectProps, Tooltip } from 'antd'
import type { InputRef } from 'antd'
import type { DefaultOptionType } from 'antd/es/select'
import type { BaseSelectRef } from 'rc-select'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

export type InlineCreateConfig = {
  onCreate: (name: string) => Promise<{ value: string | number; label: string } | undefined>
  placeholder?: string
  buttonLabel?: string
}

export type SelectEditorParams = ICellEditorParams &
  SelectProps & {
    width?: number
    setupFunc?: (setValue: (val: unknown) => void, linkedField: string) => void
    hideSearch?: boolean
    onChange?: (
      value: string | number | (string | number)[],
      option: DefaultOptionType | DefaultOptionType[],
      data: Record<string, unknown>
    ) => void
    showPopConfirmOnClear?: boolean
    enableSelectAllFromSearch?: boolean
    enableOptionTooltip?: boolean
    minWidth?: number
    defaultOpen?: boolean
    closeOnBlur?: boolean
    showSelectedValue?: boolean
    matchOptionId?: string
    inlineCreate?: InlineCreateConfig
  }

export const SearchableSelect = forwardRef<any, SelectEditorParams>((props, ref) => {
  const refInput = useRef<BaseSelectRef>(null)
  const inlineCreateInputRef = useRef<InputRef>(null)
  const [changed, setChanged] = useState(false)
  const [selected, setSelected] = useState(props.value)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPopConfirmVisible, setIsPopConfirmVisible] = useState(false)
  const [inlineCreateInput, setInlineCreateInput] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [extraOptions, setExtraOptions] = useState<DefaultOptionType[]>([])

  useEffect(() => {
    refInput.current?.focus()
  }, [])

  const enrichOption = (option: DefaultOptionType): DefaultOptionType => {
    const plainLabel = typeof option.label === 'string' ? option.label : ''
    const needsEnrichment =
      props.showSelectedValue ||
      option.icon ||
      props.enableOptionTooltip ||
      (props.matchOptionId && props.matchOptionId === option.value)

    if (!needsEnrichment) return { ...option, searchText: plainLabel }

    const richLabel = (
      <Horizontal alignItems='center' style={{ gap: '0.5rem' }}>
        {props.showSelectedValue && props.value === option.label && <CheckOutlined />}
        {option.icon}
        {props.enableOptionTooltip ? (
          <Tooltip title={option.label} mouseEnterDelay={0.5}>
            <span
              style={{
                display: 'inline-block',
                maxWidth: (props.width ?? 260) - 80,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                verticalAlign: 'middle',
              }}
            >
              {option.label}
            </span>
          </Tooltip>
        ) : (
          option.label
        )}
        {props.matchOptionId && props.matchOptionId === option.value && <Texto>(Default)</Texto>}
      </Horizontal>
    )

    return { ...option, label: richLabel, searchText: plainLabel }
  }

  const enrichOptions = (options: DefaultOptionType[]): DefaultOptionType[] => {
    return options.map((opt) => {
      if (opt.options && Array.isArray(opt.options)) {
        return { ...opt, options: opt.options.map(enrichOption) }
      }
      return enrichOption(opt)
    })
  }

  // Flatten grouped options into leaf options for Select All/Deselect All
  const flatLeafOptions = useMemo(() => {
    return (props?.options ?? []).flatMap((opt) => (opt.options && Array.isArray(opt.options) ? opt.options : [opt]))
  }, [props?.options])

  // Compute filtered leaf options based on current search query (for Select All/Deselect All)
  const filteredLeafOptions = useMemo(() => {
    if (!searchQuery) return flatLeafOptions
    const q = searchQuery.toUpperCase()
    return flatLeafOptions.filter((opt) => {
      const label = typeof opt.label === 'string' ? opt.label : ''
      return label.toUpperCase().includes(q)
    })
  }, [flatLeafOptions, searchQuery])

  const handleSelectChange = (newSelection: string | number | (string | number)[]) => {
    if (Array.isArray(newSelection)) {
      if (newSelection.includes('__select_all__')) {
        const existingValues = Array.isArray(selected) ? selected : []
        const allFilteredValues = filteredLeafOptions.map((opt) => opt.value)
        const mergedValues = Array.from(new Set([...existingValues, ...allFilteredValues]))

        setSelected(mergedValues)
        setChanged(true)

        if (props.onChange) {
          props.onChange(mergedValues, filteredLeafOptions, props.data)
        }
        setSearchQuery('')
        return
      }

      if (newSelection.includes('__deselect_all__')) {
        const existingValues = Array.isArray(selected) ? selected : []
        const allFilteredValues = filteredLeafOptions.map((opt) => opt.value)
        const filteredOut = existingValues.filter((val) => !allFilteredValues.includes(val))

        setSelected(filteredOut)
        setChanged(true)

        if (props.onChange) {
          props.onChange(filteredOut, filteredLeafOptions, props.data)
        }

        setSearchQuery('')
        return
      }
    }

    setSelected(newSelection)
    setChanged(true)
  }

  // We're overriding the keyDown event to prevent 'Enter' from closing the editor,
  // we need to watch for changes to the input and close the editor reactively.
  useEffect(() => {
    if (changed) {
      if (!props.mode) {
        props?.api?.stopEditing()
        props?.api?.setFocusedCell(props?.rowIndex, props?.column?.getColId())
      }
    }
  }, [changed])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => ({
    getValue() {
      return selected
    },
    isCancelBeforeStart() {
      return false
    },
    isCancelAfterEnd() {
      return false
    },
  }))

  const clearIcon = useMemo(
    () => (
      <Popconfirm
        title='Are you sure you want to clear this field?'
        visible={isPopConfirmVisible}
        onConfirm={() => {
          setSelected([])
          setIsPopConfirmVisible(false)
        }}
        onCancel={() => {
          setIsPopConfirmVisible(false)
        }}
      >
        <CloseOutlined
          onClick={() => {
            if (props.showPopConfirmOnClear) {
              setIsPopConfirmVisible(true)
            } else {
              setSelected(null)
            }
          }}
        />
      </Popconfirm>
    ),
    [isPopConfirmVisible, props.showPopConfirmOnClear]
  )

  const optionsToShow = useMemo(() => {
    const enriched = enrichOptions(props?.options ?? [])
    const withExtras = extraOptions.length > 0 ? [...enriched, ...enrichOptions(extraOptions)] : enriched

    if (!props?.enableSelectAllFromSearch) return withExtras

    const count = filteredLeafOptions.length + extraOptions.length
    return [
      {
        value: '__select_all__',
        label: (
          <div style={{ pointerEvents: 'none' }}>
            <strong>Select All ({count})</strong>
          </div>
        ),
        searchText: 'Select All',
      },
      {
        value: '__deselect_all__',
        label: (
          <div style={{ pointerEvents: 'none' }}>
            <strong>Deselect All ({count})</strong>
          </div>
        ),
        searchText: 'Deselect All',
      },
      ...withExtras,
    ]
  }, [
    props?.options,
    props.showSelectedValue,
    props.value,
    props.enableOptionTooltip,
    props.width,
    props.matchOptionId,
    props.enableSelectAllFromSearch,
    filteredLeafOptions,
    extraOptions,
  ])

  const handleInlineCreate = useCallback(async () => {
    if (!props.inlineCreate || isCreating) return
    const name = inlineCreateInput.trim()
    if (!name) return

    setIsCreating(true)
    try {
      const created = await props.inlineCreate.onCreate(name)
      if (!created) return

      setExtraOptions((prev) => (prev.some((o) => o.value === created.value) ? prev : [...prev, created]))

      const isMulti = props.mode === 'multiple' || props.mode === 'tags'
      if (isMulti) {
        const current = Array.isArray(selected) ? selected : []
        setSelected([...current, created.value])
      } else {
        setSelected(created.value)
      }
      setChanged(true)
      setInlineCreateInput('')
    } finally {
      setIsCreating(false)
    }
  }, [inlineCreateInput, isCreating, props.inlineCreate, props.mode, selected])

  const dropdownRender = useMemo(() => {
    if (!props.inlineCreate) return undefined
    const { placeholder, buttonLabel } = props.inlineCreate
    return (menu: React.ReactElement) => (
      <>
        {menu}
        <Divider style={{ margin: '4px 0' }} />
        <Horizontal style={{ padding: '4px 8px', gap: 8 }} alignItems='center'>
          <Input
            ref={inlineCreateInputRef}
            size='small'
            placeholder={placeholder ?? 'Create new…'}
            value={inlineCreateInput}
            onChange={(e) => setInlineCreateInput(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === 'Enter') {
                e.preventDefault()
                handleInlineCreate()
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={isCreating}
          />
          <Button
            type='primary'
            size='small'
            icon={<PlusOutlined />}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleInlineCreate}
            disabled={!inlineCreateInput.trim() || isCreating}
            loading={isCreating}
          >
            {buttonLabel ?? 'Create'}
          </Button>
        </Horizontal>
      </>
    )
  }, [props.inlineCreate, inlineCreateInput, isCreating, handleInlineCreate])

  // When Select All is enabled, use a custom filterOption that always shows the sentinel options.
  // Otherwise, let optionFilterProp="searchText" handle filtering natively.
  const selectFilterOption = useMemo(() => {
    if (!props?.enableSelectAllFromSearch) return undefined
    return (input: string, option?: DefaultOptionType) => {
      if (option?.value === '__select_all__' || option?.value === '__deselect_all__') return true
      const text = typeof option?.searchText === 'string' ? option.searchText : ''
      return text.toUpperCase().includes(input.toUpperCase())
    }
  }, [props?.enableSelectAllFromSearch])

  // Drop locally-tracked extras once the parent options refresh includes them.
  useEffect(() => {
    if (extraOptions.length === 0) return
    const upstreamValues = new Set(flatLeafOptions.map((o) => o.value))
    setExtraOptions((prev) => prev.filter((o) => !upstreamValues.has(o.value)))
  }, [flatLeafOptions])

  return (
    <Select
      defaultOpen={props?.defaultOpen ?? true}
      onBlur={() => {
        if (props?.closeOnBlur) {
          props?.api?.stopEditing()
          props?.api?.setFocusedCell(props?.rowIndex, props?.column?.getColId())
        }
      }}
      showSearch={props.showSearch}
      allowClear={props.allowClear}
      ref={refInput}
      style={{ minWidth: props.minWidth ?? 260, maxWidth: props.width ?? 260 }}
      placeholder={props.placeholder || 'Please select'}
      value={selected}
      onChange={handleSelectChange}
      mode={props.mode}
      maxTagCount={25}
      onSearch={setSearchQuery}
      optionFilterProp='searchText'
      filterOption={selectFilterOption}
      clearIcon={clearIcon}
      options={optionsToShow}
      dropdownRender={dropdownRender}
    />
  )
})
SearchableSelect.displayName = 'SearchableSelect'
