import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Form, Input, Skeleton, Space } from 'antd'
import { debounce } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { isDefined } from '../../../Utils/general'
import { ErrorNotification } from '../../Controls/FormControls/ErrorNotification'
import { BBDTag } from '../../DataDisplay/BBDTag'
import { NotificationMessage } from '../../DataDisplay/NotificationMessage'
import { Texto } from '../../DataDisplay/Texto/Texto'

type PasswordPolicyCategory =
  | 'length'
  | 'uppercase'
  | 'lowercase'
  | 'special'
  | 'nonletters'
  | 'numbers'
  | 'commonpassword'

type PasswordPolicy = Partial<Record<PasswordPolicyCategory, number>>

const parsePolicyError = (errorString: string) => {
  const [type, _, quantity] = errorString.split(/(\(|\))/)
  return { type, quantity }
}

type Props = {
  oneTimePassword: string | null
  setShowResetDialog: (show: boolean) => void
  setOneTimePassword: (oneTimePassword: string | null) => void
  validateOTP: (oneTimePassword: string | null) => Promise<any>
  validatePasswordEP: ({ password }: { password: string }) => Promise<any>
  resetPassword: (oneTimePassword: string, password: string) => Promise<any>
}

export const PasswordResetForm: React.FC<Props> = ({
  oneTimePassword,
  setShowResetDialog,
  setOneTimePassword,
  validateOTP,
  validatePasswordEP,
  resetPassword,
}) => {
  const [isValidOTP, setIsValidOTP] = useState<boolean>()

  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>({})
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [policyErrors, setPolicyErrors] = useState<{ type: string }[]>([])
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const initializePolicy = () => {
    validatePasswordEP({ password: ' ' })
      .then((resp) => {
        const { policy } = resp?.data

        if (policy) {
          setPasswordPolicy(policy)
          // Since our initial password state is empty and we need at least one character to send to the validate EP,
          // we'll prefill the errors array with each policy to start.
          const policyErrors = Object.keys(policy).map((key) => ({ type: key }))
          setPolicyErrors(policyErrors)
        }
      })
      .catch((e) => {
        console.error('Failed to fetch password policy')
        console.error(e)
      })
  }

  useEffect(initializePolicy, [])

  useEffect(() => {
    validateOTP(oneTimePassword)
      .then(() => {
        setIsValidOTP(true)
      })
      .catch(() => {
        setIsValidOTP(false)
      })
  }, [])

  const checkIfCanProceed = async () => {
    if (policyErrors.length > 0) {
      setIsConfirmed(false)
      return
    }
    try {
      await form.validateFields()
      setIsConfirmed(true)
    } catch (errorInfo) {
      setIsConfirmed(false)
    }
  }

  const validatePassword = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e?.target?.value

    if (password) {
      const resp = await validatePasswordEP({ password })
      if (resp?.data?.errors) {
        setPolicyErrors(resp?.data?.errors?.map(parsePolicyError))
      }
    } else {
      initializePolicy()
    }
  }

  const debouncedHandler = useMemo(() => debounce(validatePassword, 300), [])

  const handleReset = ({ password }: { password: string }) => {
    if (!oneTimePassword) return
    resetPassword(oneTimePassword, password).then((response) => {
      if (response?.Message) {
        NotificationMessage('Invalid Token', response.Message, true)
        navigate('/login')
      } else {
        NotificationMessage(
          'Password Changed',
          'Your password was changed successfully. You may now login.',
          false
        )
      }
      setShowResetDialog(false)
      setOneTimePassword(null)
    })
  }
  const showLengthValidation =
    isDefined(passwordPolicy?.length) && passwordPolicy.length !== 0
  const showUppercaseValidation =
    isDefined(passwordPolicy?.uppercase) && passwordPolicy.uppercase !== 0
  const showNumbersValidation =
    isDefined(passwordPolicy?.numbers) && passwordPolicy.numbers !== 0
  const showSpecialValidation =
    isDefined(passwordPolicy?.special) && passwordPolicy.special !== 0
  const showNonLettersValidation =
    isDefined(passwordPolicy?.nonletters) && passwordPolicy.nonletters !== 0
  const showLowercaseValidation =
    isDefined(passwordPolicy?.lowercase) && passwordPolicy.lowercase !== 0

  const showCommonpasswordValidation = useMemo(() => {
    return (
      isDefined(passwordPolicy?.commonpassword) &&
      policyErrors?.some((e) => e.type === 'commonpassword') &&
      form.getFieldValue('password')
    )
  }, [policyErrors])

  if (isValidOTP) {
    return (
      <div className='login-form'>
        <div className='flex-1 vertical-flex-center login-heading-container'>
          <Texto
            category='heading'
            style={{ fontSize: '1.6em' }}
            weight={600}
            align='center'
          >
            Enter new password
          </Texto>
        </div>
        <div className='flex-2'>
          <Form
            form={form}
            onFinishFailed={ErrorNotification}
            initialValues={{ one_time_password: oneTimePassword }}
            onFinish={handleReset}
          >
            <Texto
              className='mb-2'
              appearance='medium'
              category='label'
              weight='bold'
            >
              New Password
            </Texto>
            <Form.Item
              name='password'
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please enter your new password!',
                },
              ]}
            >
              <Input.Password
                data-cy='input-password-reset'
                onChange={debouncedHandler}
                placeholder='Enter New Password'
              />
            </Form.Item>
            {passwordPolicy && (
              <>
                <Texto
                  className='mb-2'
                  appearance='medium'
                  category='label'
                  weight='bold'
                >
                  Requirements:
                </Texto>
                <Space
                  wrap
                  size='middle'
                  style={{
                    justifyContent: 'center',
                    marginTop: '1.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  {showCommonpasswordValidation && (
                    <BBDTag style={{ textTransform: 'capitalize' }}>
                      Password Too Common
                    </BBDTag>
                  )}
                  {showLengthValidation && (
                    <BBDTag
                      style={{ textTransform: 'capitalize' }}
                      success={!policyErrors?.some((e) => e.type === 'length')}
                    >
                      {passwordPolicy?.length} {/** @ts-ignore */}
                      {passwordPolicy?.length > 1 ? 'characters' : 'character'}
                    </BBDTag>
                  )}
                  {showUppercaseValidation && (
                    <BBDTag
                      style={{ textTransform: 'capitalize' }}
                      success={
                        !policyErrors?.some((e) => e.type === 'uppercase')
                      }
                    >
                      {passwordPolicy?.uppercase} uppercase {/** @ts-ignore */}
                      {passwordPolicy?.uppercase > 1
                        ? 'characters'
                        : 'character'}
                    </BBDTag>
                  )}
                  {showLowercaseValidation && (
                    <BBDTag
                      style={{ textTransform: 'capitalize' }}
                      success={
                        !policyErrors?.some((e) => e.type === 'lowercase')
                      }
                    >
                      {passwordPolicy?.lowercase} lowercase {/** @ts-ignore */}
                      {passwordPolicy?.lowercase > 1
                        ? 'characters'
                        : 'character'}
                    </BBDTag>
                  )}
                  {showNumbersValidation && (
                    <BBDTag
                      style={{ textTransform: 'capitalize' }}
                      success={!policyErrors?.some((e) => e.type === 'numbers')}
                    >
                      {passwordPolicy?.numbers} {/** @ts-ignore */}
                      {passwordPolicy?.numbers > 1 ? 'numbers' : 'number'}
                    </BBDTag>
                  )}
                  {showSpecialValidation && (
                    <BBDTag
                      style={{ textTransform: 'capitalize' }}
                      success={!policyErrors?.some((e) => e.type === 'special')}
                    >
                      {passwordPolicy?.special} special {/** @ts-ignore */}
                      {passwordPolicy?.special > 1 ? 'characters' : 'character'}
                    </BBDTag>
                  )}
                  {showNonLettersValidation && (
                    <BBDTag
                      style={{ textTransform: 'capitalize' }}
                      success={
                        !policyErrors?.some((e) => e.type === 'nonletters')
                      }
                    >
                      {passwordPolicy?.nonletters} non-letter{' '}
                      {/** @ts-ignore */}
                      {passwordPolicy?.nonletters > 1
                        ? 'characters'
                        : 'character'}
                    </BBDTag>
                  )}
                </Space>
              </>
            )}
            <Texto
              className='mb-2'
              appearance='medium'
              category='label'
              weight='bold'
            >
              Confirm Password
            </Texto>
            <Form.Item
              name='confirm'
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm the new password.',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error(
                        'The two passwords that you entered do not match!'
                      )
                    )
                  },
                }),
              ]}
            >
              <Input.Password
                data-cy='input-password-reset-confirm'
                onChange={checkIfCanProceed}
                placeholder='Confirm Password'
              />
            </Form.Item>
            <Texto
              appearance='medium'
              category='label'
              style={{ marginBottom: '1rem', fontStyle: 'italic' }}
            >
              Password creation will fail if your username resembles your
              password.
            </Texto>

            <Form.Item>
              <Button
                data-cy='button-reset-password'
                type='primary'
                htmlType='submit'
                className='login-form-button'
                disabled={policyErrors?.length > 0 || !isConfirmed}
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
          <Button
            data-cy='button-password-reset-return'
            icon={<ArrowLeftOutlined />}
            type='link'
            onClick={() => setOneTimePassword(null)}
          >
            Back to login
          </Button>
        </div>
      </div>
    )
  }
  if (isValidOTP === false) {
    return <OTPInvalid />
  }
  return (
    <div className='login-form'>
      <div className='flex-1 vertical-flex-center login-heading-container'>
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    </div>
  )
}

function OTPInvalid() {
  return (
    <div className='login-form'>
      <div className='flex-1 vertical-flex-center login-heading-container'>
        <Texto category='heading' weight={600} className='mb-4' align='center'>
          Password Reset Expired
        </Texto>
        <Texto category='h6' weight={600} align='center'>
          Your One Time Password has expired. Please reset your password again.
        </Texto>
      </div>

      <Texto category='p2' className='flex-2 flex justify-center items-center'>
        <ArrowLeftOutlined
          className='mr-2'
          style={{ color: 'var(--theme-color-2)' }}
        />
        <a href='/login'>Back To Login</a>
      </Texto>
    </div>
  )
}
