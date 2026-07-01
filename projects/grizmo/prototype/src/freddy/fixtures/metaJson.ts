// Freddy mock fixture — not used in production code paths.
// CacheBuster fetches /meta.json and compares meta.version to PACKAGE_VERSION
// via semverGreaterThan. We return a low version so the comparison says
// "you already have the latest" → CacheBuster moves to loading:false and
// renders <Main /> instead of staying in the loading null state.

export const metaJsonFixture = {
  version: '0.0.0',
  REACT_APP_AMPLITUDE_API_KEY: '',
}
