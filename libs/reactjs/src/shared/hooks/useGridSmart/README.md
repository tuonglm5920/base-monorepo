# Overview

`useGridSmart` is a custom hook designed for React applications to manage grid layouts dynamically. It calculates the optimal number of columns based on container width, minimum column width, and gap between columns. Ideal for responsive web design, `useGridSmart` ensures your grid layouts are both flexible and visually appealing.

# API

| Parameter                | Type                                       | Description                                         |
| ------------------------ | ------------------------------------------ | --------------------------------------------------- | ----------------------------------- |
| `columnWidth`            | `number`                                   | Minimum width for each column in the grid.          |
| `columnCount`            | `number` (optional)                        | Default number of columns.                          |
| `columnGap`              | `number` (optional)                        | Gap between each column in pixels.                  |
| `onColumnChange`         | `(columnCount: number) => void` (optional) | Callback when the number of columns changes.        |
| `onColumnChangeDebounce` | `(columnCount: number) => void` (optional) | Debounced version of the `onColumnChange` callback. |
| `$containerEl`           | `HTMLElement                               | null`                                               | The container element for the grid. |

#### Returns

| Return Value | Type     | Description                                                                                                                                                                                                                                                                             |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `columns`    | `number` | The calculated number of columns for the grid layout. It's determined by the minimum of the specified `columnCount` (if provided) and the maximum number of columns that can fit in the container, calculated as `Math.max(1, Math.floor(containerWidth / (columnWidth + columnGap)))`. |

# Examples

Here's a basic example of how to use `useGridSmart` in a React component:

```jsx
import React from 'react';
import { useGridSmart } from 'your-package-name'; // Replace with your actual package name

interface Props {
  children: ReactNode;
  columnWidth: number;
  columnGap?: number;
  columnCount?: number;
  columnRuleColor?: CSSProperties['borderColor'];
  columnRuleStyle?: CSSProperties['borderStyle'];
  columnRuleWidth?: number;
  containerClassName?: string;
  containerNativeProps?: Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;
  columnClassName?: string;
  columnNativeProps?: Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;
  onColumnChange?: (columnCount: number) => void;
  onColumnChangeDebounce?: (columnCount: number) => void;
}

const GridSmart: FC<Props> = ({
  children,
  columnWidth,
  columnCount = defaultProps.columnCount,
  columnRuleColor = defaultProps.columnRuleColor,
  columnRuleStyle = defaultProps.columnRuleStyle,
  columnRuleWidth = defaultProps.columnRuleWidth,
  columnGap = defaultProps.columnGap,
  containerClassName = defaultProps.containerClassName,
  containerNativeProps = defaultProps.containerNativeProps,
  columnClassName = defaultProps.containerClassName,
  columnNativeProps = defaultProps.columnNativeProps,
  onColumnChange = defaultProps.onColumnChange,
}) => {
  const { columns, containerRef } = useGridSmart({ columnWidth, columnCount, columnGap, onColumnChange });

  const _renderRule = () => {
    if (!columnRuleWidth) {
      return null;
    }
    return (
      <div
        className={classNames.rule}
        style={styles.rule({
          columnGap,
          columnRuleColor,
          columnRuleStyle,
          columnRuleWidth,
        })}
      />
    );
  };

  const _renderChildren = () => {
    if (!containerRef.current && !columnCount) {
      return null;
    }
    if (Array.isArray(children)) {
      return Children.map(children, (child, index) => {
        if (!child) {
          return child;
        }
        return (
          <div
            {...columnNativeProps}
            className={`${classNames.column} ${columnClassName}`}
            style={styles.column({
              quantityColumn: columns,
              columnGap,
            })}
          >
            {child}
            {(index + 1) % columns !== 0 && index + 1 !== Children.count(children) && _renderRule()}
          </div>
        );
      });
    }
    return (
      <div
        className={`${classNames.column} ${columnClassName}`}
        style={styles.column({
          quantityColumn: columns,
          columnGap,
        })}
      >
        {children}
      </div>
    );
  };

  return (
    <div
      {...containerNativeProps}
      data-columns={columns}
      style={styles.container({
        columnGap,
      })}
      className={`${classNames.container} ${containerClassName}`}
      ref={containerRef}
    >
      {_renderChildren()}
    </div>
  );
};

export default function App() {
  return (
    <GridSmart columnWidth={400} columnGap={10} columnCount={4}>
      <div style={{ padding: 30, border: '1px solid red' }}>Column 1</div>
      <div style={{ padding: 30, border: '1px solid red' }}>Column 2</div>
      <div style={{ padding: 30, border: '1px solid red' }}>Column 3</div>
      <div style={{ padding: 30, border: '1px solid red' }}>Column 4</div>
      <div style={{ padding: 30, border: '1px solid red' }}>Column 5</div>
      <div style={{ padding: 30, border: '1px solid red' }}>Column 6</div>
      <div style={{ padding: 30, border: '1px solid red' }}>Column 7</div>
      <div style={{ padding: 30, border: '1px solid red' }}>Column 8</div>
    </GridSmart>
  )
}
```
