// Someday, the page permissions, or even the pages that exist in a site, will come down to us from the API.
// We might find a fancier way of this, and we should, but each of those have a URL. If that url comes down and contains Entity Report, when we build the page, its component will be an EntityReport WITH ONE PROP.
// That prop is the pages unique key in a string fashion.

// that page will be an instance of EntityReport with the sole prop of the key.
// when that page loads, we will hit an EP that gives us the schema from the key. (always the same EP)
// once we get that response back, we will get the url for the Read EP and hit it with the default filters (if any)

import { useApi } from '@gravitate-js/excalibrr'
import { useQuery } from '@tanstack/react-query'
import { getEntityReportColumnDefs, getFilterInputs, getServerParams } from '@utils/api'
import type { EntitySchemaResponse } from '@utils/api/index.types'
import { useEffect, useMemo, useRef, useState } from 'react'

interface IUseEntityReport {
  reportKey: string // the entity report key 'AllPrices',.. etc
  additionalActionButtons?: () => React.ReactNode
}

export const useEntityReport = ({ reportKey }: IUseEntityReport) => {
  const api = useApi()
  const [filters, setFilters] = useState<Record<string, any>[]>([])
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false)
  const [haveFiltersBeenSetFirstTime, setHaveFiltersBeenSetFirstTime] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [currentItemId, setCurrentItemId] = useState<number>(null)
  const [selectedEntityAction, setSelectedEntityAction] = useState<string>('')
  const gridRef = useRef(null)

  const schemaQuery = useQuery(
    [`EntityReport::${reportKey}::Schema`],
    () =>
      api.post<EntitySchemaResponse>('EntityReport/GetSchema', {
        ReportName: reportKey,
        IncludePageComponentData: true,
      }),
    {
      enabled: !!reportKey,
      refetchOnWindowFocus: false,
    }
  )

  const schemaData = useMemo(() => schemaQuery?.data?.Data as EntitySchemaResponse['Data'], [schemaQuery?.data])
  const primaryKey = useMemo(() => schemaData?.Schema.EntityView.PrimaryKeyField, [schemaData])
  const detailSchema = useMemo(() => schemaData?.DetailSchema, [schemaData])
  const serverParams = useMemo(() => getServerParams(schemaData), [schemaData])
  const primaryFilter = useMemo(() => serverParams[0], [serverParams])
  const hiddenFilterKeys = useMemo(() => [primaryFilter?.filter_column?.toLowerCase()], [primaryFilter])

  const dataQuery = useQuery(
    [`EntityReport::${reportKey}::Data`, filters],
    () => {
      return api.post('EntityReport/Read', {
        ReportName: reportKey,
        Inputs: getFilterInputs(filters, serverParams),
      })
    },
    { refetchOnWindowFocus: false, enabled: !!schemaData?.Schema?.Display && haveFiltersBeenSetFirstTime }
  )

  const columnDefs = useMemo(
    () =>
      getEntityReportColumnDefs(
        schemaData?.Schema,
        primaryKey,
        setIsInfoModalOpen,
        setCurrentItemId,
        setIsDeleteModalOpen,
        setSelectedEntityAction,
        dataQuery,
        !!detailSchema
      ),
    [schemaData, primaryKey, setIsInfoModalOpen, setCurrentItemId, setIsDeleteModalOpen, setSelectedEntityAction]
  )

  useEffect(() => {
    setFilters([])
  }, [reportKey])

  useEffect(() => {
    const paramsWithDefaults = serverParams.filter((p) => p.defaultValues?.length)
    if (primaryFilter && primaryFilter?.defaultValues) {
      setFilters({
        ...filters,
        ...paramsWithDefaults
          ?.map((p) => ({ [p.filter_column]: p.defaultValues }))
          .reduce((acc, next) => ({ ...acc, ...next }), {}),
        [primaryFilter.filter_column]: primaryFilter.defaultValues,
      })
    }
    if (schemaData && !haveFiltersBeenSetFirstTime) {
      setHaveFiltersBeenSetFirstTime(true)
    }
  }, [primaryFilter, schemaData])

  const menuActionQuery = (endpoint, payload) =>
    useQuery(
      [`EntityReport::${reportKey}::ActionMenu:${endpoint}`],
      () => {
        return api.post(endpoint, {
          payload,
        })
      },
      { refetchOnWindowFocus: false, enabled: !!reportKey }
    )

  return {
    columnDefs,
    dataQuery,
    filters,
    gridRef,
    hiddenFilterKeys,
    isDeleteModalOpen,
    isInfoModalOpen,
    primaryKey,
    primaryFilter,
    schemaQuery,
    isLoading: schemaQuery.isLoading || dataQuery.isLoading,
    isFetching: schemaQuery.isFetching || dataQuery.isFetching,
    detailSchema,
    selectedEntityAction,
    serverParams,
    currentItemId,
    setIsDeleteModalOpen,
    setIsInfoModalOpen,
    setSelectedEntityAction,
    setFilters,
    setCurrentItemId,
    menuActionQuery,
  }
}

interface IUseChildEntityReport {
  childSchema: EntitySchemaResponse['Data']['DetailSchema']
  parentPK: string
  detailId: string
}

export const useChildEntityReport = ({ childSchema, parentPK, detailId }: IUseChildEntityReport) => {
  const api = useApi()
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [currentItemId, setCurrentItemId] = useState<number>(null)
  const [selectedEntityAction, setSelectedEntityAction] = useState<string>('')
  const gridRef = useRef(null)

  const primaryKey = useMemo(() => childSchema?.EntityView.PrimaryKeyField, [childSchema])
  const reportKey = useMemo(() => childSchema?.Name, [childSchema])

  const columnDefs = useMemo(
    () =>
      getEntityReportColumnDefs(
        childSchema,
        primaryKey,
        setIsInfoModalOpen,
        setCurrentItemId,
        setIsDeleteModalOpen,
        setSelectedEntityAction
      ),
    [childSchema, primaryKey, setIsInfoModalOpen, setCurrentItemId, setIsDeleteModalOpen, setSelectedEntityAction]
  )

  const dataQuery = useQuery(
    [`EntityReport::${reportKey}::Data`, detailId, parentPK],
    () => {
      return api.post('EntityReport/Read', {
        ReportName: reportKey,
        Inputs: [
          {
            Value: detailId,
            ComponentName: parentPK,
            ComponentField: 'Value',
          },
        ],
      })
    },
    { refetchOnWindowFocus: false, enabled: !!reportKey }
  )

  return {
    reportKey,
    columnDefs,
    dataQuery,
    gridRef,
    isDeleteModalOpen,
    isInfoModalOpen,
    isDetailReport: !!childSchema,
    primaryKey,
    childSchema,
    selectedEntityAction,
    currentItemId,
    setIsDeleteModalOpen,
    setIsInfoModalOpen,
    setSelectedEntityAction,
    setCurrentItemId,
  }
}
