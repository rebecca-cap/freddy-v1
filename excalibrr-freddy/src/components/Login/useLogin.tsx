import queryString from 'query-string'
import { useState } from 'react'

import { useAuth } from '@/hooks/auth/useAuth'

export const useLogin = () => {
  const { sso } = useAuth()
  const url = window?.location.href
  const isSSOUrl = sso?.callbackUrl ? url.includes(sso?.callbackUrl) : false

  const params = queryString.parse(window?.location.search)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [oneTimePassword, setOneTimePassword] = useState(() => {
    const otp = Object.keys(params)[0]
    if (!otp || otp.startsWith('code') || isSSOUrl) return null
    return otp
  })

  return {
    oneTimePassword,
    setOneTimePassword,
    showResetDialog,
    setShowResetDialog,
  }
}
