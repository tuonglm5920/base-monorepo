/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { expect } from '@storybook/jest';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { useState } from 'react';
import { delay } from 'utilities';
import { IFrame } from '../src/IFrame';

export default {
  title: 'Shared/Components/IFrame',
  component: IFrame,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {},
} as Meta<typeof IFrame>;

export const Default: StoryFn<typeof IFrame> = () => <IFrame>Hello world</IFrame>;

const ScenarioRender = (): JSX.Element => {
  const [state, setState] = useState(0);
  return (
    <div data-testid="container">
      <button id="increment" onClick={() => setState(state + 1)}>
        Increment
      </button>
      <IFrame id="myIframe">
        <div>
          <h2>Iframe</h2>
          <div id="result">{state}</div>
          <button id="decrement" onClick={() => setState(state - 1)}>
            Decrement
          </button>
        </div>
      </IFrame>
    </div>
  );
};
export const RenderCorrectlyAndFunctionalityCorrectlyTesting: StoryObj = {
  render: ScenarioRender,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Delay for portal mount
    await delay(1000);

    const $containerEl = canvas.getByTestId('container');
    const $increaseBtn = $containerEl.querySelector('#increment') as HTMLElement;
    const $iframeEl = $containerEl.querySelector('#myIframe') as HTMLIFrameElement;
    const $decreaseBtn = $iframeEl?.contentWindow?.document.querySelector('#decrement') as HTMLElement;
    const $resultEl = $iframeEl?.contentWindow?.document.querySelector('#result');

    expect($resultEl?.innerHTML.includes('0')).toEqual(true);
    await userEvent.click($increaseBtn);
    expect($resultEl?.innerHTML.includes('1')).toEqual(true);
    await userEvent.click($increaseBtn);
    expect($resultEl?.innerHTML.includes('2')).toEqual(true);
    await userEvent.click($decreaseBtn);
    expect($resultEl?.innerHTML.includes('1')).toEqual(true);
  },
};
