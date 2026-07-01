import { useLocalStorage } from '@gravitate-js/excalibrr'
import { useCallback } from 'react'

/**
 * Reusable hook for persisting and restoring form field defaults via localStorage.
 *
 * @param storageKey - Unique key identifying the form (e.g., 'contractHeader')
 * @param trackedFields - Array of field names to persist. Only changes to these fields are saved.
 */
export function useFormDefaults<T extends Record<string, unknown>>(storageKey: string, trackedFields: (keyof T)[]) {
  const { value: savedDefaults, setValue: setSavedDefaults } = useLocalStorage<Partial<T>>(
    `formDefaults::${storageKey}`,
    {} as Partial<T>
  )

  const updateDefaults = useCallback(
    (changedValues: Partial<T>) => {
      const trackedChanges: Partial<T> = {}
      let hasTrackedChange = false

      for (const key of trackedFields) {
        if (key in changedValues) {
          trackedChanges[key] = changedValues[key]
          hasTrackedChange = true
        }
      }

      if (hasTrackedChange) {
        setSavedDefaults((prev) => ({ ...prev, ...trackedChanges }))
      }
    },
    [setSavedDefaults, trackedFields]
  )

  return { savedDefaults, updateDefaults }
}
