import { BarChartOutlined } from '@ant-design/icons'
import { useDeliveryPeriods } from '@api/useDeliveryPeriods'
import { DateEditor } from '@components/shared/Grid/cellEditors'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { useUser } from '@contexts/UserContext'
import { GraviButton, GraviGrid, Horizontal, NotificationMessage, RangePicker, Vertical } from '@gravitate-js/excalibrr'
import { newDeliveryPeriodConfig } from '@modules/Admin/ManageDeliveryPeriods/createConfig'
import { Drawer, Tabs } from 'antd'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'

import { getColumnDefs } from './columnDefs'
import { ManagePeriodGroupsDrawer } from './ManageDeliveryPeriodGroupsDrawer'

export function ManageDeliveryPeriods() {
  const gridAPIRef = useRef()

  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.DeliveryPeriod?.Write

  const [tab, setTab] = useState('0')
  const [showDrawer, setShowDrawer] = useState(false)

  const startDate = new Date()
  const endDate = moment().add('1', 'year').toDate()
  const [filterDates, setFilterDates] = useState([startDate, endDate])
  const [marketPlatformInstrument, setMarketPlatformInstrument] = useState(null)
  const [deliveryPeriodGroups, setDeliveryPeriodGroups] = useState([])

  const {
    useMetadataQuery,
    useDeliveryPeriodsQuery,
    createUpdateDeliveryPeriodMutation,
    createDeliveryPeriodGroupMutation,
  } = useDeliveryPeriods()

  const createDeliverPeriod = createDeliveryPeriodGroupMutation()
  const { data: metadata } = useMetadataQuery()
  const { data: deliveryPeriods, isLoading } = useDeliveryPeriodsQuery(filterDates[0], filterDates[1], tab)

  const marketPlatformInstrumentList = metadata?.MarketPlatformInstrumentList

  useEffect(() => {
    if (marketPlatformInstrumentList) {
      setTab(marketPlatformInstrumentList[0]?.Value)
      setMarketPlatformInstrument(marketPlatformInstrumentList[0])

      const groups = metadata?.DeliveryPeriodGroupList?.filter(
        (g) => g.GroupingValue === marketPlatformInstrumentList[0]?.Value
      )
      setDeliveryPeriodGroups(groups)
    }
  }, [marketPlatformInstrumentList])

  useEffect(() => {
    const mpi = marketPlatformInstrumentList?.find((mpi) => mpi.Value.toString() === tab)
    setMarketPlatformInstrument(mpi)

    const groups = metadata?.DeliveryPeriodGroupList?.filter((g) => g.GroupingValue === mpi?.Value)
    setDeliveryPeriodGroups(groups)
  }, [tab, metadata])

  const handleSaveChanges = async (row) => {
    const response = await createUpdateDeliveryPeriodMutation.mutateAsync([row])
    if (response.Validations.length) {
      response.Validations.forEach((validation) => {
        NotificationMessage(validation.Category, validation.Message, true)
      })
    }
  }

  const handleCreate = async (formDeliveryPeriodValues) => {
    const DeliveryPeriodGroupId = deliveryPeriodGroups?.find(
      (g) => g.Text === formDeliveryPeriodValues.DeliveryPeriodGroup
    )?.Value

    const { DeliveryPeriodGroup, ...formValues } = formDeliveryPeriodValues

    const newDeliveryPeriod = {
      ...formValues,
      DeliveryPeriodGroupId,
      MarketPlatformInstrumentId: marketPlatformInstrument?.Value,
      IsActive: formDeliveryPeriodValues.IsActive === 'Active',
    }
    const response = await createUpdateDeliveryPeriodMutation.mutateAsync([newDeliveryPeriod])
    if (response.Validations.length) {
      response.Validations.forEach((validation) => {
        NotificationMessage(validation.Category, validation.Message, true)
      })
    }
  }

  return (
    <Horizontal className='m-4'>
      <Tabs defaultActiveKey={tab.toString()} style={{ minWidth: '100%' }} onChange={setTab}>
        {marketPlatformInstrumentList?.map((instrument) => {
          return (
            <Tabs.TabPane
              tab={
                <span>
                  <BarChartOutlined /> {instrument.Text}
                </span>
              }
              key={instrument.Value}
            >
              <Vertical className='bg-2' style={{ height: 800 }}>
                <Drawer
                  title='Manage Delivery Period Groups'
                  placement='right'
                  width='500'
                  closable
                  onClose={() => setShowDrawer(false)}
                  visible={showDrawer}
                  className='supply-zone-drawer'
                  destroyOnClose
                >
                  <ManagePeriodGroupsDrawer
                    periodGroups={deliveryPeriodGroups}
                    MarketPlatformInstrumentId={marketPlatformInstrument?.Value}
                    updateEP={createDeliverPeriod}
                  />
                </Drawer>
                <GraviGrid
                  controlBarProps={{
                    title: 'Delivery Periods',
                    actionButtons: (
                      <Horizontal className='mx-1' style={{ gap: 10 }} verticalCenter>
                        <RangePicker
                          inputKey='Dates'
                          dates={filterDates}
                          onChange={setFilterDates}
                          placement='bottomRight'
                        />
                        {marketPlatformInstrument?.HasDeliveryPeriodGroups && canWrite && (
                          <GraviButton
                            className='mr-3'
                            buttonText='Manage Delivery Period Groups'
                            onClick={() => setShowDrawer(!showDrawer)}
                            style={{ whiteSpace: 'normal', height: 'auto' }}
                          />
                        )}
                      </Horizontal>
                    ),
                  }}
                  agPropOverrides={{
                    getRowId: (row) => row.data?.ConfigurationId,
                    frameworkComponents: { SearchableSelect, DateEditor },
                  }}
                  externalRef={gridAPIRef}
                  storageKey='MarketPlatform/DeliveryPeriods'
                  rowData={deliveryPeriods?.Data}
                  loading={isLoading}
                  updateEP={canWrite && handleSaveChanges}
                  columnDefs={getColumnDefs(marketPlatformInstrument, deliveryPeriodGroups, canWrite)}
                  createConfig={canWrite ? newDeliveryPeriodConfig : undefined}
                  createSelectOptions={{ deliveryPeriodGroups, marketPlatformInstrument }}
                  createEP={canWrite && handleCreate}
                />
              </Vertical>
            </Tabs.TabPane>
          )
        })}
      </Tabs>
    </Horizontal>
  )
}
