import { hitLogin, login } from '@utils/api/login'

import { getAPIURL } from '../../modules/_Main'

it('Grabs a valid baseURL', () => {
  const url = getAPIURL('http://core-internal.fay-devsolver1.fay.cap/api')
  expect(url).toMatch('http://core-internal.fay-devsolver1.fay.cap/api')
})

it('Successfully Calls LoginAPI', async () => {
  const resp = await hitLogin({ username: 'support@capspire.com', password: 'ngldemo' })
  const json = await resp.json()
  expect(json).toHaveProperty('access_token')
})

it('Stores the token in localStorage', async () => {
  await login({ username: 'support@capspire.com', password: 'ngldemo' })
  expect(window.localStorage.getItem('token')).toBeTruthy()
})
