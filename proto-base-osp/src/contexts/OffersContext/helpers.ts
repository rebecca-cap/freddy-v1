import { dateFormat } from '@components/TheArmory/helpers'
import type {
  GetOrderEntryDataResponse,
  OrderEntryData,
  OrderEntrySelectedItem,
  SubmitOrderRequest,
} from '@modules/SellingPlatform/BuyNow/Offers/Api/types.schema'
import dayjs from '@utils/dayjs'
import { stripTimezoneOffset } from '@utils/timezone'

import type { DateItem, OffersEntryData, OffersSelectedItemMetadata, PriceAdjustment } from './types.schema'

const createSelectList = (keyList?: Record<string, string>, selected?: string) =>
  Object.keys(keyList ?? {}).map((key, index) => ({
    key,
    value: keyList![key],
    selected: selected ? selected === key : index === 0,
  }))

export const deriveAllowBid = (data?: OrderEntryData) =>
  Array.isArray(data?.ValidSubtypes) ? data!.ValidSubtypes.some((s) => s?.AllowBid === true) : true

export const getInitialDatesFromEntry = (
  defaults?: OffersEntryData['PromptDefaultDates'],
  tradeSelectedItem?: OrderEntrySelectedItem | null
): { from: DateItem; to: DateItem } => {
  // Priority 1: Use SpecialOfferData dates if available (actual special offer dates)
  if (tradeSelectedItem?.SpecialOfferData?.OrderEffectiveStartDateTime &&
      tradeSelectedItem?.SpecialOfferData?.OrderEffectiveEndDateTime) {
    const from = new Date(tradeSelectedItem.SpecialOfferData.OrderEffectiveStartDateTime)
    const to = new Date(tradeSelectedItem.SpecialOfferData.OrderEffectiveEndDateTime)
    return { from, to }
  }

  // Priority 2: Fall back to PromptDefaultDates for non-special-offer orders
  if (!defaults) return { from: null, to: null }
  const from = defaults.DefaultStartDate
  const to = tradeSelectedItem?.PriceAdjustmentDetails?.length ? null : defaults.DefaultEndDate
  return { from, to }
}

