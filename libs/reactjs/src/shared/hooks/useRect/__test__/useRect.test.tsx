/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { act, render } from '@testing-library/react';
import { FC, useEffect, useRef } from 'react';
import { useRect } from '../src/useRect';

// Mock component to test the hook
const TestComponent: FC<{ onRect: (args: any) => void }> = ({ onRect }) => {
  const ref = useRef(null);
  const rect = useRect(ref.current);

  useEffect(() => {
    if (onRect) {
      onRect(rect);
    }
  }, [rect, onRect]);

  return <div ref={ref}>Test</div>;
};

describe('useRect', () => {
  it('should correctly return initial rect size', () => {
    const mockRect: DOMRect = {
      bottom: 100,
      height: 100,
      left: 0,
      right: 100,
      top: 0,
      width: 100,
    } as DOMRect;

    Element.prototype.getBoundingClientRect = jest.fn(() => mockRect);

    const handleRect = jest.fn();
    render(<TestComponent onRect={handleRect} />);

    // Check if getBoundingClientRect was called and returned the correct size
    expect(handleRect).toHaveBeenCalledWith(mockRect);
  });

  it('should update rect on window resize', () => {
    const initialRect: DOMRect = {
      bottom: 100,
      height: 100,
      left: 0,
      right: 100,
      top: 0,
      width: 100,
    } as DOMRect;
    const updatedRect: DOMRect = {
      bottom: 200,
      height: 200,
      left: 0,
      right: 200,
      top: 0,
      width: 200,
    } as DOMRect;

    Element.prototype.getBoundingClientRect = jest.fn(() => initialRect);

    const handleRect = jest.fn();
    render(<TestComponent onRect={handleRect} />);

    expect(handleRect).toHaveBeenLastCalledWith(initialRect);

    // Simulate window resize
    act(() => {
      Element.prototype.getBoundingClientRect = jest.fn(() => updatedRect);

      global.dispatchEvent(new Event('resize'));
    });

    expect(handleRect).toHaveBeenLastCalledWith(updatedRect);
  });
});
