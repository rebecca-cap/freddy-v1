import {
  FilterFilled,
  PushpinOutlined,
  SearchOutlined,
  WarningFilled,
} from '@ant-design/icons'
import { DropdownFieldProps } from '@components/Grid/SearchGridHeader/DynamicFilterForm/components/fields/DropdownField'
import type {
  BaseFieldProps,
  Filter,
} from '@components/Grid/SearchGridHeader/DynamicFilterForm/types'
import { AgGridReact } from 'ag-grid-react'
import { Col, Input, Row, Tooltip } from 'antd'
import { useEffect, useState } from 'react'

import { useRowPinning } from '..'
import { GraviButton } from '../Controls/Buttons/GraviButton'
import { Texto } from '../DataDisplay/Texto/Texto'
import { DynamicFilterForm } from '../Grid/SearchGridHeader/DynamicFilterForm'
import { FilterTags } from '../Grid/SearchGridHeader/FilterTags'
import { Horizontal } from './Horizontal'

type GridControlBarProps<T extends Record<string, any>, F extends Filter> = {
  gridRef: React.RefObject<AgGridReact<T>>
  showSelectedCount: boolean | undefined
  title?: string
  onSearch: (e: any) => void
  serverParams?: BaseFieldProps<F>[]
  setFilters?: (filters: F) => void
  filters?: F
  hiddenFilterKeys?: string[]
  actionButtons?: React.ReactNode
  customFilterDrawer?: JSX.Element
  customSearchBar?: React.ReactNode
  rowCount?: number
  pinnedRowIds?: ReturnType<typeof useRowPinning<T>>['pinnedRowIds']
  onRowUnpinnedAll?: () => void
  showUnpinAllButton?: boolean
  hideActiveFilters?: boolean
  warning?: string
  maxFilterTagsArrayLength?: number
  filterDrawerDefaultExpanded?: boolean
}

export function GridControlBar<
  T extends Record<string, any>,
  F extends Filter
>({
  gridRef,
  showSelectedCount,
  title,
  onSearch,
  actionButtons,
  serverParams,
  setFilters,
  hiddenFilterKeys,
  filters,
  customFilterDrawer,
  customSearchBar,
  rowCount,
  pinnedRowIds,
  onRowUnpinnedAll,
  showUnpinAllButton,
  hideActiveFilters,
  warning,
  maxFilterTagsArrayLength,
  filterDrawerDefaultExpanded = false,
}: GridControlBarProps<T, F>) {
  const [showFilterDrawer, toggleFilter] = useState(filterDrawerDefaultExpanded)

  return (
    <>
      <div className='flex px-4 page-control-bar'>
        <Horizontal className='p-3' style={{ gap: '1rem' }}>
          <GridTitle
            title={title ?? ''}
            gridRef={gridRef}
            showSelectedCount={showSelectedCount}
            rowCount={rowCount}
          />
          {showUnpinAllButton && pinnedRowIds && pinnedRowIds.length > 0 && (
            <GraviButton
              className='square-ish'
              onClick={onRowUnpinnedAll}
              icon={<PushpinOutlined />}
              buttonText={`Clear Pinned (${pinnedRowIds.length})`}
            />
          )}
        </Horizontal>

        {onSearch && (
          <div className='flex-1 vertical-flex-center'>
            <SearchBar
              onSearch={onSearch}
              serverParams={serverParams}
              showFilterDrawer={showFilterDrawer}
              toggleFilter={toggleFilter}
              customFilterDrawer={customFilterDrawer}
              customSearchBar={customSearchBar}
              warning={warning}
            />
          </div>
        )}

        <div className='pl-3 flex-1 flex justify-end items-center'>
          {actionButtons}
        </div>
      </div>

      <FilterTags
        params={serverParams as DropdownFieldProps<F>[]}
        hiddenFilterKeys={hiddenFilterKeys}
        filters={filters}
        setCurrentFilters={setFilters}
        hideActiveFilters={hideActiveFilters}
        maxArrayLength={maxFilterTagsArrayLength}
      />
      <FilterDrawer
        customFilterDrawer={customFilterDrawer}
        params={serverParams}
        showFilter={showFilterDrawer}
        setFilters={setFilters}
        filters={filters}
      />
    </>
  )
}

type SearchBarProps<F extends Filter> = {
  onSearch: React.ChangeEventHandler<HTMLInputElement>
  serverParams?: BaseFieldProps<F>[]
  showFilterDrawer?: boolean
  toggleFilter: (show: boolean) => void
  customFilterDrawer?: React.ReactNode
  customSearchBar?: React.ReactNode
  warning?: string
}