export const mapEntryDataToContext = (
  resp: GetOrderEntryDataResponse,
  specialOfferId?: number | null
): {
  entryData: OffersEntryData
  meta: OffersSelectedItemMetadata
  tradeSelectedItem: OrderEntrySelectedItem | null | undefined
} => {
  const data = resp?.Data as OrderEntryData
  const tradeSelectedItem: OrderEntrySelectedItem | undefined = data?.SelectedItems?.find(
    (item) => item.SpecialOfferData?.SpecialOfferId === specialOfferId
  )
  const bidExpiryRaw = tradeSelectedItem?.Defaults?.DefaultBidExpiryDateTime
  const meta: OffersSelectedItemMetadata = {
    PromptDefaultDates: data.PromptDefaultDates,
    ShowDateOverrideFields: !!data?.ShowDateOverrideFields,
    DateOverrideMaxDate: data?.DateOverrideMaxDate,
    DateOverrideMinDate: data?.DateOverrideMinDate,
    IsInternalUser: !!data?.IsInternalUser,

    ProductName: tradeSelectedItem?.ProductName,
    LocationName: tradeSelectedItem?.LocationName,
    Price: tradeSelectedItem?.SpecialOfferData?.FixedPrice ?? tradeSelectedItem?.Price,
    Margin: tradeSelectedItem?.Margin,
    OverridePrice: tradeSelectedItem?.SpecialOfferData?.FixedPrice ?? tradeSelectedItem?.Price,

    AdditionalItems:
      tradeSelectedItem?.AdditionalItems?.map((item) => ({
        ...item,
        selected: false,
        key: String(item.ItemKey.TradeEntrySetupId ?? item.ItemKey?.SpecialOfferId ?? ''),
      })) ?? [],

    ExternalColleagueOverride: data?.ExternalColleagueOverrideList
      ? createSelectList(data.ExternalColleagueOverrideList)
      : [],
    InternalCounterPartyOverride: data?.InternalCounterPartyOverrideList
      ? createSelectList(
          data.InternalCounterPartyOverrideList,
          tradeSelectedItem?.Defaults?.DefaultCounterPartyId?.toString()
        )
      : [],

    IndexPrice: tradeSelectedItem?.SpecialOfferData?.FixedPrice ?? tradeSelectedItem?.IndexPrice,
    Defaults: tradeSelectedItem?.Defaults,
    Constraints: tradeSelectedItem?.Constraints,
    ItemKey: tradeSelectedItem?.ItemKey,
    FuturesMonth: dayjs(tradeSelectedItem?.FuturesMonth),
    BidExpiration: bidExpiryRaw ? dayjs(stripTimezoneOffset(bidExpiryRaw)) : dayjs(bidExpiryRaw),
    MaxBidExpiration: tradeSelectedItem?.Constraints?.MaximumBidExpiration,
    LoadingNumbersList:
      tradeSelectedItem?.LoadingNumbersList?.map((x) => ({
        ...x,
        selected: tradeSelectedItem?.LoadingNumbersList?.length === 1,
        key: x.LoadingNumberId,
      })) ?? [],

    DestinationStates:
      tradeSelectedItem?.DestinationLocations?.map((x) => ({
        ...x,
        selected: tradeSelectedItem?.DestinationLocations?.length === 1,
        key: x.LocationId,
      })) ?? [],
    PriceAdjustments:
      tradeSelectedItem?.PriceAdjustmentDetails?.map((x) => ({
        ...x,
        key: x.MarketPlatformPriceAdjustmentDetailId,
      })) ?? [],

    LiftingLocationsList:
      tradeSelectedItem?.LiftingLocations?.map((x) => ({
        ...x,
        key: x.LocationId,
      })) ?? [],
    Type: data?.IsBid ? 'bid' : 'market',
    CreditData: {
      creditHold: data?.CreditData?.creditStatus !== 'Normal',
      totalCreditBalance: data?.CreditData?.EstimatedRemainingCreditBalance ?? undefined,
      remainingCreditBalance: data?.CreditData?.EstimatedRemainingCreditBalance ?? undefined,
      creditStatus: data?.CreditData?.creditStatus,
    },
    TradeNote: '',
    ExternalNotification: true,

    SpecialOfferData: tradeSelectedItem?.SpecialOfferData
      ? {
          SpecialOfferId: tradeSelectedItem.SpecialOfferData.SpecialOfferId,
          Name: tradeSelectedItem.SpecialOfferData.Name,
          PricingMechanism: tradeSelectedItem.SpecialOfferData.PricingMechanism,
          FixedPrice: tradeSelectedItem.SpecialOfferData.FixedPrice,
          MarketOffset: tradeSelectedItem.SpecialOfferData.MarketOffset,
          ReservePrice: tradeSelectedItem.SpecialOfferData.ReservePrice,
          EnforceReservePrice: tradeSelectedItem.SpecialOfferData.EnforceReservePrice,
          EffectiveMaxPerOrder: tradeSelectedItem.SpecialOfferData.EffectiveMaxPerOrder,
          OrderEffectiveStartDateTime: tradeSelectedItem.SpecialOfferData.OrderEffectiveStartDateTime,
          OrderEffectiveEndDateTime: tradeSelectedItem.SpecialOfferData.OrderEffectiveEndDateTime,
          TimeRemaining: tradeSelectedItem.SpecialOfferData.TimeRemaining,
          HasPendingOrder: tradeSelectedItem.SpecialOfferData.HasPendingOrder,
          ExistingOrderId: tradeSelectedItem.SpecialOfferData.ExistingOrderId,
          TimeZoneId: tradeSelectedItem.SpecialOfferData.TimeZoneId,
          TimeZoneDescription: tradeSelectedItem.SpecialOfferData.TimeZoneDescription,
          TimeZoneAlias: tradeSelectedItem.SpecialOfferData.TimeZoneAlias,
        }
      : undefined,
  }

  const entryData: OffersEntryData = {
    OrderTimeLimitInSeconds: data?.OrderTimeLimitInSeconds ?? null,
    State: data?.State ?? null,
    IsInternalUser: !!data?.IsInternalUser,
    ShowDateOverrideFields: !!data?.ShowDateOverrideFields,
    DateOverrideMaxDate: data?.DateOverrideMaxDate ?? null,
    DateOverrideMinDate: data?.DateOverrideMinDate ?? null,
    PromptDefaultDates: data?.PromptDefaultDates ?? null,
    SelectedItem: tradeSelectedItem ?? null,
    CreditData: data?.CreditData ?? null,
  }

  return { entryData, meta, tradeSelectedItem }
}

