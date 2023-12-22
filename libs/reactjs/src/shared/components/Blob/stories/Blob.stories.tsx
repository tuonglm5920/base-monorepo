import { Meta, StoryFn } from '@storybook/react';
import { Blob } from '../src/Blob';

export default {
  title: 'Shared/Components/Blob',
  component: Blob,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {
    background: {
      src: 'https://images.unsplash.com/photo-1696362399095-16e5abd5feec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY5OTA2NjE0NA&ixlib=rb-4.0.3&q=80&w=1080',
    },
  },
} as Meta<typeof Blob>;

export const Default: StoryFn<typeof Blob> = args => <Blob {...args} />;

export const MaskImage: StoryFn<typeof Blob> = args => <Blob {...args} />;
