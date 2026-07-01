import { SearchOutlined } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { TemplateSelectorMetadata } from '@modules/FormulaTemplates/Api/templateSelectorTypes'
import { FormulaTemplateFilter } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Util/Constants'
import { getCategoryOptions } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Util/selectorHelpers'
import { toAntOption } from '@utils/index'
import { Input, Segmented, Select } from 'antd'
import { Dispatch, SetStateAction, useMemo } from 'react'

interface FormulaTemplateChooserFiltersProps {
  isListMode: boolean
  setIsListMode: (isListMode: boolean) => void
  metadata?: TemplateSelectorMetadata
  filters: FormulaTemplateFilter
  setFilters: Dispatch<SetStateAction<FormulaTemplateFilter>>
}

export function Filters({
  isListMode,
  setIsListMode,
  metadata,
  filters,
  setFilters,
}: FormulaTemplateChooserFiltersProps) {
  const searchFilter = (input: string, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const categoryOptions = useMemo(() => getCategoryOptions(metadata?.FormulaTemplates), [metadata?.FormulaTemplates])

  const productOptions = useMemo(() => metadata?.ProductList?.map(toAntOption) ?? [], [metadata?.ProductList])
  const locationOptions = useMemo(() => metadata?.LocationList?.map(toAntOption) ?? [], [metadata?.LocationList])
  const priceTypeOptions = useMemo(() => metadata?.PriceTypeList?.map(toAntOption) ?? [], [metadata?.PriceTypeList])

  const labelStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    fontWeight: 600,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--gray-500)',
  }

  const filterGroupStyle: React.CSSProperties = {
    minWidth: 0,
  }

  const selectStyle: React.CSSProperties = {
    maxHeight: '75px',
    overflowY: 'auto',
  }

  return (
    <Vertical
      style={{
        minHeight: 'fit-content',
        maxHeight: 'fit-content',
        background: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        border: '1px solid var(--gray-200)',
      }}
    >
      <Horizontal gap={16} verticalCenter>
        <Horizontal>
          <Segmented
            options={['Cards', 'List']}
            value={isListMode ? 'List' : 'Cards'}
            onChange={(value) => {
              setIsListMode(value === 'List')
            }}
            size={'large'}
          />
        </Horizontal>
        <Vertical gap={4} flex={1} style={filterGroupStyle}>
          <Texto style={labelStyle}>Search</Texto>
          <Input
            prefix={<SearchOutlined />}
            placeholder='Search templates by keyword'
            onChange={(e) => setFilters({ ...filters, Keyword: e.target.value })}
          />
        </Vertical>
        <Vertical gap={4} flex={1} style={filterGroupStyle}>
          <Texto style={labelStyle}>Category</Texto>
          <Select
            options={categoryOptions}
            placeholder={'All'}
            className={'w-100'}
            onChange={(value) => setFilters({ ...filters, CategoryIds: value })}
            allowClear
            mode={'multiple'}
            value={filters['CategoryIds']}
            style={selectStyle}
            showSearch
            filterOption={searchFilter}
            showArrow
          />
        </Vertical>
        <Vertical gap={4} flex={1} style={filterGroupStyle}>
          <Texto style={labelStyle}>Products</Texto>
          <Select
            options={productOptions}
            placeholder={'All'}
            className={'w-100'}
            onChange={(value) => setFilters({ ...filters, ProductIds: value })}
            allowClear
            mode={'multiple'}
            value={filters['ProductIds']}
            style={selectStyle}
            showSearch
            filterOption={searchFilter}
            showArrow
          />
        </Vertical>
        <Vertical gap={4} flex={1} style={filterGroupStyle}>
          <Texto style={labelStyle}>Locations</Texto>
          <Select
            options={locationOptions}
            placeholder={'All'}
            className={'w-100'}
            onChange={(value) => setFilters({ ...filters, LocationIds: value })}
            allowClear
            mode={'multiple'}
            value={filters['LocationIds']}
            style={selectStyle}
            showSearch
            filterOption={searchFilter}
            showArrow
          />
        </Vertical>
        <Vertical gap={4} flex={1} style={filterGroupStyle}>
          <Texto style={labelStyle}>Price Type</Texto>
          <Select
            options={priceTypeOptions}
            placeholder={'All'}
            className={'w-100'}
            onChange={(value) => setFilters({ ...filters, PriceTypeCvIds: value })}
            value={filters['PriceTypeCvIds']}
            allowClear
            mode={'multiple'}
            style={selectStyle}
            showSearch
            filterOption={searchFilter}
            showArrow
          />
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
