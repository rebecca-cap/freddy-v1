import { MacCommandOutlined } from '@ant-design/icons'
import type { CommandObject, Page, Scope } from './NavigationContext'

export const getValidPages = (
  scopes: Record<string, Scope>,
  pageConfig: Record<string, Page>
) => {
  const validPages: Page[] = []
  const commandObjects: CommandObject[] = []

  Object.keys(scopes).forEach((key) => {
    if (!pageConfig[key]) {
      return
    }
    const validRoutes: any[] = []

    if (pageConfig[key].routes) {
      pageConfig[key]?.routes?.forEach((route) => {
        if (
          !route.hasPermission ||
          (route?.hasPermission as (_scopes: typeof scopes) => boolean)(scopes)
        ) {
          const filteredSubroutes = filterSubroutesToPermissoned(route, scopes)
          validRoutes.push({ ...route, routes: filteredSubroutes })
          addRouteQuickSearch(commandObjects, pageConfig, route, key)
          addSubroutesToQuickSearch(
            commandObjects,
            filteredSubroutes,
            pageConfig,
            route,
            key
          )
        }
      })
    }

    addGroupToQuickSearch(commandObjects, pageConfig, key)
    validPages.push({ ...pageConfig[key], routes: validRoutes })
  })

  return { filteredPages: validPages, commandObjects }
}

export const getChildrenCount = (group: Page) => {
  let count = 0
  group?.routes?.forEach((route) => {
    if (route.index) return
    count++
    route?.routes?.forEach((screen) => {
      if (screen.index) return
      count++
    })
  })
  return count
}

export const getSpecialKey = () => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  const macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i
  const windowsPlatforms = /(win32|win64|windows|wince)/i
  const iosPlatforms = /(iphone|ipad|ipod)/i
  let os = null
  if (macosPlatforms.test(userAgent)) {
    os = 'macos'
  } else if (iosPlatforms.test(userAgent)) {
    os = 'ios'
  } else if (windowsPlatforms.test(userAgent)) {
    os = 'windows'
  } else if (/android/.test(userAgent)) {
    os = 'android'
  } else if (!os && /linux/.test(userAgent)) {
    os = 'linux'
  }
  if (os === 'macos' || os === 'ios') {
    return <MacCommandOutlined />
  }
  return 'Ctrl'
}

export const getKeyLetter = () => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  const macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i
  const windowsPlatforms = /(win32|win64|windows|wince)/i
  const iosPlatforms = /(iphone|ipad|ipod)/i
  let os = null
  if (macosPlatforms.test(userAgent)) {
    os = 'macos'
  } else if (iosPlatforms.test(userAgent)) {
    os = 'ios'
  } else if (windowsPlatforms.test(userAgent)) {
    os = 'windows'
  } else if (/android/.test(userAgent)) {
    os = 'android'
  } else if (!os && /linux/.test(userAgent)) {
    os = 'linux'
  }
  if (os === 'macos' || os === 'ios') {
    return 'K'
  }
  return 'I'
}
// Supporting ////////////////////////////////////////

const addGroupToQuickSearch = (
  commandObjects: CommandObject[],
  pageConfig: Record<string, Page>,
  key: string
) => {
  commandObjects.push({
    name: pageConfig[key].title,
    icon: pageConfig[key].icon,
    exactURL: `/${pageConfig[key].key}`,
    callback: () => {},
  })
}

const addRouteQuickSearch = (
  commandObjects: CommandObject[],
  pageConfig: Record<string, Page>,
  route: Page,
  key: string
) => {
  if (!route.routes && !route.index && !route.query_page) {
    commandObjects.push({
      name: route.title,
      icon: pageConfig[key].icon,
      exactURL: `/${key}/${route.key}`,
      callback: () => {},
    })
  }
}

const addSubroutesToQuickSearch = (
  commandObjects: CommandObject[],
  filteredSubroutes: Page[],
  pageConfig: Record<string, Page>,
  route: Page,
  key: string
) => {
  filteredSubroutes.forEach((subRoute) => {
    if (!subRoute.index && !subRoute.query_page) {
      commandObjects.push({
        name: subRoute.title,
        icon: pageConfig[key].icon,
        description: `${pageConfig[key].title} / ${route.title} `,
        exactURL: `/${key}/${subRoute.key}`,
        callback: () => {},
      })
    }
  })
}

const filterSubroutesToPermissoned = (
  route: Page,
  scopes: Record<string, Scope>
) => {
  if (route.routes) {
    return route.routes.filter(
      (subRoute) =>
        !subRoute.hasPermission ||
        (subRoute.hasPermission as (_scopes: typeof scopes) => boolean)(scopes)
    )
  }
  return []
}
