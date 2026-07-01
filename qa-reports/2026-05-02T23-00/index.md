# Freddy QA crawl — 2026-05-02T23-00

**Base URL:** http://localhost:3001
**Routes crawled:** 2
**Crashes (navigation):** 0
**Page errors (uncaught):** 2
**Console errors (filtered):** 1
**Distinct missing fixtures:** 0

## Pages with errors (sorted by severity)

| Path | Title | Crash | PageErr | ConsoleErr | MissingFx |
|------|-------|-------|---------|------------|-----------|
| `/Admin/PriceNotifications` | Price Notifications |  | 2 | 1 | 0 |

## Pages clean (no page errors, no console errors)

- `/BuyNow/Forward` Forward

## All distinct missing fixtures


## Detailed errors by page

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
