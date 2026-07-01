# Freddy QA crawl — 2026-05-02T18-02

**Base URL:** http://localhost:3001
**Routes crawled:** 52
**Crashes (navigation):** 0
**Page errors (uncaught):** 37
**Console errors (filtered):** 91
**Distinct missing fixtures:** 84

## Pages with errors (sorted by severity)

| Path | Title | Crash | PageErr | ConsoleErr | MissingFx |
|------|-------|-------|---------|------------|-----------|
| `/Admin/CounterpartyHierarchy` | Counterparty Hierarchy |  | 4 | 3 | 2 |
| `/Admin/AuthorizationAllocationAssociations` | Authorization Allocations |  | 2 | 2 | 4 |
| `/Admin/CalculatedValueReport` | Current Prices |  | 2 | 2 | 3 |
| `/Admin/CalendarPeriods` | Calendar Periods |  | 2 | 2 | 1 |
| `/Admin/Counterparties` | Manage Counterparties |  | 2 | 2 | 2 |
| `/Admin/Instruments` | Price Instruments |  | 2 | 2 | 1 |
| `/Admin/IntegrationStatus` | Extract Status Report |  | 2 | 2 | 1 |
| `/Admin/Locations` | Locations |  | 2 | 2 | 2 |
| `/Admin/ManageOpisPrices` | Manage OPIS Curves |  | 2 | 2 | 2 |
| `/Admin/Products` | Products |  | 2 | 2 | 2 |
| `/Admin/Publishers` | Price Publishers |  | 2 | 2 | 2 |
| `/ContractManagement/MissingPrices` | Missing Prices |  | 2 | 2 | 1 |
| `/ContractManagement/Valuations` | Contract Values |  | 2 | 2 | 1 |
| `/OnlineOrders` | Online Orders |  | 2 | 2 | 1 |
| `/PricingEngine/CommandCenter` | Command Center |  | 2 | 2 | 3 |
| `/Admin/AllocationAssociationManagement` | Allocation Management |  | 1 | 2 | 4 |
| `/Admin/AllocationMappings` | Allocation Mappings |  | 1 | 2 | 2 |
| `/Admin/AppliedAllocationReport` | Applied Allocation Report |  | 1 | 2 | 1 |
| `/BuyNow/Forward` | Forward |  | 1 | 2 | 1 |
| `/SpecialOffers` | Offers |  | 1 | 2 | 2 |
| `/BuyNow/Offers` | Offers |  | 0 | 19 | 1 |
| `/` | Home |  | 0 | 1 | 4 |
| `/Admin/Availability` | Availability |  | 0 | 1 | 4 |
| `/Admin/CalendarManagement` | Calendar Management |  | 0 | 1 | 2 |
| `/Admin/DeliveryPeriods` | Delivery Periods |  | 0 | 1 | 2 |
| `/Admin/FormulaTemplates` | Formula Templates |  | 0 | 1 | 2 |
| `/Admin/MarketPlatformSetups` | Market Platform Setups |  | 0 | 1 | 2 |
| `/Admin/NetGrossDefaults` | Net / Gross Defaults |  | 0 | 1 | 2 |
| `/Admin/PlaceholderManagement` | Placeholder Management |  | 0 | 1 | 1 |
| `/Admin/PriceConfiguration` | Price Configurations |  | 0 | 1 | 2 |
| `/Admin/PriceImportMappings` | Price Import Mappings |  | 0 | 1 | 2 |
| `/Admin/PriceNotifications` | Price Notifications |  | 0 | 1 | 5 |
| `/Admin/PriceTranslations` | Price Translations |  | 0 | 1 | 2 |
| `/Admin/QuantityDistributionManagement` | Quantity Distribution |  | 0 | 1 | 1 |
| `/Admin/Users` | Users |  | 0 | 1 | 2 |
| `/Admin/VolumeThresholds` | Volume Thresholds |  | 0 | 1 | 1 |
| `/AdminDashboard` | Admin Dashboard |  | 0 | 1 | 6 |
| `/Analytics/ByChannel` | By Channel |  | 0 | 1 | 1 |
| `/Analytics/ByContract` | By Contract |  | 0 | 1 | 1 |
| `/Analytics/ByCustomer` | By Customer |  | 0 | 1 | 1 |
| `/Analytics/ByTerminal` | By Terminal |  | 0 | 1 | 1 |
| `/BuyNow/Prompt` | Prompt |  | 0 | 1 | 0 |
| `/ContractManagement/ContractRevaluation` | Contract Revaluation |  | 0 | 1 | 2 |
| `/ContractManagement/Contracts` | Contracts |  | 0 | 1 | 1 |
| `/ContractManagement/FormulaTemplates` | Formula Templates |  | 0 | 1 | 2 |
| `/ContractManagement/Measurements` | Contract Measurement |  | 0 | 1 | 0 |
| `/OrderDashboard` | Dashboard |  | 0 | 1 | 4 |
| `/PricingEngine/Calculations` | Calculations |  | 0 | 1 | 0 |
| `/PricingEngine/Prices` | Prices |  | 0 | 1 | 0 |
| `/PricingEngine/QuoteBookEOD` | Daily |  | 0 | 1 | 2 |
| `/PricingEngine/QuoteBookMidday` | Midday |  | 0 | 1 | 2 |
| `/SuperUserAdmin/MPIManagement` | MPI Management |  | 0 | 1 | 2 |

## Pages clean (no page errors, no console errors)


## All distinct missing fixtures

