export type ThresholdBound = 'CriticalBelow' | 'WarningBelow' | 'WarningAbove' | 'CriticalAbove'

export const thresholdBounds: ThresholdBound[] = ['CriticalBelow', 'WarningBelow', 'WarningAbove', 'CriticalAbove']

export const boundLabels: Record<ThresholdBound, string> = {
  CriticalBelow: 'Critical Below',
  WarningBelow: 'Warning Below',
  WarningAbove: 'Warning Above',
  CriticalAbove: 'Critical Above',
}

export const thresholdOrderingPairs: [ThresholdBound, ThresholdBound][] = [
  ['CriticalBelow', 'WarningBelow'],
  ['WarningBelow', 'WarningAbove'],
  ['WarningAbove', 'CriticalAbove'],
  ['CriticalBelow', 'CriticalAbove'],
  ['CriticalBelow', 'WarningAbove'],
  ['WarningBelow', 'CriticalAbove'],
]
