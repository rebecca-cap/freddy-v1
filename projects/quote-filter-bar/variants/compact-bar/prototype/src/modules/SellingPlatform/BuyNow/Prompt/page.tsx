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
import moment from 'moment'
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
  const canWrite = !!userPermissions?.OnlineOrder?.Write

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
    return getColumnDefs(tasMode, setCreatingOrder, setSelectedItem, canWrite, creditData)
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
  const setDateTimeOverrideToLiftingDaysSelection = (priceAdjustmentId: number) => {
    const promptDefaultDates = selectedItemMeta?.PromptDefaultDates

    const startTime = moment(promptDefaultDates?.DefaultStartDate).isAfter(moment())
      ? moment(promptDefaultDates?.DefaultStartDate)
      : moment()
    setCurrentFromDate(startTime)

    const splitOffset = promptDefaultDates?.TimeOffset?.split(':')
    const marketEndTime = !priceAdjustmentId
      ? moment(promptDefaultDates?.DefaultEndDate)
      : moment(promptDefaultDates?.ReferenceStart)
          .add(allowedPriceAdjustments.find((item) => item.key === priceAdjustmentId)?.Duration, 'days')
          .add(splitOffset?.[0], 'hours')
          .add(splitOffset?.[1], 'minutes')
          .add(splitOffset?.[2], 'seconds')
          .add(splitOffset?.[3], 'milliseconds')

    const bidEndTime = moment(selectedItemMeta?.PromptDefaultDates?.DefaultEndDate)

    const endTime = form.getFieldValue('Type') === 'bid' ? bidEndTime : marketEndTime

    const dateOverrideDisabled = selectedItemMeta?.ShowDateOverrideFields
    const endDateWithinMaximum = moment(endTime).isSameOrBefore(moment(selectedItemMeta?.DateOverrideMaxDate))

    if (!dateOverrideDisabled || endDateWithinMaximum) {
      setCurrentToDate(endTime)
    } else {
      setCurrentToDate(moment(selectedItemMeta?.DateOverrideMaxDate))
    }
  }

  const checkAndSetValues = (changedValue) => {
    if (changedValue.PriceAdjustmentId) {
      setDateTimeOverrideToLiftingDaysSelection(changedValue.PriceAdjustmentId)
      return
    }
    const startTime = moment(selectedItemMeta?.DateOverrideMinDate).isSameOrAfter(moment().add(1, 'minute'))
      ? moment(selectedItemMeta?.DateOverrideMinDate)
      : moment().add(1, 'minute')

    const endTime = selectedItemMeta?.ShowDateOverrideFields
      ? moment(selectedItemMeta?.DateOverrideMaxDate)
      : moment(selectedItemMeta?.PromptDefaultDates?.DefaultEndDate)

    if (changedValue.Type === 'market') {
      const adjustment = form.getFieldValue('PriceAdjustmentId')
      if (adjustment) {
        setDateTimeOverrideToLiftingDaysSelection(adjustment)
      } else {
        setCurrentFromDate(startTime)
        setCurrentToDate(null)
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
        destroyOnClose
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
        visible={creatingOrder}
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
        tabBarStyle={{ backgroundColor: 'white' }}
        onChange={setSelectedMarketInstrumentId}
      >
        {promptInstruments?.map((tab) => (
          <Tabs.TabPane
            tab={<span>{tab.Name}</span>}
            key={tab?.MarketPlatformInstrumentId?.toString()}
            style={{ height: 'auto' }}
          >
            <Vertical height='88vh' className={'grid-wrap'}>
              <CreditStatusBanner creditData={creditData} />
              <GraviGrid
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
          </Tabs.TabPane>
        ))}
      </Tabs>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
    </>
  )
}
