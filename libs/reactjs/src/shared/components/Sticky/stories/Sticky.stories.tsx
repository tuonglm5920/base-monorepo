/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { Meta, StoryFn } from '@storybook/react';
import { Sticky } from '../src/Sticky';
import './Sticky.stories.css';

export default {
  title: 'Shared/Components/Sticky',
  component: Sticky,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {},
} as Meta<typeof Sticky>;

export const Default: StoryFn<typeof Sticky> = () => {
  return (
    <div>
      <div className="row">
        <div className="header">Header</div>
      </div>
      <div className="row">
        <Sticky offsetTop={20} offsetBottom={20}>
          <div className="sidebar" style={{ height: 300 }}>
            Long Sidebar
          </div>
        </Sticky>
        <div style={{ minHeight: 3000 }} className="content">
          Content for long sidebar
        </div>
      </div>
      <div className="row">
        <Sticky offsetTop={20} offsetBottom={20}>
          <div className="sidebar">Sidebar</div>
        </Sticky>
        <div style={{ minHeight: 1000 }} className="content">
          Content
        </div>
      </div>
      <div className="row">
        <div className="content" style={{ height: 2000 }}>
          Content 2
        </div>
      </div>
    </div>
  );
};
