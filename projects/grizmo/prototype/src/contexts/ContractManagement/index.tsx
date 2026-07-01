import { WarningFilled } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { useUser } from '@contexts/UserContext'
import { NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useNavigationBlock } from '@hooks/useNavigationBlock'
import { ContractDetails, ContractManagementMetadata, Detail } from '@modules/ContractManagement/api/types.schema'
import { endpoints, useContracts } from '@modules/ContractManagement/api/useContracts'
import { ValuationData } from '@modules/ContractManagement/components/DetailsView/api/types.schema'
import { useContractDetailValuation } from '@modules/ContractManagement/components/DetailsView/api/useContractDetailValuation'
import { groupInList, ProvisionTypes } from '@modules/ContractManagement/utils'
import { useQueryClient } from '@tanstack/react-query'
import { message, notification } from 'antd'
import type { FormInstance } from 'antd/lib/form/Form'
import { useForm } from 'antd/lib/form/Form'
import _ from 'lodash'
import moment, { Moment } from 'moment'
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

type PageMode = 'header' | 'details'

type ContractManagement = {
  isSubmitting: boolean
  form: [FormInstance<any>]
  contract: ContractDetails
  details: Detail[]
  metadata: ContractManagementMetadata
  contractId: string
  initializeCreate: () => void
  pageMode: PageMode
  activeTabId?: string
  setPageMode: (mode: PageMode) => void
  setContractType: (type: string) => void
  openTab: (x: ContractDetails['Details'][number], e?) => void
  newTab: () => void
  closeTab: (x: string) => void
  deleteDetail: (x: ContractDetails['Details'][number]) => void
  deleteDetails: (x: ContractDetails['Details']) => void
  duplicateDetails: (x: ContractDetails['Details']) => void
  setActiveTabId: React.Dispatch<React.SetStateAction<string>>
  hasDetailEdits: boolean
  setHasDetailEdits: React.Dispatch<React.SetStateAction<boolean>>
  setHasContractEdits: React.Dispatch<React.SetStateAction<boolean>>
  hasContractEdits: boolean
  saveContract: (makeActive?: boolean) => Promise<void>
  valuationData: ValuationData[]
  retrieveValuationData: (id?: string | number) => void
  refetchValuation: (id: string | number) => void
  detailValuationStatus: string
  isRefetchingDetailValuation: boolean
  isFetchingContractValuation: boolean
  detailValuationPayload: number[]
  isFetchingDetailValuation: boolean
  isMakingActive: boolean
  openBlankDetail: boolean
  setOpenBlankDetail: React.Dispatch<React.SetStateAction<boolean>>
  saveDetail: (detail: any) => void
  saveHeader: (header: any) => void
  disableFields: boolean
  canWrite: boolean
  header: ContractDetails
  isLoadingContract: boolean
  isDraftModalVisible: boolean
  setDraftModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  getUpdatedQuantities: (
    oldDetail: ContractDetails['Details'][number],
    newEffectiveDates: [moment.Moment, moment.Moment]
  ) => ContractDetails['Details'][number]['Quantities']
}

const ContractManagementContext = createContext<ContractManagement | object>({})

