import { Meta, StoryFn } from '@storybook/react';
import { Appetize } from '../src/Appetize';

export default {
  title: 'Shared/Components/Appetize',
  component: Appetize,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {},
} as Meta<typeof Appetize>;

export const Default: StoryFn<typeof Appetize> = () => <Appetize />;
