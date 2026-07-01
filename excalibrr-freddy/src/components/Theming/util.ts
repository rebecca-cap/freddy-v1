import { ThemeConfig } from './ThemeContext'
const { localStorage } = window

export const getAvailableThemes = (
  themeConfigMap: Record<string, ThemeConfig>
) => {
  const validThemes: ThemeConfig[] = []
  Object.keys(themeConfigMap).forEach((key) => {
    const theme = themeConfigMap[key]
    const predicate = theme.isActive

    switch (typeof predicate) {
      case 'function':
        if (predicate()) validThemes.push(theme)
        break
      case 'boolean':
        if (predicate) validThemes.push(theme)
        break
      case 'undefined':
        validThemes.push(theme)
        break
    }
  })
  return validThemes
}

export const getStickyTheme = (filteredThemes: ThemeConfig[]) => {
  const defaultTheme = filteredThemes.find((theme) => theme.default)
  let loadedThemeKey =
    localStorage.getItem('TYPE_OF_THEME') || defaultTheme?.key
  if (!filteredThemes.find((theme) => theme.key === loadedThemeKey)) {
    if (defaultTheme) {
      localStorage.setItem('TYPE_OF_THEME', defaultTheme.key)
      loadedThemeKey = defaultTheme.key
    }
  }
  return loadedThemeKey
}
