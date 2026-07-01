import { useEffect, useState } from 'react'

export const useTasToggle = () => {
  const [checked, setChecked] = useState()

  useEffect(() => {
    const tasMode = localStorage.getItem('tasMode')
    setChecked(JSON.parse(tasMode))
  }, [])

  const onCheckedChange = (isChecked) => {
    setChecked(isChecked)
    localStorage.setItem('tasMode', JSON.stringify(isChecked))
  }

  return [checked, onCheckedChange]
}
