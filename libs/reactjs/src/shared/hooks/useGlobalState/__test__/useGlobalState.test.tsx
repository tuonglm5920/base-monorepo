/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { FC } from 'react';
import { createGlobalState, useGlobalState } from '../src/useGlobalState';

// Mock for a functional component using the hook
const globalState = createGlobalState({ count: 0 });
const CounterButtons: FC = () => {
  const { setState } = useGlobalState(globalState);

  const increment = (): void => {
    setState(prev => ({ count: prev.count + 1 }));
  };

  const decrement = (): void => {
    setState(prev => ({ count: prev.count - 1 }));
  };

  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};
const CounterDisplay: FC = () => {
  const { state } = useGlobalState(globalState);
  return <p>{state.count}</p>;
};

const CounterApp: FC = () => {
  return (
    <div>
      <CounterButtons />
      <CounterDisplay />
    </div>
  );
};

describe('useGlobalState', () => {
  it('should increment and decrement count correctly', async () => {
    const { getByText } = render(<CounterApp />);

    const incrementButton = getByText('Increment');
    const decrementButton = getByText('Decrement');

    expect(getByText('0')).toBeTruthy();

    // Increment
    await act(async () => fireEvent.click(incrementButton));
    await waitFor(() => expect(getByText('1')).toBeTruthy());

    // Decrement
    await act(async () => fireEvent.click(decrementButton));
    await waitFor(() => expect(getByText('0')).toBeTruthy());
  });
});
