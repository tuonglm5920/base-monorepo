/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { act, render } from '@testing-library/react';
import { FC } from 'react';
import { useWindowSize } from '../src/useWindowSize';

// Mock component to test the hook
const TestComponent: FC = () => {
  const { width, height } = useWindowSize();
  return <div data-testid="dimensions">{`Width: ${width}, Height: ${height}`}</div>;
};

describe('useWindowSize', () => {
  it('should correctly return initial window size', () => {
    const { getByTestId } = render(<TestComponent />);
    const dimensions = getByTestId('dimensions');

    expect(dimensions.textContent).toBe('Width: 1024, Height: 768');
  });

  it('should update dimensions on window resize', () => {
    const { getByTestId } = render(<TestComponent />);
    const dimensions = getByTestId('dimensions');

    act(() => {
      global.innerWidth = 500;
      global.innerHeight = 500;
      global.dispatchEvent(new Event('resize'));
    });

    expect(dimensions.textContent).toBe('Width: 500, Height: 500');
  });
});
