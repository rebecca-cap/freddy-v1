import { useEffect, useState } from 'react'

function isDefinedAndNotNull<T>(
  value: T | null | undefined
): value is NonNullable<T> {
  return typeof value !== 'undefined' && value !== null
}

function getStoreValue<T>(key: string) {
  try {
    const existingValue = localStorage.getItem(key)
    if (!existingValue) return null
    return JSON.parse(existingValue) as T
  } catch (error) {
    console.error(error)
    return null
  }
}

// The check for isDefinedAndNotNull is necessary because we don't want to stringify null or undefined into the key store.
function setStoreValue<T>(key: string, value: T | null) {
  isDefinedAndNotNull(value)
    ? window?.localStorage.setItem(key, JSON.stringify(value))
    : window?.localStorage.removeItem(key)
}

export function useLocalStorage<T>(key: string, initialValue?: T) {
  const [localValue, setLocalValue] = useState(() => {
    return getStoreValue<T>(key) ?? initialValue ?? null
  })

  useEffect(() => {
    setStoreValue<T>(key, localValue)
  }, [localValue])

  return {
    value: localValue,
    setValue: setLocalValue,
    clearFromStore: () => setLocalValue(null),
    resetValue: () => setLocalValue(initialValue ?? null), // Reset the state / store to its intial value. If an initial value was not provided, will have the same behavior as clearFromStore.
  }
}
