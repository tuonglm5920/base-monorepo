/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { render } from '@testing-library/react';
import { FC } from 'react';
import { useMount } from '../src/useMount';

describe('useMount', () => {
  it('calls the callback function when the component mounts', () => {
    const mockCallback = jest.fn();
    const TestComponent: FC = () => {
      useMount(mockCallback);
      return <div>Test Component</div>;
    };

    render(<TestComponent />);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
