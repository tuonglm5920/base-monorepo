import { useCallback, useEffect, useRef, useState } from 'react';
import { useLatestPropsRef } from '../../useLatestPropsRef';
import { useResizeEvent } from '../../useResizeEvent/src/useResizeEvent';

interface UseGridSmart {
  /** Minimum width for a column to be visually acceptable */
  columnWidth: number;
  /** Gap between columns */
  columnGap?: number;
  /** Number of columns if the columnWidth and quantity are suitable */
  columnCount?: number;
  /** Callback function when the column count changes */
  onColumnChange?: (columnCount: number) => void;
  /** Debounced version of the column change callback */
  onColumnChangeDebounce?: (columnCount: number) => void;
  /** Reference to the container element */
  $containerEl: HTMLElement | null;
}

/**
 * `useGridSmart` is a hook that dynamically calculates and manages the grid layout based on the provided parameters.
 * It automatically adjusts the number of columns and their layout within a container element based on the specified minimum column width,
 * default column count, gap between columns, and callbacks for column changes.
 *
 * @param {UseGridSmart} params - The configuration parameters for the grid.
 * @param {number} params.columnWidth - The minimum width for each column in the grid.
 * @param {number} [params.columnCount=0] - The default number of columns in the grid.
 * @param {number} [params.columnGap=20] - The gap between each column in pixels.
 * @param {(columnCount: number) => void} [params.onColumnChange] - Callback function triggered when the number of columns changes.
 * @param {(columnCount: number) => void} [params.onColumnChangeDebounce] - Debounced version of the onColumnChange callback.
 * @param {HTMLElement | null} params.$containerEl - The container element for the grid.
 *
 * @return {Object} An object containing the calculated number of columns based on the provided parameters and the container's width.
 * @property {number} columns - The calculated number of columns for the grid layout. It's computed as the minimum of the specified `columnCount` (if provided) and the maximum number of columns that can fit in the container based on `columnWidth` and `columnGap`.
 */
export const useGridSmart = ({
  columnWidth,
  columnCount = 0,
  columnGap = 20,
  onColumnChange,
  onColumnChangeDebounce,
  $containerEl,
}: UseGridSmart): {
  columns: number;
} => {
  const [columns, setColumns] = useState(columnCount);
  const timeout = useRef<number | undefined>();

  const onColumnChangeLatest = useLatestPropsRef(onColumnChange);
  const onColumnChangeDebounceLatest = useLatestPropsRef(onColumnChangeDebounce);

  const handleResize = useCallback((): void => {
    if ($containerEl) {
      const containerWidth = $containerEl.clientWidth;
      const columnsPerRow = Math.max(1, Math.floor(containerWidth / (columnWidth + columnGap)));
      setColumns(columnCount ? Math.min(columnCount, columnsPerRow) : columnsPerRow);
    }
  }, [$containerEl, columnCount, columnGap, columnWidth]);

  useResizeEvent(handleResize, [columnWidth, columnCount, columnGap, columns, handleResize]);

  useEffect(() => {
    if (columns !== columnCount) {
      onColumnChangeLatest.current?.(columns);
      timeout.current = window.setTimeout(() => {
        onColumnChangeDebounceLatest.current?.(columns);
        clearTimeout(timeout.current);
      }, 200);
    }
    return (): void => {
      clearTimeout(timeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnCount, columns]);

  return { columns };
};
