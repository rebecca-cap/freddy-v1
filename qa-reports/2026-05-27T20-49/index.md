# Freddy QA crawl — 2026-05-27T20-49

**Base URL:** http://localhost:5173
**Routes crawled:** 52
**Crashes (navigation):** 0
**Page errors (uncaught):** 0
**Console errors (filtered):** 4
**Distinct missing fixtures:** 2

## Pages with errors (sorted by severity)

| Path | Title | Crash | PageErr | ConsoleErr | MissingFx |
|------|-------|-------|---------|------------|-----------|
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
- `/Admin/PriceNotifications` Price Notifications
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

- `ReferenceData/Hierarchy/Location/List`
- `ReferenceData/Hierarchy/Product/List`

## Detailed errors by page

### `/Admin/CounterpartyHierarchy` — Counterparty Hierarchy
- final URL: http://localhost:5173/Admin/CounterpartyHierarchy
- root length: 86422
- **console.error 1:** Warning: Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.%s 

Check the render method of `Crumbs`.  
    at BreadcrumbItem2 (http://localhost:5173/node_modules/.vite/deps/chunk-SZ33DJ26.js?v=4e576b59:10016:31)
    at Crumbs (http://localhost:5173/src/components/shared/Hierarchies/components/Crumbs.tsx:20:3)
    at div
    at 

### `/Admin/Locations` — Locations
- final URL: http://localhost:5173/Admin/Locations
- root length: 135074
- **console.error 1:** Warning: Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.%s 

Check the render method of `ManageLocationGroups`.  
    at GroupEditor (http://localhost:5173/src/components/shared/GroupEditor/GroupEditor.tsx:21:3)
    at ManageLocationGroups (http://localhost:5173/src/modules/Admin/ManageLocations/components/ManagementPane/Man

### `/Admin/PriceConfiguration` — Price Configurations
- final URL: http://localhost:5173/Admin/PriceConfiguration
- root length: 72736
- **console.error 1:** Warning: Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.%s 

Check the render method of `ProductGroups`.  
    at Horizontal (http://localhost:5173/node_modules/.vite/deps/@gravitate-js_excalibrr.js?v=4e576b59:48397:3)
    at ProductGroups (http://localhost:5173/src/modules/Admin/PriceConfiguration/components/ProductGroups/i

### `/Admin/Products` — Products
- final URL: http://localhost:5173/Admin/Products
- root length: 151691
- **console.error 1:** Warning: Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.%s 

Check the render method of `ManageProductGroups`.  
    at GroupEditor (http://localhost:5173/src/components/shared/GroupEditor/GroupEditor.tsx:21:3)
    at ManageProductGroups (http://localhost:5173/src/modules/Admin/ManageProducts/components/ManagementPane/Manage
