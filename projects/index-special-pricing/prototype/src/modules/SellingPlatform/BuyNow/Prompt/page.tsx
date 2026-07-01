import './styles.css'

import { ExclamationCircleOutlined } from '@ant-design/icons'
import { usePromptContext } from '@contexts/PromptContext'
import { useUser } from '@contexts/UserContext'
import { GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { CreditBalanceBanner } from '@modules/SellingPlatform/BuyNow/sharedComponents/CreditBalanceBanner'
import { CreditStatusBanner } from '@modules/SellingPlatform/BuyNow/sharedComponents/CreditStatusBanner'
import { GridApi } from 'ag-grid-community'
import { Drawer, Form, Modal, Tabs } from 'antd'
import dayjs from '@utils/dayjs'
import type { Dayjs } from '@utils/dayjs'
import { stripTimezoneOffset } from '@utils/timezone'
import React, { useEffect, useMemo, useState } from 'react'
import Confetti from 'react-confetti'

import { getColumnDefs } from './components/columnDefs'
import { GridActionButtons } from './components/CreateOrder/components/GridActionButtons'
import { OrderDetailPane } from './components/OrderDetail'

export function Prompt() {
  const [form] = Form.useForm()
  const { confirm } = Modal

  const gridAPIRef = React.useRef<GridApi>() as React.MutableRefObject<GridApi>
  const storageKey = 'buyNowPromptGrid'
  const gridViewManager = useGridViewManager(storageKey)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.MarketPlatform?.OnlineOrder?.Write

  const {
    loading,
    pricesRefreshing,
    orderItems,
    setSelectedItem,
    selectedItemMeta,
    setOrderStep,
    tasMode,
    showConfetti,
    pendingChanges,
    setPendingChanges,
    setIsPriceExpired,
    setAllowedPriceAdjustments,
    clearOrder,
    promptInstruments,
    selectedMarketInstrumentId,
    setSelectedMarketInstrumentId,
    isInternalUser,
    marketClosed,
    allowedPriceAdjustments,
    setCurrentFromDate,
    setCurrentToDate,
    creditData,
  } = usePromptContext()

  useEffect(() => {
    if (tasMode) {
      form.setFieldsValue({ Type: 'market' })
    }
  }, [tasMode])

  useEffect(() => {
    form.setFieldsValue({ ...selectedItemMeta })
  }, [selectedItemMeta])

  const showConfirm = (event) => {
    confirm({
      title: 'Are you sure you want to navigate away?',
      icon: <ExclamationCircleOutlined />,
      content: 'There are unsaved changes. If you navigate away, you will lose any unsaved changes.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        setAllowedPriceAdjustments([])
        setCreatingOrder(false)
        clearOrder()
        form.resetFields()
        setPendingChanges(false)
        clearOrder()
        setSelectedItem(null)
        setCurrentFromDate(null)
        setCurrentToDate(null)
      },
      onCancel() {
        event.stopPropagation()
      },
    })
  }

  const columnDefs = useMemo(() => {
    return getColumnDefs({ tasMode, setCreatingOrder, setSelectedItem, canWrite, creditData })
  }, [selectedItemMeta, isInternalUser, tasMode, setCreatingOrder, setSelectedItem, canWrite, orderItems, creditData])

  useEffect(() => {
    if (promptInstruments?.length > 0 && selectedMarketInstrumentId == null) {
      setSelectedMarketInstrumentId(promptInstruments[0].MarketPlatformInstrumentId)
    }
  }, [promptInstruments])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data?.TradeEntrySetupId.toString(),
      groupDefaultExpanded: 2,
      groupRowInnerRenderer: (params) => <Texto weight='bold'>{params.value}</Texto>,
      suppressCellSelection: true,
      rowSelection: undefined,
      enableRangeSelection: false,
      overlayNoRowsTemplate: marketClosed
        ? `<div class="custom-no-rows-message">The market is currently closed</div>`
        : undefined,
    }),
    [marketClosed]
  )
  const parseAsWallClock = (value: string | Dayjs | Date | null | undefined) => {
    if (value == null) return null
    return dayjs(typeof value === 'string' ? stripTimezoneOffset(value) : value)
  }

  const setDateTimeOverrideToLiftingDaysSelection = (priceAdjustmentId: number) => {
    const promptDefaultDates = selectedItemMeta?.PromptDefaultDates

    const defaultStart = parseAsWallClock(promptDefaultDates?.DefaultStartDate)
    const defaultEnd = parseAsWallClock(promptDefaultDates?.DefaultEndDate)
    const referenceStart = parseAsWallClock(promptDefaultDates?.ReferenceStart)
    const dateOverrideMaxDate = parseAsWallClock(selectedItemMeta?.DateOverrideMaxDate)

    const startTime = defaultStart && defaultStart.isAfter(dayjs()) ? defaultStart : dayjs()
    setCurrentFromDate(startTime)

    const splitOffset = promptDefaultDates?.TimeOffset?.split(':')
    const duration = allowedPriceAdjustments.find((item) => item.key === priceAdjustmentId)?.Duration ?? 0
    const marketEndTime: Dayjs | null = !priceAdjustmentId
      ? defaultEnd
      : referenceStart
          ? referenceStart
              .add(duration, 'days')
              .add(Number(splitOffset?.[0] ?? 0), 'hours')
              .add(Number(splitOffset?.[1] ?? 0), 'minutes')
              .add(Number(splitOffset?.[2] ?? 0), 'seconds')
          : null

    const bidEndTime = defaultEnd

    const endTime: Dayjs | null = form.getFieldValue('Type') === 'bid' ? bidEndTime : marketEndTime

    const dateOverrideDisabled = selectedItemMeta?.ShowDateOverrideFields
    const endDateWithinMaximum = endTime && dateOverrideMaxDate
      ? endTime.isSameOrBefore(dateOverrideMaxDate)
      : true

    if (!dateOverrideDisabled || endDateWithinMaximum) {
      setCurrentToDate(endTime)
    } else {
      setCurrentToDate(dateOverrideMaxDate)
    }
  }

  const checkAndSetValues = (changedValue) => {
    if (changedValue.PriceAdjustmentId) {
      setDateTimeOverrideToLiftingDaysSelection(changedValue.PriceAdjustmentId)
      return
    }
    const minDate = parseAsWallClock(selectedItemMeta?.DateOverrideMinDate)
    const startTime = minDate && minDate.isSameOrAfter(dayjs().add(1, 'minute'))
      ? minDate
      : dayjs().add(1, 'minute')

    const endTime = selectedItemMeta?.ShowDateOverrideFields
      ? parseAsWallClock(selectedItemMeta?.DateOverrideMaxDate)
      : parseAsWallClock(selectedItemMeta?.PromptDefaultDates?.DefaultEndDate)

    if (changedValue.Type === 'market') {
      const adjustment = form.getFieldValue('PriceAdjustmentId')
      if (adjustment) {
        setDateTimeOverrideToLiftingDaysSelection(adjustment)
      } else {
        setCurrentFromDate(parseAsWallClock(selectedItemMeta?.PromptDefaultDates?.DefaultStartDate) ?? startTime)
        // Mirror setupCurrentDates: null prompts the user to pick a lifting day; otherwise restore the prompt's default end.
        setCurrentToDate(
          selectedItemMeta?.PriceAdjustments?.length
            ? null
            : parseAsWallClock(selectedItemMeta?.PromptDefaultDates?.DefaultEndDate)
        )
      }
    }
    if (changedValue.Type === 'bid') {
      setCurrentFromDate(startTime)
      setCurrentToDate(endTime)
    }
    if (changedValue.OverrideOrderDateTime) {
      form.setFields([
        {
          name: 'PriceAdjustmentId',
          errors: [],
        },
      ])
    }
  }

  const controlBarProps = useMemo(
    () => ({
      hideActiveFilters: false,
      title: 'Buy Prompts',
      actionButtons: (
        <Horizontal className={'grid-action-buttons'}>
          <GridActionButtons />
          <CreditBalanceBanner creditData={creditData} />
        </Horizontal>
      ),
    }),
    [creditData]
  )

  return (
    <>
      <Drawer
        title={
          <div className='flex justify-sb'>
            <Texto category='h6'>Create New Order</Texto>
          </div>
        }
        placement='right'
        width={600}
        destroyOnHidden
        onClose={(event) => {
          if (pendingChanges) {
            showConfirm(event)
          } else {
            setCreatingOrder(!creatingOrder)
            setSelectedItem(null)
            setAllowedPriceAdjustments([])
            setPendingChanges(false)
            form.resetFields()
          }
        }}
        open={creatingOrder}
        className='buy-now-drawer'
      >
        <Vertical style={{ width: '100%', margin: 0 }}>
          <Form
            name='tradeForm'
            form={form}
            onFieldsChange={setPendingChanges}
            onValuesChange={checkAndSetValues}
            onFinish={(formValues) => {
              setOrderStep('confirm')
            }}
            style={{ minHeight: '100%' }}
            scrollToFirstError
          >
            <OrderDetailPane
              form={form}
              setCreatingOrder={setCreatingOrder}
              setDateTimeOverrideToLiftingDaysSelection={setDateTimeOverrideToLiftingDaysSelection}
            />
          </Form>
        </Vertical>
      </Drawer>
      <Tabs
        defaultActiveKey={selectedMarketInstrumentId?.toString()}
        activeKey={selectedMarketInstrumentId?.toString()}
        tabBarStyle={{ backgroundColor: 'white', paddingLeft: '10px' }}
        onChange={setSelectedMarketInstrumentId}
        items={promptInstruments?.map((tab) => ({
          key: tab?.MarketPlatformInstrumentId?.toString(),
          label: <span>{tab.Name}</span>,
          style: { height: 'auto' },
          children: (
            <Vertical height='88vh' className={'grid-wrap'}>
              <CreditStatusBanner creditData={creditData} />
              <GraviGrid
                enableFilterContextMenu
                externalRef={gridAPIRef}
                controlBarProps={controlBarProps}
                columnDefs={columnDefs}
                agPropOverrides={agPropOverrides}
                storageKey={storageKey}
                gridViewManager={gridViewManager}
                rowData={orderItems || []}
                loading={loading || pricesRefreshing}
              />
            </Vertical>
          ),
        }))}
      />
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
    </>
  )
}
