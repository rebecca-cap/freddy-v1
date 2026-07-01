import { SearchOutlined } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { TemplateSelectorMetadata } from '@modules/FormulaTemplates/Api/templateSelectorTypes'
import { FormulaTemplateFilter } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Util/Constants'
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

  const productOptions = useMemo(() => metadata?.ProductList?.map(toAntOption) ?? [], [metadata?.ProductList])
  const locationOptions = useMemo(() => metadata?.LocationList?.map(toAntOption) ?? [], [metadata?.LocationList])
  const priceTypeOptions = useMemo(() => metadata?.PriceTypeList?.map(toAntOption) ?? [], [metadata?.PriceTypeList])

  return (
    <Vertical className={'my-2'} style={{ maxWidth: '1600px', minHeight: 'fit-content', maxHeight: 'fit-content' }}>
      <Horizontal verticalCenter className={'gap-16'}>
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
        <Horizontal flex={0.75}>
          <Input
            prefix={<SearchOutlined />}
            placeholder='Search templates by keyword'
            onChange={(e) => setFilters({ ...filters, Keyword: e.target.value })}
          />
        </Horizontal>
        <Horizontal flex={1} verticalCenter className={'gap-10'}>
          <Texto>Products: </Texto>
          <Select
            options={productOptions}
            placeholder={'Product'}
            className={'w-100'}
            onChange={(value) => setFilters({ ...filters, ProductIds: value })}
            allowClear
            mode={'multiple'}
            value={filters['ProductIds']}
            style={{ maxHeight: '75px', overflowY: 'auto' }}
            showSearch
            filterOption={searchFilter}
            showArrow
          />
        </Horizontal>
        <Horizontal flex={1} verticalCenter className={'gap-10'}>
          <Texto>Locations: </Texto>
          <Select
            options={locationOptions}
            placeholder={'Location'}
            className={'w-100'}
            onChange={(value) => setFilters({ ...filters, LocationIds: value })}
            allowClear
            mode={'multiple'}
            value={filters['LocationIds']}
            style={{ maxHeight: '75px', overflowY: 'auto' }}
            showSearch
            filterOption={searchFilter}
            showArrow
          />
        </Horizontal>
        <Horizontal flex={1} className={'ml-2 gap-10'} verticalCenter>
          <Texto style={{ whiteSpace: 'nowrap' }}>Price Type: </Texto>
          <Select
            options={priceTypeOptions}
            placeholder={'Price Type'}
            className={'w-100'}
            onChange={(value) => setFilters({ ...filters, PriceTypeCvIds: value })}
            value={filters['PriceTypeCvIds']}
            allowClear
            mode={'multiple'}
            style={{ maxHeight: '75px', overflowY: 'auto' }}
            showSearch
            filterOption={searchFilter}
            showArrow
          />
        </Horizontal>
      </Horizontal>
    </Vertical>
  )
}
