import { useNotificationPreferences } from '@api/useNotificationPreferences'
import loginBannerImage from '@assets/SiteImages/login-side.jpg'
import { themeConfigs } from '@components/shared/Theming/themeconfigs'
import { Button, Card, Form, Input, Select, Typography, message } from 'antd'
import React, { useMemo, useState } from 'react'

const { Title, Paragraph } = Typography
const { Option } = Select

export const UnsubscribePage: React.FC = () => {
  const [form] = Form.useForm()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { useOptOutMutation } = useNotificationPreferences()
  const optOutMutation = useOptOutMutation()

  const activeThemeKey = localStorage.getItem('TYPE_OF_THEME')
  const activeTheme = useMemo(() => {
    return themeConfigs[activeThemeKey]
  }, [activeThemeKey])

  const bannerImage = activeTheme?.LoginBanner || loginBannerImage

  const handleSubmit = async (values: { email: string; reason?: string }) => {
    try {
      await optOutMutation.mutateAsync({
        Email: values.email,
        Reason: values.reason || undefined,
      })
      setIsSubmitted(true)
      message.success('You have been successfully unsubscribed from offer invitations.')
    } catch (error) {
      message.error('An error occurred while processing your request. Please try again.')
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          borderRadius: '2px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
          padding: '24px',
        }}
      >
        <div style={{ marginBottom: '30px' }}>
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            Gravitate Energy
          </div>
        </div>

        <Title level={2} style={{ color: '#4BADE9', marginBottom: '20px' }}>
          Unsubscribe from Offer Invitations
        </Title>

        {isSubmitted ? (
          <div
            style={{
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              color: '#155724',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px',
            }}
          >
            You have been successfully unsubscribed from offer invitations.
          </div>
        ) : (
          <>
            <Paragraph style={{ textAlign: 'left', fontSize: '16px', lineHeight: '1.6' }}>
              We understand that you are considering unsubscribing from special offer invitations.
            </Paragraph>

            <Paragraph style={{ textAlign: 'left', fontSize: '16px', lineHeight: '1.6' }}>
              Please note this action will result in you NOT receiving any notifications of future special offers,
              auction invitations, and exclusive deal opportunities.
            </Paragraph>

            <div
              style={{
                margin: '30px 0',
                padding: '30px 0',
                borderTop: '1px solid #d9d9d9',
                borderBottom: '1px solid #d9d9d9',
              }}
            >
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  label={
                    <span style={{ fontWeight: 500 }}>If you wish to proceed, provide your email address:</span>
                  }
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email address' },
                    { type: 'email', message: 'Please enter a valid email address' },
                  ]}
                  style={{ marginBottom: '24px' }}
                >
                  <Input placeholder="your.email@company.com" size="large" />
                </Form.Item>

                <Form.Item
                  label={<span style={{ fontWeight: 500 }}>Reason for unsubscribing (optional):</span>}
                  name="reason"
                  style={{ marginBottom: '32px' }}
                >
                  <Select placeholder="Select a reason..." size="large" allowClear>
                    <Option value="not_relevant">Content is not relevant to my job role</Option>
                    <Option value="too_frequent">Too many emails</Option>
                    <Option value="no_longer_interested">No longer interested in these offers</Option>
                    <Option value="no_longer_customer">No longer a customer</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={optOutMutation.isLoading}
                    style={{
                      width: '100%',
                      height: '48px',
                      backgroundColor: '#4BADE9',
                      borderColor: '#4BADE9',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: 600,
                    }}
                  >
                    Unsubscribe
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