- `Admin/CounterPartyManagement/GetMetaData`
- `Admin/CounterPartyManagement/Read`
- `Admin/LocationManagement/GetMetaData`
- `Admin/LocationManagement/read`
- `Admin/NetGrossRules/GetAll`
- `Admin/NetGrossRules/Metadata`
- `Admin/ProductManagement/GetMetaData`
- `Admin/ProductManagement/read`
- `Admin/UserManagement/GetDataForUserManagement`
- `Admin/UserManagement/ReadUsers`
- `Application/UserDefinedPageView/Read`
- `AvailabilityMaintenance/GetAvailabilityMaintenanceGridData`
- `ContractManagement/report/GetAll`
- `ContractRevaluation/GetContractValuations`
- `ContractRevaluation/GetMetaData`
- `DeliveryPeriodManagement/GetDeliveryPeriodConfigurations`
- `DeliveryPeriodManagement/GetMetaData`
- `EntityReport/GetSchema`
- `FormulaTemplateManagement/GetAll`
- `FormulaTemplateManagement/Metadata`
- `MarketPlatform/Admin/AllocationFileImportManagement/GetSupplierMetadata`
- `MarketPlatform/Admin/AllocationFileImportManagement/ReadSupplierTranslations`
- `MarketPlatform/Admin/Calendar/GetMetadata`
- `MarketPlatform/Admin/OrderAllocationStatus/GetOrderAllocationData`
- `MarketPlatform/Admin/PriceConfiguration/GetAll`
- `MarketPlatform/Admin/PriceConfiguration/MetaData`
- `MarketPlatform/Admin/TradeEntrySetup/GetMetaData`
- `MarketPlatform/Admin/TradeEntrySetup/Read`
- `MarketPlatform/Admin/TradeEntrySetupVolumeConstraints/ReadTradeEntrySetupVolumeThresholds`
- `MarketPlatform/AdminOrderDashboard/GetPendingOrders`
- `MarketPlatform/AdminOrderDashboard/GetProcessedForwardVolume`
- `MarketPlatform/AdminOrderDashboard/GetProcessedProfit`
- `MarketPlatform/AdminOrderDashboard/GetProcessedPromptVolume`
- `MarketPlatform/AdminOrderDashboard/GetProcessedVolume`
- `MarketPlatform/AdminOrderDashboard/GetRecentlyProcessedOrders`
- `MarketPlatform/CalculatedPriceReport/GetSecondaryPriceBreakdown`
- `MarketPlatform/CalculatedPriceReport/ReadCalculatedValues`
- `MarketPlatform/CalculatedPriceReport/ReadMetadata`
- `MarketPlatform/ContractTemplates/GetAll`
- `MarketPlatform/ContractTemplates/Metadata`
- `MarketPlatform/MarketPlatformAllSpecialOffers/GetAllSpecialOffers`
- `MarketPlatform/OrderEntry/GetOrderEntryData`
- `MarketPlatform/OrderEntry/GetPricesForDashboard`
- `MarketPlatform/OrderReporting/GetCreditWidget`
- `MarketPlatform/OrderReporting/GetPendingOrders`
- `MarketPlatform/OrderReporting/GetRecentlyProcessedOrders`
- `MarketPlatform/PlaceholderPriceManagement/GetPlaceholders`
- `MarketPlatform/QuantityDistribution/GetQuantityDistributionWeights`
- `MarketPlatform/SpecialOfferAdmin/GetMetadata`
- `MarketPlatform/SpecialOfferAdmin/GetSpecialOffers`
- `OpisInstruments/Admin/GetAllOpisCurves`
- `OpisInstruments/Admin/GetMetadata`
- `PriceImport/TranslatedIdentifiers/GetAll`
- `PriceImport/TranslatedIdentifiers/MetaData`
- `PriceImport/TranslationManagement/GetMetadata`
- `PriceImport/TranslationManagement/GetPriceTranslationData`
- `PriceInstrumentUpload/GetPriceInstrumentUploadData`
- `PriceNotifications/SubscriptionManagement/GetAvailableLocations`
- `PriceNotifications/SubscriptionManagement/GetAvailableProducts`
- `PriceNotifications/SubscriptionManagement/GetMetadata`
- `PriceNotifications/SubscriptionManagement/GetRecipientData`
- `PriceNotifications/SubscriptionManagement/GetSubscriptions`
- `PricePerformance/ByChannel`
- `PricePerformance/ByContract`
- `PricePerformance/ByCustomer`
- `PricePerformance/ByTerminal`
- `PricingEngine/Admin/Calendar/GetMetadata`
- `PricingEngine/Admin/Calendar/Read`
- `QuoteBook/Analytics/Allocation/Admin/GetAllocations`
- `QuoteBook/Analytics/Allocation/Admin/GetAssociations`
- `QuoteBook/GetMetaData`
- `QuoteBook/GetRows`
- `ReferenceData/CodeSet/Get`
- `ReferenceData/CounterPartyHierarchy/CounterParty/Get`
- `ReferenceData/CounterPartyHierarchy/CounterParty/List`
- `ReferenceData/Hierarchy/Location/List`
- `ReferenceData/Hierarchy/Product/List`
- `ReferenceData/PricePublisher/Get`
- `admin/allocation/management/GetMetadata`
- `admin/allocation/management/ReadManagementData`
- `admin/allocation/reference/GetMetaDataForReferences`
- `admin/allocation/reference/GetReferences`
- `marketPlatform/admin/marketPlatformInstrument/GetAllMarketPlatformInstruments`
- `marketPlatform/admin/marketPlatformInstrument/GetMetaData`

## Detailed errors by page

### `/` — Home
- final URL: http://localhost:3001/OrderDashboard
- root length: 185947
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/OrderEntry/GetPricesForDashboard`, `MarketPlatform/OrderReporting/GetCreditWidget`, `MarketPlatform/OrderReporting/GetPendingOrders`, `MarketPlatform/OrderReporting/GetRecentlyProcessedOrders`

### `/Admin/AllocationAssociationManagement` — Allocation Management
- final URL: http://localhost:3001/Admin/AllocationAssociationManagement
- root length: 0
- **pageerror 1:** rowData.forEach is not a function
ImmutableService2.createTransactionForRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53729:19)
```
TypeError: rowData.forEach is not a function
ImmutableService2.createTransactionForRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53729:19)
    at ImmutableService2.createTransactionForRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53729:19)
    at ImmutableService2.setRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53703:38)
    at GridApi2.setRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:21403:33)
    at GridApi2.__updateProperty (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:21267:33)
    at <anonymous> (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:5676:22)
    at ComponentUtil2.processOnChange (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:5675:17)
