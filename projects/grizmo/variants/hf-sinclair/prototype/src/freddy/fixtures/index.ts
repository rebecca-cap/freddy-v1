// Freddy mock fixture — not used in production code paths.
// Realistic-looking but clearly fictional data. Fictional company/site names.

import { configurationFixture } from './configuration'
import { ssoListFixture } from './ssoList'
import { userInfoFixture } from './userInfo'
import { impersonationCounterpartiesFixture } from './impersonationCounterparties'
import { metaJsonFixture } from './metaJson'
import { menuItemsFixture } from './menuItems'
import { marketPlatformInstrumentsFixture } from './marketPlatformInstruments'
import { codeSetFixture } from './codeSet'
import { pricePublishersFixture } from './pricePublishers'
import {
  counterpartyHierarchyGetFixture,
  counterpartyHierarchyItemsFixture,
  counterpartyHierarchyListFixture,
} from './counterpartyHierarchy'
import { counterpartiesMetadataFixture, counterpartiesReadFixture } from './counterparties'
import { locationsMetadataFixture, locationsReadFixture } from './locations'
import { productsMetadataFixture, productsReadFixture } from './products'
import { usersMetadataFixture, usersReadFixture } from './users'
import { manageInstrumentsMetadataFixture, manageInstrumentsReadFixture } from './manageInstruments'
import { calendarPeriodsMetadataFixture, calendarPeriodsReadFixture } from './calendarPeriods'
import {
  calendarManagementMetadataFixture,
  calendarManagementReadFixture,
} from './calendarManagement'
import {
  deliveryPeriodsMetadataFixture,
  deliveryPeriodsReadFixture,
} from './deliveryPeriods'
import { priceInstrumentUploadFixture } from './priceInstrumentUpload'
import { opisCurvesFixture, opisMetadataFixture } from './opisCurves'
import { quoteBookMetadataFixture, quoteBookRowsFixture } from './quoteBook'
import { calculatedValuesFixture } from './calculatedValueReport'
import { contractsReportFixture } from './contractsReport'
import { entityReportSchemaFixture, entityReportReadFixture } from './entityReport'
import { contractsMetadataFixture, tradeDataByQueryFixture } from './contracts'
import {
  contractRevaluationMetadataFixture,
  contractRevaluationValuationsFixture,
} from './contractRevaluation'
import {
  formulaTemplatesGetAllFixture,
  formulaTemplatesMetadataFixture,
} from './formulaTemplates'
import {
  commandCenterMetadataFixture,
  intradayCompetitorMovementFixture,
  marginSummaryFixture,
  strategyMissFixture,
  volumePaceFixture,
  userDefinedPageViewFixture,
} from './commandCenter'
import { orderEntryDataFixture, forwardPricesFixture } from './orderEntry'
import {
  allocationManagementMetadataFixture,
  allocationManagementReadFixture,
  allocationReferenceMetadataFixture,
  allocationReferencesFixture,
  quoteBookAllocationsFixture,
  quoteBookAllocationAssociationsFixture,
} from './allocationManagement'
import {
  allocationMappingSuppliersFixture,
  allocationMappingSuppliersMetadataFixture,
  allocationMappingLocationsFixture,
  allocationMappingLocationsMetadataFixture,
  allocationMappingProductsFixture,
  allocationMappingProductsMetadataFixture,
} from './allocationMappings'
import { appliedAllocationReportFixture } from './appliedAllocationReport'
import {
  marketPlatformSetupsMetadataFixture,
  marketPlatformSetupsReadFixture,
} from './marketPlatformSetups'
import { analyticsByCustomerFixture } from './analyticsByCustomer'
import { analyticsByChannelFixture } from './analyticsByChannel'
import { analyticsByTerminalFixture } from './analyticsByTerminal'
import { analyticsByContractFixture } from './analyticsByContract'
import { integrationStatusReportFixture } from './priceInstrumentUpload'
import {
  priceImportMappingsFixture,
  priceImportMappingsMetadataFixture,
} from './priceImportMappings'
import {
  priceTranslationsFixture,
  priceTranslationsMetadataFixture,
} from './priceTranslations'
import {
  priceConfigurationMetadataFixture,
  priceConfigurationReadFixture,
} from './priceConfiguration'
import {
  priceNotificationsLocationsFixture,
  priceNotificationsMetadataFixture,
  priceNotificationsProductsFixture,
  priceNotificationsRecipientDataFixture,
  priceNotificationsSubscriptionsFixture,
} from './priceNotifications'
// === T10 Admin-Misc ===
import { netGrossMetadataFixture, netGrossRulesFixture } from './netGrossDefaults'
import {
  adminFormulaTemplatesFixture,
  adminFormulaTemplatesMetadataFixture,
} from './adminFormulaTemplates'
import { placeholderManagementFixture } from './placeholderManagement'
import {
  adminCalculatedValueReportMetadataFixture,
  adminCalculatedValueSecondaryBreakdownFixture,
} from './adminCalculatedValueReport'
import { availabilityMaintenanceGridFixture } from './availability'
import { quantityDistributionFixture } from './quantityDistribution'
import { volumeThresholdsFixture } from './volumeThresholds'
import {
  pendingOrdersFixture,
  processedOrdersFixture,
  creditWidgetFixture,
  dashboardPriceListingsFixture,
} from './orderDashboard'
// === T8 BuyNow + Online ===
import { allSpecialOffersFixture } from './buyNowOffers'
import {
  specialOffersListFixture,
  specialOffersMetadataFixture,
} from './specialOffers'
import {
  adminDashboardPendingFixture,
  adminDashboardRecentlyProcessedFixture,
  adminProcessedVolumeFixture,
  adminProcessedProfitFixture,
  adminProcessedPromptVolumeFixture,
  adminProcessedForwardVolumeFixture,
} from './adminDashboard'

