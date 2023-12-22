import { renderHook } from '@testing-library/react';
import { useOnValueChange } from '../src/useOnValueChange';

describe('useOnValueChange', () => {
  it('does not call onChange on initial render', () => {
    const onChange = jest.fn();
    renderHook(({ value }) => useOnValueChange(value, onChange), {
      initialProps: { value: 'initial' },
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onChange with new and old value when the value changes', () => {
    const onChange = jest.fn();
    const { rerender } = renderHook(({ value }) => useOnValueChange(value, onChange), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'changed' });

    expect(onChange).toHaveBeenCalledWith('changed', 'initial');
  });

  it('does not call onChange when the value stays the same', () => {
    const onChange = jest.fn();
    const { rerender } = renderHook(({ value }) => useOnValueChange(value, onChange), {
      initialProps: { value: 'unchanged' },
    });

    rerender({ value: 'unchanged' });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onChange with the correct previous value on subsequent updates', () => {
    const onChange = jest.fn();
    const { rerender } = renderHook(({ value }) => useOnValueChange(value, onChange), {
      initialProps: { value: 'first' },
    });

    rerender({ value: 'second' });
    expect(onChange).toHaveBeenCalledWith('second', 'first');

    rerender({ value: 'third' });
    expect(onChange).toHaveBeenCalledWith('third', 'second');
  });
});
