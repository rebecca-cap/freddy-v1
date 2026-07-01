import { useState } from 'react'
import useMousetrap from 'react-hook-mousetrap'
import { useNavigate } from 'react-router-dom'

export const useQuickSearch = () => {
  const navigate = useNavigate()
  const [boxVisible, setBoxVisibile] = useState(false)

  const handleQuickSearchSelect = (url: string) => {
    setBoxVisibile(false)
    navigate(url)
  }
  useMousetrap(
    ['ctrl+i', 'meta+k'], // any mousetrap combo, or array of combo
    () => setBoxVisibile((boxVisible) => !boxVisible)
  )
  return { boxVisible, setBoxVisibile, handleQuickSearchSelect }
}
