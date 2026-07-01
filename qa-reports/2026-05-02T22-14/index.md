# Freddy QA crawl — 2026-05-02T22-14

**Base URL:** http://localhost:3001
**Routes crawled:** 52
**Crashes (navigation):** 0
**Page errors (uncaught):** 6
**Console errors (filtered):** 122
**Distinct missing fixtures:** 53

## Pages with errors (sorted by severity)

| Path | Title | Crash | PageErr | ConsoleErr | MissingFx |
|------|-------|-------|---------|------------|-----------|
| `/Admin/AuthorizationAllocationAssociations` | Authorization Allocations |  | 2 | 1 | 0 |
| `/Admin/PriceNotifications` | Price Notifications |  | 2 | 1 | 0 |
| `/Admin/Users` | Users |  | 1 | 1 | 0 |
| `/BuyNow/Forward` | Forward |  | 1 | 1 | 0 |
| `/Admin/DeliveryPeriods` | Delivery Periods |  | 0 | 96 | 2 |
| `/BuyNow/Offers` | Offers |  | 0 | 19 | 1 |
| `/Admin/Availability` | Availability |  | 0 | 1 | 1 |
| `/Admin/CalculatedValueReport` | Current Prices |  | 0 | 1 | 2 |
| `/Admin/CounterpartyHierarchy` | Counterparty Hierarchy |  | 0 | 1 | 1 |

## Pages clean (no page errors, no console errors)

- `/` Home
- `/Admin/AllocationAssociationManagement` Allocation Management
- `/Admin/AllocationMappings` Allocation Mappings
- `/Admin/AppliedAllocationReport` Applied Allocation Report
- `/Admin/CalendarManagement` Calendar Management
- `/Admin/CalendarPeriods` Calendar Periods
- `/Admin/Counterparties` Manage Counterparties
- `/Admin/FormulaTemplates` Formula Templates
- `/Admin/Instruments` Price Instruments
- `/Admin/IntegrationStatus` Extract Status Report
- `/Admin/Locations` Locations
- `/Admin/ManageOpisPrices` Manage OPIS Curves
- `/Admin/MarketPlatformSetups` Market Platform Setups
- `/Admin/NetGrossDefaults` Net / Gross Defaults
- `/Admin/PlaceholderManagement` Placeholder Management
- `/Admin/PriceConfiguration` Price Configurations
- `/Admin/PriceImportMappings` Price Import Mappings
- `/Admin/PriceTranslations` Price Translations
- `/Admin/Products` Products
- `/Admin/Publishers` Price Publishers
- `/Admin/QuantityDistributionManagement` Quantity Distribution
- `/Admin/VolumeThresholds` Volume Thresholds
- `/AdminDashboard` Admin Dashboard
- `/Analytics/ByChannel` By Channel
- `/Analytics/ByContract` By Contract
- `/Analytics/ByCustomer` By Customer
- `/Analytics/ByTerminal` By Terminal
- `/BuyNow/Prompt` Prompt
- `/ContractManagement/ContractRevaluation` Contract Revaluation
- `/ContractManagement/Contracts` Contracts
- `/ContractManagement/FormulaTemplates` Formula Templates
- `/ContractManagement/Measurements` Contract Measurement
- `/ContractManagement/MissingPrices` Missing Prices
- `/ContractManagement/Valuations` Contract Values
- `/OnlineOrders` Online Orders
- `/OrderDashboard` Dashboard
- `/PricingEngine/Calculations` Calculations
- `/PricingEngine/CommandCenter` Command Center
- `/PricingEngine/Prices` Prices
- `/PricingEngine/QuoteBookEOD` Daily
- `/PricingEngine/QuoteBookMidday` Midday
- `/SpecialOffers` Offers
- `/SuperUserAdmin/MPIManagement` MPI Management

## All distinct missing fixtures

