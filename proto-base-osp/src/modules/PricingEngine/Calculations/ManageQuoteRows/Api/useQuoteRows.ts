// Freddy compat shim. Production renamed `useQuoteRows` -> `useQuoteRowsTyped`
// during the typed-API migration. Baseline Admin/ManageQuoteConfigs (outside the
// Pricing Engine sync) still imports the old name; re-export so the app boots.
// If ManageQuoteConfigs is ever brought current, drop this shim.
export { useQuoteRowsTyped as useQuoteRows } from './useQuoteRowsTyped'
