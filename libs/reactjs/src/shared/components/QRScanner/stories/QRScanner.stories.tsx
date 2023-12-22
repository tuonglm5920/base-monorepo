/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { Meta, StoryFn } from '@storybook/react';
import { QRScanner } from '../src/QRScanner';

export default {
  title: 'Shared/Components/QRScanner',
  component: QRScanner,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {
    Loading: <h1>Loading...</h1>,
    Reconnect: <h1>Reconnect...</h1>,
    open: true,
  },
} as Meta<typeof QRScanner>;

export const Default: StoryFn<typeof QRScanner> = args => {
  return <QRScanner {...args} />;
};
