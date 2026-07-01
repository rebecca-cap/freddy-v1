// @ts-nocheck
import { useState, useEffect, useCallback, Fragment } from 'react'
import { Row, Col, Button, Drawer, AutoComplete, Input, Tooltip } from 'antd'
import classNames from 'classnames'
import {
  SettingOutlined,
  FilterFilled,
  PlusCircleOutlined,
  LoadingOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { ViewOptions } from '../ViewOptions'
import { DynamicFilterForm } from './DynamicFilterForm'
import _ from 'lodash'
import { FilterTags } from './FilterTags'
import { Texto } from '../../DataDisplay/Texto/Texto'
import { GraviButton } from '../../Controls/Buttons/GraviButton'

/**
 * @deprecated
 * Do not use this component. It has been flagged as 'unused' and will be removed in the future.
 */
export function SearchGridHeader({
  title,
  rowCount,
  params,
  viewOptions,
  applyViewOptions,
  applyFilters,
  onSearch,
  loading,
  actionButton,
  currentFilters,
  controlFilters,
  hiddenFilterKeys,
  setCurrentFilters,
  addBlankRecord,
  setEditingKey,
  selectedRows,
  SelectToolbar,
  hideFilters,
  requireFilters,
}) {
  const [optionsVisible, toggleOptions] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [showFilterDrawer, toggleFilter] = useState(requireFilters)
  return (
    <Fragment>
      <div className='flex px-4 page-control-bar'>
        <div
          className={classNames(
            { 'flex-1': !hideFilters },
            { 'flex-2': hideFilters },
            'p-3 vertical-flex-center'
          )}
        >
          <GridTitle
            title={title}
            rowCount={rowCount}
            hideFilters={hideFilters}
            filters={currentFilters}
            requireFilters={requireFilters}
            hiddenFilterKeys={hiddenFilterKeys}
            setCurrentFilters={setCurrentFilters}
            setSearchValue={setSearchValue}
          />
        </div>

        {!hideFilters && (
          <div className='flex-1 vertical-flex-center'>
            <SearchBar
              applyFilters={applyFilters}
              params={params}
              currentFilters={currentFilters}
              controlFilters={controlFilters}
              onSearch={onSearch}
              loading={loading}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              setCurrentFilters={setCurrentFilters}
              requireFilters={requireFilters}
              toggleFilter={toggleFilter}
              showFilterDrawer={showFilterDrawer}
            />
          </div>
        )}

        <div className='pl-3 flex-1 flex justify-end items-center'>
          {addBlankRecord != null && (
            <GraviButton
              onClick={() => {
                addBlankRecord()
                setEditingKey(0)
              }}
              success
              buttonText='Create'
              className='create-product-button'
              icon={<PlusCircleOutlined />}
            />
          )}
          {viewOptions && (
            <Fragment>
              <Tooltip title='View Options'>
                <Button
                  onClick={() => toggleOptions(true)}
                  icon={<SettingOutlined />}
                />
              </Tooltip>
              <Drawer
                title='View Options'
                placement='right'
                className='option-drawer'
                closable={false}
                onClose={() => toggleOptions(false)}
                visible={optionsVisible}
                width={400}
              >
                <ViewOptions
                  closeSelf={() => toggleOptions(false)}
                  initialViewOptions={viewOptions}
                  applyViewOptions={applyViewOptions}
                />
              </Drawer>
            </Fragment>
          )}
          {actionButton}
        </div>
      </div>
      <FilterDrawer
        params={params}
        showFilter={showFilterDrawer}
        applyFilters={applyFilters}
      />

      {SelectToolbar && <SelectToolbar selectedRows={selectedRows} />}
    </Fragment>
  )
}

const SearchBar = ({
  applyFilters,
  params,
  currentFilters,
  controlFilters,
  onSearch,
  loading,
  searchValue,
  setSearchValue,
  setCurrentFilters,
  toggleFilter,
  showFilterDrawer,
}) => {
  const [results, setResults] = useState([])
  const [searchProperty, setSearchProperty] = useState()
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const listener = (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        const copy = { ...currentFilters }
        if (searchProperty) {
          copy[searchProperty] = searchValue
          setCurrentFilters(copy)
        }
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [searchValue, searchProperty])

  const FilterToggle = () => {
    return (
      <div className='vertical-flex-center'>
        <Tooltip title={showFilterDrawer ? 'Hide Filters' : 'Show Filters'}>
          <GraviButton
            className='mr-2'
            theme2={showFilterDrawer}
            disabled={loading}
            icon={<FilterFilled />}
            onClick={() => toggleFilter(!showFilterDrawer)}
          />
        </Tooltip>
      </div>
    )
  }

  const handleSearch = async (value) => {
    if (value.length < 2) {
      setResults([])
      return
    }
    setIsSearching(true)
    const resp = await onSearch(value, { ...currentFilters, ...controlFilters })
    const data = resp && resp.data
    if (data && data.length === 1) {
      const firstResult = data[0]
      setSearchProperty(firstResult.title)
      const options = firstResult.options
      if (options && options.length === 1) {
        setSearchValue(options[0].label)
      }
    }
    const renderItem = (title, count, filterValue, i) => {
      const locationType = Object.keys(filterValue)[0] || ''
      return {
        key: `${locationType}${i}`,
        value: title,
        label: (
          <div
            onClick={() => applyFilters(filterValue)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {title}
            <span>Results: {count}</span>
          </div>
        ),
      }
    }

    const searchResults = data.map((result) => {
      return {
        label: <span>{result.title}</span>,
        options: result.options.map((option, i) => {
          return renderItem(option.label, option.count, option.filter, i)
        }),
      }
    })
    setIsSearching(false)
    setResults(searchResults)
  }

  const delayedQuery = useCallback(
    _.debounce((q) => handleSearch(q), 500),
    [currentFilters, controlFilters]
  )

  return (
    <Fragment>
      <Row>
        <Col span={24}>
          <div className='search-control'>
            <FilterToggle />
            <AutoComplete
              dropdownClassName='certain-category-search-dropdown'
              options={results}
              onSearch={(value) => {
                setSearchValue(value)
                delayedQuery(value)
              }}
              onSelect={(value) => setSearchValue('')}
              style={{ flex: 1 }}
              value={searchValue}
            >
              <Input
                prefix={
                  <SearchOutlined
                    className='pr-2'
                    style={{ color: 'var(--gray-500)' }}
                  />
                }
                suffix={
                  isSearching && (
                    <LoadingOutlined style={{ color: 'var(--theme-color-2' }} />
                  )
                }
                placeholder='Search here'
              />
            </AutoComplete>
          </div>
        </Col>
      </Row>
    </Fragment>
  )
}

const GridTitle = ({
  title,
  rowCount,
  filters,
  setCurrentFilters,
  hiddenFilterKeys,
  setSearchValue,
}) => (
  <div className='flex'>
    <div className='flex-1 flex items-center'>
      <Texto category='h4'>{title}</Texto>
      <div className='pl-4 flex-div grid-results items-center'>
        {rowCount !== 1000 && <Fragment>{rowCount} Results </Fragment>}
        {rowCount === 1000 && (
          <Texto className='pl-2' category='label' appearance='secondary'>
            (Matching results exceed display limit, please refine your search)
          </Texto>
        )}
        <FilterTags
          hiddenFilterKeys={hiddenFilterKeys}
          filters={filters}
          setCurrentFilters={setCurrentFilters}
          setSearchValue={setSearchValue}
        />
      </div>
    </div>
  </div>
)

const FilterDrawer = ({ showFilter, applyFilters, params }) => {
  const renderFilter = showFilter && Object.keys(params).length > 0
  if (!renderFilter) return null
  return (
    <div className='filter-drawer px-5 py-2'>
      <DynamicFilterForm params={params} submitFunction={applyFilters} />
    </div>
  )
}
