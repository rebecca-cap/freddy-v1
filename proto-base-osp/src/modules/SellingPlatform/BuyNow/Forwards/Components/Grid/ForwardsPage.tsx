import { CreditData } from '@api/useForwards/types'
import { useForwardsCreation } from '@contexts/ForwardsContext'
import React, { useMemo } from 'react'

import { ForwardsGrid } from './Components/Grid'

export function ForwardsGridContainer({
  setIsModalVisible,
  creditData,
}: {
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  creditData: CreditData | undefined
}) {
  const {
    availableItems,
    areItemsLoading,
    hasBadSelection,
    setSelectedGridCells,
    selectedPeriodIds,
    onlyAssigned,
    toggleOnlyAssigned,
  } = useForwardsCreation()

  const loadingNumberSelectionIsRequiredButNoneWereFound = useMemo(() => {
    if (selectedPeriodIds?.length) {
      const tradeEntrySetupId = selectedPeriodIds?.[0].TradeEntrySetupId
      const selectedAvailableItem = availableItems?.Data?.ItemGroups?.find(
        (availableItem) => availableItem.TradeEntrySetupId === tradeEntrySetupId
      )
      if (selectedAvailableItem) {
        return selectedAvailableItem?.LoadingNumberSelectionIsRequiredButNoneWereFound
      }
    }

    return false
  }, [selectedPeriodIds, availableItems])

  const hasCreditHold = creditData?.creditStatus === 'CreditHold'

  return (
    <ForwardsGrid
      areItemsLoading={areItemsLoading}
      availableItems={availableItems}
      setIsModalVisible={setIsModalVisible}
      selectedPeriodIds={selectedPeriodIds}
      hasBadSelection={hasBadSelection}
      setSelectedGridCells={setSelectedGridCells}
      onlyAssigned={onlyAssigned}
      toggleOnlyAssigned={toggleOnlyAssigned}
      hasCreditHold={hasCreditHold}
      loadingNumberSelectionIsRequiredButNoneWereFound={loadingNumberSelectionIsRequiredButNoneWereFound}
    />
  )
}
