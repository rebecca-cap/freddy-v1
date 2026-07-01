import { sortListByKeys } from '@utils/general'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import notFoundAnimation from '../Animations/404.json'
import { LoadingAnimation } from '../Animations/LoadingAnimation'
import { Horizontal } from '../Layout/Horizontal'
import { PageWrapper } from './PageWrapper'
import { getValidPages } from './util'

const NavigationContext = createContext<{ validPages: Page[] }>({
  validPages: [],
})

const store = window.localStorage

export type Scope = any

export type Page = {
  index: number
  icon: ReactNode
  title: string
  key: string
  element: ReactNode
  defaultRedirect?: string
  routes?: Page[]
  hideNav?: boolean
  query_page: string
  hasPermission: boolean | ((scopes: Record<string, Scope>) => boolean)
}

export type CommandObject = {
  name: string
  icon: React.ReactNode
  exactURL: string
  callback: () => void
  description?: string
}

type NavStyle = 'horizontal' | 'vertical' | 'inline'

export type SharedNavigationProps = {
  children: React.ReactNode
  handleLogout: () => void
  userControlPane: ReactNode
  navStyle: NavStyle
}

type NavigationContextProps = SharedNavigationProps & {
  getScopes: () => Promise<Record<string, Scope>>
  pageConfig: Record<string, Page>
  updatePreferenceSetting: (key: string, value: string) => void
}

type RouteBuilderProps = SharedNavigationProps & {
  commandObjects: CommandObject[]
  validPages: Page[]
}

export const NavigationContextProvider: React.FC<NavigationContextProps> = ({
  getScopes,
  handleLogout,
  pageConfig,
  children,
  userControlPane,
  navStyle = 'vertical',
  updatePreferenceSetting = () => {},
}) => {
  const location = useLocation()
  const [validPages, setValidPages] = useState<Page[]>([])
  const [commandObjects, setCommandObjects] = useState<CommandObject[]>([])

  useEffect(() => {
    getScopes().then((scopes) => {
      const { filteredPages, commandObjects } = getValidPages(
        scopes,
        pageConfig
      )
      setCommandObjects(commandObjects)

      /**
       * 📝: Today, the top level pages on a site's pageConfig are defined as keys on an object.
       * getValidPages converts these entries into an array, and inserts based on permissions.
       * This can lead to an unexpected order of those pages, so we're using the original key order
       * to sort the list in place after the fact. All of the children routes (and their children)
       * are conveniently already in a list, and therefore don't need this extra sorting applied.
       */

      const sortedPages = sortListByKeys(
        filteredPages,
        Object.keys(pageConfig),
        'key'
      )

      setValidPages(sortedPages)
    })
  }, [pageConfig])

  useEffect(() => {
    if (!validPages) {
      return
    }
    const splitPath = location.pathname.split('/')
    if (splitPath[1]) {
      store.setItem('last_page_section', splitPath[1])
      if (
        updatePreferenceSetting &&
        typeof updatePreferenceSetting === 'function'
      ) {
        updatePreferenceSetting('last_page_section', splitPath[1])
      }
    }
    if (splitPath[2]) {
      store.setItem(`last_${splitPath[1]}_page`, splitPath[2])
      if (
        updatePreferenceSetting &&
        typeof updatePreferenceSetting === 'function'
      ) {
        updatePreferenceSetting(`last_${splitPath[1]}_page`, splitPath[2])
      }
    }
  }, [location?.pathname, validPages])

  return (
    <NavigationContext.Provider value={{ validPages }}>
      <RouteBuilder
        handleLogout={handleLogout}
        validPages={validPages}
        userControlPane={userControlPane}
        navStyle={navStyle}
        commandObjects={commandObjects}
      >
        {children}
      </RouteBuilder>
    </NavigationContext.Provider>
  )
}

const RouteBuilder: React.FC<RouteBuilderProps> = ({
  children,
  handleLogout,
  validPages,
  userControlPane,
  navStyle,
  commandObjects,
}) => {
  return (
    <Routes>
      <Route
        path='/*'
        element={
          <PageWrapper
            // @ts-ignore - handleLogout isn't a prop on PageWrapper and isn't used, leaving for insurance
            handleLogout={handleLogout}
            validPages={validPages}
            userControlPane={userControlPane}
            navStyle={navStyle}
            commandObjects={commandObjects}
          >
            {children}
          </PageWrapper>
        }
      >
        {validPages?.length > 0 && (
          <>
            <Route
              index
              element={
                <Navigate
                  to={store.getItem('last_page_section') || validPages[0]?.key}
                />
              }
            />
            {validPages.map((siteSection, i) => {
              return (
                <Route
                  path={siteSection.key}
                  key={i}
                  element={siteSection.element}
                >
                  {siteSection?.routes && siteSection.routes.length > 0 && (
                    <Route
                      index
                      element={
                        <Navigate
                          to={
                            store.getItem(`last_${siteSection.key}_page`) ||
                            siteSection.defaultRedirect!
                          }
                        />
                      }
                    />
                  )}
                  {siteSection.routes?.flatMap((subPage, j) => {
                    if (subPage?.routes?.length === 0) {
                      return (
                        <Route
                          key={`${i}- ${j}`}
                          path={subPage.key}
                          element={subPage.element}
                        />
                      )
                    }
                    return subPage.routes?.map((groupPage, k) => {
                      return (
                        <Route
                          key={`${i}- ${j}- ${k}`}
                          path={groupPage.key}
                          element={groupPage.element}
                        />
                      )
                    })
                  })}
                </Route>
              )
            })}
            <Route
              path='*'
              element={
                <Horizontal fullHeight flex={1} verticalCenter horizontalCenter>
                  <LoadingAnimation
                    title='Page Not Found'
                    message='We are a little lost. Sorry, we could not find that page.'
                    animationData={notFoundAnimation}
                    large
                  />
                </Horizontal>
              }
            />
          </>
        )}
      </Route>
    </Routes>
  )
}

export const useNavigationContext = () => {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('Context must be used within a Provider')
  }
  return context
}
