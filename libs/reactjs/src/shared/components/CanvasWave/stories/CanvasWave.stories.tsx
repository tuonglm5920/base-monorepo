import { Meta, StoryFn } from '@storybook/react';
import { CanvasWave } from '../src/CanvasWave';

export default {
  title: 'Shared/Components/CanvasWave',
  component: CanvasWave,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {},
} as Meta<typeof CanvasWave>;

export const Default: StoryFn<typeof CanvasWave> = args => <CanvasWave {...args} />;
