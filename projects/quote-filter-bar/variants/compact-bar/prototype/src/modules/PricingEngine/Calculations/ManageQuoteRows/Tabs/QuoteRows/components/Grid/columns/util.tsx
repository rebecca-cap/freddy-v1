import GrossIcon from '@assets/icons/GrossIcon'
import GrossIconFilled from '@assets/icons/GrossIconFilled'
import NetIcon from '@assets/icons/NetIcon'
import NetIconFilled from '@assets/icons/NetIconFilled'
import React from 'react'

export function getIcon(value, label, defaultNetGrossId) {
  switch (label) {
    case 'Net':
      if (value.toString() === defaultNetGrossId?.toString() || !defaultNetGrossId) {
        return <NetIconFilled />
      }
      return <NetIcon />

    case 'Gross':
      if (value.toString() === defaultNetGrossId?.toString() || !defaultNetGrossId) {
        return <GrossIconFilled />
      }
      return <GrossIcon />
    default:
      return 'N/A'
  }
}

export const getCostLinkDisplay = ({ costType, params, metadata }) => {
  if (!costType) return null
  switch (costType.toLowerCase()) {
    case 'contract':
      const selectedContract = metadata?.Data?.ContractManagementCostSources.find(
        (c) => c.Value == params?.data?.CostSourceTradeEntryDetailId
      )
      if (selectedContract) return selectedContract.Text
      return params.data.CostSourceTradeEntryDetailId
    case 'instrument':
      if (params?.data?.CostSourceExplicitPriceInstrument) {
        return params?.data?.CostSourceExplicitPriceInstrument
      }
      const instrument = Object.values(metadata.Data?.PublisherPriceInstruments)
        .flatMap((instrument) => instrument)
        .find((instrument) => instrument.Value == params?.data?.CostSourceExplicitPriceInstrumentId)
      return instrument?.Text ?? params?.data?.CostSourceExplicitPriceInstrumentId
    case 'marker':
    default:
      return 'N/A'
  }
}

export const setCostLink = ({
  costType,
  id,
  params,
}: {
  costType: 'contract' | 'instrument' | 'marker'
  id: string
  params: any
}) => {
  switch (costType) {
    case 'contract':
      params.data.CostSourceType = 'Contract'
      params.data.CostSourceTradeEntryDetailId = id
      params.data.CostSourceMarkerId = null
      params.data.CostSourceMarker = null
      params.data.CostSourceExplicitPriceInstrumentId = null
      params.api.redrawRows({ rowNodes: [params.node] })
      break
    case 'instrument':
      params.data.CostSourceExplicitPriceInstrumentId = id
      params.data.CostSourceExplicitPriceInstrument = ''
      params.data.CostSourceType = 'Instrument'
      params.data.CostSourceMarkerId = null
      params.data.CostSourceMarker = null
      params.data.CostSourceTradeEntryDetailId = null
      params.api.redrawRows({ rowNodes: [params.node] })
      break
    default:
      params.data.CostSourceMarkerId = id
      params.data.CostSourceMarker = 'N/A'
      params.data.CostSourceType = 'Marker'
      params.data.CostSourceTradeEntryDetailId = null
      params.data.CostSourceExplicitPriceInstrumentId = null
      params.api.redrawRows({ rowNodes: [params.node] })
      break
  }
}
