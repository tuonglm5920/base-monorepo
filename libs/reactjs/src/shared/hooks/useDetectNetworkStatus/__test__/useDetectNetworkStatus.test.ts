import { renderHook, act } from '@testing-library/react';
import { useDetectNetworkStatus } from '../src/useDetectNetworkStatus';

describe('useDetectNetworkStatus', () => {
  let map: Record<string, any> = {};

  // Mocking addEventListener and removeEventListener
  beforeEach(() => {
    map = {};
    window.addEventListener = jest.fn((event, callback) => {
      map[event] = callback;
    });
    window.removeEventListener = jest.fn();
  });

  it('should initially set isOnline based on navigator.onLine', () => {
    const { result } = renderHook(() => useDetectNetworkStatus());
    expect(result.current.isOnline).toBe(navigator.onLine);
  });

  it('should update isOnline when online/offline events occur', () => {
    // Mocking navigator.onLine property
    Object.defineProperty(navigator, 'onLine', {
      get: jest.fn(() => true),
      configurable: true,
    });

    const { result } = renderHook(() => useDetectNetworkStatus());

    // Simulate going offline
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        get: jest.fn(() => false),
        configurable: true,
      });
      map['offline']();
    });

    expect(result.current.isOnline).toBe(false);

    // Simulate going online
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        get: jest.fn(() => true),
        configurable: true,
      });
      map['online']();
    });

    expect(result.current.isOnline).toBe(true);
  });

  it('should cleanup listeners on unmount', () => {
    const { unmount } = renderHook(() => useDetectNetworkStatus());

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
  });
});
