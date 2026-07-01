/**
 * Permission enum containing all backend permission values.
 * Names match the database Permission.Name column exactly.
 *
 * New code should use hasPermission(Permission.X) instead of
 * the legacy userPermissions?.Category?.Feature?.Action pattern.
 */
export enum Permission {
  // Allocation
  AllocationMapping_Read = 'AllocationMapping_Read',
  AllocationMapping_Write = 'AllocationMapping_Write',

  // Applied Allocation
  AppliedAllocation_Read = 'AppliedAllocation_Read',

  // Authorization Allocation
  AuthorizationAllocation_Read = 'AuthorizationAllocation_Read',
  AuthorizationAllocation_Write = 'AuthorizationAllocation_Write',

  // Availability
  Availability_Read = 'Availability_Read',
  Availability_Write = 'Availability_Write',

  // Calculated Price
  CalculatedPrice_Read = 'CalculatedPrice_Read',

  // Calendar Period
  CalendarPeriod_Read = 'CalendarPeriod_Read',
  CalendarPeriod_Write = 'CalendarPeriod_Write',

  // Command Center
  CommandCenter_IntradayCompetitorMovement_Read = 'CommandCenter_IntradayCompetitorMovement_Read',
  CommandCenter_Pace_Read = 'CommandCenter_Pace_Read',
  CommandCenter_StrategyMiss_Read = 'CommandCenter_StrategyMiss_Read',

  // Contract Management
  ContractManagement_Read = 'ContractManagement_Read',
  ContractManagement_Write = 'ContractManagement_Write',

  // Contract Measurement
  PricingEngine_ContractMeasurement_Read = 'PricingEngine_ContractMeasurement_Read',
  PricingEngine_ContractMeasurement_Write = 'PricingEngine_ContractMeasurement_Write',

  // Contract Revaluation
  ContractRevaluation_Execute = 'ContractRevaluation_Execute',

  // Correlation Analytics
  CorrelationAnalytics_Read = 'CorrelationAnalytics_Read',

  // CounterParty
  CounterParty_Read = 'CounterParty_Read',
  CounterParty_Write = 'CounterParty_Write',

  // Counterparty Hierarchy
  CounterpartyHierarchy_Read = 'CounterpartyHierarchy_Read',
  CounterpartyHierarchy_Write = 'CounterpartyHierarchy_Write',

  // Delivery Period
  DeliveryPeriod_Read = 'DeliveryPeriod_Read',
  DeliveryPeriod_Write = 'DeliveryPeriod_Write',

  // Formula Management
  FormulaManagement_Read = 'FormulaManagement_Read',
  FormulaManagement_Write = 'FormulaManagement_Write',

  // Formula Templates
  FormulaTemplates_Read = 'FormulaTemplates_Read',
  FormulaTemplates_Write = 'FormulaTemplates_Write',

  // Integration Status
  IntegrationStatus_Read = 'IntegrationStatus_Read',
  IntegrationStatus_Write = 'IntegrationStatus_Write',

  // Loading Numbers
  LoadingNumbers_Read = 'LoadingNumbers_Read',
  LoadingNumbers_Write = 'LoadingNumbers_Write',

  // Location
  Location_Read = 'Location_Read',
  Location_Write = 'Location_Write',

  // Location Hierarchy
  LocationHierarchy_Read = 'LocationHierarchy_Read',
  LocationHierarchy_Write = 'LocationHierarchy_Write',

  // Margin Summary
  MarginSummary_Read = 'MarginSummary_Read',

  // MarketPlatform - Online Order
  MarketPlatform_OnlineOrder_Read = 'MarketPlatform_OnlineOrder_Read',
  MarketPlatform_OnlineOrder_Write = 'MarketPlatform_OnlineOrder_Write',

  // MarketPlatform - Quantity Distribution
  MarketPlatform_QuantityDistribution_Read = 'MarketPlatform_QuantityDistribution_Read',
  MarketPlatform_QuantityDistribution_Write = 'MarketPlatform_QuantityDistribution_Write',

  // MarketPlatform - Special Offer Admin (internal admin dashboard)
  MarketPlatform_SpecialOfferAdmin_Read = 'MarketPlatform_SpecialOfferAdmin_Read',
  MarketPlatform_SpecialOfferAdmin_Write = 'MarketPlatform_SpecialOfferAdmin_Write',
  MarketPlatform_SpecialOfferAdmin_Manage = 'MarketPlatform_SpecialOfferAdmin_Manage',