```
- **console.error 1:** The above error occurred in the <AgGridReactUi> component:

    at AgGridReactUi (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:33330:36)
    at AgGridReact3 (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:34032:47)
    at div
    at div
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `QuoteBook/Analytics/Allocation/Admin/GetAllocations`, `QuoteBook/Analytics/Allocation/Admin/GetAssociations`, `admin/allocation/reference/GetMetaDataForReferences`, `admin/allocation/reference/GetReferences`

### `/Admin/AllocationMappings` — Allocation Mappings
- final URL: http://localhost:3001/Admin/AllocationMappings
- root length: 0
- **pageerror 1:** rowData.forEach is not a function
ImmutableService2.createTransactionForRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53729:19)
```
TypeError: rowData.forEach is not a function
ImmutableService2.createTransactionForRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53729:19)
    at ImmutableService2.createTransactionForRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53729:19)
    at ImmutableService2.setRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53703:38)
    at GridApi2.setRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:21403:33)
    at GridApi2.__updateProperty (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:21267:33)
    at <anonymous> (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:5676:22)
    at ComponentUtil2.processOnChange (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:5675:17)
```
- **console.error 1:** The above error occurred in the <AgGridReactUi> component:

    at AgGridReactUi (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:33330:36)
    at AgGridReact3 (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:34032:47)
    at div
    at div
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/Admin/AllocationFileImportManagement/GetSupplierMetadata`, `MarketPlatform/Admin/AllocationFileImportManagement/ReadSupplierTranslations`

