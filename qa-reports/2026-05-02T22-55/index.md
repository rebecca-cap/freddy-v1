# Freddy QA crawl — 2026-05-02T22-55

**Base URL:** http://localhost:3001
**Routes crawled:** 52
**Crashes (navigation):** 0
**Page errors (uncaught):** 2
**Console errors (filtered):** 5
**Distinct missing fixtures:** 3

## Pages with errors (sorted by severity)

| Path | Title | Crash | PageErr | ConsoleErr | MissingFx |
|------|-------|-------|---------|------------|-----------|
| `/Admin/PriceNotifications` | Price Notifications |  | 2 | 1 | 0 |
| `/Admin/CounterpartyHierarchy` | Counterparty Hierarchy |  | 0 | 1 | 0 |
| `/Admin/Locations` | Locations |  | 0 | 1 | 0 |
| `/Admin/PriceConfiguration` | Price Configurations |  | 0 | 1 | 0 |
| `/Admin/Products` | Products |  | 0 | 1 | 0 |

## Pages clean (no page errors, no console errors)

- `/` Home
- `/Admin/AllocationAssociationManagement` Allocation Management
- `/Admin/AllocationMappings` Allocation Mappings
- `/Admin/AppliedAllocationReport` Applied Allocation Report
- `/Admin/AuthorizationAllocationAssociations` Authorization Allocations
- `/Admin/Availability` Availability
- `/Admin/CalculatedValueReport` Current Prices
- `/Admin/CalendarManagement` Calendar Management
- `/Admin/CalendarPeriods` Calendar Periods
- `/Admin/Counterparties` Manage Counterparties
- `/Admin/DeliveryPeriods` Delivery Periods
- `/Admin/FormulaTemplates` Formula Templates
- `/Admin/Instruments` Price Instruments
- `/Admin/IntegrationStatus` Extract Status Report
- `/Admin/ManageOpisPrices` Manage OPIS Curves
- `/Admin/MarketPlatformSetups` Market Platform Setups
- `/Admin/NetGrossDefaults` Net / Gross Defaults
- `/Admin/PlaceholderManagement` Placeholder Management
- `/Admin/PriceImportMappings` Price Import Mappings
- `/Admin/PriceTranslations` Price Translations
- `/Admin/Publishers` Price Publishers
- `/Admin/QuantityDistributionManagement` Quantity Distribution
- `/Admin/Users` Users
- `/Admin/VolumeThresholds` Volume Thresholds
- `/AdminDashboard` Admin Dashboard
- `/Analytics/ByChannel` By Channel
- `/Analytics/ByContract` By Contract
- `/Analytics/ByCustomer` By Customer
- `/Analytics/ByTerminal` By Terminal
- `/BuyNow/Forward` Forward
- `/BuyNow/Offers` Offers
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

- `MarketPlatform/OrderEntry/GetItemsAvailableForOrder`
- `ReferenceData/Hierarchy/Location/List`
- `ReferenceData/Hierarchy/Product/List`

## Detailed errors by page

### `/Admin/CounterpartyHierarchy` — Counterparty Hierarchy
- final URL: http://localhost:3001/Admin/CounterpartyHierarchy
- root length: 85547
- **console.error 1:** Warning: Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.%s 

Check the render method of `Crumbs`.  
    at BreadcrumbItem2 (http://localhost:3001/node_modules/.vite/deps/chunk-SZ33DJ26.js?v=5e2cf333:10016:31)
    at Crumbs (http://localhost:3001/src/components/shared/Hierarchies/components/Crumbs.tsx:20:3)
    at div
    at 

### `/Admin/Locations` — Locations
- final URL: http://localhost:3001/Admin/Locations
- root length: 145016
- **console.error 1:** Warning: Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.%s 

Check the render method of `ManageLocationGroups`.  
    at GroupEditor (http://localhost:3001/src/components/shared/GroupEditor/GroupEditor.tsx:21:3)
    at ManageLocationGroups (http://localhost:3001/src/modules/Admin/ManageLocations/components/ManagementPane/Man

### `/Admin/PriceConfiguration` — Price Configurations
- final URL: http://localhost:3001/Admin/PriceConfiguration
- root length: 71861
- **console.error 1:** Warning: Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.%s 

Check the render method of `ProductGroups`.  
    at Horizontal (http://localhost:3001/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=a4eed063:48397:3)
    at ProductGroups (http://localhost:3001/src/modules/Admin/PriceConfiguration/components/ProductGroups/i

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

### `/Admin/Products` — Products
- final URL: http://localhost:3001/Admin/Products
- root length: 150816
- **console.error 1:** Warning: Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.%s 

Check the render method of `ManageProductGroups`.  
    at GroupEditor (http://localhost:3001/src/components/shared/GroupEditor/GroupEditor.tsx:21:3)
    at ManageProductGroups (http://localhost:3001/src/modules/Admin/ManageProducts/components/ManagementPane/Manage
