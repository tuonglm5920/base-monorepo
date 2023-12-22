import { act, renderHook } from '@testing-library/react';
import { useLinkPrefetch } from '../src/useLinkPrefetch';

describe('useLinkPrefetch', () => {
  const LINK = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';

  // Cleanup function to remove the link element after each test
  afterEach(() => {
    const linkEl = document.querySelector(`link[rel="prefetch"][href="${LINK}"]`);
    if (linkEl) {
      linkEl.remove();
    }
  });

  it('useLinkPrefetch when fetching', () => {
    const { result } = renderHook(() => useLinkPrefetch({ link: LINK }));

    expect(typeof result.current.fetch).toBe('function');
    expect(typeof result.current.cancel).toBe('function');

    act(() => {
      result.current.fetch();
    });

    const linkEl = document.querySelector(`link[rel="prefetch"][href="${LINK}"]`);
    expect(linkEl).toBeTruthy();
  });

  it('useLinkPrefetch when fetching and then canceling immediately', () => {
    const { result } = renderHook(() => useLinkPrefetch({ link: LINK }));

    expect(typeof result.current.fetch).toBe('function');
    expect(typeof result.current.cancel).toBe('function');

    act(() => {
      result.current.fetch();
      result.current.cancel();
    });

    const linkElAfter = document.querySelector(`link[rel="prefetch"][href="${LINK}"]`);
    expect(linkElAfter).toBeFalsy();
  });
});
