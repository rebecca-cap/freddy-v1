import { PLACEHOLDER_COLORS } from '@constants/colors'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Modal, theme } from 'antd'
import { useState } from 'react'

export function PlaceholderExplanationModal({}) {
  const { token } = theme.useToken()
  const [placeholderModalVisible, setPlaceholderModalVisible] = useState(false)

  return (
    <>
      <Horizontal
        className='mb-2 p-2'
        verticalCenter
        style={{
          backgroundColor: token.colorBgContainer,
          borderRadius: '3px',
          border: `1px solid ${token.colorInfoBorder}`,
        }}
      >
        <Texto category='p2' appearance='medium'>
          Use placeholders (e.g.,{' '}
          <span style={{ fontFamily: 'monospace', color: PLACEHOLDER_COLORS.text, fontWeight: 600 }}>[*INSTR*]</span>)
          for fields that will be customized later when applying this template.
        </Texto>
        <GraviButton
          onClick={() => setPlaceholderModalVisible(true)}
          className='ml-1 ghost-gravi-button'
          buttonText={
            <Texto category='p2' weight={'normal'} style={{ color: token.colorPrimary, textDecoration: 'underline' }}>
              Tell me more
            </Texto>
          }
        />
      </Horizontal>

      {/* Placeholder Info Modal */}
      <Modal
        title={
          <Texto category='h5' weight='600'>
            About Placeholders in Formula Templates
          </Texto>
        }
        styles={{ body: { fontSize: '12px' } }}
        open={placeholderModalVisible}
        onCancel={() => setPlaceholderModalVisible(false)}
        footer={[
          <GraviButton
            key='close'
            buttonText='Got It'
            onClick={() => setPlaceholderModalVisible(false)}
            className='gravi-button-success'
          />,
        ]}
        width={700}
      >
        <Vertical gap='20px'>
          <Vertical>
            <Texto category='p1' weight='600' className='mb-2' style={{ display: 'block' }}>
              What are placeholders?
            </Texto>
            <Texto category='p2' appearance='medium'>
              Placeholders allow you to create flexible, reusable formula templates by marking fields that will be
              customized later. Instead of specifying exact values for every field, you can use placeholder values like{' '}
              <span style={{ fontFamily: 'monospace', color: PLACEHOLDER_COLORS.text, fontWeight: 600 }}>
                [*INSTR*]
              </span>{' '}
              for instrument or{' '}
              <span style={{ fontFamily: 'monospace', color: PLACEHOLDER_COLORS.text, fontWeight: 600 }}>[*PUB*]</span>{' '}
              for publisher.
            </Texto>
          </Vertical>

          {/* When to use them */}
          <Vertical>
            <Texto category='p1' weight='600' className='mb-2' style={{ display: 'block' }}>
              When should I use placeholders?
            </Texto>
            <Texto category='p2' appearance='medium'>
              Use placeholders when you want to create a template that can be applied to multiple products, locations,
              or scenarios where certain fields will vary. For example, if you have a standard pricing structure that
              works for multiple instruments, you can leave the instrument field as a placeholder.
            </Texto>
          </Vertical>

          {/* Available placeholders */}
          <Vertical>
            <Texto category='p1' weight='600' className='mb-2' style={{ display: 'block' }}>
              Available placeholders:
            </Texto>
            <div
              className='border-radius-4 p-2'
              style={{ backgroundColor: token.colorBgLayout, border: `1px solid ${token.colorBorderSecondary}` }}
            >
              <Vertical gap='8px'>
                <Horizontal gap={10}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      color: PLACEHOLDER_COLORS.text,
                      fontWeight: 600,
                      minWidth: '120px',
                    }}
                  >
                    [*PCT*]
                  </span>
                  <Texto category='p2' appearance='medium'>
                    Percentage value
                  </Texto>
                </Horizontal>
                <Horizontal gap={10}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      color: PLACEHOLDER_COLORS.text,
                      fontWeight: 600,
                      minWidth: '120px',
                    }}
                  >
                    [*PUB*]
                  </span>
                  <Texto category='p2' appearance='medium'>
                    Publisher/Source (Argus, OPIS, etc.)
                  </Texto>
                </Horizontal>
                <Horizontal gap={10}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      color: PLACEHOLDER_COLORS.text,
                      fontWeight: 600,
                      minWidth: '120px',
                    }}
                  >
                    [*INSTR*]
                  </span>
                  <Texto category='p2' appearance='medium'>
                    Instrument (CBOB, ULSD, etc.)
                  </Texto>
                </Horizontal>
                <Horizontal gap={10}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      color: PLACEHOLDER_COLORS.text,
                      fontWeight: 600,
                      minWidth: '120px',
                    }}
                  >
                    [*DATE*]
                  </span>
                  <Texto category='p2' appearance='medium'>
                    Date Rule (Prior Day, Current, etc.)
                  </Texto>
                </Horizontal>
                <Horizontal gap={10}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      color: PLACEHOLDER_COLORS.text,
                      fontWeight: 600,
                      minWidth: '120px',
                    }}
                  >
                    [*TYPE*]
                  </span>
                  <Texto category='p2' appearance='medium'>
                    Type (Settle, Average, Fixed, etc.)
                  </Texto>
                </Horizontal>
              </Vertical>
            </div>
          </Vertical>

          {/* How they work */}
          <div>
            <Texto category='p1' weight='600' className='mb-2' style={{ display: 'block' }}>
              How do placeholders work?
            </Texto>
            <div
              className='p-3 border-radius-4'
              style={{ backgroundColor: token.colorBgContainer, border: `1px solid ${token.colorInfoBorder}` }}
            >
              <Vertical gap={10}>
                <div>
                  <Texto category='p2' weight='600' className='mb-1' style={{ display: 'block' }}>
                    1. Create Template with Placeholders
                  </Texto>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '12px' }}>
                    When building your template, select placeholder options from the dropdowns for any fields you want
                    to customize later.
                  </Texto>
                </div>
                <div>
                  <Texto category='p2' weight='600' className='mb-1' style={{ display: 'block' }}>
                    2. Visual Highlighting
                  </Texto>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '12px' }}>
                    Placeholder cells are highlighted in{' '}
                    <span
                      style={{
                        backgroundColor: PLACEHOLDER_COLORS.bg,
                        color: PLACEHOLDER_COLORS.text,
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontWeight: 600,
                      }}
                    >
                      purple
                    </span>{' '}
                    so you can easily identify which fields need to be filled in later.
                  </Texto>
                </div>
                <div>
                  <Texto category='p2' weight='600' className='mb-1' style={{ display: 'block' }}>
                    3. Apply Template
                  </Texto>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '12px' }}>
                    When you import this template into a contract formula, you'll fill in the specific values for each
                    placeholder field.
                  </Texto>
                </div>
                <div>
                  <Texto category='p2' weight='600' className='mb-1' style={{ display: 'block' }}>
                    4. Template Ready to Use
                  </Texto>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '12px' }}>
                    Once all placeholders are replaced with actual values, your formula is complete and ready to use.
                  </Texto>
                </div>
              </Vertical>
            </div>
          </div>

          {/* Example */}
          <div>
            <Texto category='p1' weight='600' className='mb-2' style={{ display: 'block' }}>
              Example:
            </Texto>
            <div
              className='p-3 border-radius-4'
              style={{ backgroundColor: token.colorBgLayout, border: `1px solid ${token.colorBorderSecondary}` }}
            >
              <Vertical gap={10}>
                <div>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                    Template Formula:
                  </Texto>
                  <Texto category='p2' className='mt-1' style={{ fontFamily: 'monospace', display: 'block' }}>
                    100% <span style={{ color: PLACEHOLDER_COLORS.text, fontWeight: 600 }}>[*PUB*]</span>{' '}
                    <span style={{ color: PLACEHOLDER_COLORS.text, fontWeight: 600 }}>[*INSTR*]</span> Prior Day Settle
                  </Texto>
                </div>
                <div style={{ borderLeft: `3px solid ${token.colorPrimary}`, paddingLeft: '12px' }}>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                    After Importing (User fills in):
                  </Texto>
                  <Texto category='p2' className='mt-1' style={{ fontFamily: 'monospace', display: 'block' }}>
                    100% <span style={{ color: token.colorSuccess, fontWeight: 600 }}>Argus</span>{' '}
                    <span style={{ color: token.colorSuccess, fontWeight: 600 }}>CBOB USGC</span> Prior Day Settle
                  </Texto>
                </div>
              </Vertical>
            </div>
          </div>
        </Vertical>
      </Modal>
    </>
  )
}
