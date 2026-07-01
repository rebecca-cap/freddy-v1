# Permission System

This document describes how permissions work in the Gravitate frontend application.

## Overview

The permission system controls access to features based on user roles. Permissions are defined in the database and returned by the backend API as a flat array of strings (e.g., `["AllocationMapping_Read", "MarketPlatform_SpecialOfferAdmin_Write"]`).

## How Permissions Work

### Backend
- Permissions are stored in the `Permission` table with a `Name` column
- Users are assigned roles, and roles have permissions via the `PermissionRole` table
- The `/Credential/UserInfo` endpoint returns the user's permissions as `string[]`

### Frontend
The `UserContext` provides two ways to check permissions:

#### 1. New Pattern (Recommended) - `hasPermission()`
```typescript
import { Permission, useUser } from '@contexts/UserContext'

function MyComponent() {
  const { hasPermission } = useUser()

  const canWrite = hasPermission(Permission.MarketPlatform_SpecialOfferAdmin_Write)
  const canManage = hasPermission(Permission.MarketPlatform_SpecialOfferAdmin_Manage)

  return canWrite ? <EditButton /> : null
}
```

**Benefits:**
- Type-safe with autocomplete via the `Permission` enum
- Simple boolean check
- O(1) lookup using Set
- Permission names match database exactly

#### 2. Legacy Pattern - Nested Object Access
```typescript
import { useUser } from '@contexts/UserContext'

function MyComponent() {
  const { userPermissions } = useUser()

  const canWrite = !!userPermissions?.MarketPlatform?.SpecialOfferAdmin?.Write

  return canWrite ? <EditButton /> : null
}
```

**Note:** This pattern is maintained for backward compatibility. New code should use `hasPermission()`.

## Permission Naming Convention

Permission names follow the pattern: `{Category}_{Feature}_{Action}` or `{Category}_{Feature}_{SubFeature}_{Action}`

- **Category**: Top-level grouping (e.g., `MarketPlatform`, `Admin`)
- **Feature**: Specific feature area (e.g., `SpecialOfferAdmin`, `QuantityDistribution`)
- **SubFeature**: Optional nested feature (e.g., `OnlineOrder`)
- **Action**: What the user can do (`Read`, `Write`, `Manage`, `Execute`)

### Examples
| Permission | Description |
|------------|-------------|
| `AllocationMapping_Read` | View allocation mappings |
| `AllocationMapping_Write` | Edit allocation mappings |
| `MarketPlatform_SpecialOfferAdmin_Read` | View special offer admin dashboard |
| `MarketPlatform_SpecialOfferAdmin_Write` | Create/edit special offers |
| `MarketPlatform_SpecialOfferAdmin_Manage` | Approve/reject special offer orders |
| `MarketPlatform_SpecialOffer_OnlineOrder_Read` | Customer view of special offers |
| `MarketPlatform_SpecialOffer_OnlineOrder_Write` | Customer can place special offer orders |

## Adding New Permissions

### 1. Backend (SQL Migration)
Create a SQL migration script in `backend/Scripting/SQL/Upgrade/Automated/V10_00/`:

```sql
;WITH merge_data AS (
    SELECT DISTINCT Name FROM (VALUES
        ('NewFeature_Read'),
        ('NewFeature_Write')
    ) AS Permissions(Name)
)
MERGE Permission AS Target
USING merge_data AS Source ON (TARGET.Name = Source.Name)
WHEN NOT MATCHED BY TARGET THEN INSERT (Name) VALUES (SOURCE.Name);
```

### 2. Frontend (Permission Enum)
Add the new permission to `frontend/src/contexts/UserContext/permissions.ts`:

```typescript
export enum Permission {
  // ... existing permissions ...

  // New Feature
  NewFeature_Read = 'NewFeature_Read',
  NewFeature_Write = 'NewFeature_Write',
}
```

### 3. Use in Components
```typescript
import { Permission, useUser } from '@contexts/UserContext'

function NewFeaturePage() {
  const { hasPermission } = useUser()
  const canWrite = hasPermission(Permission.NewFeature_Write)
  // ...
}
```

## Testing Permissions

### In Unit Tests
```typescript
import { Permission } from './permissions'

it('should check permissions correctly', () => {
  const permissionSet = new Set(['NewFeature_Read', 'NewFeature_Write'])

  expect(permissionSet.has(Permission.NewFeature_Read)).toBe(true)
  expect(permissionSet.has(Permission.NewFeature_Write)).toBe(true)
  expect(permissionSet.has(Permission.SomeOther_Read)).toBe(false)
})
```

### Manual Testing
1. Login with a user that has the target role
2. Check browser DevTools -> Network -> `/Credential/UserInfo` response
3. Verify the `Permissions` array contains expected values

## Architecture Notes

```
+---------------------------------------------------------+
|                        Backend                          |
|  +-------------+    +-------------+    +-------------+  |
|  | Permission  |--->|PermissionRole|<---| Role        |  |
|  |   Table     |    |    Table     |    |    Table    |  |
|  +-------------+    +-------------+    +-------------+  |
|                            |                            |
|                            v                            |
|                   UserContext.Permissions               |
|                       (string[])                        |
+---------------------------------------------------------+
                            |
                            v API Response
+---------------------------------------------------------+
|                        Frontend                         |
|                                                         |
|  +---------------------------------------------------+  |
|  |                    UserContext                    |  |
|  |  +----------------+    +-----------------------+  |  |
|  |  | permissionSet  |    | userPermissions (legacy)|  |
|  |  |  Set<string>   |    |   nested object       |  |  |
|  |  +----------------+    +-----------------------+  |  |
|  |           |                                       |  |
|  |           v                                       |  |
|  |  hasPermission(Permission.X) -> boolean           |  |
|  +---------------------------------------------------+  |
|                            |                            |
|                            v                            |
|                       Components                        |
|            hasPermission(Permission.Feature_Write)      |
+---------------------------------------------------------+
```

## Migration Guide (Legacy -> New Pattern)

When updating existing code:

**Before:**
```typescript
const { userPermissions } = useUser()
const canWrite = !!userPermissions?.MarketPlatform?.SpecialOfferAdmin?.Write
```

**After:**
```typescript
import { Permission, useUser } from '@contexts/UserContext'
const { hasPermission } = useUser()
const canWrite = hasPermission(Permission.MarketPlatform_SpecialOfferAdmin_Write)
```

The legacy `userPermissions` object will be deprecated in a future release.
