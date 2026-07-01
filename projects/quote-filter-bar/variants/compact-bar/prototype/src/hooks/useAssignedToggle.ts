import { useEffect, useState } from 'react'

const store = window.localStorage

export const useAssignedToggle = () => {
  const [checked, setChecked] = useState()

  useEffect(() => {
    const onlyAssigned = store.getItem('onlyAssigned')
    setChecked(JSON.parse(onlyAssigned))
  }, [])

  const onCheckedChange = (isChecked) => {
    setChecked(isChecked)
    store.setItem('onlyAssigned', JSON.stringify(isChecked))
  }

  return [checked, onCheckedChange]
}
