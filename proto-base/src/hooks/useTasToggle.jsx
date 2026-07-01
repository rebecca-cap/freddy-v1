import { useEffect, useState } from 'react'

const store = window.localStorage

export const useTasToggle = () => {
  const [checked, setChecked] = useState()

  useEffect(() => {
    const tasMode = store.getItem('tasMode')
    setChecked(JSON.parse(tasMode))
  }, [])

  const onCheckedChange = (isChecked) => {
    setChecked(isChecked)
    store.setItem('tasMode', JSON.stringify(isChecked))
  }

  return [checked, onCheckedChange]
}
