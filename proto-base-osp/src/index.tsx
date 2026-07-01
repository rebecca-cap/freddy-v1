// Freddy: bootstrap mock seam BEFORE anything else loads. Sets
// window.__FREDDY_MOCKS__ for excalibrr's patched useApi/useAuth and
// monkey-patches window.fetch for raw-fetch call sites.
import './freddy/bootstrap'
import './freddy/silence-externals'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { LicenseManager } from 'ag-grid-enterprise'
import React from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import * as serviceWorker from './serviceWorker'

LicenseManager.setLicenseKey(
  'Using_this_AG_Grid_Enterprise_key_( AG-050987 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( capSpire )_is_granted_a_( Multiple Applications )_Developer_License_for_( 3 )_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_AG_Grid_Enterprise___This_key_has_been_granted_a_Deployment_License_Add-on_for_( 8 )_Production_Environments___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 17_December_2024 )____[v2]_MTczNDM5MzYwMDAwMA==97e04a13d661cd40e68a78abfaa164d0'
)

// Freddy: Sentry's network init is suppressed when the mock seam is active
// (always true in proto-base). We keep the @sentry/react import intact so
// `Sentry.ErrorBoundary` and `Sentry.captureException` still work as no-op /
// local-only fallbacks for any code paths that reference them.
if (!(window as any).__FREDDY_MOCKS__?.enabled) {
  Sentry.init({
    dsn: 'https://60e7252aca964ce68cd3573282e45d29@o563053.ingest.sentry.io/4504475337031680',
    environment: import.meta.env.VITE_ENVIRONMENT || 'production',
    integrations: [new Integrations.BrowserTracing()],
    ignoreErrors: ['ResizeObserver loop limit exceeded'],
    tracesSampleRate: 1.0,
  })
}
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
export { toastApiError } from '@api/common'
export { useQuoteBookTyped } from '@modules/PricingEngine/QuoteBook/api/useQuoteBookTyped'



