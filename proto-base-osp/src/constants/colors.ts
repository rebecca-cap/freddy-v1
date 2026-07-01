/**
 * Application color constants for values that don't map to antd design tokens.
 *
 * WHEN TO USE:
 * - For semantic colors with no antd token equivalent
 * - For chart/visualization colors
 * - For feature-specific colors (e.g., placeholder purple)
 *
 * WHEN NOT TO USE:
 * - If an antd token exists (use theme.useToken() instead)
 * - If a CSS variable exists (use var(--name) in .css/.less files)
 */

/** Estimated/highlighted row background in formula and price grids */
export const ESTIMATED_ROW_BG = '#D2DCF9'

/** FormulaTemplates placeholder styling */
export const PLACEHOLDER_COLORS = {
  text: '#722ed1',
  bg: '#f3e8ff',
} as const

/** Chart/visualization palette */
export const CHART_COLORS = {
  success: '#14a349',
  warning: '#f59e0c',
  remaining: '#e4e6ea',
  trendLine: '#82ca9d',
  labelMuted: '#7C97B6',
  darkTeal: '#0C5A58',
  gold: '#d4af37',
} as const

/** Revaluation-specific */
export const REVALUATION_COLORS = {
  successBg: '#f0fdf4',
  successText: '#156534',
  progressTeal: '#179088',
} as const