  // MarketPlatform - Special Offer Online Order (customer-facing)
  MarketPlatform_SpecialOffer_OnlineOrder_Read = 'MarketPlatform_SpecialOffer_OnlineOrder_Read',
  MarketPlatform_SpecialOffer_OnlineOrder_Write = 'MarketPlatform_SpecialOffer_OnlineOrder_Write',

  // MarketPlatform - SuperUser
  MarketPlatform_SuperUser = 'MarketPlatform_SuperUser',

  // Market Platform Formula
  MarketPlatformFormula_Read = 'MarketPlatformFormula_Read',
  MarketPlatformFormula_Write = 'MarketPlatformFormula_Write',

  // Market Platform Setup
  MarketPlatformSetup_Read = 'MarketPlatformSetup_Read',
  MarketPlatformSetup_Write = 'MarketPlatformSetup_Write',

  // Online Order
  OnlineOrder_Cancel = 'OnlineOrder_Cancel',
  OnlineOrder_Read = 'OnlineOrder_Read',
  OnlineOrder_Write = 'OnlineOrder_Write',
  OnlineOrder_Resubmit = 'OnlineOrder_Resubmit',
  OnlineOrder_UpdateIsHedged = 'OnlineOrder_UpdateIsHedged',

  // Online Order Admin
  OnlineOrderAdmin_Read = 'OnlineOrderAdmin_Read',
  OnlineOrderAdmin_Write = 'OnlineOrderAdmin_Write',

  // OPIS Curve Management
  OPISCurveManagement_Read = 'OPISCurveManagement_Read',
  OPISCurveManagement_Write = 'OPISCurveManagement_Write',

  // Placeholder Management
  PlaceholderManagement_Read = 'PlaceholderManagement_Read',
  PlaceholderManagement_Write = 'PlaceholderManagement_Write',

  // Price Adjustments
  PriceAdjustments_Read = 'PriceAdjustments_Read',
  PriceAdjustments_Write = 'PriceAdjustments_Write',

  // Price Import Mappings
  PriceImportMappings_Read = 'PriceImportMappings_Read',
  PriceImportMappings_Write = 'PriceImportMappings_Write',

  // Price Instrument
  PriceInstrument_Read = 'PriceInstrument_Read',
  PriceInstrument_Write = 'PriceInstrument_Write',

  // Price Notification Distribution
  PriceNotificationDistribution_Read = 'PriceNotificationDistribution_Read',
  PriceNotificationDistribution_Write = 'PriceNotificationDistribution_Write',

  // Price Notification Subscription Management
  PriceNotificationSubscriptionManagement_Read = 'PriceNotificationSubscriptionManagement_Read',
  PriceNotificationSubscriptionManagement_Write = 'PriceNotificationSubscriptionManagement_Write',

  // Price Publisher
  PricePublisher_Read = 'PricePublisher_Read',
  PricePublisher_Write = 'PricePublisher_Write',

  // Prices
  Prices_Read = 'Prices_Read',
  Prices_Write = 'Prices_Write',

  // Price Translations
  PriceTranslations_Read = 'PriceTranslations_Read',
  PriceTranslations_Write = 'PriceTranslations_Write',

  // Product
  Product_Read = 'Product_Read',
  Product_Write = 'Product_Write',

  // Product Hierarchy
  ProductHierarchy_Read = 'ProductHierarchy_Read',
  ProductHierarchy_Write = 'ProductHierarchy_Write',

  // Quotebook
  Quotebook_Read = 'Quotebook_Read',
  Quotebook_Write = 'Quotebook_Write',

  // Quote Row Management
  QuoteRowManagement_Read = 'QuoteRowManagement_Read',
  QuoteRowManagement_Write = 'QuoteRowManagement_Write',

  // SCIM User
  SCIM_User_Read = 'SCIM_User_Read',
  SCIM_User_Write = 'SCIM_User_Write',

  // Trade Entry Setup
  TradeEntrySetup_VolumeThresholds_Read = 'TradeEntrySetup_VolumeThresholds_Read',
  TradeEntrySetup_VolumeThresholds_Write = 'TradeEntrySetup_VolumeThresholds_Write',

  // Users
  Users_Read = 'Users_Read',
  Users_Write = 'Users_Write',
}