- `Admin/NetGrossRules/GetAll`
- `Admin/NetGrossRules/Metadata`
- `AvailabilityMaintenance/GetAvailabilityMaintenanceGridData`
- `ContractRevaluation/GetContractValuations`
- `ContractRevaluation/GetMetaData`
- `DeliveryPeriodManagement/GetDeliveryPeriodConfigurations`
- `DeliveryPeriodManagement/GetMetaData`
- `EntityReport/Read`
- `FormulaTemplateManagement/GetAll`
- `FormulaTemplateManagement/Metadata`
- `MarketPlatform/Admin/AllocationFileImportManagement/GetSupplierMetadata`
- `MarketPlatform/Admin/AllocationFileImportManagement/ReadSupplierTranslations`
- `MarketPlatform/Admin/Calendar/ReadCalendarPeriods`
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
- `MarketPlatform/CalculatedPriceReport/ReadMetadata`
- `MarketPlatform/ContractTemplates/GetAll`
- `MarketPlatform/ContractTemplates/Metadata`
- `MarketPlatform/MarketPlatformAllSpecialOffers/GetAllSpecialOffers`
- `MarketPlatform/OrderEntry/GetPricesForDashboard`
- `MarketPlatform/OrderReporting/GetCreditWidget`
- `MarketPlatform/OrderReporting/GetPendingOrders`
- `MarketPlatform/OrderReporting/GetRecentlyProcessedOrders`
- `MarketPlatform/PlaceholderPriceManagement/GetPlaceholders`
- `MarketPlatform/QuantityDistribution/GetQuantityDistributionWeights`
- `MarketPlatform/SpecialOfferAdmin/GetMetadata`
- `MarketPlatform/SpecialOfferAdmin/GetSpecialOffers`
- `PriceImport/TranslatedIdentifiers/GetAll`
- `PriceImport/TranslatedIdentifiers/MetaData`
- `PriceImport/TranslationManagement/GetMetadata`
- `PriceImport/TranslationManagement/GetPriceTranslationData`
- `PricePerformance/ByChannel`
- `PricePerformance/ByContract`
- `PricePerformance/ByCustomer`
- `PricePerformance/ByTerminal`
- `PricingEngine/Admin/Calendar/GetMetadata`
- `PricingEngine/Admin/Calendar/Read`
- `QuoteBook/Analytics/Allocation/Admin/GetAllocations`
- `QuoteBook/Analytics/Allocation/Admin/GetAssociations`
- `ReferenceData/CounterPartyHierarchy/CounterParty/Items`
- `ReferenceData/Hierarchy/Location/List`
- `ReferenceData/Hierarchy/Product/List`

## Detailed errors by page

