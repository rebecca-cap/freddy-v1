import { AlignLeftOutlined, ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { Footer } from '@components/shared/Navigation/Footer/Footer'
import { useContractManagementContext } from '@contexts/ContractManagement'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Detail } from '@modules/ContractManagement/api/types.schema'
import { checkDetailForOverlappingPriceDates } from '@modules/ContractManagement/utils'
import { Form, message, Modal, notification } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'

import { DetailForm } from './DetailForm'
import { ProvisionManager } from './PriceManagement/ProvisionManager/ProvisionManager'
import { QuantityManager } from './QuantityManager/QuantityManager'

export function DetailManager() {
  const {
    details,
    activeTabId,
    metadata,
    saveDetail,
    setHasContractEdits,
    setHasDetailEdits,
    hasDetailEdits,
    openBlankDetail,
    setActiveTabId,
    closeTab,
    canWrite,
    header,
  } = useContractManagementContext()
  const showQuantity = useMemo(
    () => header.ContractManagementRequiresQuantities || header.ContractManagementRequiresQuantities === null,
    [header]
  )
  const [form] = Form.useForm()
  const { confirm } = Modal

  const [managedDetail, setManagedDetail] = useState<Detail>(null)
  const [dateDiffs, setDateDiffs] = useState<number[]>([0, 0])
  useEffect(() => {
    if (!activeTabId || activeTabId === '0') {
      if (hasDetailEdits) {
        showConfirm()
      } else {
        setManagedDetail(blankDetail(header))
      }
    } else if (metadata) {
      const selectedDetail = details.find((detail) => detail?.LocalTradeEntryDetailId === activeTabId)
      if (selectedDetail) {
        setManagedDetail(_.cloneDeep(selectedDetail))
      } else {
        const duplicateId = activeTabId.split('/')?.[1]
        const detailToDuplicate = details.find((detail) => detail.LocalTradeEntryDetailId === duplicateId)
        const detail = _.cloneDeep(detailToDuplicate)
        const newDetail = {
          ...detail,
          LocalTradeEntryDetailId: crypto.randomUUID(),
          isOpen: true,
          TradeEntryDetailId: '',
        }
        setManagedDetail((prev) => newDetail)
      }
    }
  }, [activeTabId, openBlankDetail])

  useEffect(() => {
    if (managedDetail) {
      form.setFieldsValue({ ...managedDetail })
    }
  }, [managedDetail])
  const showConfirm = () => {
    confirm({
      title: 'Are you sure you want to navigate away?',
      icon: <ExclamationCircleOutlined />,
      content: 'There are unsaved changes. If you navigate away, you will lose any unsaved changes.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setHasDetailEdits(false)
        setManagedDetail(blankDetail(header) as any)
        setActiveTabId('0')
        if (activeTabId) {
          closeTab(activeTabId)
        }
      },
    })
  }

  const onValuesChange = (changedValues) => {
    if (changedValues.EffectiveDates) {
      if (!moment(changedValues.EffectiveDates[0]).isSame(moment(managedDetail.FromDateTime))) {
        const diffStart = moment(changedValues.EffectiveDates[0]).diff(moment(managedDetail?.FromDateTime), 'days')
        setDateDiffs((diffs) => [diffStart, diffs[1]])
        setManagedDetail((prev) => ({
          ...prev,
          FromDateTime: changedValues.EffectiveDates[0],
          EffectiveDates: [changedValues.EffectiveDates[0], managedDetail.EffectiveDates[1]],
        }))
      } else if (!moment(changedValues.EffectiveDates[1]).isSame(moment(managedDetail.ToDateTime))) {
        const diffEnd = moment(changedValues.EffectiveDates[1]).diff(moment(managedDetail?.ToDateTime), 'days')
        setDateDiffs((diffs) => [diffs[0], diffEnd])
        setManagedDetail((prev) => ({
          ...prev,
          ToDateTime: changedValues.EffectiveDates[1],
          EffectiveDates: [managedDetail.EffectiveDates[0], changedValues.EffectiveDates[1]],
        }))
      }
    }
  }

  if (!managedDetail) {
    return (
      <Vertical verticalCenter flex={1} horizontalCenter>
        <Texto category='h3' appearance='secondary'>
          <LoadingOutlined />
        </Texto>
      </Vertical>
    )
  }

  return (
    <Form
      form={form}
      style={{ flex: 1 }}
      onFinish={(formData) => {
        const detailToSave = { ...managedDetail, ...formData }
        isNaN(detailToSave.Quantity) ? (detailToSave.Quantity = null) : detailToSave.Quantity
        if (validateDetail(detailToSave, header).length > 0) {
          return
        }
        saveDetail(detailToSave)
        setHasContractEdits(true)
        message.open({
          type: 'success',
          content: `Detail (${detailToSave.ToLocationName} - ${detailToSave.ProductName}) Information Successfully Saved`,
        })
        setActiveTabId('0')
      }}
      onFieldsChange={() => setHasDetailEdits(true)}
      onValuesChange={onValuesChange}
    >
      <Vertical flex='1' style={{ background: 'var(--gray-100)' }}>
        <DetailForm
          managedDetail={managedDetail}
          setManagedDetail={setManagedDetail}
          key={activeTabId}
          form={form}
          dateDiffs={dateDiffs}
        />
        <ProvisionManager managedDetail={managedDetail} setManagedDetail={setManagedDetail} />

        <QuantityManager
          managedDetail={managedDetail}
          setManagedDetail={setManagedDetail}
          metadata={metadata}
          form={form}
          setHasDetailEdits={setHasDetailEdits}
          showQuantity={showQuantity}
        />

        <Horizontal flex='none' height='auto'>
          <Footer
            title='Manage Detail'
            icon={<AlignLeftOutlined />}
            buttonTitle='Save Detail'
            onClick={() => {
              form.submit()
            }}
            canWrite={canWrite}
            onClickCancel={() => {
              if (hasDetailEdits) {
                showConfirm()
              } else {
                setActiveTabId('0')
                if (activeTabId) {
                  closeTab(activeTabId)
                }
              }
            }}
          />
        </Horizontal>
      </Vertical>
    </Form>
  )
}

