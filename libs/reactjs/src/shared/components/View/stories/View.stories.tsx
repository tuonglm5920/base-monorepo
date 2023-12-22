/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { Meta, StoryFn } from '@storybook/react';
import { View } from '../src/View';

export default {
  title: 'Shared/Components/View',
  component: View,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {},
} as Meta<typeof View>;

export const Default: StoryFn<typeof View> = args => (
  <View {...args}>
    <div>Valid Child</div>
  </View>
);