/**
 * Registry of mock handlers, keyed by the API path *relative* to /api/.
 * The freddy bootstrap routes both useApi calls and raw fetch() calls
 * through these handlers. Returned values are JSON-serialized into a
 * Response when the call comes from raw fetch.
 */
export const fixtures: Record<string, (path?: string, init?: any) => Promise<unknown>> = {
  // Hit by EnvironmentConfigProvider on first render (raw fetch)
  'configuration': async () => configurationFixture,

  // Hit by Main (raw fetch) before login redirect
  'sso/List': async () => ssoListFixture,

  // Hit by useCredential.useUserInfoQuery via api.post (excalibrr seam)
  'Credential/GetUserInfo': async () => userInfoFixture,

  // Hit by useCredential.getImpersonationOptionsQuery via api.post
  'Credential/GetImpersonationCounterparties': async () =>
    impersonationCounterpartiesFixture,

  // Hit by CacheBuster.componentDidMount via raw fetch (root /meta.json,
  // not /api/). The fetch interceptor falls back to trimmed pathname when
  // there's no /api/ segment, so the key here is "meta.json".
  'meta.json': async () => metaJsonFixture,

  // Hit by UserProvider — drives availablePageKeys via reducePermissionsToKeys
  'Application/Menu/GetMenuItemsByQuery': async () => menuItemsFixture,

  // Hit by PromptProvider — needs { Data: [] } at minimum
  'MarketPlatform/OrderEntry/GetMarketPlatformInstruments': async () =>
    marketPlatformInstrumentsFixture,

  // /Admin/Publishers — useCodeSets().useCodeSetQuery and usePricePublishers
  'ReferenceData/CodeSet/Get': async () => codeSetFixture,
  'ReferenceData/PricePublisher/Get': async () => pricePublishersFixture,

  // /Admin/CounterpartyHierarchy — TreeView consumes Get; List is bare array
  'ReferenceData/CounterPartyHierarchy/CounterParty/Get': async () =>
    counterpartyHierarchyGetFixture,
  'ReferenceData/CounterPartyHierarchy/CounterParty/List': async () =>
    counterpartyHierarchyListFixture,

  // /Admin/Counterparties
  'Admin/CounterPartyManagement/GetMetaData': async () => counterpartiesMetadataFixture,
  'Admin/CounterPartyManagement/Read': async () => counterpartiesReadFixture,

  // /Admin/Locations
  'Admin/LocationManagement/GetMetaData': async () => locationsMetadataFixture,
  'Admin/LocationManagement/read': async () => locationsReadFixture,

  // /Admin/Products
  'Admin/ProductManagement/GetMetaData': async () => productsMetadataFixture,
  'Admin/ProductManagement/read': async () => productsReadFixture,

  // /Admin/Users
  'Admin/UserManagement/GetDataForUserManagement': async () => usersMetadataFixture,
  'Admin/UserManagement/ReadUsers': async () => usersReadFixture,

  // /Admin/Instruments
  'marketPlatform/admin/marketPlatformInstrument/GetAllMarketPlatformInstruments':
    async () => manageInstrumentsReadFixture,
  'marketPlatform/admin/marketPlatformInstrument/GetMetaData': async () =>
    manageInstrumentsMetadataFixture,

  // /Admin/CalendarPeriods
  'MarketPlatform/Admin/Calendar/GetMetadata': async () => calendarPeriodsMetadataFixture,

  // /Admin/IntegrationStatus
  'PriceInstrumentUpload/GetPriceInstrumentUploadData': async () =>
    priceInstrumentUploadFixture,

  // /Admin/ManageOpisPrices
  'OpisInstruments/Admin/GetAllOpisCurves': async () => opisCurvesFixture,
  'OpisInstruments/Admin/GetMetadata': async () => opisMetadataFixture,

  // /PricingEngine/CommandCenter — QuoteBook
  'QuoteBook/GetMetaData': async () => quoteBookMetadataFixture,
  'QuoteBook/GetRows': async () => quoteBookRowsFixture,

  // /ContractManagement/Valuations
  'MarketPlatform/CalculatedPriceReport/ReadCalculatedValues': async () =>
    calculatedValuesFixture,

  // /ContractManagement/MissingPrices
  'ContractManagement/report/GetAll': async () => contractsReportFixture,

  // /OnlineOrders + ContractManagement/{Valuations,MissingPrices} — entity report
  // Both endpoints dispatch on body.ReportName inside the fixture functions.
  'EntityReport/GetSchema': entityReportSchemaFixture,
  'EntityReport/Read': entityReportReadFixture,

  // === T6 PricingEngine ===
  // /PricingEngine/CommandCenter
  'CommandCenter/GetMetaData': async () => commandCenterMetadataFixture,
  'CommandCenter/GetIntradayCompetitorMovementData': async () => intradayCompetitorMovementFixture,
  'CommandCenter/GetMarginSummaryData': async () => marginSummaryFixture,
  'CommandCenter/GetStrategyMissData': async () => strategyMissFixture,
  'CommandCenter/GetVolumePaceData': async () => volumePaceFixture,
  'Application/UserDefinedPageView/Read': async () => userDefinedPageViewFixture,

  // /BuyNow/Forward
  'MarketPlatform/OrderEntry/GetOrderEntryData': async () => orderEntryDataFixture,
  'MarketPlatform/OrderEntry/GetItemsAvailableForOrder': async () => forwardPricesFixture,

  // /Admin/AuthorizationAllocationAssociations
  'admin/allocation/management/GetMetadata': async () => allocationManagementMetadataFixture,
  'admin/allocation/management/ReadManagementData': async () => allocationManagementReadFixture,
  'admin/allocation/reference/GetMetaDataForReferences': async () => allocationReferenceMetadataFixture,
  'admin/allocation/reference/GetReferences': async () => allocationReferencesFixture,

  // === T1 Admin-People ===
  // /Admin/CounterpartyHierarchy — Items endpoint drives the right-pane grid
  'ReferenceData/CounterPartyHierarchy/CounterParty/Items': async () =>
    counterpartyHierarchyItemsFixture,

  // === T5 Admin-Calendar ===
  // /Admin/CalendarPeriods — read key (metadata wired earlier above)
  'MarketPlatform/Admin/Calendar/ReadCalendarPeriods': async () => calendarPeriodsReadFixture,

  // /Admin/CalendarManagement (ManagePriceEngineCalendars)
  'PricingEngine/Admin/Calendar/GetMetadata': async () => calendarManagementMetadataFixture,
  'PricingEngine/Admin/Calendar/Read': async () => calendarManagementReadFixture,

  // /Admin/DeliveryPeriods
  'DeliveryPeriodManagement/GetMetaData': async () => deliveryPeriodsMetadataFixture,
  'DeliveryPeriodManagement/GetDeliveryPeriodConfigurations': async () =>
    deliveryPeriodsReadFixture,

  // === T2 Admin-Catalog ===
  // /Admin/MarketPlatformSetups — TradeEntrySetup grid
  'MarketPlatform/Admin/TradeEntrySetup/GetMetaData': async () =>
    marketPlatformSetupsMetadataFixture,
  'MarketPlatform/Admin/TradeEntrySetup/Read': async () => marketPlatformSetupsReadFixture,

  // === T9 Analytics ===
  // /Analytics/ByCustomer, ByChannel, ByTerminal, ByContract — chart+grid pages
  'PricePerformance/ByCustomer': async () => analyticsByCustomerFixture,
  'PricePerformance/ByChannel': async () => analyticsByChannelFixture,
  'PricePerformance/ByTerminal': async () => analyticsByTerminalFixture,
  'PricePerformance/ByContract': async () => analyticsByContractFixture,

  // === T4 Admin-Allocations ===
  // /Admin/AllocationAssociationManagement (PriceEngine quote-book side)
  'QuoteBook/Analytics/Allocation/Admin/GetAllocations': async () => quoteBookAllocationsFixture,
  'QuoteBook/Analytics/Allocation/Admin/GetAssociations': async () =>
    quoteBookAllocationAssociationsFixture,

  // /Admin/AllocationMappings — DTN file-import translations
  'MarketPlatform/Admin/AllocationFileImportManagement/GetSupplierMetadata': async () =>
    allocationMappingSuppliersMetadataFixture,
  'MarketPlatform/Admin/AllocationFileImportManagement/ReadSupplierTranslations': async () =>
    allocationMappingSuppliersFixture,
  'MarketPlatform/Admin/AllocationFileImportManagement/GetLocationMetadata': async () =>
    allocationMappingLocationsMetadataFixture,
  'MarketPlatform/Admin/AllocationFileImportManagement/ReadLocationTranslations': async () =>
    allocationMappingLocationsFixture,
  'MarketPlatform/Admin/AllocationFileImportManagement/GetProductMetadata': async () =>
    allocationMappingProductsMetadataFixture,
  'MarketPlatform/Admin/AllocationFileImportManagement/ReadProductGroupTranslations': async () =>
    allocationMappingProductsFixture,

  // /Admin/AppliedAllocationReport
  'MarketPlatform/Admin/OrderAllocationStatus/GetOrderAllocationData': async () =>
    appliedAllocationReportFixture,

  // === T3 Admin-Pricing ===
  // /Admin/IntegrationStatus — EntityReport/Read is dispatched centrally by
  // entityReport.ts (keyed on body.ReportName='IntegrationStatus'), which
  // forwards to integrationStatusReportFixture from priceInstrumentUpload.ts.

  // /Admin/PriceImportMappings — DTNMappings
  'PriceImport/TranslationManagement/GetPriceTranslationData': async () =>
    priceImportMappingsFixture,
  'PriceImport/TranslationManagement/GetMetadata': async () =>
    priceImportMappingsMetadataFixture,

  // /Admin/PriceTranslations
  'PriceImport/TranslatedIdentifiers/GetAll': async () => priceTranslationsFixture,
  'PriceImport/TranslatedIdentifiers/MetaData': async () =>
    priceTranslationsMetadataFixture,

  // /Admin/PriceConfiguration
  'MarketPlatform/Admin/PriceConfiguration/MetaData': async () =>
    priceConfigurationMetadataFixture,
  'MarketPlatform/Admin/PriceConfiguration/GetAll': async () =>
    priceConfigurationReadFixture,

  // /Admin/PriceNotifications
  'PriceNotifications/SubscriptionManagement/GetSubscriptions': async () =>
    priceNotificationsSubscriptionsFixture,
  'PriceNotifications/SubscriptionManagement/GetRecipientData': async () =>
    priceNotificationsRecipientDataFixture,
  'PriceNotifications/SubscriptionManagement/GetAvailableProducts': async () =>
    priceNotificationsProductsFixture,
  'PriceNotifications/SubscriptionManagement/GetAvailableLocations': async () =>
    priceNotificationsLocationsFixture,
  'PriceNotifications/SubscriptionManagement/GetMetadata': async () =>
    priceNotificationsMetadataFixture,

  // === T10 Admin-Misc ===
  // /Admin/NetGrossDefaults
  'Admin/NetGrossRules/Metadata': async () => netGrossMetadataFixture,
  'Admin/NetGrossRules/GetAll': async () => netGrossRulesFixture,

  // /Admin/FormulaTemplates (OSP variant — see FormulaTemplateEndpoints.ts)
  'MarketPlatform/ContractTemplates/GetAll': async () => adminFormulaTemplatesFixture,
  'MarketPlatform/ContractTemplates/Metadata': async () =>
    adminFormulaTemplatesMetadataFixture,
  'MarketPlatform/ContractTemplates/RawMetadata': async () =>
    adminFormulaTemplatesMetadataFixture,

  // /Admin/PlaceholderManagement
  'MarketPlatform/PlaceholderPriceManagement/GetPlaceholders': async () =>
    placeholderManagementFixture,

  // /Admin/CalculatedValueReport — metadata + secondary breakdown only
  // (ReadCalculatedValues handler is owned by calculatedValueReport.ts / T7)
  'MarketPlatform/CalculatedPriceReport/ReadMetadata': async () =>
    adminCalculatedValueReportMetadataFixture,
  'MarketPlatform/CalculatedPriceReport/GetSecondaryPriceBreakdown': async () =>
    adminCalculatedValueSecondaryBreakdownFixture,

  // /Admin/Availability — main grid (Volume Setup endpoints handled by other fixtures)
  'AvailabilityMaintenance/GetAvailabilityMaintenanceGridData': async () =>
    availabilityMaintenanceGridFixture,

  // /Admin/QuantityDistributionManagement
  'MarketPlatform/QuantityDistribution/GetQuantityDistributionWeights': async () =>
    quantityDistributionFixture,

  // /Admin/VolumeThresholds
  'MarketPlatform/Admin/TradeEntrySetupVolumeConstraints/ReadTradeEntrySetupVolumeThresholds':
    async () => volumeThresholdsFixture,

  // / (root Order Dashboard) — same handler returns mixed prompt/forward orders
  'MarketPlatform/OrderReporting/GetPendingOrders': async () => pendingOrdersFixture,
  'MarketPlatform/OrderReporting/GetRecentlyProcessedOrders': async () =>
    processedOrdersFixture,
  'MarketPlatform/OrderReporting/GetCreditWidget': async () => creditWidgetFixture,
  'MarketPlatform/OrderEntry/GetPricesForDashboard': async () =>
    dashboardPriceListingsFixture,

  // === T7 ContractManagement ===
  // /ContractManagement/Contracts — header/details metadata + trade query stub
  'ContractManagement/MetaData': async () => contractsMetadataFixture,
  'TransactionalData/TradeData/GetTradesByQuery': async () => tradeDataByQueryFixture,

  // /ContractManagement/ContractRevaluation
  'ContractRevaluation/GetMetaData': async () => contractRevaluationMetadataFixture,
  'ContractRevaluation/GetContractValuations': async () =>
    contractRevaluationValuationsFixture,

  // /ContractManagement/FormulaTemplates (PE variant)
  'FormulaTemplateManagement/GetAll': async () => formulaTemplatesGetAllFixture,
  'FormulaTemplateManagement/Metadata': async () => formulaTemplatesMetadataFixture,
  'FormulaTemplateManagement/RawMetadata': async () => formulaTemplatesMetadataFixture,

  // Note: /ContractManagement/Valuations + /ContractManagement/MissingPrices
  // are EntityReport-driven; their schemas + rows live in entityReport.ts and
  // dispatch on body.ReportName ('TradeEntryValuation' / 'TradeEntryValuationMissingPrices').
  // /ContractManagement/Measurements is fully populated via inline seeds in
  // src/api/useContractMeasure/seed.ts and needs no fixture.

  // === T8 BuyNow + Online ===
  // /BuyNow/Offers
  'MarketPlatform/MarketPlatformAllSpecialOffers/GetAllSpecialOffers': async () =>
    allSpecialOffersFixture,

  // /SpecialOffers admin
  'MarketPlatform/SpecialOfferAdmin/GetSpecialOffers': async () => specialOffersListFixture,
  'MarketPlatform/SpecialOfferAdmin/GetMetadata': async () => specialOffersMetadataFixture,

  // /AdminDashboard — orders go through different URL than /OrderDashboard
  'MarketPlatform/AdminOrderDashboard/GetPendingOrders': async () =>
    adminDashboardPendingFixture,
  'MarketPlatform/AdminOrderDashboard/GetRecentlyProcessedOrders': async () =>
    adminDashboardRecentlyProcessedFixture,
  'MarketPlatform/AdminOrderDashboard/GetProcessedVolume': async () =>
    adminProcessedVolumeFixture,
  'MarketPlatform/AdminOrderDashboard/GetProcessedProfit': async () =>
    adminProcessedProfitFixture,
  'MarketPlatform/AdminOrderDashboard/GetProcessedPromptVolume': async () =>
    adminProcessedPromptVolumeFixture,
  'MarketPlatform/AdminOrderDashboard/GetProcessedForwardVolume': async () =>
    adminProcessedForwardVolumeFixture,

  // /OnlineOrders is served by EntityReport/Read (entityReport.ts dispatches
  // on body.ReportName='OnlineOrders' and pulls rows from onlineOrders.ts).
  // /BuyNow/Forward + /BuyNow/Prompt: orderEntry + marketPlatformInstruments
  // (registered above) supply Data; populated marketPlatformInstrumentsFixture
  // fixes the BuyForwards page.jsx:54 crash on forwardInstruments[0].
}
