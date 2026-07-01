import { Permission } from './permissions'

/**
 * Test to verify permission parsing logic handles nested Market Platform permissions correctly
 */

describe('Permission Parsing Logic', () => {
  it('should correctly parse nested Market Platform permissions', () => {
    // Simulate the permission array from the backend
    const permissions = [
      'AllocationMapping_Read',
      'AllocationMapping_Write',
      'MarketPlatform_QuantityDistribution_Read',
      'MarketPlatform_QuantityDistribution_Write',
      'MarketPlatform_SpecialOffer_OnlineOrder_Read',
      'MarketPlatform_SpecialOffer_OnlineOrder_Write',
      'MarketPlatform_SpecialOfferAdmin_Read',
      'MarketPlatform_SpecialOfferAdmin_Write',
      'MarketPlatform_SpecialOfferAdmin_Manage',
    ]

    // This is the actual logic from UserContext/index.tsx
    // Note: 3-level nesting was removed - now use hasPermission() with Permission enum instead
    const userPermissionsObject: any = {}
    permissions?.forEach((permission) => {
      const lastUnderscoreIndex = permission.lastIndexOf('_')
      if (lastUnderscoreIndex === -1) {
        return
      }

      const featurePath = permission.substring(0, lastUnderscoreIndex)
      const action = permission.substring(lastUnderscoreIndex + 1)

      const parts = featurePath.split('_')
      if (parts.length >= 2) {
        // Two-level permission (e.g., MarketPlatform_QuantityDistribution)
        // Note: 3+ level permissions like MarketPlatform_SpecialOffer_OnlineOrder are also handled here
        // using only the first two parts for backwards compatibility with the legacy nested object
        const [category, feature] = parts
        userPermissionsObject[category] = userPermissionsObject[category] || {}
        userPermissionsObject[category][feature] = userPermissionsObject[category][feature] || {}
        userPermissionsObject[category][feature][action] = true
      } else {
        userPermissionsObject[featurePath] = { ...userPermissionsObject[featurePath], [action]: true }
      }
    })

    // Test single-level permissions (old pattern)
    expect(userPermissionsObject.AllocationMapping).toBeDefined()
    expect(userPermissionsObject.AllocationMapping.Read).toBe(true)
    expect(userPermissionsObject.AllocationMapping.Write).toBe(true)

    // Test nested MarketPlatform permissions (new pattern)
    expect(userPermissionsObject.MarketPlatform).toBeDefined()
    expect(userPermissionsObject.MarketPlatform.QuantityDistribution).toBeDefined()
    expect(userPermissionsObject.MarketPlatform.QuantityDistribution.Read).toBe(true)
    expect(userPermissionsObject.MarketPlatform.QuantityDistribution.Write).toBe(true)

    // Customer-facing special offer online order permissions
    // Note: With the simplified 2-level nesting, SpecialOffer now has Read/Write directly
    // For proper permission checking, use hasPermission(Permission.MarketPlatform_SpecialOffer_OnlineOrder_Read)
    expect(userPermissionsObject.MarketPlatform.SpecialOffer).toBeDefined()
    expect(userPermissionsObject.MarketPlatform.SpecialOffer.Read).toBe(true)
    expect(userPermissionsObject.MarketPlatform.SpecialOffer.Write).toBe(true)

    // Admin special offer permissions
    expect(userPermissionsObject.MarketPlatform.SpecialOfferAdmin).toBeDefined()
    expect(userPermissionsObject.MarketPlatform.SpecialOfferAdmin.Read).toBe(true)
    expect(userPermissionsObject.MarketPlatform.SpecialOfferAdmin.Write).toBe(true)
    expect(userPermissionsObject.MarketPlatform.SpecialOfferAdmin.Manage).toBe(true)

    // Verify the structure is correct
    console.log('Parsed permissions structure:', JSON.stringify(userPermissionsObject, null, 2))
  })
})

describe('Permission Set (New Pattern)', () => {
  it('should correctly check permissions using Set and Permission enum', () => {
    const permissions = [
      'AllocationMapping_Read',
      'AllocationMapping_Write',
      'MarketPlatform_SpecialOfferAdmin_Write',
      'MarketPlatform_SpecialOffer_OnlineOrder_Read',
      'MarketPlatform_SpecialOffer_OnlineOrder_Write',
    ]

    const permissionSet = new Set(permissions)

    // Verify Permission enum values match what's in the Set
    expect(permissionSet.has(Permission.AllocationMapping_Read)).toBe(true)
    expect(permissionSet.has(Permission.AllocationMapping_Write)).toBe(true)
    expect(permissionSet.has(Permission.MarketPlatform_SpecialOfferAdmin_Write)).toBe(true)
    expect(permissionSet.has(Permission.MarketPlatform_SpecialOffer_OnlineOrder_Read)).toBe(true)
    expect(permissionSet.has(Permission.MarketPlatform_SpecialOffer_OnlineOrder_Write)).toBe(true)

    // Verify permissions not in the Set return false
    expect(permissionSet.has(Permission.MarketPlatform_SuperUser)).toBe(false)
    expect(permissionSet.has(Permission.MarketPlatform_SpecialOfferAdmin_Read)).toBe(false)
    expect(permissionSet.has(Permission.MarketPlatform_SpecialOfferAdmin_Manage)).toBe(false)
  })

  it('should handle empty permission set', () => {
    const permissionSet = new Set<string>()

    expect(permissionSet.has(Permission.AllocationMapping_Read)).toBe(false)
    expect(permissionSet.has(Permission.MarketPlatform_SpecialOfferAdmin_Write)).toBe(false)
  })

  it('should work with hasPermission-like helper function', () => {
    const permissions = [
      'MarketPlatform_OnlineOrder_Write',
      'MarketPlatform_SpecialOffer_OnlineOrder_Write',
    ]
    const permissionSet = new Set(permissions)

    // Simulate the hasPermission helper
    const hasPermission = (permission: Permission | string): boolean => {
      return permissionSet.has(permission)
    }

    // Test the pattern used in ViewOnlineOrderDetails
    const canWrite =
      hasPermission(Permission.MarketPlatform_OnlineOrder_Write) ||
      hasPermission(Permission.MarketPlatform_SpecialOffer_OnlineOrder_Write)

    expect(canWrite).toBe(true)

    // Test when user only has one of the permissions
    const permissionSet2 = new Set(['MarketPlatform_OnlineOrder_Write'])
    const hasPermission2 = (permission: Permission | string): boolean => {
      return permissionSet2.has(permission)
    }

    const canWrite2 =
      hasPermission2(Permission.MarketPlatform_OnlineOrder_Write) ||
      hasPermission2(Permission.MarketPlatform_SpecialOffer_OnlineOrder_Write)

    expect(canWrite2).toBe(true)
  })
})
