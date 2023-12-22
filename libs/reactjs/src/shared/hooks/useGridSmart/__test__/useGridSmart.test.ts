import { act, fireEvent, renderHook } from '@testing-library/react';
import { useGridSmart } from '../src/useGridSmart';

describe('useGridSmart', () => {
  const fullScreenWindowSize = 1800;
  const mediumWindowScreen = 1400;
  const smallWindowScreen = 900;
  const extraSmallWindowScreen = 500;
  const columnWidth = 400;
  const columnGap = 10;

  it('responds to window resize', () => {
    const mockContainerEl = document.createElement('div');

    const { result } = renderHook(() => {
      return useGridSmart({
        columnWidth,
        columnGap,
        $containerEl: mockContainerEl,
      });
    });

    act(() => {
      Object.defineProperty(HTMLDivElement.prototype, 'clientWidth', {
        configurable: true,
        value: fullScreenWindowSize,
      });
      fireEvent(window, new Event('resize'));
    });
    expect(result.current.columns).toBe(4);

    act(() => {
      window.innerWidth = mediumWindowScreen;
      Object.defineProperty(HTMLDivElement.prototype, 'clientWidth', { configurable: true, value: mediumWindowScreen });
      fireEvent(window, new Event('resize'));
    });
    expect(result.current.columns).toBe(3);

    act(() => {
      window.innerWidth = smallWindowScreen;
      Object.defineProperty(HTMLDivElement.prototype, 'clientWidth', { configurable: true, value: smallWindowScreen });
      fireEvent(window, new Event('resize'));
    });
    expect(result.current.columns).toBe(2);

    act(() => {
      window.innerWidth = extraSmallWindowScreen;
      Object.defineProperty(HTMLDivElement.prototype, 'clientWidth', {
        configurable: true,
        value: extraSmallWindowScreen,
      });
      fireEvent(window, new Event('resize'));
    });
    expect(result.current.columns).toBe(1);
  });
});
