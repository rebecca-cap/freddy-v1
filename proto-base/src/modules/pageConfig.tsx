import {
  DashboardFilled,
  DashboardOutlined,
  DatabaseOutlined,
  DiffOutlined,
  DollarCircleFilled,
  EnvironmentOutlined,
  FileOutlined,
  FileProtectOutlined,
  FileSyncOutlined,
  LineChartOutlined,
  MobileOutlined,
  MoneyCollectFilled,
  SlidersOutlined,
  SmileFilled,
  SwapOutlined,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { SuperUserIcon } from '@assets/icons/SuperUserIcon'
import { EntityReport } from '@components/shared/EntityReport/components'
import { ContractManagementProvider } from '@contexts/ContractManagement'
import { ContractsProvider } from '@contexts/ContractsContext'
import { OffersProvider } from '@contexts/OffersContext'
import { PromptProvider } from '@contexts/PromptContext'
import { AppliedAllocationReport } from '@modules/Admin/AppliedAllocationReport/page'
import { PriceFileLineItemsReport } from '@modules/Admin/Integrations/PriceFileLineItems/page'
import { ManageCounterpartiesPage } from '@modules/Admin/ManageCounterparties/ManageCounterpartiesPage'
import { ManageCounterpartyHierarchy } from '@modules/Admin/ManageCounterpartyHierarchy'
import { ManageLocationHierarchy } from '@modules/Admin/ManageLocationHierarchy'
import { ManageMPIsPage } from '@modules/Admin/ManageMPIs/ManageMPIsPage'
import { ManageOpisCurves } from '@modules/Admin/ManageOpisCurves'
import { ManagePriceNotifications } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/page'
import { ManageProductHierarchy } from '@modules/Admin/ManageProductHierarchy'
import { ManageVolumeThresholdsPage } from '@modules/Admin/ManageVolumeThresholds/ManageVolumeThresholdsPage'
import { AllocationManagement } from '@modules/Admin/PriceEngineQuoteBookAllocationManagement/page'
import { ByChannel } from '@modules/Analytics/PricePerformance/ByChannel/page'
import { ByContract } from '@modules/Analytics/PricePerformance/ByContract/page'
import { ByCustomer } from '@modules/Analytics/PricePerformance/ByCustomer/page'
import { ByTerminal } from '@modules/Analytics/PricePerformance/ByTerminal/page'
import { CommandCenterPage } from '@modules/CommandCenter/CommandCenterPage'
import { ContractRevaluation } from '@modules/ContractManagement/ContractRevaluation/page'
import { SpecialOffersPage } from '@modules/Dashboard/SpecialOffers/SpecialOffersPage'
import { OSPFormulaTemplatesPage } from '@modules/FormulaTemplates/OSPFormulaTemplatesPage'
import { PEFormulaTemplatesPage } from '@modules/FormulaTemplates/PEFormulaTemplatesPage'
import { ManageQuoteRowsPage } from '@modules/PricingEngine/Calculations/ManageQuoteRows/ManageQuoteRowsPage'
import { QuoteBookPage } from '@modules/PricingEngine/QuoteBook/page'
import { OffersPage } from '@modules/SellingPlatform/BuyNow/Offers/OffersPage'
import { Navigate, Outlet } from 'react-router-dom'

import { AvailabilityMaintenance } from './Admin/AvailabilityMaintenance'
import { AllocationMappingsPage } from './Admin/Integrations/AllocationMappings/page'
import { DTNMappingsPage } from './Admin/Integrations/DTNMappings/page'
import { PriceTranslationsPage } from './Admin/Integrations/PriceTranslations/page'
import { ManageAllocationAssociations } from './Admin/ManageAllocationAssociations'
import { ManageBenchmarks } from './Admin/ManageBenchmarks'
import { ManageDeliveryPeriods } from './Admin/ManageDeliveryPeriods'
import { ManageLoadingNumbers } from './Admin/ManageLoadingNumbers'
import { ManageLocations } from './Admin/ManageLocations/ManageLocationsPage'
import { ManageMarketPlatformFormulasPage } from './Admin/ManageMarketPlatformFormulas/page'
import { ManagePriceAdjustments } from './Admin/ManagePriceAdjustments'
import { ManagePECalendarsPage } from './Admin/ManagePriceEngineCalendars/ManagePECalendarsPage'
import { ManageFormulasPage } from './Admin/ManagePriceEngineFormulas/page'
import { ManagePriceInstrumentsPage } from './Admin/ManagePriceInstruments'
import { ManagePricesPage } from './Admin/ManagePrices/ManagePricesPage'
import { ManageProducts } from './Admin/ManageProducts/ManageProducts'
import { QuantityDistribution } from './Admin/ManageQuantityDistribution/QuantityDistribution'
import { ManageQuoteConfigs } from './Admin/ManageQuoteConfigs'
import { ManageUsers } from './Admin/ManageUsers'
import { MarketPlatformSetups } from './Admin/MarketPlatformSetups'
import { NetGrossDefaults } from './Admin/NetGrossDefaults'
import { PlaceholderManagement } from './Admin/PlaceholderManagement'
import { PriceConfiguration } from './Admin/PriceConfiguration/page'
import { PricePublishersPage } from './Admin/PricePublishers'
import { CalendarPeriods } from './CalendarPeriods/Calendar'
import { ContractsReport } from './ContractManagement/ContractsReport/page'
import { ContractMeasurementPage } from './ContractManagement/Measurements/page'
import { ContractManagementPage } from './ContractManagement/page'
import { AdminDashboard } from './Dashboard/AdminDashboard/page'
import { OrderDashboard } from './Dashboard/OrderDashboard/page'
import { Sandbox } from './Sandbox/page'
import { BuyForwardsPage } from './SellingPlatform/BuyNow/Forwards/page'
import { Prompt } from './SellingPlatform/BuyNow/Prompt/page'
import { CalculatedValueReport } from './SellingPlatform/CalculatedValueReport'

export const createPageConfig = () => ({
  OrderDashboard: {
    hasPermission: (scopes) => scopes?.OrderDashboard,
    key: 'OrderDashboard',
    icon: <DashboardOutlined />,
    title: 'Dashboard',
    element: <OrderDashboard />,
    defaultRedirect: 'OrderDashboard',
  },
  AdminDashboard: {
    hasPermission: (scopes) => scopes?.AdminDashboard,
    key: 'AdminDashboard',
    icon: <SlidersOutlined />,
    title: 'Admin Dashboard',
    element: <AdminDashboard />,
    defaultRedirect: 'AdminDashboard',
  },
  SpecialOffers: {
    hasPermission: (scopes) => scopes?.SpecialOffers,
    key: 'SpecialOffers',
    icon: <TagOutlined />,
    title: 'Offers',
    element: <SpecialOffersPage />,
  },
  OnlineOrders: {
    hasPermission: (scopes) => scopes?.OnlineOrders,
    key: 'OnlineOrders',
    icon: <MoneyCollectFilled />,
    title: 'Online Orders',
    element: <EntityReport reportKey='OnlineOrders' />,
  },
  BuyNow: {
    hasPermission: (scopes) => scopes?.BuyNow,
    key: 'BuyNow',
    icon: <FileOutlined />,
    title: 'Buy Now',
    defaultRedirect: 'Prompt',
    routes: [
      {
        hasPermission: (scopes) => scopes?.BuyNow?.Prompt,
        key: 'Prompt',
        icon: <MoneyCollectFilled />,
        title: 'Prompt',
        element: (
          <PromptProvider>
            <Prompt />
          </PromptProvider>
        ),
      },
      {
        hasPermission: (scopes) => scopes?.BuyNow?.Forward,
        key: 'Forward',
        icon: <MoneyCollectFilled />,
        title: 'Forward',
        element: <BuyForwardsPage />,
      },
      {
        hasPermission: (scopes) => true,
        key: 'Offers',
        icon: <MoneyCollectFilled />,
        title: 'Offers',
        element: (
          <OffersProvider>
            <OffersPage />
          </OffersProvider>
        ),
      },
      {
        hasPermission: (scopes) => true,
        key: 'Offers/:SpecialOfferId',
        query_page: true,
        element: (
          <OffersProvider>
            <OffersPage />
          </OffersProvider>
        ),
      },
    ],
  },
  PricingEngine: {
    hasPermission: (scopes) => scopes?.PricingEngine,
    key: 'PricingEngine',
    icon: <FileSyncOutlined />,
    title: 'Pricing Engine',
    element: <CustomerPortal />,
    defaultRedirect: 'QuoteBookEOD',
    routes: [
      {
        hasPermission: (scopes) => scopes?.PricingEngine?.Quotebook,
        key: 'Quotebook',
        title: 'Quote Book',
        defaultRedirect: 'QuoteBookEOD',
        routes: [
          {
            hasPermission: () => true,
            key: 'QuoteBookEOD',
            icon: <MoneyCollectFilled />,
            title: 'Daily',
            element: <QuoteBookPage />,
          },
          {
            hasPermission: () => true,
            key: 'QuoteBookMidday',
            icon: <MoneyCollectFilled />,
            title: 'Midday',
            element: <QuoteBookPage />,
          },
        ],
      },
      {
        hasPermission: (scopes) => scopes?.PricingEngine?.CommandCenter,
        title: 'Command Center',
        key: 'CommandCenter',
        element: <CommandCenterPage />,
        icon: <DashboardOutlined />,
        defaultRedirect: 'CommandCenter',
        routes: [
          {
            hasPermission: (scopes) => scopes?.PricingEngine?.CommandCenter,
            title: 'Command Center',
            key: 'CommandCenter',
            element: <CommandCenterPage />,
          },
        ],
      },
      {
        hasPermission: (scopes) => scopes?.Admin?.PriceEngineAdmin,
        key: 'Calculations',
        icon: <MoneyCollectFilled />,
        title: 'Calculations',
        routes: [
          {
            hasPermission: (scopes) => scopes?.Admin?.PriceEngineAdmin?.FormulaManagement,
            key: 'FormulaManagement',
            icon: <MoneyCollectFilled />,
            title: 'Formula Management',
            element: <ManageFormulasPage />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.PriceEngineAdmin?.Quotes,
            key: 'Quotes',
            icon: <MoneyCollectFilled />,
            title: 'Quote Rows',
            element: <ManageQuoteRowsPage />,
          },
        ],
      },
      {
        hasPermission: (scopes) => scopes?.PricingEngine,
        key: 'Prices',
        icon: <MoneyCollectFilled />,
        title: 'Prices',
        routes: [
          {
            hasPermission: (scopes) => scopes?.PricingEngine?.AllPrices,
            key: 'AllPrices',
            icon: <MoneyCollectFilled />,
            title: 'All Prices',
            element: <EntityReport reportKey='AllPrices' />,
          },
        ],
      },
    ],
  },
  ContractManagement: {
    hasPermission: (scopes) => scopes?.ContractManagement,
    key: 'ContractManagement',
    icon: <FileProtectOutlined />,
    title: 'Contract Management',
    element: (
      <ContractsProvider>
        <Outlet />
      </ContractsProvider>
    ),
    defaultRedirect: 'Contracts',
    routes: [
      {
        hasPermission: (scopes) => scopes?.ContractManagement?.Contracts,
        key: 'Contracts',
        icon: <MoneyCollectFilled />,
        title: 'Contracts',
        element: <ContractsReport />,
      },
      {
        hasPermission: (scopes) => scopes?.ContractManagement?.Contracts,
        title: 'Manage Contract',
        query_page: true,
        key: ':contractId',
        element: (
          <ContractManagementProvider>
            <ContractManagementPage />
          </ContractManagementProvider>
        ),
        icon: <EnvironmentOutlined />,
      },
      {
        hasPermission: (scopes) => scopes?.ContractManagement?.Valuations,
        key: 'Valuations',
        icon: <MoneyCollectFilled />,
        title: 'Contract Values',
        element: <EntityReport reportKey='TradeEntryValuation' />,
      },
      {
        hasPermission: (scopes) => scopes?.ContractManagement?.ContractRevaluation || true,
        key: 'ContractRevaluation',
        icon: <MoneyCollectFilled />,
        title: 'Contract Revaluation',
        element: <ContractRevaluation />,
      },
      {
        hasPermission: (scopes) => scopes?.ContractManagement?.Valuations,
        key: 'MissingPrices',
        icon: <MoneyCollectFilled />,
        title: 'Missing Prices',
        element: <EntityReport reportKey='TradeEntryValuationMissingPrices' />,
      },
      {
        title: 'Contract Measurement',
        hasPermission: (scopes) => scopes?.ContractManagement?.Measurements,
        key: 'Measurements',
        icon: <EnvironmentOutlined />,
        element: <ContractMeasurementPage />,
      },
      {
        hasPermission: (scopes) => scopes?.ContractManagement,
        key: 'FormulaTemplates',
        icon: <EnvironmentOutlined />,
        title: 'Formula Templates',
        element: <PEFormulaTemplatesPage />,
      },
    ],
  },
  Analytics: {
    hasPermission: (scopes) => scopes?.Analytics,
    key: 'Analytics',
    icon: <LineChartOutlined />,
    title: 'Analytics',
    element: <Outlet />,
    defaultRedirect: 'PricePerformance',
    routes: [
      {
        hasPermission: (scopes) => scopes?.Analytics?.PricePerformance,
        key: 'PricePerformance',
        icon: <MoneyCollectFilled />,
        title: 'Price Performance',
        routes: [
          {
            key: 'ByCustomer',
            icon: <MoneyCollectFilled />,
            title: 'By Customer',
            element: <ByCustomer />,
          },
          {
            key: 'ByChannel',
            icon: <MoneyCollectFilled />,
            title: 'By Channel',
            element: <ByChannel />,
          },
          {
            key: 'ByTerminal',
            icon: <MoneyCollectFilled />,
            title: 'By Terminal',
            element: <ByTerminal />,
          },
          {
            key: 'ByContract',
            title: 'By Contract',
            element: <ByContract />,
          },
        ],
      },
    ],
  },
  Admin: {
    hasPermission: (scopes) => scopes?.Admin,
    key: 'Admin',
    icon: <DiffOutlined />,
    title: 'Admin',
    element: <Outlet />,
    defaultRedirect: 'Publishers',
    routes: [
      {
        hasPermission: (scopes) => scopes?.Admin?.PriceEngineAdmin,
        title: 'Pricing Engine',
        key: 'PriceEngineAdmin',
        icon: <DollarCircleFilled />,
        routes: [
          {
            index: true,
            element: <Navigate to='Quote Configs' />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.PriceEngineAdmin?.ManageQuoteConfigs,
            key: 'Quote Configs',
            title: 'Quote Configs',
            element: <ManageQuoteConfigs />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.PriceEngineAdmin?.NetGrossDefaults,
            key: 'NetGrossDefaults',
            title: 'Net / Gross Defaults',
            element: <NetGrossDefaults />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.PriceEngineAdmin?.ManageBenchmarks,
            key: 'Benchmarks',
            title: 'Manage Benchmarks',
            element: <ManageBenchmarks />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.PriceEngineAdmin,
            key: 'AllocationAssociationManagement',
            icon: <MoneyCollectFilled />,
            title: 'Allocation Management',
            element: <AllocationManagement />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.PriceEngineAdmin,
            key: 'PriceNotifications',
            title: 'Price Notifications',
            element: <ManagePriceNotifications />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.PriceEngineAdmin,
            key: 'CalendarManagement',
            title: 'Calendar Management',
            element: <ManagePECalendarsPage />,
          },
        ],
      },
      {
        hasPermission: (scopes) => scopes?.Admin?.PriceSetupAdmin,
        title: 'Price Setup',
        key: 'PriceSetupAdmin',
        icon: <DollarCircleFilled />,
        routes: [
          {
            index: true,
            element: <Navigate to='Publishers' />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.PriceSetupAdmin?.Publishers,
            key: 'Publishers',
            icon: <MoneyCollectFilled />,
            title: 'Price Publishers',
            element: <PricePublishersPage />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.PriceSetupAdmin?.Instruments,
            key: 'Instruments',
            icon: <MoneyCollectFilled />,
            title: 'Price Instruments',
            element: <ManagePriceInstrumentsPage />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.PriceSetupAdmin?.Prices,
            key: 'AdminPrices',
            icon: <MoneyCollectFilled />,
            title: 'Upload Prices',
            element: <ManagePricesPage />,
          },
        ],
      },
      {
        hasPermission: (scopes) => scopes?.Admin?.ReferenceDataAdmin,
        title: 'Reference Data',
        key: 'ReferenceDataAdmin',
        icon: <DatabaseOutlined />,
        routes: [
          {
            hasPermission: (scopes) => scopes?.Admin?.ReferenceDataAdmin?.Products,
            key: 'Products',
            icon: <UserOutlined />,
            title: 'Products',
            element: <ManageProducts />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.ReferenceDataAdmin?.ProductsHierarchy,
            key: 'ProductHierarchy',
            icon: <UserOutlined />,
            title: 'Product Hierarchy',
            element: <ManageProductHierarchy />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.ReferenceDataAdmin?.Locations,
            key: 'Locations',
            icon: <UserOutlined />,
            title: 'Locations',
            element: <ManageLocations />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.ReferenceDataAdmin?.LocationsHierarchy,
            key: 'LocationHierarchy',
            icon: <UserOutlined />,
            title: 'Location Hierarchy',
            element: <ManageLocationHierarchy />,
          },
          {
            hasPermission: (scopes) => scopes?.CounterPartyLocation,
            key: 'CounterPartyLocation',
            icon: <UserOutlined />,
            title: 'Counterparty-Location',
            element: <EntityReport reportKey='CounterPartyLocation' />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.ReferenceDataAdmin?.Users,
            key: 'Users',
            icon: <UserOutlined />,
            title: 'Users',
            element: <ManageUsers />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.ReferenceDataAdmin?.Counterparties,
            key: 'Counterparties',
            icon: <DashboardFilled />,
            title: 'Manage Counterparties',
            element: <ManageCounterpartiesPage />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.ReferenceDataAdmin?.CounterpartyHierarchy,
            key: 'CounterpartyHierarchy',
            icon: <UserOutlined />,
            title: 'Counterparty Hierarchy',
            element: <ManageCounterpartyHierarchy />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.ReferenceDataAdmin?.LoadingNumberAdmin,
            key: 'LoadingNumbers',
            icon: <DashboardFilled />,
            title: 'Loading Numbers',
            element: <ManageLoadingNumbers />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.ReferenceDataAdmin?.PriceAdjustmentAdmin,
            key: 'PriceAdjustments',
            icon: <DashboardFilled />,
            title: 'Price Adjustments',
            element: <ManagePriceAdjustments />,
          },
        ],
      },
      {
        hasPermission: (scopes) => scopes?.Admin?.Integrations,
        title: 'Integrations',
        key: 'Integrations',
        icon: <DatabaseOutlined />,
        routes: [
          {
            hasPermission: (scopes) => scopes?.Admin?.Integrations?.PriceImportMappings,
            key: 'PriceImportMappings',
            icon: <UserOutlined />,
            title: 'Price Import Mappings',
            element: <DTNMappingsPage />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.Integrations?.PriceTranslations,
            key: 'PriceTranslations',
            icon: <UserOutlined />,
            title: 'Price Translations',
            element: <PriceTranslationsPage />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.Integrations?.AllocationMappings,
            key: 'AllocationMappings',
            icon: <UserOutlined />,
            title: 'Allocation Mappings',
            element: <AllocationMappingsPage />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.Integrations?.PriceFileImport,
            key: 'PriceFileLineItems',
            icon: <MoneyCollectFilled />,
            title: 'Price File Import Items',
            element: <PriceFileLineItemsReport />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.Integrations?.ManageOpisPrices,
            key: 'ManageOpisPrices',
            icon: <MoneyCollectFilled />,
            title: 'Manage OPIS Curves',
            element: <ManageOpisCurves />,
          },
        ],
      },
      {
        hasPermission: (scopes) => scopes?.Admin?.Application,
        title: 'Application',
        key: 'Application',
        icon: <MobileOutlined />,
        routes: [
          {
            hasPermission: (scopes) => scopes?.Admin?.Application?.IntegrationStatus,
            key: 'IntegrationStatus',
            title: 'Extract Status Report',
            element: <EntityReport reportKey='IntegrationStatus' />,
          },
        ],
      },
      {
        hasPermission: (scopes) => scopes?.Admin?.MarketPlatform,
        title: 'Market Platform',
        key: 'MarketPlatform',
        icon: <SwapOutlined />,
        routes: [
          {
            hasPermission: (scopes) => scopes?.Admin?.MarketPlatform?.AppliedAllocationReport,
            key: 'AppliedAllocationReport',
            icon: <DashboardFilled />,
            title: 'Applied Allocation Report',
            element: <AppliedAllocationReport />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.MarketPlatform?.AuthorizationAllocationAssociations,
            key: 'AuthorizationAllocationAssociations',
            icon: <DashboardFilled />,
            title: 'Authorization Allocations',
            element: <ManageAllocationAssociations />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.MarketPlatform?.Availability,
            key: 'Availability',
            icon: <MoneyCollectFilled />,
            title: 'Availability',
            element: <AvailabilityMaintenance />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.MarketPlatform?.MarketPlatformSetups,
            key: 'MarketPlatformSetups',
            icon: <MoneyCollectFilled />,
            title: 'Market Platform Setups',
            element: <MarketPlatformSetups />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.MarketPlatform?.PriceConfiguration,
            key: 'PriceConfiguration',
            icon: <MoneyCollectFilled />,
            title: 'Price Configurations',
            element: <PriceConfiguration />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.MarketPlatform?.FormulaManagement,
            key: 'MarketPlatformFormulaManagement',
            icon: <MoneyCollectFilled />,
            title: 'Formula Management',
            element: <ManageMarketPlatformFormulasPage />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.MarketPlatform?.FormulaTemplates,
            key: 'FormulaTemplates',
            icon: <MoneyCollectFilled />,
            title: 'Formula Templates',
            element: <OSPFormulaTemplatesPage />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.MarketPlatform?.PlaceholderManagement,
            key: 'PlaceholderManagement',
            icon: <MoneyCollectFilled />,
            title: 'Placeholder Management',
            element: <PlaceholderManagement />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.MarketPlatform?.DeliveryPeriods,
            key: 'DeliveryPeriods',
            icon: <MoneyCollectFilled />,
            title: 'Delivery Periods',
            element: <ManageDeliveryPeriods />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.MarketPlatform?.CalculatedValueReport,
            key: 'CalculatedValueReport',
            icon: <MoneyCollectFilled />,
            title: 'Current Prices',
            element: <CalculatedValueReport />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.MarketPlatform?.CalendarPeriods,
            key: 'CalendarPeriods',
            icon: <DashboardFilled />,
            title: 'Calendar Periods',
            element: <CalendarPeriods />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.MarketPlatform?.QuantityDistributionManagement,
            key: 'QuantityDistributionManagement',
            icon: <DashboardFilled />,
            title: 'Quantity Distribution',
            element: <QuantityDistribution />,
          },
          {
            hasPermission: (scopes) => scopes?.Admin?.MarketPlatform?.VolumeThresholds,
            key: 'VolumeThresholds',
            icon: <DashboardFilled />,
            title: 'Volume Thresholds',
            element: <ManageVolumeThresholdsPage />,
          },
        ],
      },
    ],
  },
  SuperUserAdmin: {
    hasPermission: (scopes) => true,
    key: 'SuperUserAdmin',
    icon: <SuperUserIcon />,
    title: 'Super User Admin',
    element: <Outlet />,
    defaultRedirect: 'MPIManagement',
    routes: [
      {
        hasPermission: (scopes) => true,
        key: 'MPIManagement',
        icon: <DatabaseOutlined />,
        title: 'MPI Management',
        element: <ManageMPIsPage />,
      },
    ],
  },
  sandbox: {
    key: 'Sandbox',
    icon: <SmileFilled />,
    title: 'Sandbox',
    element: <Sandbox />,
  },
})

function CustomerPortal() {
  return <Outlet />
}
