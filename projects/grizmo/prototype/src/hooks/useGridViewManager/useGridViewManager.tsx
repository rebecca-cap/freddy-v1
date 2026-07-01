import { useLocalStorage } from '@gravitate-js/excalibrr'
import { GridView, ViewPayload } from '@hooks/useGridViewManager/api/types.schema'
import { useGridViews } from '@hooks/useGridViewManager/api/useGridViews'
import { changeConfigToPayload, changeResponseToConfig } from '@hooks/useGridViewManager/api/util'

export function useGridViewManager(storageKey: string) {
  const { useSaveViewMutation, useDeleteViewMutation } = useGridViews()
  const { value: gridViews, setValue: setGridViews } = useLocalStorage<GridView[]>(`gridViewList::${storageKey}`, [])

  return {
    deleteView: ({ id }: { id: number | string }): GridView[] => {
      try {
        const userPreferenceId = typeof id === 'number' ? id : (Number(id) as number)
        useDeleteViewMutation.mutate(userPreferenceId)
        let newGridViews
        setGridViews((current) => {
          newGridViews = current?.filter((v) => v.id !== id)
          return newGridViews
        })
        return newGridViews
      } catch (e) {
        console.error('ERROR: ', e)
        return gridViews ?? []
      }
    },
    saveView: async (view: ViewPayload): Promise<GridView[]> => {
      try {
        const newView = changeConfigToPayload({ ...view, gridKey: storageKey })
        const resp = await useSaveViewMutation.mutateAsync(newView)
        const newGridViewConfig = changeResponseToConfig(resp?.Data)
        const currentViewJson = window.localStorage.getItem(`gridViewList::${storageKey}`)
        const currentViews = currentViewJson && currentViewJson !== 'undefined' ? JSON.parse(currentViewJson) : []
        const newGridViews = currentViews.some((item) => item.id === newGridViewConfig.id)
          ? currentViews.map((v) => (v.id === view.id ? newGridViewConfig : v))
          : [...currentViews, newGridViewConfig]
        const sorted = newGridViews.sort((a, b) => a.name.localeCompare(b.name))
        setGridViews(sorted)

        return newGridViews
      } catch (e) {
        console.error('ERROR: ', e)
        return gridViews ?? []
      }
    },
  }
}
