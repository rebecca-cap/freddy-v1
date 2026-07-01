import './styles.css'

import { useLocationManagement } from '@api/useLocationManagement'
import { useProductManagement } from '@api/useProductManagement'
import { Horizontal, useLocalStorage, Vertical } from '@gravitate-js/excalibrr'
import { GridConfigState } from '@hooks/useGridViewManager/api/types.schema'
import { UseQueryResult } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
  intradayMovementGridSettings,
  marginSummaryGridSettings,
  strategyMissGridSettings,
  volumePaceGridSettings,
} from './api/defaultWidgetSettings'
import {
  DataTypeWithStatus,
  GraviGridRef,
  PageSettingFilters,
  UserDefinedPageView,
  WidgetConfig,
  WidgetRequestPayload,
  WidgetTitle,
} from './api/types.schema'
import { useCommandCenter } from './api/useCommandCenter'
import { usePageViews } from './api/usePageViews'
import { IntradayCompetitorMovementsColumnDefs } from './components/Grids/IntraDayCompetitorMovement/IntraDayCompetitorMovementsColumnDefs'
import { MarginSummaryColumnDefs } from './components/Grids/MarginSummary/MarginSummaryColumnDefs'
import { ModalGridViewContainer } from './components/Grids/sharedComponents/ModalGridViewContainer'
import { StrategyDeltaColumnDefs } from './components/Grids/StrategyMiss/StrategyDeltaColumnDefs'
import { VolumePaceColumnDefs } from './components/Grids/VolumePace/VolumePaceColumnDefs'
import { GridSettingsDrawer } from './components/GridSettingsDrawer/GridSettingsDrawer'
import { HeaderControlBar } from './components/Header/HeaderControlBar'
import { getIntradayCompetitorMovementDataWithStatus, updateIntradayMovementSettings } from './components/intradayUtil'
import { getMarginSummaryDataWithStatus, updateMarginSummarySettings } from './components/marginSummaryUtil'
import { getUserDefinedPageViewForLocalStorage } from './components/PageSettingsDrawer/components/util'
import { PageViewSettingsDrawer } from './components/PageSettingsDrawer/PageViewSettingsDrawer'
import { HierarchyItem, PageSettingsModal } from './components/PageSettingsModal/PageSettingsModal'
import { getStrategyMissDataWithStatus, updateStrategyMissSettings } from './components/strategyMissUtil'
import { getVolumePaceDataWithStatus, updateVolumePaceSettings } from './components/volumePaceUtil'
import { WidgetContainer } from './components/WidgetContainer'

