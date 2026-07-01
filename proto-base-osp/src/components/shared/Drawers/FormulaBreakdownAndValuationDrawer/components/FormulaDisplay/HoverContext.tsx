import React, { createContext, type ReactNode, useContext, useMemo, useState } from 'react'

interface FormulaHoverContextValue {
  hoveredComponentId: number | null
  setHoveredComponentId: (id: number | null) => void
}

const FormulaHoverContext = createContext<FormulaHoverContextValue>({
  hoveredComponentId: null,
  setHoveredComponentId: () => {},
})

export function FormulaHoverProvider({ children }: { children: ReactNode }) {
  const [hoveredComponentId, setHoveredComponentId] = useState<number | null>(null)
  const value = useMemo(() => ({ hoveredComponentId, setHoveredComponentId }), [hoveredComponentId])
  return <FormulaHoverContext.Provider value={value}>{children}</FormulaHoverContext.Provider>
}

export function useFormulaHover() {
  return useContext(FormulaHoverContext)
}
