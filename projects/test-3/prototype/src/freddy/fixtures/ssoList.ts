// Freddy mock fixture — not used in production code paths.
// Empty SSO providers list = login form falls back to username/password
// (which we never hit anyway because useAuth's mock seam pre-seeds tokens).

export const ssoListFixture: unknown[] = []
