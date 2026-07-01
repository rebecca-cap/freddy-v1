import { screen } from '@testing-library/dom'
import React from 'react'

import { renderWithMockedAPI } from '../../../../../tests/utils'
import { staticColumns } from '../Components/Grid/Components/getColumnDefs'
import { ForwardsGrid } from '../Components/Grid/Components/Grid'
import { getItemFromRow, getItemIndexFromRow, hasIndexGaps } from '../Components/Grid/utils'
import { BuyForwardsPage } from '../page'
import { availableItems } from './mocks/availableItems'

describe('ForwardsGrid', () => {
  test('renders ForwardsGrid component', () => {
    const { getByText } = renderWithMockedAPI(<BuyForwardsPage />)
    expect(getByText('Buy Forwards')).toBeDefined()
  })

  test('downloads a csv file', () => {
    const tools = renderWithMockedAPI(<BuyForwardsPage />)
    const downloadButton = tools.queryByText('Export to CSV')
    expect(downloadButton).toBeDefined()
    downloadButton.click()

    const csvResults = tools.queryByTestId('csvResults')
    expect(csvResults).toBeDefined()
    expect(csvResults.innerHTML).toBeDefined()
  })

  test('clears the selection', () => {
    const tools = renderWithMockedAPI(<BuyForwardsPage />)
    const clearSelectionButton = tools.queryByText('Clear Selection')
    expect(clearSelectionButton).toBeDefined()
    clearSelectionButton.click()
  })

  test('tas toggle is not visible when there are no tas instruments', () => {
    const tools = renderWithMockedAPI(
      <ForwardsGrid
        selectedPeriodIds={[]}
        areItemsLoading={false}
        availableItems={availableItems}
        hasBadSelection={false}
        hasTasInstruments={false}
        tasMode={false}
      />
    )

    const tasToggle = screen.queryByTestId('tasToggleWrapper')
    expect(tasToggle).toBeNull()
  })

  test('create button is enabled for when selection is valid', () => {
    const tools = renderWithMockedAPI(
      <ForwardsGrid
        selectedPeriodIds={[1, 2, 3]}
        areItemsLoading={false}
        availableItems={availableItems}
        hasBadSelection={false}
        hasTasInstruments
        tasMode={false}
      />
    )

    const createOrderButtonWrapper = screen.getByTestId('createOrderButton')
    expect(createOrderButtonWrapper).toBeDefined()

    const createOrderButton = createOrderButtonWrapper.children[0]
    expect(createOrderButton).toBeDefined()

    expect(createOrderButton.disabled).toBe(false)
  })

  test('create button is disabled when selection is invalid', () => {
    const tools = renderWithMockedAPI(
      <ForwardsGrid
        selectedPeriodIds={[1, 2, 4]}
        areItemsLoading={false}
        availableItems={availableItems}
        hasBadSelection
        hasTasInstruments
        tasMode={false}
      />
    )

    const createOrderButtonWrapper = screen.getByTestId('createOrderButton')
    expect(createOrderButtonWrapper).toBeDefined()

    const createOrderButton = createOrderButtonWrapper.children[0]
    expect(createOrderButton).toBeDefined()

    expect(createOrderButton.disabled).toBe(true)
  })

  test('create button is disabled when no periods are selected', () => {
    const tools = renderWithMockedAPI(
      <ForwardsGrid
        selectedPeriodIds={[]}
        areItemsLoading={false}
        availableItems={availableItems}
        hasBadSelection={false}
        hasTasInstruments
        tasMode={false}
      />
    )

    const createOrderButtonWrapper = screen.getByTestId('createOrderButton')
    expect(createOrderButtonWrapper).toBeDefined()

    const createOrderButton = createOrderButtonWrapper.children[0]
    expect(createOrderButton).toBeDefined()

    expect(createOrderButton.disabled).toBe(true)
  })

  test("indexHasGaps returns true when gaps are present and false when there aren't any", () => {
    let data = [1, 2, 3, 5, 6, 7]
    expect(hasIndexGaps(data)).toBe(true)

    data = [1, 2, 3, 4, 5, 6, 7]
    expect(hasIndexGaps(data)).toBe(false)
  })

  test('getItemIndexFromRow returns the correct item index', () => {
    const row = availableItems.Data.ItemGroups[0]

    const index = getItemIndexFromRow(row, {
      DeliveryPeriodGroupId: null,
      DeliveryPeriodConfigurationId: 232,
    })
    expect(index).toBe(0)

    const index2 = getItemIndexFromRow(row, {
      DeliveryPeriodGroupId: null,
      DeliveryPeriodConfigurationId: 272,
    })
    expect(index2).toBe(1)
  })

  test('getItemFromRow returns the correct item', () => {
    const row = availableItems.Data.ItemGroups[0]

    const item = getItemFromRow(row, {
      DeliveryPeriodGroupId: null,
      DeliveryPeriodConfigurationId: 232,
    })
    expect(item).toStrictEqual({ cellIndex: 0, cell: row.MarketPlatformItems[0] })

    const item2 = getItemFromRow(row, {
      DeliveryPeriodGroupId: null,
      DeliveryPeriodConfigurationId: 272,
    })
    expect(item2).toStrictEqual({ cellIndex: 1, cell: row.MarketPlatformItems[1] })
  })

  test('Product + Location columns should not be clickable', () => {
    // check if object has at least one property with a certain value..
    expect(staticColumns.every((col) => col.cellStyle.pointerEvents === 'none')).toBe(true)
    // expect(staticColumns[0].cellStyle).toHaveProperty('cursor', 'default')
  })
})