### `/Admin/AppliedAllocationReport` — Applied Allocation Report
- final URL: http://localhost:3001/Admin/AppliedAllocationReport
- root length: 0
- **pageerror 1:** rowData.forEach is not a function
ImmutableService2.createTransactionForRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53729:19)
```
TypeError: rowData.forEach is not a function
ImmutableService2.createTransactionForRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53729:19)
    at ImmutableService2.createTransactionForRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53729:19)
    at ImmutableService2.setRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53703:38)
    at GridApi2.setRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:21403:33)
    at GridApi2.__updateProperty (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:21267:33)
    at <anonymous> (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:5676:22)
    at ComponentUtil2.processOnChange (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:5675:17)
```
- **console.error 1:** The above error occurred in the <AgGridReactUi> component:

    at AgGridReactUi (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:33330:36)
    at AgGridReact3 (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:34032:47)
    at div
    at div
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/Admin/OrderAllocationStatus/GetOrderAllocationData`

### `/Admin/AuthorizationAllocationAssociations` — Authorization Allocations
- final URL: http://localhost:3001/Admin/AuthorizationAllocationAssociations
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'map')
```
TypeError: Cannot read properties of undefined (reading 'map')
    at getAllocationData (http://localhost:3001/src/modules/Admin/ManageAllocationAssociations/components/mappingEvents.ts:25:46)
    at <anonymous> (http://localhost:3001/src/modules/Admin/ManageAllocationAssociations/components/AuthorizationAllocationMappings.tsx:56:12)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at AuthorizationAllocationMappings (http://localhost:3001/src/modules/Admin/ManageAllocationAssociations/components/AuthorizationAllocationMappings.tsx:53:23)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **pageerror 2:** Cannot read properties of undefined (reading 'map')
```
TypeError: Cannot read properties of undefined (reading 'map')
    at getAllocationData (http://localhost:3001/src/modules/Admin/ManageAllocationAssociations/components/mappingEvents.ts:25:46)
    at <anonymous> (http://localhost:3001/src/modules/Admin/ManageAllocationAssociations/components/AuthorizationAllocationMappings.tsx:56:12)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at AuthorizationAllocationMappings (http://localhost:3001/src/modules/Admin/ManageAllocationAssociations/components/AuthorizationAllocationMappings.tsx:53:23)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **console.error 1:** The above error occurred in the <AuthorizationAllocationMappings> component:

    at AuthorizationAllocationMappings (http://localhost:3001/src/modules/Admin/ManageAllocationAssociations/components/AuthorizationAllocationMappings.tsx:27:3)
    at div
    at TabPane (http://localhost:3001/node_modules/.vite/deps/chunk-SZ33DJ26.js?v=5e2cf333:17493:24)
    at div
    at div
    at TabPanelList (http:
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `admin/allocation/management/GetMetadata`, `admin/allocation/management/ReadManagementData`, `admin/allocation/reference/GetMetaDataForReferences`, `admin/allocation/reference/GetReferences`

### `/Admin/Availability` — Availability
- final URL: http://localhost:3001/Admin/Availability
- root length: 52534
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `AvailabilityMaintenance/GetAvailabilityMaintenanceGridData`, `admin/allocation/management/ReadManagementData`, `admin/allocation/reference/GetMetaDataForReferences`, `admin/allocation/reference/GetReferences`

### `/Admin/CalculatedValueReport` — Current Prices
- final URL: http://localhost:3001/Admin/CalculatedValueReport
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading '0')
```
TypeError: Cannot read properties of undefined (reading '0')
    at <anonymous> (http://localhost:3001/src/modules/SellingPlatform/CalculatedValueReport/index.tsx:74:50)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at CalculatedValueReport (http://localhost:3001/src/modules/SellingPlatform/CalculatedValueReport/index.tsx:66:40)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
```
- **pageerror 2:** Cannot read properties of undefined (reading '0')
```
TypeError: Cannot read properties of undefined (reading '0')
    at <anonymous> (http://localhost:3001/src/modules/SellingPlatform/CalculatedValueReport/index.tsx:74:50)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at CalculatedValueReport (http://localhost:3001/src/modules/SellingPlatform/CalculatedValueReport/index.tsx:66:40)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
```
- **console.error 1:** The above error occurred in the <CalculatedValueReport> component:

    at CalculatedValueReport (http://localhost:3001/src/modules/SellingPlatform/CalculatedValueReport/index.tsx:27:61)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3251:5)
    at Outlet (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3630:26)
    at Re
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/CalculatedPriceReport/GetSecondaryPriceBreakdown`, `MarketPlatform/CalculatedPriceReport/ReadCalculatedValues`, `MarketPlatform/CalculatedPriceReport/ReadMetadata`

### `/Admin/CalendarManagement` — Calendar Management
- final URL: http://localhost:3001/Admin/CalendarManagement
- root length: 74296
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `PricingEngine/Admin/Calendar/GetMetadata`, `PricingEngine/Admin/Calendar/Read`

### `/Admin/CalendarPeriods` — Calendar Periods
- final URL: http://localhost:3001/Admin/CalendarPeriods
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading '0')
```
TypeError: Cannot read properties of undefined (reading '0')
    at CalendarPeriods (http://localhost:3001/src/modules/CalendarPeriods/Calendar/index.tsx:272:51)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
    at beginWork (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:15457:22)
    at callCallback2 (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3575:22)
    at sentryWrapped (http://localhost:3001/node_modules/.vite/deps/@sentry_react.js?v=4357a569:1909:17)
    at invokeGuardedCallbackDev (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3600:24)
```
- **pageerror 2:** Cannot read properties of undefined (reading '0')
```
TypeError: Cannot read properties of undefined (reading '0')
    at CalendarPeriods (http://localhost:3001/src/modules/CalendarPeriods/Calendar/index.tsx:272:51)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
    at beginWork (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:15457:22)
    at callCallback2 (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3575:22)
    at sentryWrapped (http://localhost:3001/node_modules/.vite/deps/@sentry_react.js?v=4357a569:1909:17)
    at invokeGuardedCallbackDev (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3600:24)
```
- **console.error 1:** The above error occurred in the <CalendarPeriods> component:

    at CalendarPeriods (http://localhost:3001/src/modules/CalendarPeriods/Calendar/index.tsx:36:7)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3251:5)
    at Outlet (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3630:26)
    at RenderedRoute (http://localh
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/Admin/Calendar/GetMetadata`

### `/Admin/Counterparties` — Manage Counterparties
- final URL: http://localhost:3001/Admin/Counterparties
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'map')
```
TypeError: Cannot read properties of undefined (reading 'map')
    at getCounterpartyColumnDefs (http://localhost:3001/src/modules/Admin/ManageCounterparties/components/Grid/Columns/columnDefs.tsx:188:50)
    at <anonymous> (http://localhost:3001/src/modules/Admin/ManageCounterparties/components/Grid/ManageCounterpartiesGrid.tsx:47:36)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at ManageCounterpartiesGrid (http://localhost:3001/src/modules/Admin/ManageCounterparties/components/Grid/ManageCounterpartiesGrid.tsx:47:22)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **pageerror 2:** Cannot read properties of undefined (reading 'map')
```
TypeError: Cannot read properties of undefined (reading 'map')
    at getCounterpartyColumnDefs (http://localhost:3001/src/modules/Admin/ManageCounterparties/components/Grid/Columns/columnDefs.tsx:188:50)
    at <anonymous> (http://localhost:3001/src/modules/Admin/ManageCounterparties/components/Grid/ManageCounterpartiesGrid.tsx:47:36)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at ManageCounterpartiesGrid (http://localhost:3001/src/modules/Admin/ManageCounterparties/components/Grid/ManageCounterpartiesGrid.tsx:47:22)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **console.error 1:** The above error occurred in the <ManageCounterpartiesGrid> component:

    at ManageCounterpartiesGrid (http://localhost:3001/src/modules/Admin/ManageCounterparties/components/Grid/ManageCounterpartiesGrid.tsx:25:3)
    at div
    at Vertical (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:64495:3)
    at div
    at Horizontal (http://localhost:3001/node_module
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `Admin/CounterPartyManagement/GetMetaData`, `Admin/CounterPartyManagement/Read`

### `/Admin/CounterpartyHierarchy` — Counterparty Hierarchy
- final URL: http://localhost:3001/Admin/CounterpartyHierarchy
- root length: 0
- **pageerror 1:** hierarchies.map is not a function
```
TypeError: hierarchies.map is not a function
    at <anonymous> (http://localhost:3001/src/components/shared/Hierarchies/components/HierarchySelector.tsx:28:24)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at HierarchySelector (http://localhost:3001/src/components/shared/Hierarchies/components/HierarchySelector.tsx:25:19)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
```
- **pageerror 2:** nodes.filter is not a function
```
TypeError: nodes.filter is not a function
    at sortTree (http://localhost:3001/src/components/shared/Hierarchies/helpers.ts:8:14)
    at <anonymous> (http://localhost:3001/src/components/shared/Hierarchies/components/TreeView.tsx:55:20)
    at mountMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12398:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12722:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at TreeView (http://localhost:3001/src/components/shared/Hierarchies/components/TreeView.tsx:53:20)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **pageerror 3:** hierarchies.map is not a function
```
TypeError: hierarchies.map is not a function
    at <anonymous> (http://localhost:3001/src/components/shared/Hierarchies/components/HierarchySelector.tsx:28:24)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at HierarchySelector (http://localhost:3001/src/components/shared/Hierarchies/components/HierarchySelector.tsx:25:19)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
```
- **pageerror 4:** nodes.filter is not a function
```
TypeError: nodes.filter is not a function
    at sortTree (http://localhost:3001/src/components/shared/Hierarchies/helpers.ts:8:14)
    at <anonymous> (http://localhost:3001/src/components/shared/Hierarchies/components/TreeView.tsx:55:20)
    at mountMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12398:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12722:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at TreeView (http://localhost:3001/src/components/shared/Hierarchies/components/TreeView.tsx:53:20)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **console.error 1:** The above error occurred in the <HierarchySelector> component:

    at HierarchySelector (http://localhost:3001/src/components/shared/Hierarchies/components/HierarchySelector.tsx:20:3)
    at div
    at Vertical (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:64495:3)
    at div
    at Horizontal (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_exca
- **console.error 2:** The above error occurred in the <TreeView> component:

    at TreeView (http://localhost:3001/src/components/shared/Hierarchies/components/TreeView.tsx:38:3)
    at CounterpartyTree (http://localhost:3001/src/modules/Admin/ManageCounterpartyHierarchy/components/counterpartyTree.tsx:24:3)
    at div
    at Vertical (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063
- **console.error 3:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `ReferenceData/CounterPartyHierarchy/CounterParty/Get`, `ReferenceData/CounterPartyHierarchy/CounterParty/List`

### `/Admin/DeliveryPeriods` — Delivery Periods
- final URL: http://localhost:3001/Admin/DeliveryPeriods
- root length: 27781
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `DeliveryPeriodManagement/GetDeliveryPeriodConfigurations`, `DeliveryPeriodManagement/GetMetaData`

### `/Admin/FormulaTemplates` — Formula Templates
- final URL: http://localhost:3001/Admin/FormulaTemplates
- root length: 86388
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/ContractTemplates/GetAll`, `MarketPlatform/ContractTemplates/Metadata`

### `/Admin/Instruments` — Price Instruments
- final URL: http://localhost:3001/Admin/Instruments
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'map')
```
TypeError: Cannot read properties of undefined (reading 'map')
    at ManagePriceInstrumentsPage (http://localhost:3001/src/modules/Admin/ManagePriceInstruments/index.tsx:263:72)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
    at beginWork (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:15457:22)
    at callCallback2 (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3575:22)
    at sentryWrapped (http://localhost:3001/node_modules/.vite/deps/@sentry_react.js?v=4357a569:1909:17)
    at invokeGuardedCallbackDev (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3600:24)
```
- **pageerror 2:** Cannot read properties of undefined (reading 'map')
```
TypeError: Cannot read properties of undefined (reading 'map')
    at ManagePriceInstrumentsPage (http://localhost:3001/src/modules/Admin/ManagePriceInstruments/index.tsx:263:72)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
    at beginWork (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:15457:22)
    at callCallback2 (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3575:22)
    at sentryWrapped (http://localhost:3001/node_modules/.vite/deps/@sentry_react.js?v=4357a569:1909:17)
    at invokeGuardedCallbackDev (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3600:24)
```
- **console.error 1:** The above error occurred in the <ManagePriceInstrumentsPage> component:

    at ManagePriceInstrumentsPage (http://localhost:3001/src/modules/Admin/ManagePriceInstruments/index.tsx:30:7)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3251:5)
    at Outlet (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3630:26)
    at Re
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `PriceInstrumentUpload/GetPriceInstrumentUploadData`

### `/Admin/IntegrationStatus` — Extract Status Report
- final URL: http://localhost:3001/Admin/IntegrationStatus
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'EntityView')
```
TypeError: Cannot read properties of undefined (reading 'EntityView')
    at <anonymous> (http://localhost:3001/src/hooks/useEntityReport.ts:26:54)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at useEntityReport (http://localhost:3001/src/hooks/useEntityReport.ts:26:22)
    at EntityReport (http://localhost:3001/src/components/shared/EntityReport/components/index.tsx:50:7)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **pageerror 2:** Cannot read properties of undefined (reading 'EntityView')
```
TypeError: Cannot read properties of undefined (reading 'EntityView')
    at <anonymous> (http://localhost:3001/src/hooks/useEntityReport.ts:26:54)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at useEntityReport (http://localhost:3001/src/hooks/useEntityReport.ts:26:22)
    at EntityReport (http://localhost:3001/src/components/shared/EntityReport/components/index.tsx:50:7)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **console.error 1:** The above error occurred in the <EntityReport> component:

    at EntityReport (http://localhost:3001/src/components/shared/EntityReport/components/index.tsx:28:3)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3251:5)
    at Outlet (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3630:26)
    at RenderedRoute (http://loc
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `EntityReport/GetSchema`

### `/Admin/Locations` — Locations
- final URL: http://localhost:3001/Admin/Locations
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'map')
```
TypeError: Cannot read properties of undefined (reading 'map')
    at ManageLocationGroups (http://localhost:3001/src/modules/Admin/ManageLocations/components/ManagementPane/ManageLocationGroups/index.tsx:33:56)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
    at beginWork (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:15457:22)
    at callCallback2 (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3575:22)
    at sentryWrapped (http://localhost:3001/node_modules/.vite/deps/@sentry_react.js?v=4357a569:1909:17)
    at invokeGuardedCallbackDev (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3600:24)
```
- **pageerror 2:** Cannot read properties of undefined (reading 'map')
```
TypeError: Cannot read properties of undefined (reading 'map')
    at ManageLocationGroups (http://localhost:3001/src/modules/Admin/ManageLocations/components/ManagementPane/ManageLocationGroups/index.tsx:33:56)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
    at beginWork (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:15457:22)
    at callCallback2 (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3575:22)
    at sentryWrapped (http://localhost:3001/node_modules/.vite/deps/@sentry_react.js?v=4357a569:1909:17)
    at invokeGuardedCallbackDev (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3600:24)
```
- **console.error 1:** The above error occurred in the <ManageLocationGroups> component:

    at ManageLocationGroups (http://localhost:3001/src/modules/Admin/ManageLocations/components/ManagementPane/ManageLocationGroups/index.tsx:23:3)
    at div
    at Horizontal (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:48397:3)
    at div
    at TabPane (http://localhost:3001/node_modules/
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `Admin/LocationManagement/GetMetaData`, `Admin/LocationManagement/read`

### `/Admin/ManageOpisPrices` — Manage OPIS Curves
- final URL: http://localhost:3001/Admin/ManageOpisPrices
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'filter')
```
TypeError: Cannot read properties of undefined (reading 'filter')
    at <anonymous> (http://localhost:3001/src/modules/Admin/ManageOpisCurves/components/Grid/ManageOpisCurvesGrid.tsx:40:72)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at ManageOpisCurvesGrid (http://localhost:3001/src/modules/Admin/ManageOpisCurves/components/Grid/ManageOpisCurvesGrid.tsx:38:22)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
```
- **pageerror 2:** Cannot read properties of undefined (reading 'filter')
```
TypeError: Cannot read properties of undefined (reading 'filter')
    at <anonymous> (http://localhost:3001/src/modules/Admin/ManageOpisCurves/components/Grid/ManageOpisCurvesGrid.tsx:40:72)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at ManageOpisCurvesGrid (http://localhost:3001/src/modules/Admin/ManageOpisCurves/components/Grid/ManageOpisCurvesGrid.tsx:38:22)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
```
- **console.error 1:** The above error occurred in the <ManageOpisCurvesGrid> component:

    at ManageOpisCurvesGrid (http://localhost:3001/src/modules/Admin/ManageOpisCurves/components/Grid/ManageOpisCurvesGrid.tsx:25:3)
    at div
    at Vertical (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:64495:3)
    at div
    at Horizontal (http://localhost:3001/node_modules/.vite/deps/@gr
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `OpisInstruments/Admin/GetAllOpisCurves`, `OpisInstruments/Admin/GetMetadata`

### `/Admin/MarketPlatformSetups` — Market Platform Setups
- final URL: http://localhost:3001/Admin/MarketPlatformSetups
- root length: 83588
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/Admin/TradeEntrySetup/GetMetaData`, `MarketPlatform/Admin/TradeEntrySetup/Read`

### `/Admin/NetGrossDefaults` — Net / Gross Defaults
- final URL: http://localhost:3001/Admin/NetGrossDefaults
- root length: 27068
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `Admin/NetGrossRules/GetAll`, `Admin/NetGrossRules/Metadata`

### `/Admin/PlaceholderManagement` — Placeholder Management
- final URL: http://localhost:3001/Admin/PlaceholderManagement
- root length: 130942
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/PlaceholderPriceManagement/GetPlaceholders`

### `/Admin/PriceConfiguration` — Price Configurations
- final URL: http://localhost:3001/Admin/PriceConfiguration
- root length: 31349
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/Admin/PriceConfiguration/GetAll`, `MarketPlatform/Admin/PriceConfiguration/MetaData`

### `/Admin/PriceImportMappings` — Price Import Mappings
- final URL: http://localhost:3001/Admin/PriceImportMappings
- root length: 74868
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `PriceImport/TranslationManagement/GetMetadata`, `PriceImport/TranslationManagement/GetPriceTranslationData`

### `/Admin/PriceNotifications` — Price Notifications
- final URL: http://localhost:3001/Admin/PriceNotifications
- root length: 81863
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `PriceNotifications/SubscriptionManagement/GetAvailableLocations`, `PriceNotifications/SubscriptionManagement/GetAvailableProducts`, `PriceNotifications/SubscriptionManagement/GetMetadata`, `PriceNotifications/SubscriptionManagement/GetRecipientData`, `PriceNotifications/SubscriptionManagement/GetSubscriptions`

### `/Admin/PriceTranslations` — Price Translations
- final URL: http://localhost:3001/Admin/PriceTranslations
- root length: 123200
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `PriceImport/TranslatedIdentifiers/GetAll`, `PriceImport/TranslatedIdentifiers/MetaData`

### `/Admin/Products` — Products
- final URL: http://localhost:3001/Admin/Products
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'map')
```
TypeError: Cannot read properties of undefined (reading 'map')
    at ManageProductGroups (http://localhost:3001/src/modules/Admin/ManageProducts/components/ManagementPane/ManageProductGroups/index.tsx:33:54)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
    at beginWork (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:15457:22)
    at callCallback2 (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3575:22)
    at sentryWrapped (http://localhost:3001/node_modules/.vite/deps/@sentry_react.js?v=4357a569:1909:17)
    at invokeGuardedCallbackDev (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3600:24)
```
- **pageerror 2:** Cannot read properties of undefined (reading 'map')
```
TypeError: Cannot read properties of undefined (reading 'map')
    at ManageProductGroups (http://localhost:3001/src/modules/Admin/ManageProducts/components/ManagementPane/ManageProductGroups/index.tsx:33:54)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
    at beginWork (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:15457:22)
    at callCallback2 (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3575:22)
    at sentryWrapped (http://localhost:3001/node_modules/.vite/deps/@sentry_react.js?v=4357a569:1909:17)
    at invokeGuardedCallbackDev (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3600:24)
```
- **console.error 1:** The above error occurred in the <ManageProductGroups> component:

    at ManageProductGroups (http://localhost:3001/src/modules/Admin/ManageProducts/components/ManagementPane/ManageProductGroups/index.tsx:23:3)
    at div
    at Horizontal (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:48397:3)
    at div
    at TabPane (http://localhost:3001/node_modules/.vit
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `Admin/ProductManagement/GetMetaData`, `Admin/ProductManagement/read`

### `/Admin/Publishers` — Price Publishers
- final URL: http://localhost:3001/Admin/Publishers
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'CodeValues')
```
TypeError: Cannot read properties of undefined (reading 'CodeValues')
    at <anonymous> (http://localhost:3001/src/modules/Admin/PricePublishers/index.tsx:54:25)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at PricePublishersPage (http://localhost:3001/src/modules/Admin/PricePublishers/index.tsx:53:22)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
```
- **pageerror 2:** Cannot read properties of undefined (reading 'CodeValues')
```
TypeError: Cannot read properties of undefined (reading 'CodeValues')
    at <anonymous> (http://localhost:3001/src/modules/Admin/PricePublishers/index.tsx:54:25)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at PricePublishersPage (http://localhost:3001/src/modules/Admin/PricePublishers/index.tsx:53:22)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
```
- **console.error 1:** The above error occurred in the <PricePublishersPage> component:

    at PricePublishersPage (http://localhost:3001/src/modules/Admin/PricePublishers/index.tsx:31:19)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3251:5)
    at Outlet (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3630:26)
    at RenderedRoute (http://
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `ReferenceData/CodeSet/Get`, `ReferenceData/PricePublisher/Get`

### `/Admin/QuantityDistributionManagement` — Quantity Distribution
- final URL: http://localhost:3001/Admin/QuantityDistributionManagement
- root length: 46838
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/QuantityDistribution/GetQuantityDistributionWeights`

### `/Admin/Users` — Users
- final URL: http://localhost:3001/Admin/Users
- root length: 133959
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `Admin/UserManagement/GetDataForUserManagement`, `Admin/UserManagement/ReadUsers`

### `/Admin/VolumeThresholds` — Volume Thresholds
- final URL: http://localhost:3001/Admin/VolumeThresholds
- root length: 109766
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/Admin/TradeEntrySetupVolumeConstraints/ReadTradeEntrySetupVolumeThresholds`

### `/AdminDashboard` — Admin Dashboard
- final URL: http://localhost:3001/AdminDashboard
- root length: 237923
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/AdminOrderDashboard/GetPendingOrders`, `MarketPlatform/AdminOrderDashboard/GetProcessedForwardVolume`, `MarketPlatform/AdminOrderDashboard/GetProcessedProfit`, `MarketPlatform/AdminOrderDashboard/GetProcessedPromptVolume`, `MarketPlatform/AdminOrderDashboard/GetProcessedVolume`, `MarketPlatform/AdminOrderDashboard/GetRecentlyProcessedOrders`

### `/Analytics/ByChannel` — By Channel
- final URL: http://localhost:3001/Analytics/ByChannel
- root length: 82845
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `PricePerformance/ByChannel`

### `/Analytics/ByContract` — By Contract
- final URL: http://localhost:3001/Analytics/ByContract
- root length: 113545
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `PricePerformance/ByContract`

### `/Analytics/ByCustomer` — By Customer
- final URL: http://localhost:3001/Analytics/ByCustomer
- root length: 76388
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `PricePerformance/ByCustomer`

### `/Analytics/ByTerminal` — By Terminal
- final URL: http://localhost:3001/Analytics/ByTerminal
- root length: 76385
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `PricePerformance/ByTerminal`

### `/BuyNow/Forward` — Forward
- final URL: http://localhost:3001/BuyNow/Forward
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'MarketPlatformInstrumentId')
```
TypeError: Cannot read properties of undefined (reading 'MarketPlatformInstrumentId')
    at <anonymous> (http://localhost:3001/src/modules/SellingPlatform/BuyNow/Forwards/page.jsx:54:59)
    at commitHookEffectListMount (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:16438:34)
    at commitPassiveMountOnFiber (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:17679:19)
    at commitPassiveMountEffects_complete (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:17652:17)
    at commitPassiveMountEffects_begin (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:17642:15)
    at commitPassiveMountEffects (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:17632:11)
    at flushPassiveEffectsImpl (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:18985:11)
```
- **console.error 1:** The above error occurred in the <PageWrapper> component:

    at PageWrapper (http://localhost:3001/src/modules/SellingPlatform/BuyNow/Forwards/page.jsx:49:7)
    at ForwardsProvider (http://localhost:3001/src/contexts/ForwardsContext/index.tsx:28:3)
    at BuyForwardsPage
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3251:5)
    at RenderedRoute 
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/OrderEntry/GetOrderEntryData`

### `/BuyNow/Offers` — Offers
- final URL: http://localhost:3001/BuyNow/Offers
- root length: 123785
- **console.error 1:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:70021:5)
    at OffersGrid (http://localhost:3001/src/modules/SellingPlatform/BuyNo
- **console.error 2:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:70021:5)
    at OffersGrid (http://localhost:3001/src/modules/SellingPlatform/BuyNo
- **console.error 3:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:70021:5)
    at OffersGrid (http://localhost:3001/src/modules/SellingPlatform/BuyNo
- **console.error 4:** Failed to load resource: the server responded with a status of 429 ()
- **console.error 5:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:70021:5)
    at OffersGrid (http://localhost:3001/src/modules/SellingPlatform/BuyNo
- **console.error 6:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:70021:5)
    at OffersGrid (http://localhost:3001/src/modules/SellingPlatform/BuyNo
- **console.error 7:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:70021:5)
    at OffersGrid (http://localhost:3001/src/modules/SellingPlatform/BuyNo
- **console.error 8:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:70021:5)
    at OffersGrid (http://localhost:3001/src/modules/SellingPlatform/BuyNo
- **console.error 9:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:70021:5)
    at OffersGrid (http://localhost:3001/src/modules/SellingPlatform/BuyNo
- **console.error 10:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:70021:5)
    at OffersGrid (http://localhost:3001/src/modules/SellingPlatform/BuyNo
- missing fixtures: `MarketPlatform/MarketPlatformAllSpecialOffers/GetAllSpecialOffers`

### `/BuyNow/Prompt` — Prompt
- final URL: http://localhost:3001/BuyNow/Prompt
- root length: 25882
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()

### `/ContractManagement/ContractRevaluation` — Contract Revaluation
- final URL: http://localhost:3001/ContractManagement/ContractRevaluation
- root length: 112922
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `ContractRevaluation/GetContractValuations`, `ContractRevaluation/GetMetaData`

### `/ContractManagement/Contracts` — Contracts
- final URL: http://localhost:3001/ContractManagement/Contracts
- root length: 142442
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `ContractManagement/report/GetAll`

### `/ContractManagement/FormulaTemplates` — Formula Templates
- final URL: http://localhost:3001/ContractManagement/FormulaTemplates
- root length: 85340
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `FormulaTemplateManagement/GetAll`, `FormulaTemplateManagement/Metadata`

### `/ContractManagement/Measurements` — Contract Measurement
- final URL: http://localhost:3001/ContractManagement/Measurements
- root length: 216490
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()

### `/ContractManagement/MissingPrices` — Missing Prices
- final URL: http://localhost:3001/ContractManagement/MissingPrices
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'EntityView')
```
TypeError: Cannot read properties of undefined (reading 'EntityView')
    at <anonymous> (http://localhost:3001/src/hooks/useEntityReport.ts:26:54)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at useEntityReport (http://localhost:3001/src/hooks/useEntityReport.ts:26:22)
    at EntityReport (http://localhost:3001/src/components/shared/EntityReport/components/index.tsx:50:7)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **pageerror 2:** Cannot read properties of undefined (reading 'EntityView')
```
TypeError: Cannot read properties of undefined (reading 'EntityView')
    at <anonymous> (http://localhost:3001/src/hooks/useEntityReport.ts:26:54)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at useEntityReport (http://localhost:3001/src/hooks/useEntityReport.ts:26:22)
    at EntityReport (http://localhost:3001/src/components/shared/EntityReport/components/index.tsx:50:7)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **console.error 1:** The above error occurred in the <EntityReport> component:

    at EntityReport (http://localhost:3001/src/components/shared/EntityReport/components/index.tsx:28:3)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3251:5)
    at Outlet (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3630:26)
    at ContractsProvider (http:/
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `EntityReport/GetSchema`

### `/ContractManagement/Valuations` — Contract Values
- final URL: http://localhost:3001/ContractManagement/Valuations
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'EntityView')
```
TypeError: Cannot read properties of undefined (reading 'EntityView')
    at <anonymous> (http://localhost:3001/src/hooks/useEntityReport.ts:26:54)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at useEntityReport (http://localhost:3001/src/hooks/useEntityReport.ts:26:22)
    at EntityReport (http://localhost:3001/src/components/shared/EntityReport/components/index.tsx:50:7)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **pageerror 2:** Cannot read properties of undefined (reading 'EntityView')
```
TypeError: Cannot read properties of undefined (reading 'EntityView')
    at <anonymous> (http://localhost:3001/src/hooks/useEntityReport.ts:26:54)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at useEntityReport (http://localhost:3001/src/hooks/useEntityReport.ts:26:22)
    at EntityReport (http://localhost:3001/src/components/shared/EntityReport/components/index.tsx:50:7)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **console.error 1:** The above error occurred in the <EntityReport> component:

    at EntityReport (http://localhost:3001/src/components/shared/EntityReport/components/index.tsx:28:3)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3251:5)
    at Outlet (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3630:26)
    at ContractsProvider (http:/
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `EntityReport/GetSchema`

### `/OnlineOrders` — Online Orders
- final URL: http://localhost:3001/OnlineOrders
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'EntityView')
```
TypeError: Cannot read properties of undefined (reading 'EntityView')
    at <anonymous> (http://localhost:3001/src/hooks/useEntityReport.ts:26:54)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at useEntityReport (http://localhost:3001/src/hooks/useEntityReport.ts:26:22)
    at EntityReport (http://localhost:3001/src/components/shared/EntityReport/components/index.tsx:50:7)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **pageerror 2:** Cannot read properties of undefined (reading 'EntityView')
```
TypeError: Cannot read properties of undefined (reading 'EntityView')
    at <anonymous> (http://localhost:3001/src/hooks/useEntityReport.ts:26:54)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at useEntityReport (http://localhost:3001/src/hooks/useEntityReport.ts:26:22)
    at EntityReport (http://localhost:3001/src/components/shared/EntityReport/components/index.tsx:50:7)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **console.error 1:** The above error occurred in the <EntityReport> component:

    at EntityReport (http://localhost:3001/src/components/shared/EntityReport/components/index.tsx:28:3)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3251:5)
    at Outlet (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3630:26)
    at main
    at http://localh
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `EntityReport/GetSchema`

### `/OrderDashboard` — Dashboard
- final URL: http://localhost:3001/OrderDashboard
- root length: 186002
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/OrderEntry/GetPricesForDashboard`, `MarketPlatform/OrderReporting/GetCreditWidget`, `MarketPlatform/OrderReporting/GetPendingOrders`, `MarketPlatform/OrderReporting/GetRecentlyProcessedOrders`

### `/PricingEngine/Calculations` — Calculations
- final URL: http://localhost:3001/PricingEngine/Calculations
- root length: 25565
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()

### `/PricingEngine/CommandCenter` — Command Center
- final URL: http://localhost:3001/PricingEngine/CommandCenter
- root length: 0
- **pageerror 1:** hierarchyList?.map is not a function
```
TypeError: hierarchyList?.map is not a function
    at getAntOptionsFromHierarchyList (http://localhost:3001/src/modules/CommandCenter/components/PageSettingsModal/PageSettingsModal.tsx:45:27)
    at <anonymous> (http://localhost:3001/src/modules/CommandCenter/components/PageSettingsModal/PageSettingsModal.tsx:51:12)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at PageSettingsModal (http://localhost:3001/src/modules/CommandCenter/components/PageSettingsModal/PageSettingsModal.tsx:50:32)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **pageerror 2:** hierarchyList?.map is not a function
```
TypeError: hierarchyList?.map is not a function
    at getAntOptionsFromHierarchyList (http://localhost:3001/src/modules/CommandCenter/components/PageSettingsModal/PageSettingsModal.tsx:45:27)
    at <anonymous> (http://localhost:3001/src/modules/CommandCenter/components/PageSettingsModal/PageSettingsModal.tsx:51:12)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at PageSettingsModal (http://localhost:3001/src/modules/CommandCenter/components/PageSettingsModal/PageSettingsModal.tsx:50:32)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
```
- **console.error 1:** The above error occurred in the <PageSettingsModal> component:

    at PageSettingsModal (http://localhost:3001/src/modules/CommandCenter/components/PageSettingsModal/PageSettingsModal.tsx:25:3)
    at div
    at Vertical (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:64495:3)
    at CommandCenterPage (http://localhost:3001/src/modules/CommandCenter/CommandCen
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `Application/UserDefinedPageView/Read`, `ReferenceData/Hierarchy/Location/List`, `ReferenceData/Hierarchy/Product/List`

### `/PricingEngine/Prices` — Prices
- final URL: http://localhost:3001/PricingEngine/Prices
- root length: 25565
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()

### `/PricingEngine/QuoteBookEOD` — Daily
- final URL: http://localhost:3001/PricingEngine/QuoteBookEOD
- root length: 162850
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `QuoteBook/GetMetaData`, `QuoteBook/GetRows`

### `/PricingEngine/QuoteBookMidday` — Midday
- final URL: http://localhost:3001/PricingEngine/QuoteBookMidday
- root length: 139274
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `QuoteBook/GetMetaData`, `QuoteBook/GetRows`

### `/SpecialOffers` — Offers
- final URL: http://localhost:3001/SpecialOffers
- root length: 0
- **pageerror 1:** rowData.forEach is not a function
ImmutableService2.createTransactionForRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53729:19)
```
TypeError: rowData.forEach is not a function
ImmutableService2.createTransactionForRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53729:19)
    at ImmutableService2.createTransactionForRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53729:19)
    at ImmutableService2.setRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:53703:38)
    at GridApi2.setRowData (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:21403:33)
    at GridApi2.__updateProperty (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:21267:33)
    at <anonymous> (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:5676:22)
    at ComponentUtil2.processOnChange (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:5675:17)
```
- **console.error 1:** The above error occurred in the <AgGridReactUi> component:

    at AgGridReactUi (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:33330:36)
    at AgGridReact3 (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:34032:47)
    at div
    at div
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr
- **console.error 2:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `MarketPlatform/SpecialOfferAdmin/GetMetadata`, `MarketPlatform/SpecialOfferAdmin/GetSpecialOffers`

### `/SuperUserAdmin/MPIManagement` — MPI Management
- final URL: http://localhost:3001/SuperUserAdmin/MPIManagement
- root length: 170452
- **console.error 1:** Failed to load resource: the server responded with a status of 429 ()
- missing fixtures: `marketPlatform/admin/marketPlatformInstrument/GetAllMarketPlatformInstruments`, `marketPlatform/admin/marketPlatformInstrument/GetMetaData`
