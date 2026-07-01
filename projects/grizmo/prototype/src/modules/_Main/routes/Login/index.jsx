import { useUsers } from '@api/useUsers'
import loginLogoImage from '@assets/SiteImages/login-logo.png'
import loginBannerImage from '@assets/SiteImages/login-side.jpg'
import { themeConfigs } from '@components/shared/Theming/themeconfigs'
import { LoginScreen, useApi, useAuth } from '@gravitate-js/excalibrr'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function SiteLogin() {
  const activeThemeKey = localStorage.getItem('TYPE_OF_THEME')
  const activeTheme = useMemo(() => {
    return themeConfigs[activeThemeKey]
  }, [themeConfigs, activeThemeKey])

  const navigate = useNavigate()
  const { sendResetEmailRequest, validatePasswordRequest, resetPasswordMutation, validateOTPRequest } = useUsers()

  const { post } = useApi()
  const { authenticate } = useAuth()
  const [errorMessage, setErrorMessage] = useState('')

  const handlePasswordReset = (oneTimePassword, newPassword) => {
    return resetPasswordMutation.mutateAsync({ oneTimePassword, newPassword })
  }

  const handleValidate = async ({ password }) => {
    const fetchedData = await validatePasswordRequest.mutateAsync({ password })
    const prom = new Promise((resolve) => resolve({ data: fetchedData }))
    return prom
  }
  const params = useMemo(() => {
    const p = window.location.search
    if (p.startsWith('?code=')) {
      return p.substring(6)
    }
    return null
  }, [window.location.search])
  return (
    <LoginScreen
      loginBannerImage={activeTheme?.LoginBanner || loginBannerImage}
      poweredByLogo={activeTheme?.poweredByLogo}
      onLogin={(values) => {
        const config = {}
        config.headers = {
          'Content-Type': 'application/json',
          'Gravitate-Impersonation-Mode': 'Single',
        }
        post(
          'token/authorize',
          {
            username: values.username,
            password: values.password,
            grant_type: 'password',
          },
          config
        )
          .then((resp) => {
            if (resp?.error === 0) {
              setErrorMessage(resp?.error_description)
            } else {
              authenticate(resp)
              if (params) {
                window.localStorage.removeItem('last_page_section')
                window.localStorage.removeItem('next_page_redirect_link')
                navigate(params)
              } else {
                navigate('/')
              }
            }
          })
          .catch((error) => {
            if (error === undefined) {
              return setErrorMessage('Network or CORS error. Please check browser console log')
            }
            if (error === 502) {
              return setErrorMessage('Backend Server Error 502. Is the backend running?')
            }
            if (error === 401) {
              return setErrorMessage('Invalid User Credentials. Please validate your login.')
            }
            return setErrorMessage('Unknown Auth Failure. Check browser logs for more')
          })
      }}
      loginLayout={activeTheme?.key === 'CHRISTMAS' ? 1 : 2}
      loginLogoImage={activeTheme?.LoginLogo || loginLogoImage}
      errorMessage={errorMessage}
      validateOTP={validateOTPRequest.mutateAsync}
      validatePasswordEP={handleValidate}
      resetPassword={handlePasswordReset}
      sendResetEmail={sendResetEmailRequest.mutateAsync}
    />
  )
}
