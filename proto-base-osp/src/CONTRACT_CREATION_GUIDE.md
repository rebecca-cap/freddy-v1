# Contract Creation Information Location Guide

## Overview
This document maps out where all contract creation information is located in the ContractManagement module.

---

## Main Entry Point
**Location:** `/modules/ContractManagement/page.tsx`

The main page renders two modes:
- **Header Entry Mode** (`pageMode === 'header'`) - For creating/editing contract headers
- **Details View Mode** (`pageMode === 'details'`) - For managing contract details after header is created

---

## Contract Creation Flow

### 1. **Header Entry View**
**Component:** `/modules/ContractManagement/components/HeaderEntry/index.tsx`

This is the main contract creation form that consists of 4 sub-sections:

#### **Section A: Contract Type & Description**
**Location:** Rendered directly in HeaderEntryView

**Fields:**
- `TradeInstrumentId` - Contract Type (radio buttons)
  - Data source: `metadata.TradeInstrumentList`
  - Component: `ContractTypeCheckboxGroup` (`/components/ContractTypeCheckboxGroup/index.tsx`)
- `Description` - Free text field
- `Comments` - Text area field

---

#### **Section B: Counterparty Information**
**Component:** `/modules/ContractManagement/components/CounterpartyInfoForm/index.tsx`

**Required Fields:**
- `InternalCounterparty` - Cascading selector (Counterparty → Contact)
  - Data source:
    - `metadata.InternalCounterPartyList` (parent options)
    - `metadata.InternalColleagueList` (child options, filtered by GroupingValue)

- `ExternalCounterparty` - Cascading selector (Counterparty → Contact)
  - Data source:
    - `metadata.ExternalCounterPartyList` (parent options)
    - `metadata.ExternalColleagueList` (child options, filtered by GroupingValue)
  - Note: External contact is optional (can select just counterparty)

**What happens on save:**
The form transforms these cascader values into individual fields:
- `InternalCounterPartyId`, `InternalCounterPartyName`
- `InternalColleagueId`, `InternalColleagueFirstName`, `InternalColleagueLastName`
- `ExternalCounterPartyId`, `ExternalCounterPartyName`
- `ExternalColleagueId`, `ExternalColleagueFirstName`, `ExternalColleagueLastName`

---

#### **Section C: Trade Information**
**Component:** `/modules/ContractManagement/components/TradeInfoForm/index.tsx`

**Required Fields:**

**Trade Dates:**
- `ValuationCalendarId` - Contract Calendar dropdown
  - Data source: `metadata.PricingCalendars`
- `TradeEntryDateTime` - Contract Date picker
- `EffectiveDates` - Date range picker [start, end]

**Quantities:**
- `ContractManagementRequiresQuantities` - Switch (Required/Disabled)

**Cascading Options (when editing existing contracts with details):**
- `CascadeHeaderDatesToDetails` - Checkbox
- `CascadeHeaderDatesToPrices` - Checkbox
  - Note: If CascadeHeaderDatesToPrices is true, CascadeHeaderDatesToDetails must also be true

**Special Features:**
- Press 'T' key in any date field to insert today's date
- Date changes trigger confirmation dialogs if cascading options are enabled

---

#### **Section D: Additional Information**
**Component:** `/modules/ContractManagement/components/AdditionalInfoForm/index.tsx`

**Optional Fields:**
- `InternalContractNumber` - Text input
- `ExternalContractNumber` - Text input
- `MovementTypeCvId` - Dropdown
  - Data source: `metadata.MovementTypes`
- `BookId` - Strategy dropdown
  - Data source: `metadata.Books`

---

## API Endpoints & Data Sources

### Metadata Endpoint
**Location:** `/modules/ContractManagement/api/useContracts.ts`

**Endpoint:** `ContractManagement/MetaData`
**Hook:** `useALLContractManagementData()`
**Cached for:** 10 minutes

