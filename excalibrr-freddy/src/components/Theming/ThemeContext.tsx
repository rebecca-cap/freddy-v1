import { LoadingOutlined } from '@ant-design/icons'
import { Suspense, createContext, useContext, useEffect, useState } from 'react'
import { getAvailableThemes, getStickyTheme } from './util'

const ThemeContext = createContext<{
  isDarkTheme: boolean
  availableThemes: ThemeConfig[]
}>({
  isDarkTheme: false,
  availableThemes: [],
})

export type ThemeConfig = {
  key: string
  isDark: boolean
  default?: boolean
  isActive?: boolean | (() => boolean)
  ThemeImportComponent: React.LazyExoticComponent<React.FC>
}

type ThemeContextProviderProps = {
  children: React.ReactNode
  themeConfigs: Record<string, ThemeConfig>
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({
  children,
  themeConfigs,
}) => {
  const [chosenThemeKey, setChosenThemeKey] = useState<string | undefined>()
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>([])

  useEffect(() => {
    const filteredThemes = getAvailableThemes(themeConfigs)
    const loadedThemeKey = getStickyTheme(filteredThemes)
    setChosenThemeKey(loadedThemeKey)
    setIsDarkTheme(themeConfigs[loadedThemeKey!]?.isDark)
    setAvailableThemes(filteredThemes)
  }, [themeConfigs])

  if (!chosenThemeKey) return <ThemeLoading isDarkTheme={isDarkTheme} />
  let ThemeComponent = themeConfigs[chosenThemeKey]?.ThemeImportComponent

  if (!ThemeComponent) {
    const defaultTheme = Object.values(themeConfigs)?.find((t) => t.default)

    if (defaultTheme) {
      localStorage.setItem('TYPE_OF_THEME', defaultTheme.key)
      ThemeComponent = defaultTheme?.ThemeImportComponent
    }
  }

  return (
    <ThemeContext.Provider value={{ isDarkTheme, availableThemes }}>
      <Suspense fallback={<ThemeLoading isDarkTheme={isDarkTheme} />}>
        <ThemeComponent />
      </Suspense>
      {children}
    </ThemeContext.Provider>
  )
}
const ThemeLoading = ({ isDarkTheme = false }: { isDarkTheme: boolean }) => (
  <div
    style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDarkTheme ? '#1b242e' : 'lightGrey',
      transition: '0.5s ease',
    }}
  >
    <LoadingOutlined style={{ color: 'lightblue', fontSize: '3em' }} />
  </div>
)

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('Context must be used within a Provider')
  }
  return context
}
