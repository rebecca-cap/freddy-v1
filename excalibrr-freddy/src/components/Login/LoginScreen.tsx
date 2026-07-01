import './styles.css'

import { Horizontal } from '../Layout/Horizontal'
import { Vertical } from '../Layout/Vertical'
import { ForgotPasswordForm } from './Forms/ForgotPasswordForm'
import { LoginForm, LoginValues } from './Forms/LoginForm'
import { PasswordResetForm } from './Forms/PasswordResetForm'
import { useLogin } from './useLogin'

export type LoginScreenProps = {
  onLogin: (values: LoginValues) => void
  loginTitle: string
  loginBannerImage: string
  validateOTP: (otp: string | null) => Promise<boolean>
  validatePasswordEP: ({ password }: { password: string }) => Promise<any>
  resetPassword: (password: string) => Promise<boolean>
  sendResetEmail: (email: string) => Promise<boolean>
  loginLayout?: 1 | 2
  loginLogoImage: string
  errorMessage?: string
  poweredByLogo?: string
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  loginTitle,
  loginBannerImage,
  validateOTP,
  validatePasswordEP,
  resetPassword,
  sendResetEmail,
  loginLayout = 1,
  loginLogoImage,
  errorMessage,
  poweredByLogo,
}) => {
  const {
    oneTimePassword,
    setOneTimePassword,
    showResetDialog,
    setShowResetDialog,
  } = useLogin()

  return (
    <Horizontal horizontalCenter verticalCenter style={{ height: '100vh' }}>
      {oneTimePassword && (
        <PasswordResetForm
          oneTimePassword={oneTimePassword}
          setOneTimePassword={setOneTimePassword}
          setShowResetDialog={setShowResetDialog}
          validateOTP={validateOTP}
          validatePasswordEP={validatePasswordEP}
          resetPassword={resetPassword}
        />
      )}
      {showResetDialog && (
        <ForgotPasswordForm
          setShowResetDialog={setShowResetDialog}
          sendResetEmail={sendResetEmail}
        />
      )}
      {!showResetDialog && !oneTimePassword && (
        <LoginForm
          onLogin={onLogin}
          setShowResetDialog={setShowResetDialog}
          loginLogoImage={loginLogoImage}
          loginLayout={loginLayout}
          errorMessage={errorMessage}
          poweredByLogo={poweredByLogo}
        />
      )}
      <Background
        loginLayout={loginLayout}
        loginTitle={loginTitle}
        loginBannerImage={loginBannerImage}
      />
    </Horizontal>
  )
}

type BackgroundProps = {
  loginTitle: string
  loginBannerImage: string
  loginLayout: 1 | 2
}

const Background: React.FC<BackgroundProps> = ({
  loginTitle,
  loginBannerImage,
  loginLayout,
}) => {
  if (loginLayout === 1) {
    return (
      <Horizontal
        flex={1}
        className='login-container'
        horizontalCenter
        verticalCenter
      >
        <Vertical
          flex={1}
          style={{ backgroundImage: `url(${loginBannerImage})` }}
          className='login-banner-image'
        >
          <Horizontal flex={1}>
            <Vertical flex={1} className='image-filter'>
              <Vertical flex={1} verticalCenter>
                {loginTitle}
              </Vertical>
              <div className='ml-5 '>
                <div className='login-logo' />
              </div>
            </Vertical>
          </Horizontal>
        </Vertical>
        <Vertical flex={1}>
          <div className='trans-login-logo' />
        </Vertical>
      </Horizontal>
    )
  }
  return (
    <Horizontal
      flex={1}
      className='login-container'
      horizontalCenter
      verticalCenter
    >
      <Vertical
        flex={1}
        style={{ backgroundImage: `url(${loginBannerImage})` }}
        className='login-banner-image'
      />
    </Horizontal>
  )
}
