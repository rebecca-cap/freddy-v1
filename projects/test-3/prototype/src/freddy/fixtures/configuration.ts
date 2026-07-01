// Freddy mock fixture — not used in production code paths.
// Shape: ConfigurationResponse from src/api/useEnvironmentConfig.
// IMPORTANT: getFilteredThemes() in themeconfigs.ts expects Default and
// Options as STRINGS that match theme.display (e.g. 'Light', 'Dark').
// Anything else and ThemeWrapper returns null → empty root → blank page.

export const configurationFixture = {
  DecimalPrecision: 4,
  Theme: {
    Default: 'Light',
    Options: ['Light', 'Dark'],
  },
}
