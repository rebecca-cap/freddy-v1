import { vi } from 'vitest'

vi.mock('react-ga')

// beforeAll(async () => {
//   await login({ username: 'support@capspire.com', password: 'ngldemo' })
// })
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

global.jest = vi