const validateDetail = (detail, header) => {
  const errors: string[] = []
  const detailContainsOverlappingDates = checkDetailForOverlappingPriceDates(detail)

  if (detailContainsOverlappingDates) {
    errors.push('Detail prices cannot contain overlapping effective dates')
  }

  if (
    !detail.Quantity &&
    detail.Quantity !== 0 &&
    (header.ContractManagementRequiresQuantities === true || header.ContractManagementRequiresQuantities === null)
  ) {
    errors.push('Quantity is required')
  }
  if (detail.Prices.some((price) => price.Status !== 'Valid')) {
    if (detail.Prices.some((price) => price.Status === 'Invalid Volume Basis')) {
      errors.push('Volume basis does not match Net/Gross rule')
    } else {
      errors.push('There are invalid prices')
    }
  }
  if (detail.Prices.length === 0) {
    errors.push('At least one price is required.')
  }
  errors.forEach((error) => {
    notification.error({
      message: 'Validation Errors',
      description: error,
      duration: 30,
    })
  })

  return errors
}

const blankDetail = (header) => ({
  Label: null,
  FrequencyCodeValueDisplay: 'Per Month',
  FrequencyCvId: 2201,
  FromDateTime: header?.EffectiveDates[0] || moment(),
  Prices: [],
  ToDateTime: header?.EffectiveDates[1] || moment(),
  EffectiveDates: [...header.EffectiveDates],
  TradeEntryDetailId: '',
  LocalTradeEntryDetailId: crypto.randomUUID(),
  isOpen: true,
  Quantities: [],
  Status: 'In Progress',
  ValuationCalendarId: header?.ValuationCalendarId?.toString() || null,
})
