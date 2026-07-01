// Freddy: silence external services (Amplitude, ReactGA) that have no business
// firing in the stripped offline proto-base. Sentry is silenced separately in
// src/index.tsx by guarding its init() behind the __FREDDY_MOCKS__ flag.
//
// This module must be imported AFTER ./bootstrap (which sets the mock flag)
// and BEFORE any code path that initializes ReactGA / Amplitude.

// 1) ReactGA — pre-initialize with a fake tracking id in test mode so that
//    later `ReactGA.pageview(...)` calls in AuthenticatedRoute don't warn
//    `ReactGA.initialize must be called first`. testMode prevents any
//    actual network requests to google-analytics.com.
import ReactGA from 'react-ga'

try {
  if (ReactGA && typeof (ReactGA as any).initialize === 'function') {
    ;(ReactGA as any).initialize('UA-FREDDY-MOCK-1', {
      testMode: true,
      debug: false,
    })
  }
} catch {
  // react-ga init failed — nothing else to do; warnings will resurface.
}

// 2) Amplitude — `initializeAmplitude` (src/utils/amplitude/initializeAmplitude.ts)
//    logs `console.error('Amplitude API key is missing!')` when the key is
//    empty (which it always is in the proto-base mock fixture). We can't
//    pass a real key (that would start real network calls + session replay),
//    so we filter just that one specific message at the console layer.
//
//    This is intentionally narrow: only the exact warning string is dropped.
//    Every other console.error continues to flow through untouched.
const AMPLITUDE_NOISE = 'Amplitude API key is missing!'
const originalConsoleError = console.error.bind(console)
console.error = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0] === AMPLITUDE_NOISE) {
    return
  }
  originalConsoleError(...args)
}

export {}
