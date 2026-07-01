interface StorageItem {
  value: any
  expiration: number
}

export class LocalStorageWithExpiration {
  /**
   * Set an item in localStorage with expiration
   * @param key - Storage key
   * @param value - Value to store
   * @param hoursUntilExpiration - Hours until expiration (default: 8)
   */
  static set(key: string, value: any, hoursUntilExpiration: number = 8): void {
    const expirationTime = Date.now() + hoursUntilExpiration * 60 * 60 * 1000
    const item: StorageItem = {
      value,
      expiration: expirationTime,
    }
    localStorage.setItem(key, JSON.stringify(item))
  }

  /**
   * Get an item from localStorage, returns null if expired or doesn't exist
   * @param key - Storage key
   * @returns The stored value or null if expired/missing
   */
  static get(key: string): any {
    try {
      const itemStr = localStorage.getItem(key)
      if (!itemStr) return null

      const item: StorageItem = JSON.parse(itemStr)
      if (Date.now() > item.expiration) {
        // Item expired, remove it
        localStorage.removeItem(key)
        return null
      }

      return item.value
    } catch (error) {
      // Invalid JSON or other error, remove the item
      localStorage.removeItem(key)
      return null
    }
  }

  /**
   * Check if an item exists and is not expired
   * @param key - Storage key
   * @returns true if item exists and is not expired
   */
  static exists(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Remove an item from localStorage
   * @param key - Storage key
   */
  static remove(key: string): void {
    localStorage.removeItem(key)
  }

  /**
   * Clean up expired items from localStorage
   */
  static cleanupExpired(): void {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      try {
        const itemStr = localStorage.getItem(key)
        if (itemStr) {
          const item = JSON.parse(itemStr)
          if (item.expiration && Date.now() > item.expiration) {
            localStorage.removeItem(key)
          }
        }
      } catch {
        // Ignore invalid JSON items
      }
    })
  }
}