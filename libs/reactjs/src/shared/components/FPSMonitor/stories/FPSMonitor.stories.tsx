import { expect, jest } from '@storybook/jest';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { within } from '@testing-library/react';
import { FPSMonitor } from '../src/FPSMonitor';

export default {
  title: 'Shared/Components/FPSMonitor',
  component: FPSMonitor,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {},
} as Meta<typeof FPSMonitor>;

export const Default: StoryFn<typeof FPSMonitor> = args => <FPSMonitor {...args} />;

const RenderCorrectlyWhenActiveScenario = (): JSX.Element => <FPSMonitor isActive />;
export const RenderCorrectlyWhenActiveTesting: StoryObj = {
  render: RenderCorrectlyWhenActiveScenario,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('FPS')).toBeTruthy();
  },
};

const RenderCorrectlyWhenNotActiveScenario = (): JSX.Element => <FPSMonitor isActive={false} />;
export const RenderCorrectlyWhenNotActiveTesting: StoryObj = {
  render: RenderCorrectlyWhenNotActiveScenario,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('FPS')).toBeFalsy();
  },
};

const CalculatesFPSCorrectlyScenario = (): JSX.Element => <FPSMonitor isActive />;
export const CalculatesFPSCorrectlyScenarioTesting: StoryObj = {
  render: CalculatesFPSCorrectlyScenario,
  play: async () => {
    const requestAnimationFrame = jest.spyOn(window, 'requestAnimationFrame');
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(requestAnimationFrame).toBeCalled();
  },
};
