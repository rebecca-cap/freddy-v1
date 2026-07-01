# UserContext Permissions - Claude Code Guidance

## Permission Checking Pattern (Required)

Always use `hasPermission()` with the `Permission` enum:

```typescript
import { Permission, useUser } from '@contexts/UserContext'

const { hasPermission } = useUser()
const canWrite = hasPermission(Permission.MarketPlatform_SpecialOfferAdmin_Write)
```

## Legacy Pattern (Do Not Use in New Code)

```typescript
// AVOID - Legacy nested object pattern
const canWrite = !!userPermissions?.MarketPlatform?.SpecialOfferAdmin?.Write
```

## Adding New Permissions

1. Add to backend enum: `Gravitate.Domain.Adapter.DatabaseGeneric.GravitateDatabaseEnums.cs`
2. Add to frontend enum: `frontend/src/contexts/UserContext/permissions.ts`
3. Use `hasPermission(Permission.NewPermission_Action)` in components

See `README.md` in this folder for full documentation.
