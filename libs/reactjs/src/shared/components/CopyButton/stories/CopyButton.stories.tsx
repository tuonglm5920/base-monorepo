import { expect, jest } from '@storybook/jest';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { CopyButton } from '../src/CopyButton';

export default {
  title: 'Shared/Components/CopyButton',
  component: CopyButton,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {},
} as Meta<typeof CopyButton>;

export const Default: StoryFn<typeof CopyButton> = args => <CopyButton {...args} />;

const ScenarioRender = (): JSX.Element => <CopyButton />;
export const RenderCorrectlyWhenClickButtonTesting: StoryObj = {
  render: ScenarioRender,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const originExecCommand = document.execCommand;

    document.execCommand = jest.fn();

    expect(canvas.getByText('Copy')).toBeTruthy();
    await userEvent.click(canvas.getByRole('button'));
    expect(canvas.getByText('Copied')).toBeTruthy();
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    await new Promise(resolve => setTimeout(resolve, 2000));
    expect(canvas.getByText('Copy')).toBeTruthy();

    document.execCommand = originExecCommand;
  },
};
