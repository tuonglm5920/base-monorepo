/* eslint-disable @nx/workspace/no-untranslated-text */
/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Text } from '../src/Text';

describe('Text', () => {
  it('renders correctly with a text child', () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('throws an error when a non-text child is passed', () => {
    const renderWithNonTextChild = (): void => {
      render(
        <Text>
          {/* @ts-ignore */}
          <div>Invalid Child</div>
        </Text>,
      );
    };
    expect(renderWithNonTextChild).toThrow('Text component can only have text as its children.');
  });
});
