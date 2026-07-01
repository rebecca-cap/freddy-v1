import * as amplitude from '@amplitude/analytics-browser'
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser'

export const initializeAmplitude = (apiKey: string) => {
  if (!apiKey) {
    console.error('Amplitude API key is missing!')
    return
  }

  amplitude.init(apiKey, {
    fetchRemoteConfig: true,
    autocapture: true,
  })
  const sessionReplayTracking = sessionReplayPlugin({
    sampleRate: 1,
  })
  amplitude.add(sessionReplayTracking)
}
