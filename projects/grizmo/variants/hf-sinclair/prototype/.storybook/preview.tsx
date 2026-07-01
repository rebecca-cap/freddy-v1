import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LicenseManager } from 'ag-grid-enterprise'
import { render } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeContextProvider } from '@gravitate-js/excalibrr'
import { themeConfigs } from '../src/components/shared/Theming/themeconfigs'
import React from 'react'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
export const preview: Preview = {
  decorators: [(Story) => renderWithMockedAPI(<Story />)],
}

const renderWithMockedAPI = (component) => {
  const queryClient = new QueryClient()
  LicenseManager.setLicenseKey(
    'Using_this_AG_Grid_Enterprise_key_( AG-050987 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( capSpire )_is_granted_a_( Multiple Applications )_Developer_License_for_( 3 )_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_AG_Grid_Enterprise___This_key_has_been_granted_a_Deployment_License_Add-on_for_( 8 )_Production_Environments___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 17_December_2024 )____[v2]_MTczNDM5MzYwMDAwMA==97e04a13d661cd40e68a78abfaa164d0'
  )

  return render(
    <GlobalAPIProvider baseUrl='https://marketplatform-api.demo.gravitate.energy/api'>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeContextProvider themeConfigs={themeConfigs}>{component}</ThemeContextProvider>
        </Router>
      </QueryClientProvider>
    </GlobalAPIProvider>
  )
}
