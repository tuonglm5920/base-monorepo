import { Meta, StoryFn } from '@storybook/react';
import { Text } from '../src/Text';

export default {
  title: 'Shared/Components/Text',
  component: Text,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {},
} as Meta<typeof Text>;

export const Default: StoryFn<typeof Text> = args => (
  <Text disableStrict {...args}>
    Valid Child
  </Text>
);
