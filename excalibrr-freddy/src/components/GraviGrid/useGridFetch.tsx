import { useState, useEffect } from 'react'

type FetchReturn<T> = {
  data: {
    rows: T[]
  }
}

export const useGridFetch = <T,>(url: () => Promise<FetchReturn<T>>) => {
  const [rowData, setRowData] = useState<T[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    getRowData()
  }, [url])

  const getRowData = () => {
    setIsLoading(true)
    url().then((resp) => {
      if (resp) {
        setRowData(resp.data.rows)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        throw Error
      }
    })
  }
  return { rowData, refresh: getRowData, isLoading }
}
