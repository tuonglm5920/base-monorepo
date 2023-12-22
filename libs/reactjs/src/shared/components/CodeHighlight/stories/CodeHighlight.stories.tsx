import { expect } from '@storybook/jest';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { within } from '@testing-library/react';
import { CodeHighlight } from '../src/CodeHighlight';

export default {
  title: 'Shared/Components/CodeHighlight',
  component: CodeHighlight,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {
    code: 'console.log("Hello world")',
  },
} as Meta<typeof CodeHighlight>;

export const Default: StoryFn<typeof CodeHighlight> = args => <CodeHighlight {...args} />;

const ScenarioRender = (): JSX.Element => {
  return <CodeHighlight code='console.log("Hello world")' />;
};

export const RenderCorrectlyTesting: StoryObj = {
  render: ScenarioRender,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.findByText(/console\.log\("Hello world"\)/)).toBeTruthy();
  },
};