### `/Admin/AuthorizationAllocationAssociations` — Authorization Allocations
- final URL: http://localhost:3001/Admin/AuthorizationAllocationAssociations
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'reduce')
```
TypeError: Cannot read properties of undefined (reading 'reduce')
    at <anonymous> (http://localhost:3001/src/modules/Admin/ManageAllocationAssociations/components/AuthorizationAllocationMappings.tsx:64:69)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at AuthorizationAllocationMappings (http://localhost:3001/src/modules/Admin/ManageAllocationAssociations/components/AuthorizationAllocationMappings.tsx:58:30)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
```
- **pageerror 2:** Cannot read properties of undefined (reading 'reduce')
```
TypeError: Cannot read properties of undefined (reading 'reduce')
    at <anonymous> (http://localhost:3001/src/modules/Admin/ManageAllocationAssociations/components/AuthorizationAllocationMappings.tsx:64:69)
    at updateMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12414:27)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:12930:24)
    at useMemo (http://localhost:3001/node_modules/.vite/deps/chunk-YP55OVAM.js?v=5e2cf333:1014:29)
    at AuthorizationAllocationMappings (http://localhost:3001/src/modules/Admin/ManageAllocationAssociations/components/AuthorizationAllocationMappings.tsx:58:30)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at updateFunctionComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14151:28)
```
- **console.error 1:** The above error occurred in the <AuthorizationAllocationMappings> component:

    at AuthorizationAllocationMappings (http://localhost:3001/src/modules/Admin/ManageAllocationAssociations/components/AuthorizationAllocationMappings.tsx:27:3)
    at div
    at TabPane (http://localhost:3001/node_modules/.vite/deps/chunk-SZ33DJ26.js?v=5e2cf333:17493:24)
    at div
    at div
    at TabPanelList (http:

### `/Admin/Availability` — Availability
- final URL: http://localhost:3001/Admin/Availability
- root length: 76877
- **console.error 1:** Warning: Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.%s 
    at p
    at Texto (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:48301:3)
    at div
    at Horizontal (http://localhost:3001/node_modules/.vite/deps/@gravitate
- missing fixtures: `AvailabilityMaintenance/GetAvailabilityMaintenanceGridData`

### `/Admin/CalculatedValueReport` — Current Prices
- final URL: http://localhost:3001/Admin/CalculatedValueReport
- root length: 101481
- **console.error 1:** Warning: Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.%s 
    at span
    at SingleSelector2 (http://localhost:3001/node_modules/.vite/deps/chunk-SZ33DJ26.js?v=5e2cf333:2360:28)
    at div
    at Selector2 (http://localhost:3001/node_modules/.vite/deps/chunk-S
- missing fixtures: `MarketPlatform/CalculatedPriceReport/GetSecondaryPriceBreakdown`, `MarketPlatform/CalculatedPriceReport/ReadMetadata`

### `/Admin/CounterpartyHierarchy` — Counterparty Hierarchy
- final URL: http://localhost:3001/Admin/CounterpartyHierarchy
- root length: 78431
- **console.error 1:** Warning: Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.%s 
    at h4
    at Texto (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:48301:3)
    at div
    at div
    at GridTitle$1 (http://localhost:3001/node_modules/.vite/de
- missing fixtures: `ReferenceData/CounterPartyHierarchy/CounterParty/Items`

### `/Admin/DeliveryPeriods` — Delivery Periods
- final URL: http://localhost:3001/Admin/DeliveryPeriods
- root length: 28533
- **console.error 1:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at ManageDeliveryPeriods (http://localhost:3001/src/modules/Admin/ManageDeliveryPeriods/index.tsx:31:22)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VX
- **console.error 2:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at ManageDeliveryPeriods (http://localhost:3001/src/modules/Admin/ManageDeliveryPeriods/index.tsx:31:22)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VX
- **console.error 3:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at ManageDeliveryPeriods (http://localhost:3001/src/modules/Admin/ManageDeliveryPeriods/index.tsx:31:22)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VX
- **console.error 4:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at ManageDeliveryPeriods (http://localhost:3001/src/modules/Admin/ManageDeliveryPeriods/index.tsx:31:22)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VX
- **console.error 5:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at ManageDeliveryPeriods (http://localhost:3001/src/modules/Admin/ManageDeliveryPeriods/index.tsx:31:22)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VX
- **console.error 6:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at ManageDeliveryPeriods (http://localhost:3001/src/modules/Admin/ManageDeliveryPeriods/index.tsx:31:22)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VX
- **console.error 7:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at ManageDeliveryPeriods (http://localhost:3001/src/modules/Admin/ManageDeliveryPeriods/index.tsx:31:22)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VX
- **console.error 8:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at ManageDeliveryPeriods (http://localhost:3001/src/modules/Admin/ManageDeliveryPeriods/index.tsx:31:22)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VX
- **console.error 9:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at ManageDeliveryPeriods (http://localhost:3001/src/modules/Admin/ManageDeliveryPeriods/index.tsx:31:22)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VX
- **console.error 10:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at ManageDeliveryPeriods (http://localhost:3001/src/modules/Admin/ManageDeliveryPeriods/index.tsx:31:22)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VX
- missing fixtures: `DeliveryPeriodManagement/GetDeliveryPeriodConfigurations`, `DeliveryPeriodManagement/GetMetaData`

### `/Admin/PriceNotifications` — Price Notifications
- final URL: http://localhost:3001/Admin/PriceNotifications
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'Write')
```
TypeError: Cannot read properties of undefined (reading 'Write')
    at ManagePriceNotifications (http://localhost:3001/src/modules/Admin/ManagePriceNotifications/SubscriptionManagement/page.tsx:33:78)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at mountIndeterminateComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14492:21)
    at beginWork (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:15447:22)
    at callCallback2 (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3575:22)
    at invokeGuardedCallbackDev (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3600:24)
    at invokeGuardedCallback (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3634:39)
```
- **pageerror 2:** Cannot read properties of undefined (reading 'Write')
```
TypeError: Cannot read properties of undefined (reading 'Write')
    at ManagePriceNotifications (http://localhost:3001/src/modules/Admin/ManagePriceNotifications/SubscriptionManagement/page.tsx:33:78)
    at renderWithHooks (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:11763:26)
    at mountIndeterminateComponent (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:14492:21)
    at beginWork (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:15447:22)
    at callCallback2 (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3575:22)
    at invokeGuardedCallbackDev (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3600:24)
    at invokeGuardedCallback (http://localhost:3001/node_modules/.vite/deps/chunk-ZRYTYW4C.js?v=5e2cf333:3634:39)
```
- **console.error 1:** The above error occurred in the <ManagePriceNotifications> component:

    at ManagePriceNotifications (http://localhost:3001/src/modules/Admin/ManagePriceNotifications/SubscriptionManagement/page.tsx:32:7)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3251:5)
    at Outlet (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf33

### `/Admin/Users` — Users
- final URL: http://localhost:3001/Admin/Users
- root length: 0
- **pageerror 1:** Cannot read properties of undefined (reading 'Text')
```
TypeError: Cannot read properties of undefined (reading 'Text')
    at valueGetter (http://localhost:3001/src/modules/Admin/ManageUsers/components/colDefs.tsx:295:118)
    at ValueService2.executeValueGetter (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:45791:20)
    at ValueService2.getValue (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:45610:25)
    at RowNode2.getValueFromValueService (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:17707:45)
    at CellCtrl2.updateAndFormatValue (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:27022:35)
    at CellCtrl2 (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:26477:15)
    at <anonymous> (http://localhost:3001/node_modules/.vite/deps/chunk-ORJMJRMT.js?v=5e2cf333:27747:24)
```
- **console.error 1:** The above error occurred in the <GraviGrid> component:

    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:70021:5)
    at div
    at ManageUsers (http://localhost:3001/src/modules/Admin/ManageUsers/index.tsx:33:7)
    at RenderedRoute (http://localhost:3001/node_modules/.vite/deps/chunk-VXUUUR2W.js?v=5e2cf333:3251:5)
    at Outlet (http://localho

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
- **console.error 4:** Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.%s 
    at GraviGrid (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:70021:5)
    at OffersGrid (http://localhost:3001/src/modules/SellingPlatform/BuyNo
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
