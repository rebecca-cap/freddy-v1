import { useRef } from 'react'

export interface UseScrollControlsReturn {
  cardsScrollRef: React.RefObject<HTMLDivElement>
  scrollCards: (direction: 'left' | 'right') => void
}

export function useScrollControls(scrollAmount = 300): UseScrollControlsReturn {
  const cardsScrollRef = useRef<HTMLDivElement>(null)

  const scrollCards = (direction: 'left' | 'right') => {
    if (cardsScrollRef.current) {
      cardsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return {
    cardsScrollRef,
    scrollCards,
  }
}
