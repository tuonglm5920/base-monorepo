/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { render, screen } from '@testing-library/react';
import { FC, useRef } from 'react';
import { useMergeRef } from '../src/useMergeRef';

// Sample component using the useMergeRef hook
const TestComponent: FC<{
  externalRef: React.Ref<HTMLDivElement>;
}> = ({ externalRef }) => {
  const internalRef = useRef<HTMLDivElement>(null);

  const mergedRef = useMergeRef(externalRef, internalRef);

  return (
    <div ref={mergedRef} data-testid="test-div">
      Hello World
    </div>
  );
};

it('useMergeRef merges multiple refs correctly', () => {
  // Define an external ref
  const externalRef = jest.fn();

  // Render the TestComponent with the external ref
  render(<TestComponent externalRef={externalRef} />);

  // Find the rendered div
  const divElement = screen.getByTestId('test-div');

  // Check that the external ref callback was called with the div element
  expect(externalRef).toHaveBeenCalledWith(divElement);
});
