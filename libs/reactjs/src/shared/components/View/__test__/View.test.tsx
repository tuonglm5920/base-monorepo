/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { View } from '../src/View';

describe('View', () => {
  it('renders without crashing with valid children', () => {
    render(
      <View>
        <div>Valid Child</div>
      </View>,
    );

    expect(screen.getByText('Valid Child')).toBeInTheDocument();
  });

  it('throws an error when a string is passed as a child', () => {
    const renderWithTextChild = (): void => {
      render(<View>This is a text string</View>);
    };

    expect(renderWithTextChild).toThrow(
      'View component cannot have text strings as children. Use Text component instead.',
    );
  });
});
