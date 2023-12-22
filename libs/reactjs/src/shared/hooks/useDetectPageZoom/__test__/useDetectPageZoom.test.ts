import { renderHook } from '@testing-library/react';
import { useDetectPageZoom } from '../src/useDetectPageZoom';

describe('useDetectPageZoom', () => {
  it('should return the initial page zoom level', () => {
    const { result } = renderHook(() => useDetectPageZoom());
    expect(typeof result.current.pageZoom).toBe('number');
    expect(result.current.pageZoom).toBeGreaterThanOrEqual(0);
  });
});
