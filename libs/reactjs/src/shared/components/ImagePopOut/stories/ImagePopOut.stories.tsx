import { Meta, StoryFn } from '@storybook/react';
import { ImagePopOut } from '../src/ImagePopOut';

export default {
  title: 'Shared/Components/ImagePopOut',
  component: ImagePopOut,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {
    background: 'https://res.cloudinary.com/dazdt97d3/image/upload/v1615813805/background.png',
    foreground: 'https://res.cloudinary.com/dazdt97d3/image/upload/v1615813805/foreground.png',
  },
} as Meta<typeof ImagePopOut>;

export const Default: StoryFn<typeof ImagePopOut> = args => (
  <div
    style={{
      padding: '2em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '300px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 100px)',
    }}
  >
    <ImagePopOut
      {...args}
      style={{
        flexBasis: '100%',
        margin: '0',
      }}
    />
  </div>
);