export function CommandCenterPage() {
  const { useHierarchyListQuery: useLocationHierarchyListQuery } = useLocationManagement()
  const { data: locationHierarchyList } = useLocationHierarchyListQuery() as UseQueryResult<HierarchyItem[]>
  const { useHierarchyListQuery: useProductHierarchyListQuery } = useProductManagement()
  const { data: productHierarchyList } = useProductHierarchyListQuery() as UseQueryResult<HierarchyItem[]>
  const [currentlySelectedPageView, setCurrentlySelectedPageView] = useState<string | null>(null)
  const [displayTitle, setDisplayTitle] = useState<WidgetTitle>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isGridViewModalOpen, setIsGridViewModalOpen] = useState(false)
  const [isPageViewSettingsDrawerOpen, setIsPageViewSettingsDrawerOpen] = useState(false)
  const [isPageSettingsModalOpen, setIsPageSettingsModalOpen] = useState(false)
  const [alertsOnly, setAlertsOnly] = useState(false)
  const [pageSettingFilters, setPageSettingFilters] = useState<PageSettingFilters>({
    LocationHierarchyTypeCvId: 0,
    ProductHierarchyTypeCvId: 0,
  })
  useEffect(() => {
    if (locationHierarchyList && productHierarchyList) {
      setPageSettingFilters({
        LocationHierarchyTypeCvId: locationHierarchyList[0].Key,
        ProductHierarchyTypeCvId: productHierarchyList[0].Key,
      })
    }
  }, [locationHierarchyList, productHierarchyList])

  const { getMetadata } = useCommandCenter()
  const { data: metadata } = getMetadata(pageSettingFilters)
  const widgetStorageKey = useMemo(() => {
    return {
      'Intraday Competitor Movement': 'CommandCenter-IntradayCompetitorMovement',
      'Strategy Delta Report': 'CommandCenter-StrategyMiss',
      'Margin Summary': 'CommandCenter-MarginSummary',
      'Volume Pace': 'CommandCenter-VolumePace',
    }
  }, [])
  const VolumePaceGridApiRef = useRef<GraviGridRef<DataTypeWithStatus> | undefined>()
  const IntradayCompetitorMovementGridApiRef = useRef<GraviGridRef<DataTypeWithStatus> | undefined>()
  const StrategyMissReportGridApiRef = useRef<GraviGridRef<DataTypeWithStatus> | undefined>()
  const MarginSummaryGridApiRef = useRef<GraviGridRef<DataTypeWithStatus> | undefined>()
  const { getIntradayCompetitorMovementData, getStrategyMissData, getMarginSummaryData, getVolumePaceData } =
    useCommandCenter()
  const { useGetPageViewsQuery } = usePageViews()
  const { data: pageViewsData } = useGetPageViewsQuery()
  const { value: intradayMovementSettings, setValue: setIntradayMovementSettings } = useLocalStorage(
    `gridSettings::${widgetStorageKey['Intraday Competitor Movement']}`,
    intradayMovementGridSettings
  )
  const { value: strategyMissSettings, setValue: setStrategyMissSettings } = useLocalStorage(
    `gridSettings::${widgetStorageKey['Strategy Delta Report']}`,
    strategyMissGridSettings
  )
  const { value: marginSummarySettings, setValue: setMarginSummarySettings } = useLocalStorage(
    `gridSettings::${widgetStorageKey['Margin Summary']}`,
    marginSummaryGridSettings
  )

  const { value: volumePaceSettings, setValue: setVolumePaceSettings } = useLocalStorage(
    `gridSettings::${widgetStorageKey['Volume Pace']}`,
    volumePaceGridSettings
  )
  const transformStringFiltersToNumbers = (filters: any) => {
    if (!filters || !Object.keys(filters).length) return {}
    return {
      ...filters,
      LocationIds: filters?.LocationIds?.map((id: string) => parseInt(id)),
      ProductIds: filters?.ProductIds?.map((id: string) => parseInt(id)),
      QuoteConfigurationIds: filters?.QuoteConfigurationIds?.map((id: string) => parseInt(id)),
    }
  }
  const {
    data: intradayCompetitorMovementData,
    isFetching: intradayCompetitorMovementIsLoading,
    refetch: refetchIntradayCompetitorMovementData,
    dataUpdatedAt: intradayCompetitorMovementDataUpdatedAt,
  } = getIntradayCompetitorMovementData({
    ...pageSettingFilters,
    ...transformStringFiltersToNumbers(intradayMovementSettings?.filters),
  } as WidgetRequestPayload)

  const {
    data: originalMarginSummaryData,
    isFetching: marginSummaryIsLoading,
    refetch: refetchMarginSummaryData,
    dataUpdatedAt: marginSummaryDataUpdatedAt,
  } = getMarginSummaryData({
    ...pageSettingFilters,
    ...transformStringFiltersToNumbers(marginSummarySettings?.filters),
  } as WidgetRequestPayload)
  const {
    data: originalVolumePaceData,
    isFetching: volumePaceIsLoading,
    refetch: refetchVolumePaceData,
    dataUpdatedAt: volumePaceDataUpdatedAt,
  } = getVolumePaceData({
    ...pageSettingFilters,
    ...transformStringFiltersToNumbers(volumePaceSettings?.filters),
  } as WidgetRequestPayload)

  const {
    data: originalStrategyMissReportData,
    isFetching: strategyMissReportIsLoading,
    refetch: refetchStrategyMissReportData,
    dataUpdatedAt: strategyMissReportDataUpdatedAt,
  } = getStrategyMissData({
    ...pageSettingFilters,
    ...transformStringFiltersToNumbers(strategyMissSettings?.filters),
  } as WidgetRequestPayload)

  const volumePaceData = useMemo(
    () => getVolumePaceDataWithStatus(originalVolumePaceData, volumePaceSettings),
    [originalVolumePaceData, volumePaceSettings]
  )

  const intradayData = useMemo(
    () => getIntradayCompetitorMovementDataWithStatus(intradayCompetitorMovementData, intradayMovementSettings),
    [intradayCompetitorMovementData, intradayMovementSettings]
  )

  const marginSummaryData = useMemo(
    () => getMarginSummaryDataWithStatus({ originalMarginSummaryData, marginSummarySettings }),
    [originalMarginSummaryData, marginSummarySettings]
  )

  const strategyMissReportData = useMemo(
    () => getStrategyMissDataWithStatus(originalStrategyMissReportData, strategyMissSettings),
    [originalStrategyMissReportData, strategyMissSettings]
  )

  const refreshAllData = () => {
    refetchIntradayCompetitorMovementData()
    refetchStrategyMissReportData()
    refetchMarginSummaryData()
    refetchVolumePaceData()
  }

  const widgets = useMemo(
    (): WidgetConfig[] => [
      {
        storageKey: widgetStorageKey['Intraday Competitor Movement'],
        columnDefs: IntradayCompetitorMovementsColumnDefs,
        data: intradayData,
        settings: intradayMovementSettings,
        setSettings: setIntradayMovementSettings,
        gridApiRef: IntradayCompetitorMovementGridApiRef,
        title: 'Intraday Competitor Movement',
        isLoading: intradayCompetitorMovementIsLoading,
      },
      {
        storageKey: widgetStorageKey['Strategy Delta Report'],
        columnDefs: StrategyDeltaColumnDefs,
        data: strategyMissReportData,
        settings: strategyMissSettings,
        setSettings: setStrategyMissSettings,
        gridApiRef: StrategyMissReportGridApiRef,
        title: 'Strategy Delta Report',
        isLoading: strategyMissReportIsLoading,
      },
      {
        storageKey: widgetStorageKey['Margin Summary'],
        columnDefs: MarginSummaryColumnDefs,
        data: marginSummaryData,
        settings: marginSummarySettings,
        setSettings: setMarginSummarySettings,
        gridApiRef: MarginSummaryGridApiRef,
        title: 'Margin Summary',
        isLoading: marginSummaryIsLoading,
        columnHeadersByColumnId: originalMarginSummaryData?.Data?.ColumnHeadersByColumnId || {},
      },
      {
        storageKey: widgetStorageKey['Volume Pace'],
        columnDefs: VolumePaceColumnDefs,
        data: volumePaceData,
        settings: volumePaceSettings,
        setSettings: setVolumePaceSettings,
        gridApiRef: VolumePaceGridApiRef,
        title: 'Volume Pace',
        isLoading: volumePaceIsLoading,
      },
    ],
    [
      intradayData,
      strategyMissReportData,
      marginSummaryData,
      volumePaceData,
      originalMarginSummaryData?.Data?.ColumnHeadersByColumnId,
      intradayCompetitorMovementIsLoading,
      strategyMissReportIsLoading,
      marginSummaryIsLoading,
      volumePaceIsLoading,
    ]
  )

  const selectedWidget = useMemo(() => {
    return widgets.find((widget) => widget.title === displayTitle)
  }, [displayTitle, widgets])

  const openCloseModal = (title: WidgetTitle) => {
    setDisplayTitle(title)
    setIsGridViewModalOpen(!!title)
  }
  const openCloseDrawer = (title: WidgetTitle) => {
    setDisplayTitle(title)
    setIsDrawerOpen(!!title)
  }
  const commonProps = {
    openCloseDrawer,
    openCloseModal,
  }

  const updateWidgetSettings = (title: WidgetTitle, settings: any) => {
    if (title === 'Volume Pace' && volumePaceSettings) {
      updateVolumePaceSettings(settings, volumePaceSettings, setVolumePaceSettings)
    }
    if (title === 'Intraday Competitor Movement' && intradayMovementSettings) {
      updateIntradayMovementSettings(settings, intradayMovementSettings, setIntradayMovementSettings)
    }
    if (title === 'Strategy Delta Report' && strategyMissSettings) {
      updateStrategyMissSettings(settings, strategyMissSettings, setStrategyMissSettings)
    }
    if (title === 'Margin Summary' && marginSummarySettings) {
      updateMarginSummarySettings(settings, marginSummarySettings, setMarginSummarySettings)
    }
  }
  const { value: pageViews, setValue: setPageViews } = useLocalStorage<UserDefinedPageView[] | null>(
    'CommandCenter-PageViews',
    []
  )

  const gridRefs = useMemo(
    () => [
      IntradayCompetitorMovementGridApiRef,
      StrategyMissReportGridApiRef,
      MarginSummaryGridApiRef,
      VolumePaceGridApiRef,
    ],
    [
      IntradayCompetitorMovementGridApiRef.current,
      StrategyMissReportGridApiRef.current,
      MarginSummaryGridApiRef.current,
      VolumePaceGridApiRef.current,
    ]
  )
  useEffect(() => {
    if (pageViewsData?.Data?.length) {
      setPageViews(pageViewsData.Data?.map((view) => getUserDefinedPageViewForLocalStorage(widgets, view)) || [])
    }
  }, [pageViewsData])

  const lastUpdated = useMemo(() => {
    return Math.max(
      intradayCompetitorMovementDataUpdatedAt,
      strategyMissReportDataUpdatedAt,
      marginSummaryDataUpdatedAt,
      volumePaceDataUpdatedAt
    )
  }, [
    intradayCompetitorMovementDataUpdatedAt,
    strategyMissReportDataUpdatedAt,
    marginSummaryDataUpdatedAt,
    volumePaceDataUpdatedAt,
  ])
  const isDataLoading = useMemo(() => {
    return (
      intradayCompetitorMovementIsLoading ||
      strategyMissReportIsLoading ||
      marginSummaryIsLoading ||
      volumePaceIsLoading
    )
  }, [intradayCompetitorMovementIsLoading, strategyMissReportIsLoading, marginSummaryIsLoading, volumePaceIsLoading])
  return (
    <Vertical flex={1}>
      <HeaderControlBar
        setIsPageViewSettingsDrawerOpen={setIsPageViewSettingsDrawerOpen}
        currentlySelectedPageView={currentlySelectedPageView}
        setIsPageSettingsModalOpen={setIsPageSettingsModalOpen}
        alertsOnly={alertsOnly}
        setAlertsOnly={setAlertsOnly}
        refreshData={refreshAllData}
        lastUpdated={lastUpdated}
      />
      <Horizontal style={{ width: '100%', height: '100%' }} flex={1} justifyContent='space-between' className='mb-4'>
        {widgets.slice(0, 3).map((widget, index) => {
          if (index < 3) {
            const className = index === 1 ? 'mx-4 mb-2' : 'mb-2'
            return (
              <Vertical flex={1} key={widget.title} className={className}>
                <WidgetContainer
                  title={widget.title}
                  columnDefs={widget.columnDefs}
                  gridDataWithStatus={widget.data}
                  gridSettings={widget.settings}
                  setGridSettings={widget.setSettings}
                  isLoading={widget.isLoading}
                  storageKey={widget.storageKey}
                  gridApiRef={widget.gridApiRef}
                  columnHeadersByColumnId={widget.columnHeadersByColumnId}
                  alertsOnly={alertsOnly}
                  {...commonProps}
                />
              </Vertical>
            )
          }
        })}
      </Horizontal>
      <Vertical flex={1} className='mb-4'>
        {widgets.slice(3).map((widget) => {
          return (
            <WidgetContainer
              title={widget.title}
              columnDefs={widget.columnDefs}
              gridDataWithStatus={widget.data}
              gridSettings={widget.settings}
              setGridSettings={widget.setSettings}
              isLoading={widget.isLoading}
              storageKey={widget.storageKey}
              gridApiRef={widget.gridApiRef}
              {...commonProps}
              key={widget.title}
              alertsOnly={alertsOnly}
            />
          )
        })}
      </Vertical>

      <PageSettingsModal
        isModalOpen={isPageSettingsModalOpen}
        onClose={() => setIsPageSettingsModalOpen(false)}
        pageSettingFilters={pageSettingFilters}
        setPageSettingFilters={setPageSettingFilters}
      />
      {isGridViewModalOpen && !!displayTitle && (
        <ModalGridViewContainer
          widget={selectedWidget as WidgetConfig<DataTypeWithStatus, GridConfigState>}
          isModalOpen={isGridViewModalOpen}
          closeModal={() => openCloseModal(null)}
          alertsOnly={alertsOnly}
        />
      )}

      {isDrawerOpen && !!displayTitle && (
        <GridSettingsDrawer
          title={displayTitle}
          isDrawerOpen={isDrawerOpen}
          closeDrawer={() => openCloseDrawer(null)}
          updateWidgetSettings={updateWidgetSettings}
          storageKey={selectedWidget?.storageKey || ''}
          metadata={metadata?.Data}
        />
      )}

      {isPageViewSettingsDrawerOpen && (
        <PageViewSettingsDrawer
          isOpen={isPageViewSettingsDrawerOpen}
          onClose={() => setIsPageViewSettingsDrawerOpen(false)}
          setCurrentlySelectedPageView={setCurrentlySelectedPageView}
          currentlySelectedPageView={currentlySelectedPageView}
          pageViewsData={pageViewsData?.Data || []}
          pageViews={pageViews || []}
          widgets={widgets}
          setPageViews={setPageViews}
          widgetStorageKey={widgetStorageKey}
          gridRefs={gridRefs}
          pageSettingsFilters={pageSettingFilters}
          isLoading={isDataLoading}
        />
      )}
    </Vertical>
  )
}
