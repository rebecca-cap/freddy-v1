// Button.stories.ts|tsx

import { GraviButton } from '@gravitate-js/excalibrr'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'HelloWorld',
  component: GraviButton,
} as ComponentMeta<typeof GraviButton>

export const Primary: ComponentStory<typeof GraviButton> = () => <GraviButton />
