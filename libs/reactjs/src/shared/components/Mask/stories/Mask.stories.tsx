/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { expect, jest } from '@storybook/jest';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { ReactNode } from 'react';
import { Mask } from '../src/Mask';

export default {
  title: 'Shared/Components/Mask',
  component: Mask,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {},
} as Meta<typeof Mask>;

export const Default: StoryFn<typeof Mask> = args => (
  <Mask<HTMLDivElement>
    {...args}
    children={(ref): ReactNode => {
      return (
        <div
          ref={ref}
          style={{
            width: 230,
            height: 230,
            border: '2px solid #5ae',
            background: 'white',
            padding: 10,
            borderRadius: 10,
            textAlign: 'center',
            fontSize: '.7em',
            transform: `translateX(200px)`,
          }}
          onClick={(event): void => {
            event.preventDefault();
            alert('Clicked!');
          }}
          onKeyDown={(): void => alert('Clicked!')}
          role="button"
          tabIndex={0}
        >
          Clickable zone!
          <p className="text-primary-base text-base">Click to show alert.</p>
        </div>
      );
    }}
  />
);

const ScenarioRender = (): JSX.Element => {
  return (
    <Mask<HTMLDivElement>
      children={(ref): ReactNode => {
        return (
          <div
            ref={ref}
            style={{
              width: 230,
              height: 230,
              border: '2px solid #5ae',
              background: 'white',
              padding: 10,
              borderRadius: 10,
              textAlign: 'center',
              fontSize: '.7em',
              transform: `translateX(200px)`,
            }}
            onClick={(event): void => {
              event.preventDefault();
              alert('Clicked!');
            }}
            onKeyDown={(): void => alert('Clicked!')}
            role="button"
            tabIndex={0}
          >
            Clickable zone!
            <p className="text-primary-base text-base">Click to show alert.</p>
          </div>
        );
      }}
    />
  );
};

export const RenderCorrectlyAndClickableZoneTesting: StoryObj = {
  render: ScenarioRender,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Mock alert
    const alertMock = jest.fn();
    global.alert = alertMock;

    // Click on the clickable zone
    await userEvent.click(canvas.getByText('Clickable zone!'));

    // Check if alert is called
    expect(alertMock).toHaveBeenCalledWith('Clicked!');
  },
};
