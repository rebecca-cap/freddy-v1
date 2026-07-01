import React, { createContext, ReactNode, useContext } from 'react'

const ContractsContext = createContext({})

export const ContractsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <ContractsContext.Provider value={{}}>{children}</ContractsContext.Provider>
}

export const useContractsContext = () => {
  const context = useContext(ContractsContext)
  if (context === undefined) {
    throw new Error('Context must be used within a Provider')
  }
  return context
}
