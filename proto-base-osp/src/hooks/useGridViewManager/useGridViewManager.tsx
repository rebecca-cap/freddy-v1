import { useLocalStorage } from '@gravitate-js/excalibrr'
import { GridView, ViewPayload } from '@hooks/useGridViewManager/api/types.schema'
import { useGridViewsTyped } from '@hooks/useGridViewManager/api/useGridViewsTyped'
import { changeConfigToPayload, changeResponseToConfig } from '@hooks/useGridViewManager/api/util'

export function useGridViewManager(storageKey: string) {
  const { useSaveViewMutation, useDeleteViewMutation } = useGridViewsTyped()
  const saveViewMutation = useSaveViewMutation()
  const deleteViewMutation = useDeleteViewMutation()
  const { value: gridViews, setValue: setGridViews } = useLocalStorage<GridView[]>(`gridViewList::${storageKey}`, [])

  return {
    deleteView: ({ id }: { id: number | string }): GridView[] => {
      try {
        const userPreferenceId = typeof id === 'number' ? id : (Number(id) as number)
        deleteViewMutation.mutate(userPreferenceId)
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
        const resp = await saveViewMutation.mutateAsync(newView)
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
