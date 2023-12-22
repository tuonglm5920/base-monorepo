import { Length } from '../../Length';
import { Unshift } from '../../Unshift';

// Dùng cho biến đếm
type Position<T extends any[]> = Length<T>;
type Next<T extends any[]> = Unshift<T, any>;

/**
 * Reverse the order of elements within a tuple type.
 * @param {any[]} list Source array.
 * @example ```typescript
  type Case1 = Reverse<[1, 2, 3, 4]>; // Result: [4, 3, 2, 1]
  ```
 */
export type Reverse<T extends any[], R extends any[] = [], I extends any[] = []> = {
  0: Reverse<T, Unshift<R, T[Position<I>]>, Next<I>>;
  1: R;
}[Position<I> extends Length<T> ? 1 : 0];