export const adjustPriceAdjustmentsHelper = (
  list: PriceAdjustment[] | undefined,
  quantity: number,
  isBidType: boolean
): { filtered: PriceAdjustment[]; defaultKey: string | null } => {
  const filtered = (list ?? []).filter((p) => p.QuantityFrom <= quantity && p.QuantityTo >= quantity)
  let defaultKey: string | null = null

  if (!isBidType && filtered.length === 1) defaultKey = String(filtered[0].key)
  if (!isBidType && filtered.length > 1) {
    const best = filtered.find((x) => x.AdjustmentPrice === 0)
    if (best) defaultKey = String(best.key)
  }
  return { filtered, defaultKey }
}

export const buildSubmitOrderPayload = (
  pending: any,
  meta: OffersSelectedItemMetadata,
  entry: OffersEntryData | null
): SubmitOrderRequest => {
  const isBid = pending?.Type === 'bid'
  const selectedAdditionalItems =
    meta.AdditionalItems?.filter((p) => pending?.SelectedItems?.map((i: any) => i.key).includes(p.key))
      .map((x) => ({
        ItemKey: x.ItemKey,
      })) ?? []

  const selectedLoadingNumbers =
    pending?.LoadingNumbersIds && Array.isArray(pending?.LoadingNumbersIds)
      ? pending?.LoadingNumbers
      : pending?.LoadingNumbersIds
      ? [pending?.LoadingNumbersIds]
      : []

  const DestinationLocationIds = pending?.DestinationStatesIds

  const totalAdjustmentPrice =
    meta.PriceAdjustments?.map((a) =>
      a.MarketPlatformPriceAdjustmentDetailId?.toString() === pending?.PriceAdjustmentId?.toString()
        ? a.AdjustmentPrice
        : 0
    ).reduce((a, b) => a + b, 0) ?? 0

  const payload: SubmitOrderRequest = {
    Items: [
      {
        Volume: pending?.Quantity,
        LoadingNumberIds: selectedLoadingNumbers?.map((x: any) => x.LoadingNumberId),
        DestinationLocationIds,
        LiftingLocationIds: [],
        ItemKey: pending?.ItemKey,
        MarketPlatformPriceAdjustmentDetailId: isBid ? null : pending?.PriceAdjustmentId ?? undefined,
        SelectedAdditionalItems: selectedAdditionalItems,
        OverridePrice: !isBid ? (pending?.Price ?? 0) + totalAdjustmentPrice : undefined,
        OverrideIndexPrice: !isBid ? pending?.IndexPrice ?? 0 : undefined,
      },
    ],
    IsBid: isBid,
    BidPrice: isBid ? pending?.Price : undefined,
    BidExpiry: isBid ? dayjs(pending?.BidExpiration)?.format(dateFormat.ISO_V2) : undefined,
    Notes: pending?.Notes,
    State: entry?.State ?? undefined,
    ExternalColleagueOverride: pending?.ExternalColleagueId,
    InternalCounterPartyOverride: pending?.InternalCounterPartyId,
    OverridePrice: !isBid ? (pending?.Price ?? 0) + totalAdjustmentPrice : undefined,
    OverrideIndexPrice: !isBid ? pending?.IndexPrice : undefined,
    ShouldSendExternalNotification: pending?.ExternalNotification,
    OverrideStartDate: pending?.OverrideStartDate ? dayjs(pending?.OverrideStartDate).format(dateFormat.ISO_V2) : null,
    OverrideEndDate: pending?.OverrideEndDate ? dayjs(pending?.OverrideEndDate).format(dateFormat.ISO_V2) : null,
  }

  return payload
}