export const ContractManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userPermissions } = useUser()
  const [pageMode, setPageMode] = useState<PageMode>()
  const [header, setHeader] = useState<ContractDetails>()
  const [activeTabId, setActiveTabId] = useState<string>('0')
  const [details, setDetails] = useState<Detail[]>([])
  const [hasDetailEdits, setHasDetailEdits] = useState<boolean>(false)
  const [hasContractEdits, setHasContractEdits] = useState<boolean>(false)
  const [isDraftModalVisible, setDraftModalVisible] = useState(false)
  const [openBlankDetail, setOpenBlankDetail] = useState(false)
  const navigate = useNavigate()
  const form = useForm()
  const [isLoadingContract, setIsLoadingContract] = useState(true)
  const { useALLContractManagementData } = useContracts()
  const { data: metadata } = useALLContractManagementData()
  const queryClient = useQueryClient()
  const { contractId } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMakingActive, setIsMakingActive] = useState(false)

  const location = useLocation()
  const queryType = location.state
  const { useContractDetails, submitContract } = useContracts()
  const { data: contract, isLoading: contractFetching } = useContractDetails(contractId, queryType)

  const canWrite = !!userPermissions?.ContractManagement?.Write && !contract?.IsExtracted
  const [detailValuationPayload, setDetailValuationPayload] = useState<number[]>([])
  const [contractValuationPayload, setContractValuationPayload] = useState<number | string>()
  const { getContractDetailValuation, getContractValuation } = useContractDetailValuation()
  const {
    data: contractValuationData,
    isFetching: isFetchingContractValuation,
    refetch: refetchContractValuation,
  } = getContractValuation(contractValuationPayload)
  const {
    data: contractDetailValuationData,
    refetch: refetchContractDetailValuation,
    isFetching: isFetchingDetailValuation,
  } = getContractDetailValuation(detailValuationPayload)

  const [valuationData, setValuationData] = useState<ValuationData[]>([])

  function refetchValuation(detailId?: number) {
    if (!detailId || hasDetailEdits) return
    if (detailValuationPayload?.length === 1 && detailId === detailValuationPayload?.[0]) {
      refetchContractDetailValuation().then((res) => {
        if (res?.data?.Data?.length > 0) {
          setValuationData((previous) => {
            return previous.map((item) => (item.TradeEntryPriceId === detailId ? res?.data?.Data?.[0] : item))
          })
        }
      })
      return
    }
    setDetailValuationPayload([detailId])
  }
  let lastCalled = 0
  function retrieveValuationData(detailId?: number) {
    const now = new Date().getTime()
    if (!detailId || now - lastCalled < 2) {
      if (contractValuationPayload === contractId) {
        refetchContractValuation().then()
      } else {
        setContractValuationPayload(contractId)
        return
      }
    }
    const detailValuationData = valuationData?.find((item) => item?.TradeEntryPriceId === detailId)
    if (!detailValuationData) {
      lastCalled = new Date().getTime()
      setDetailValuationPayload([detailId])
    }
  }
  useEffect(() => {
    if (contractValuationData?.Data?.length > 0) {
      setValuationData(contractValuationData.Data)
    }
  }, [contractValuationData])

  function checkAndSetValuationData() {
    if (!valuationData.length) setValuationData(contractDetailValuationData.Data)
    contractDetailValuationData.Data.forEach((valuationDetail) => {
      setValuationData((previous) => {
        const presentInList = previous.some((item) => item.TradeEntryPriceId === valuationDetail.TradeEntryPriceId)
        if (presentInList) {
          return previous.map((item) =>
            item.TradeEntryPriceId === valuationDetail.TradeEntryPriceId ? valuationDetail : item
          )
        }
        return [...previous, valuationDetail]
      })
    })
  }
  useEffect(() => {
    if (contractDetailValuationData?.Data?.length > 0) {
      checkAndSetValuationData()
    }
  }, [contractDetailValuationData])

  const removeKeyFromStorage = () => {
    const urlFragments = location.pathname.split('/')
    const lastPageKey = urlFragments[1]
    localStorage.removeItem(`last_${lastPageKey}_page`)
  }
  useNavigationBlock({
    blockCondition: (hasContractEdits || hasDetailEdits) && canWrite,
    modalTitle: 'Contract has unsaved changes.',
    modalContent: 'If you leave this page, you will lose any unsaved changes. Are you sure?',
    beforeProceed: async (blocker) => {
      // Reset edit state to prevent the blocker from re-triggering during route transition
      setHasContractEdits(false)
      setHasDetailEdits(false)
      // Because of how stupid our URL caching is, we need to temporarily remove the last page key (the contract id)
      // before we can navigate away. Otherwise, the hook gets stuck in a loop, and the user can't navigate away using
      // the back button in the browser. After navigating, excalibrr will automatically add the key page as if nothing happened.
      removeKeyFromStorage()
    },
  })

  useEffect(() => {
    setTimeout(() => {
      removeKeyFromStorage()
    }, 100)
  }, [])

  useEffect(() => {
    if (contractFetching) {
      setIsLoadingContract(true)
    }
  }, [contractFetching])

  useEffect(() => {
    // If we're in create mode, we don't need to fetch the contract
    if (contractId === 'createContract') {
      initializeCreate()
    }
  }, [contractId])

  useEffect(() => {
    if (contract && metadata && metadata?.TradeInstrumentList) {
      const selectedInstrument = metadata?.TradeInstrumentList.find(
        (item) => item.Value === contract?.TradeInstrumentId.toString()
      )
      setHeader({ ...contract, TradeEntryTypeCvId: parseInt(selectedInstrument?.GroupingValue || '') })
      setDetails(contract.Details.map((detail) => fixDetails(detail, metadata)))
      setPageMode('details')
      setIsLoadingContract(false)
      if (queryType?.queryType === 'duplicate') {
        setHasContractEdits(true)
      }
    }
  }, [contract, metadata])

  const disableFields = useMemo(() => {
    return contract?.TradeEntryId && contract.OrderStatusCodeValueDisplay !== 'Draft'
  }, [contract])

  const initializeCreate = () => {
    setPageMode('header')
    setIsLoadingContract(false)
  }

  function getUpdatedQuantities(
    oldDetail: ContractDetails['Details'][number],
    newEffectiveDates: [moment.Moment, moment.Moment]
  ) {
    const startDate = moment(newEffectiveDates[0])
    const endDate = moment(newEffectiveDates[1])
    const months: string[] = []
    const currentDate = startDate.clone().startOf('month')

    // Generate month strings for the date range
    while (currentDate.isBefore(endDate)) {
      const monthString = currentDate.format()
      if (!months.includes(monthString)) {
        months.push(monthString)
      }
      currentDate.add(1, 'month')
    }

    // If we have existing quantities, try to preserve the individual monthly values
    const existingQuantities = oldDetail.Quantities?.filter((q) => q.IsActive) || []

    if (existingQuantities.length > 0) {
      // Calculate the average quantity per month from existing data
      const avgQuantityPerMonth =
        existingQuantities.length > 0
          ? existingQuantities.reduce((sum, q) => sum + q.Quantity, 0) / existingQuantities.length
          : 1

      // Create new quantities preserving the per-month amount
      const monthlyQuantities = months.map((month) => ({
        IsActive: true,
        Quantity: Math.round(avgQuantityPerMonth), // Preserve the individual monthly quantity
        QuantityDateTime: month,
        TradeEntryQuantityId: null,
      }))

      return monthlyQuantities
    }

    // Fallback: If no existing quantities, distribute based on frequency type
    const isMonthlyDistribution = oldDetail.FrequencyCodeValueDisplay === 'Per Month'
    const totalQuantity = oldDetail.Quantity || 0

    if (isMonthlyDistribution) {
      // For "Per Month", each month should get the same amount (total stays as entered)
      const perMonthQuantity = totalQuantity
      return months.map((month) => ({
        IsActive: true,
        Quantity: perMonthQuantity,
        QuantityDateTime: month,
        TradeEntryQuantityId: null,
      }))
    } else {
      // For "Per Contract", distribute total across months
      const perMonthQuantity = Math.floor(totalQuantity / months.length)
      const monthlyQuantities = months.map((month) => ({
        IsActive: true,
        Quantity: perMonthQuantity,
        QuantityDateTime: month,
        TradeEntryQuantityId: null,
      }))

      // Distribute any remainder evenly across months
      const floorSum = monthlyQuantities.map((item) => item.Quantity).reduce((a, b) => a + b, 0)
      let differenceToDistribute = totalQuantity - floorSum

      while (differenceToDistribute > 0) {
        const q = monthlyQuantities[differenceToDistribute % monthlyQuantities.length]
        if (!q) break
        q.Quantity += 1
        differenceToDistribute -= 1
      }

      return monthlyQuantities
    }
  }

  function checkAndSetEffectiveDates(formData) {
    const effectiveDates = formData.EffectiveDates
    if (formData?.CascadeHeaderDatesToPrices && formData.detailsWithUpdatedDates) {
      setDetails(formData.detailsWithUpdatedDates)
    } else if (formData?.CascadeHeaderDatesToDetails) {
      setDetails((prevDetails) =>
        prevDetails.map((detail) => ({
          ...detail,
          ToDateTime: effectiveDates[1],
          FromDateTime: effectiveDates[0],
          EffectiveDates: [effectiveDates[0], effectiveDates[1]],
          Quantities: getUpdatedQuantities(detail, effectiveDates),
        }))
      )
    }
  }

  const saveHeader = (formData) => {
    const ExternalColleagueFirstName = metadata?.ExternalColleagueList.find(
      (c) => c.Value === formData.ExternalColleagueId
    )?.Text.split(' ')[0]
    const ExternalColleagueLastName = metadata?.ExternalColleagueList.find(
      (c) => c.Value === formData.ExternalColleagueId
    )?.Text.split(' ')[1]
    const ExternalCounterPartyName = metadata?.ExternalCounterPartyList.find(
      (c) => c.Value === formData.ExternalCounterPartyId
    )?.Text
    const InternalColleagueFirstName = metadata?.InternalColleagueList.find(
      (c) => c.Value === formData.InternalColleagueId
    )?.Text.split(' ')[0]
    const InternalColleagueLastName = metadata?.InternalColleagueList.find(
      (c) => c.Value === formData.InternalColleagueId
    )?.Text.split(' ')[1]
    const InternalCounterPartyName = metadata?.InternalCounterPartyList.find(
      (c) => c.Value === formData.InternalCounterPartyId
    )?.Text
    const TradeInstrumentName = metadata?.TradeInstrumentList.find(
      (c) => c.Value === formData.TradeInstrumentId?.toString()
    )?.Text

    checkAndSetEffectiveDates(formData)
    setHeader((prevHeader) => {
      return {
        ...prevHeader,
        ...formData,
        ExternalColleagueFirstName,
        ExternalColleagueLastName,
        ExternalCounterPartyName,
        InternalColleagueFirstName,
        InternalColleagueLastName,
        InternalCounterPartyName,
        TradeInstrumentName,
      }
    })
  }
  const fixDetails = (detail, metadata) => {
    // Setting a local trade entry detail id to existing id or new if there isn't any, we will use this instead. If sent to BE, they will ignore
    const LocalTradeEntryDetailId =
      detail.TradeEntryDetailId === 0 ? crypto.randomUUID() : detail.TradeEntryDetailId.toString()

    // infer price publisher name if it doesn't exist
    detail.LocalTradeEntryDetailId = LocalTradeEntryDetailId
    detail.ValuationCalendarId = detail.ValuationCalendarId?.toString() || ''

    detail.Prices.forEach((price) => {
      price.LocalTradeEntryPriceId = price.TradeEntryPriceId === 0 ? crypto.randomUUID() : price.TradeEntryPriceId
      price.Formula?.FormulaVariables?.forEach((variable) => {
        if (price.ProvisionType !== 'Fixed') {
          if (!variable.PricePublisherId) {
            const foundInstrument = metadata.PriceInstrumentList.find(
              (instrument) => variable.PriceInstrumentId?.toString() === instrument.Value
            )

            const foundPublisher = metadata.PricePublisherList.find(
              (publisher) => foundInstrument?.GroupingValue === publisher.Value
            )

            variable.PricePublisherId = foundPublisher?.Value
            variable.PricePublisherName = foundPublisher?.Text
            variable.PriceInstrumentId = foundInstrument?.Value
          }
          if (!variable.PriceTypeDisplayName) {
            variable.PriceTypeDisplayName = metadata.PriceTypeList.find(
              (type) => variable.PriceTypeCvId?.toString() === type.Value
            )?.Text
          }
          variable.Percentage = variable.Percentage || 100
        }
      })
    })
    return detail
  }
  const addMetadataToDetail = (detail) => {
    const UnitOfMeasureName = metadata?.UnitOfMeasureList.find((c) => c.Value === detail.UnitOfMeasureId)?.Text
    const FrequencyCvId = metadata?.FrequencyTypeList.find((c) => c.Text === detail.FrequencyCodeValueDisplay)?.Value

    return { ...detail, UnitOfMeasureName, FrequencyCvId }
  }
  const saveDetail = (newDetail) => {
    const newDetailCopy = addMetadataToDetail(newDetail)

    const detailsCopy = [...details]
    const detailMatchIndex = detailsCopy.findIndex(
      (detail) => detail?.LocalTradeEntryDetailId === newDetail?.LocalTradeEntryDetailId
    )
    const newTradeEntryDetailId = crypto.randomUUID()

    if (detailMatchIndex !== -1) {
      detailsCopy[detailMatchIndex] = newDetailCopy
    } else {
      detailsCopy.push({
        ...newDetailCopy,
        LocalTradeEntryDetailId: newTradeEntryDetailId,
        TradeEntryDetailId: undefined,
      })
    }
    setHasDetailEdits(false)
    setDetails(detailsCopy)
  }
  const deleteDetail = (detailToDelete: ContractDetails['Details'][number]) => {
    const updatedDetails = details.filter(
      (detail) => detail?.LocalTradeEntryDetailId !== detailToDelete?.LocalTradeEntryDetailId
    )
    setDetails(updatedDetails)
    setHasContractEdits(true)
    setActiveTabId('0')
  }

  const deleteDetails = (detailsToDelete: ContractDetails['Details']) => {
    const idsToDelete = new Set(detailsToDelete.map((d) => d?.LocalTradeEntryDetailId))

    const updatedDetails = details.filter((detail) => !idsToDelete.has(detail?.LocalTradeEntryDetailId))

    setDetails(updatedDetails)
    setHasContractEdits(true)
    setActiveTabId('0')
  }

  const duplicateDetails = (detailsToDuplicate: ContractDetails['Details']) => {
    const updatedDetails: Detail[] = []
    detailsToDuplicate.forEach((detail) => {
      const duplicateDetail = _.cloneDeep(detail)
      updatedDetails.push({
        ...duplicateDetail,
        TradeEntryDetailId: undefined,
        LocalTradeEntryDetailId: crypto.randomUUID(),
      })
    })

    setDetails((prev) => [...prev, ...updatedDetails])
    setHasContractEdits(true)
    setActiveTabId('0')
  }

  const openTab = (detail: ContractDetails['Details'][number], e?: any) => {
    if (!e || !e.target.className.includes('ant-menu-title-content')) {
      setActiveTabId(detail?.LocalTradeEntryDetailId)
      saveDetail({ ...detail, isOpen: true })
    }
  }
  const newTab = (duplicateDetail: any) => {
    setActiveTabId(duplicateDetail?.LocalTradeEntryDetailId || '')
    setOpenBlankDetail((prevState) => !prevState)
  }
  const closeTab = (tabToClose: string) => {
    const detailToClose = details.find((detail) => detail.LocalTradeEntryDetailId === tabToClose)
    if (!tabToClose.includes('duplicate')) {
      saveDetail({ ...detailToClose, isOpen: false })
    }
    setActiveTabId('0')
  }
  const updateManagedDetail = (newProvision, managedDetail) => {
    setHasDetailEdits(true)
    const managedDetailCopy = { ...managedDetail }
    const newDetail = managedDetailCopy.Prices
      ? managedDetailCopy.Prices.push(newProvision)
      : (managedDetailCopy.Prices = [newProvision])
    saveDetail(newDetail)
  }
  const createFormula = (variables, type) => {
    if (type === ProvisionTypes.FIXED) {
      return 'var_1'
    }
    let formulaString = ''
    const groups = groupInList(variables)
    if (type === ProvisionTypes.FORMULA) {
      return groups[0].map((variable) => variable.VariableName).join(' + ')
    }
    formulaString = 'MIN('
    groups.forEach((group, index) => {
      formulaString += '( '
      formulaString += group.map((variable) => variable.VariableName).join(' + ')
      formulaString += ' ) '
      if (index !== groups.length - 1) {
        formulaString += ', '
      }
    })
    formulaString += ')'
    return formulaString
  }

  const validateContract = () => {
    type entries = {
      TradeEntryDetailId: number | undefined
      ProductId: number
      ProductName: string
      FromLocationId: number
      FromLocationName: string
      ToLocationId: number
      ToLocationName: string
      FromDateTime: Date | Moment
      ToDateTime: Date | Moment
    }
    const groupedDetails: Record<string, entries[]> = {}
    const overlaps: string[] = []

    details?.forEach((detail) => {
      const key = `${detail.ProductId}_${detail?.FromLocationId}${
        detail?.ToLocationId ? `_${detail?.ToLocationId}` : ''
      }`
      if (!groupedDetails[key]) groupedDetails[key] = []
      const groupedDetail = {
        TradeEntryDetailId: detail?.TradeEntryDetailId,
        ProductId: detail?.ProductId,
        ProductName: detail?.ProductName,
        FromLocationId: detail?.FromLocationId,
        FromLocationName: detail.FromLocationName,
        ToLocationId: detail?.ToLocationId,
        ToLocationName: detail?.ToLocationName,
        FromDateTime: detail?.FromDateTime,
        ToDateTime: detail?.ToDateTime,
      }

      groupedDetails[key].push(groupedDetail)
    })

    Object.keys(groupedDetails).forEach((groupKey) => {
      const sortedGroupDetail = groupedDetails[groupKey].sort(
        (a, b) => new Date(a.FromDateTime).getTime() - new Date(b.FromDateTime).getTime()
      )

      for (let i = 0; i < sortedGroupDetail?.length; i++) {
        const curr = sortedGroupDetail[i]
        const next = sortedGroupDetail[i + 1]
        if (curr && next) {
          const hasInvalidDates =
            moment(next.FromDateTime).isSame(curr.FromDateTime) ||
            moment(next.ToDateTime).isSame(curr.ToDateTime) ||
            moment(next.FromDateTime).isSameOrBefore(curr.ToDateTime)
          if (hasInvalidDates) {
            const overlapString = `${next.TradeEntryDetailId ?? 'Draft'} - ${next.FromLocationName} - ${
              next.ProductName
            } ${next?.ToLocationName ? ` - ${next.ToLocationName}` : ''}`
            overlaps.push(overlapString)
          }
        }
      }
    })

    return {
      hasOverlaps: overlaps?.length > 0,
      overlaps,
    }
  }

  const saveContract = async (makeActive?) => {
    const detailsToSend = details.map((detail) => {
      const detailNetOrGross = metadata?.NetOrGrossTypeList.find((item) => item.Value === detail.NetOrGrossCvId)

      const hasQuantities =
        header?.ContractManagementRequiresQuantities === true || header?.ContractManagementRequiresQuantities === null

      return {
        MinimumAllocation: detail.MinimumAllocation ? parseInt(detail.MinimumAllocation) : 90,
        MaximumAllocation: detail.MaximumAllocation ? parseInt(detail.MaximumAllocation) : 110,
        TradeEntryDetailId: detail.TradeEntryDetailId ? detail.TradeEntryDetailId : 0,
        FrequencyCvId: detail?.FrequencyCvId ? parseInt(detail.FrequencyCvId) : 0,
        FromDateTime: moment(detail?.EffectiveDates[0])?.startOf('day').format(dateFormat.ISO),
        ToDateTime: moment(detail?.EffectiveDates[1])?.endOf('day').format(dateFormat.ISO),
        FromLocationId: detail?.FromLocationId ? parseInt(detail.FromLocationId) : 0,
        NetOrGrossCvId: parseInt(detailNetOrGross?.Value),
        NetOrGross: detailNetOrGross?.Text,
        ProductId: detail?.ProductId ? parseInt(detail.ProductId) : 0,
        Quantity: hasQuantities ? detail?.Quantity : null,
        ToLocationId: detail?.ToLocationId, // Null is allowed here
        UnitOfMeasureId: detail?.UnitOfMeasureId ? parseInt(detail.UnitOfMeasureId) : 0,
        PricePeriodStartOffset: detail?.PricePeriodStartOffset,
        Quantities: hasQuantities
          ? detail?.Quantities?.filter((q) => q.IsActive).map((q) => {
              return {
                IsActive: q.IsActive,
                Quantity: q.Quantity,
                QuantityDateTime: moment(q.QuantityDateTime).format(dateFormat.ISO),
                TradeEntryQuantityId: q?.TradeEntryQuantityId || 0,
              }
            })
          : [],
        Prices: detail?.Prices?.map((p) => {
          let FormulaVariables = []
          if (p.ProvisionType === ProvisionTypes.FIXED) {
            FormulaVariables = [
              {
                DisplayName: 'Fixed Price', // this can be whatever you want
                FixedValue: p.FixedValue, // the fixed value for the variable goes here
                PriceTypeCvId: 704, // this may be nullable but I'm not 100% sure
                ValueSourceCvId: 7203, // indicates we use the "fixed" value
                VariableName: 'var_1',
              },
            ]
          } else {
            FormulaVariables = p.Formula?.FormulaVariables?.map((variable) => {
              const PricePublisherId =
                metadata?.PricePublisherList.find((c) => c.Value.toString() === variable?.PricePublisherId?.toString())
                  ?.Value || null
              const PriceInstrumentId =
                metadata?.PriceInstrumentList.find((c) => c.Value.toString() === variable.PriceInstrumentId?.toString())
                  ?.Value || null
              const PriceTypeCvId =
                metadata?.PriceTypeList.find((c) => c.Text === variable.PriceTypeDisplayName)?.Value || null
              const PriceValuationRuleId =
                metadata?.TradePriceValuationRuleList.find(
                  (c) => c.Value.toString() === variable?.PriceValuationRuleId?.toString()
                )?.Value || null

              return {
                ...variable,
                PricePublisherId: parseInt(PricePublisherId),
                PriceInstrumentId: parseInt(PriceInstrumentId),
                PriceTypeCvId: parseInt(PriceTypeCvId),
                PriceValuationRuleId: parseInt(PriceValuationRuleId),
              }
            })
          }

          const payOrReceiveId = metadata.PayOrReceiveTypeList.find(
            (item) => item.Text === p.PayOrReceiveCodeValueDisplay
          )?.Value

          return {
            TradeEntryPriceId: p?.TradeEntryPriceId,
            CurrencyId: parseInt(p.CurrencyId),
            FromDate: moment(p.FromDate).startOf('day').format(dateFormat.ISO),
            ToDate: moment(p.ToDate).endOf('day').format(dateFormat.ISO),
            NetOrGrossCvId: detail?.NetOrGrossCvId ? parseInt(detail.NetOrGrossCvId) : detailNetOrGross?.Value,
            PayOrReceiveCvId: p.PayOrReceiveCvId ? parseInt(p.PayOrReceiveCvId) : payOrReceiveId,
            UnitOfMeasureId: parseInt(p.UnitOfMeasureId),
            Formula: {
              ...p.Formula,
              FormulaVariables,
              Formula: createFormula(FormulaVariables, p.ProvisionType),
            },
          }
        }),
        ValuationCalendarId: parseInt(detail?.ValuationCalendarId),
      }
    })

    const objectToSend = {
      MakeActive: makeActive,
      Contract: {
        ...header,
        Description: header?.Description,
        Comments: header?.Comments,
        ExternalColleagueId: header?.ExternalColleagueId,
        ExternalCounterPartyId: header?.ExternalCounterPartyId ? parseInt(header?.ExternalCounterPartyId) : 0,
        FromDateTime: moment(header?.EffectiveDates[0]).startOf('day').format(dateFormat.ISO),
        ToDateTime: moment(header?.EffectiveDates[1]).endOf('day').format(dateFormat.ISO),
        InternalColleagueId: header?.InternalColleagueId ? parseInt(header?.InternalColleagueId) : 0,
        InternalCounterPartyId: header?.InternalCounterPartyId ? parseInt(header?.InternalCounterPartyId) : 0,
        TradeEntryDateTime: moment(header?.TradeEntryDateTime).startOf('day').format(dateFormat.ISO),
        TradeInstrumentId: header?.TradeInstrumentId ? parseInt(header?.TradeInstrumentId) : 0,
        Details: detailsToSend,
        ContractManagementRequiresQuantities: !!header?.ContractManagementRequiresQuantities,
      },
    }
    const contractValidation = validateContract()
    if (!contractValidation?.hasOverlaps) {
      if (makeActive) {
        setIsMakingActive(true)
      } else {
        setIsSubmitting(true)
      }
      submitContract(objectToSend)
        .then((result) => {
          setHasContractEdits(false)
          setHasDetailEdits(false)
          if (result?.Data?.TradeEntryId) {
            if (header?.TradeEntryId) {
              queryClient.invalidateQueries([endpoints.details])
            } else {
              queryClient.invalidateQueries([endpoints.details])
              setTimeout(() => {
                navigate(`/ContractManagement/${result?.Data.TradeEntryId}`, { replace: true })
              }, 500)
            }
          }

          if (!result.Validations.length) {
            message.open({
              type: 'success',
              content: 'Contract successfully saved.',
            })
          } else {
            result.Validations.forEach((validation) => {
              NotificationMessage(`${validation.Category} Warning`, validation.Message, true)
            })
          }
        })
        .catch((e) => {
          message.open({
            type: 'error',
            content: 'Unable to save. There are errors with the contract',
          })
          NotificationMessage('Unable to save', 'There are errors with the contract details.', true)
        })
        .finally(() => {
          setIsSubmitting(false)
          setIsMakingActive(false)
          setValuationData([])
        })
    } else {
      notification.open({
        message: 'Overlapping Detail Dates Found',
        description: <OverLaps contractValidation={contractValidation} />,
        icon: <WarningFilled style={{ color: 'var(--theme-error)', marginTop: '.5em' }} />,
        style: { width: '100%' },
      })
    }
  }

  return (
    <ContractManagementContext.Provider
      value={{
        isSubmitting,
        isMakingActive,
        form,
        contract,
        saveContract,
        metadata,
        pageMode,
        setPageMode,
        initializeCreate,
        contractId,
        activeTabId,
        setActiveTabId,
        header,
        details,
        setDetails,
        saveDetail,
        saveHeader,
        openTab,
        newTab,
        deleteDetail,
        deleteDetails,
        duplicateDetails,
        closeTab,
        updateManagedDetail,
        setHasDetailEdits,
        hasDetailEdits,
        hasContractEdits,
        setHasContractEdits,
        openBlankDetail,
        setOpenBlankDetail,
        isLoadingContract,
        isDraftModalVisible,
        setDraftModalVisible,
        disableFields,
        canWrite,
        retrieveValuationData,
        valuationData,
        refetchValuation,
        detailValuationPayload,
        isFetchingContractValuation,
        isFetchingDetailValuation,
        getUpdatedQuantities,
      }}
    >
      {children}
    </ContractManagementContext.Provider>
  )
}

export const useContractManagementContext = (): ContractManagement => {
  const context = useContext<ContractManagement | object>(ContractManagementContext)
  if (context === undefined) {
    throw new Error('Context must be used within a Provider')
  }
  return context as ContractManagement
}

function OverLaps({ contractValidation }) {
  const multipleOverlaps = contractValidation?.overlaps?.length > 2
  return (
    <Vertical scroll>
      {!multipleOverlaps &&
        contractValidation?.overlaps.map((overlap) => {
          return <Texto key={overlap}>{overlap}</Texto>
        })}
      {multipleOverlaps && <Texto>Multiple overlapping detail dates found</Texto>}
    </Vertical>
  )
}
