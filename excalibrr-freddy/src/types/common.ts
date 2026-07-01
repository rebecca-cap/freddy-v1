/**
 * These theme props are reused heavily in various gravi components, so they've been exported here for convenience.
 * They can be used on their own, or combined with other prop type definitions using the union (&) operator.
 * Example: type ComponentProps = ThemeVariants & { extraProp: boolean }
 * You can also use a variety of utility types provided by TS to augment this type, like:
 * Partial<ThemeVariants> would make all of the keys of this type optional.
 */
export type ThemeVariants = {
  theme1: boolean
  theme2: boolean
  theme3: boolean
  theme4: boolean
  success: boolean
  warning: boolean
  error: boolean
}
