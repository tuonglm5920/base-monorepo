import { renderHook } from '@testing-library/react';
import { useFetchChunk } from '../src/useFetchChunk';

describe('useFetchChunk', () => {
  it('calls each chunk function on fetch', async () => {
    // Mock chunk functions
    const mockChunkFn1 = jest.fn(() => Promise.resolve({ default: jest.fn() }));
    const mockChunkFn2 = jest.fn(() => Promise.resolve({ default: jest.fn() }));

    // Render the hook with mock chunks
    const { result } = renderHook(() => useFetchChunk({ chunks: [mockChunkFn1, mockChunkFn2] }));

    // Call the fetch function
    result.current.fetch();

    // Assert that each mock chunk function was called
    expect(mockChunkFn1).toHaveBeenCalled();
    expect(mockChunkFn2).toHaveBeenCalled();
  });
});