**Returns all dropdown/selection data:**
```typescript
{
  InternalCounterPartyList: SelectOption[]
  InternalColleagueList: SelectOption[]
  ExternalCounterPartyList: SelectOption[]
  ExternalColleagueList: SelectOption[]
  TradeInstrumentList: SelectOption[]
  PricingCalendars: SelectOption[]
  MovementTypes: SelectOption[]
  Books: SelectOption[]
  // ... other metadata
}
```

### Contract Submission
**Endpoint:** `ContractManagement/Upsert`
**Function:** `submitContract(contract)`

**Called from:** ContractManagementContext when user clicks "Save" or "Activate"

---

## Contract Details Management

After the header is saved, the system switches to **Details View Mode** where users can:

### Add/Edit Contract Details
**Component:** `/modules/ContractManagement/components/DetailManager/DetailForm.tsx`

**Key Components:**
- **Details Section** - Product, Location, Quantities
- **Price Management** - Pricing provisions, formulas
- **Provision Manager** - Complex pricing formula builder

---

## State Management

**Context:** `ContractManagementContext` (`/contexts/ContractManagement`)

**Key State:**
- `pageMode` - Toggles between 'header' and 'details' views
- `header` - Current contract header data
- `metadata` - All dropdown/selection options
- `isLoadingContract` - Loading state
- `isDraftModalVisible` - Controls save/draft modal
- `hasContractEdits` - Tracks unsaved changes

**Key Functions:**
- `saveHeader()` - Saves header and switches to details mode
- `saveContract()` - Final contract submission
- `setPageMode()` - Switches between header/details views

---

## Data Flow Summary

```
1. User navigates to /ContractManagement/Contracts
   ↓
2. Click "Create Contract" (id === 'createContract')
   ↓
3. Load Metadata via useALLContractManagementData()
   ↓
4. Render HeaderEntryView with empty form
   ↓
5. User fills out all 4 sections:
   - Contract Type & Description
   - Counterparty Info
   - Trade Info
   - Additional Info
   ↓
6. Click "Manage Details" button
   ↓
7. Form validation runs
   ↓
8. saveHeader() transforms and stores data
   ↓
9. Switch to pageMode='details'
   ↓
10. User adds contract details, quantities, prices
   ↓
11. Click "Save As..." or "Activate"
   ↓
12. submitContract() calls ContractManagement/Upsert endpoint
```

---

## Required Fields Summary

**Minimum required to proceed from Header to Details:**
1. ✅ Trade Instrument (Contract Type)
2. ✅ Internal Counterparty & Contact
3. ✅ External Counterparty (Contact optional)
4. ✅ Contract Calendar
5. ✅ Contract Date
6. ✅ Effective Dates (range)

**Optional but recommended:**
- Description
- Comments
- Internal/External Contract Numbers
- Movement Type
- Strategy (Book)

---

## File Structure

```
/modules/ContractManagement/
├── page.tsx                          # Main router (header vs details mode)
├── api/
│   ├── useContracts.ts              # All API hooks and endpoints
│   └── types.schema.ts              # TypeScript types
├── components/
│   ├── HeaderEntry/
│   │   └── index.tsx                # Main header form container
│   ├── ContractTypeCheckboxGroup/   # Contract type selection
│   ├── CounterpartyInfoForm/        # Internal/External parties
│   ├── TradeInfoForm/               # Dates & quantities config
│   ├── AdditionalInfoForm/          # Optional metadata
│   ├── DetailsView/                 # Post-header detail management
│   ├── DetailManager/               # Individual detail editor
│   └── SaveAsModal.tsx              # Final save/activation modal
└── utils/                           # Helper functions
```

---

## Notes

- **Contract Type** determines `TradeEntryTypeCvId` via the `GroupingValue` in metadata
- **Effective Dates** are stored as both individual dates (`FromDateTime`, `ToDateTime`) and as a range (`EffectiveDates`)
- **Colleague names** are split into FirstName/LastName on save
- **Draft contracts** can be edited until activated
- **Activated contracts** may have field restrictions based on `disableFields` logic
