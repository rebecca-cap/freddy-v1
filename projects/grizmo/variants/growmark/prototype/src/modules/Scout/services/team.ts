// Fake team roster + share-label helpers for the Scout prototype.
//
// Sharing a saved item lands it in a teammate's Library. There are no real
// accounts in the prototype, so this module supplies a small static roster and
// the human-readable strings the share badge + toast use. Keep it obviously
// canned — these are demo colleagues, not real users.

import type { FakeUser, ShareTarget } from '../types'

// The current user is "You" and is NOT in this list — you share *to* others.
// Adam Wallace is the manager persona (the "standardize the team" case).
export const TEAM_USERS: FakeUser[] = [
  { id: 'u-adam', name: 'Adam Wallace', initials: 'AW' },
  { id: 'u-agustin', name: 'Agustin Reichhardt', initials: 'AR' },
  { id: 'u-reece', name: 'Reece', initials: 'R' },
  { id: 'u-dana', name: 'Dana Okafor', initials: 'DO' },
]

const userById = (id: string): FakeUser | undefined =>
  TEAM_USERS.find((u) => u.id === id)

// First names (or full names) of the picked users, in roster order.
const pickedNames = (userIds: string[]): string[] =>
  TEAM_USERS.filter((u) => userIds.includes(u.id)).map((u) => u.name)

// Compact badge on a shared card: "Shared · team" / "Shared · Reece" /
// "Shared · 3 people".
export const summarizeShareBadge = (target: ShareTarget): string => {
  if (target.scope === 'team') return 'Shared · team'
  const names = pickedNames(target.userIds)
  if (names.length === 0) return 'Shared'
  if (names.length === 1) return `Shared · ${names[0]}`
  return `Shared · ${names.length} people`
}

// Confirmation toast after sharing.
export const summarizeShareToast = (target: ShareTarget): string => {
  if (target.scope === 'team') {
    return "Shared with the team — it's now in everyone's library."
  }
  const names = pickedNames(target.userIds)
  if (names.length === 0) return 'Shared.'
  const list =
    names.length <= 2
      ? names.join(' and ')
      : `${names.slice(0, 2).join(', ')} +${names.length - 2}`
  return `Shared with ${list} — it's in their library.`
}

export { userById }