function SearchBar<F extends Filter>({
  onSearch,
  serverParams,
  showFilterDrawer,
  toggleFilter,
  customFilterDrawer,
  customSearchBar,
  warning,
}: SearchBarProps<F>) {
  const showToggle = serverParams || !!customFilterDrawer
  return (
    <Row>
      <Col span={24}>
        <div className='search-control'>
          {showToggle && (
            <div className='vertical-flex-center'>
              <Tooltip title='Query Filters'>
                <GraviButton
                  className='mr-2'
                  theme1={showFilterDrawer}
                  icon={<FilterFilled />}
                  onClick={() => toggleFilter(!showFilterDrawer)}
                />
              </Tooltip>
            </div>
          )}
          {customSearchBar || (
            <Input
              prefix={
                <SearchOutlined
                  className='pr-2'
                  style={{ color: 'var(--gray-500)' }}
                />
              }
              onBlur={(event) => {
                /** This is a stupid hack, but ag-grid (in certain scenarios), will steal focus from the active element
                 * when rows populate the grid with group columns. When search results match and _can_ be expanded,
                 * the grid uses the group columm to expand. This is where the focus is going after the input is blurred.
                 *
                 * Here, we're just checking if the related target (what stole focus) is actually the expand arrow el, and if so,
                 * we're setting focus back to the input. Smells really bad, but the className is the only way I could find to
                 * differentiate between other valid focus scenarios. (like Site Notes on Admin -> Site Management in BBD)
                 *
                 * Update 04/11/2024 a.w
                 * There was anothe scenario where the user enters a search string , clicks a cell to edit, and then focused on the
                 * search bar again, starts typing, it was focusing the cell again and mistakenly overwring the cell. I included a check
                 * for ag-cell, so that the search bar is focused again after results load. but also kept a check for the row-group
                 */
                if (event.relatedTarget) {
                  const relatedTargetClassList = Object.values(
                    event.relatedTarget.classList
                  )
                  const regex = /\bag-cell\b/
                  if (
                    relatedTargetClassList.some((className) => {
                      return (
                        regex.test(className) || className === 'ag-row-group'
                      )
                    })
                  ) {
                    setTimeout(() => {
                      event.target.focus(), [50]
                    })
                  }
                }
              }}
              onChange={onSearch}
              placeholder='Search here'
            />
          )}
          {warning && (
            <Horizontal verticalCenter>
              <Tooltip title={warning}>
                <WarningFilled
                  className='px-2'
                  style={{ color: 'var(--theme-warning)', fontSize: '20px' }}
                />
              </Tooltip>
            </Horizontal>
          )}
        </div>
      </Col>
    </Row>
  )
}

type GridTitleProps<T extends Record<string, any>> = {
  title: string
  gridRef: React.RefObject<AgGridReact<T>>
  showSelectedCount: boolean | undefined
  rowCount?: number
}

function GridTitle({
  title,
  gridRef,
  showSelectedCount,
  rowCount,
}: GridTitleProps<any>) {
  const [visibleRowCount, setVisibleRowCount] = useState(0)
  const updateRowCount = () => {
    if (gridRef && gridRef?.current?.api) {
      let rowCounter = 0

      gridRef?.current?.api?.forEachNodeAfterFilterAndSort((node) => {
        if (!node.group) {
          rowCounter += 1
        }
      })
      setVisibleRowCount(rowCounter)
    } else {
      setVisibleRowCount(rowCount || 0)
    }
  }

  useEffect(() => {
    updateRowCount()
    if (gridRef?.current && gridRef?.current?.api) {
      gridRef.current.api.addEventListener('rowDataUpdated', updateRowCount)
      gridRef.current.api.addEventListener('filterChanged', updateRowCount)
    }

    return () => {
      gridRef?.current?.api?.removeEventListener(
        'rowDataUpdated',
        updateRowCount
      )
      gridRef?.current?.api?.removeEventListener(
        'filterChanged',
        updateRowCount
      )
    }
  }, [gridRef?.current, rowCount])

  const showRowCount = !!visibleRowCount || visibleRowCount === 0
  const selectedCount = gridRef?.current?.api?.getSelectedRows()?.length
  const isSelectedCountVisible = showSelectedCount && !!selectedCount

  return (
    <div className='flex'>
      <div className='flex-1 flex items-center'>
        <Texto category='h4'>{title}</Texto>
        {isSelectedCountVisible && (
          <Texto
            category='h6'
            appearance='secondary'
            className='pl-4 vertical-flex-center'
          >
            {selectedCount} Selected | {visibleRowCount}{' '}
            {visibleRowCount === 1 ? 'Result' : 'Results'}
          </Texto>
        )}
        {!isSelectedCountVisible && showRowCount && (
          <Texto
            category='h6'
            appearance='secondary'
            className='pl-4 vertical-flex-center'
          >
            {visibleRowCount} {visibleRowCount === 1 ? 'Result' : 'Results'}
          </Texto>
        )}
      </div>
    </div>
  )
}

type FilterDrawerProps<F extends Filter> = {
  showFilter: boolean
  setFilters?: (filters: F) => void
  filters?: F
  params?: BaseFieldProps<F>[]
  customFilterDrawer?: JSX.Element
}

function FilterDrawer<F extends Filter>({
  showFilter,
  setFilters,
  filters,
  params,
  customFilterDrawer,
}: FilterDrawerProps<F>) {
  if (customFilterDrawer) {
    if (showFilter) {
      return customFilterDrawer
    }
    return null
  }
  const renderFilter = showFilter && params && params?.length > 0
  const applyFilters = (values: F) => {
    if (setFilters) {
      setFilters({
        ...(filters as F),
        ...(Object.entries(values) as [keyof F, string][])
          ?.filter(
            ([_k, _v]) =>
              _v !== '' && !((_k === 'From' && !_v) || (_k === 'To' && !_v)) // throw away any keys with an empty string, and ignore From or To resets to undefined
          )
          .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
      })
    }
  }
  if (!renderFilter) return null
  return (
    <div className='filter-drawer px-5 py-2'>
      <DynamicFilterForm
        params={params}
        filters={filters!}
        setFilters={setFilters}
        submitFunction={applyFilters}
      />
    </div>
  )
}
