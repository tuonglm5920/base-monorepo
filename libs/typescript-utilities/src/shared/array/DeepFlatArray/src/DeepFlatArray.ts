import { FlatArray } from '../../FlatArray';

// https://github.com/microsoft/TypeScript/issues/40250
// (length của array [-1, 0, 1, 2, 3, ...] bắt buộc > Depth)
// "Deepth extends number" là độ sâu có thể flat
// Do recursive generic typescript đang bị lỗi nên nó cheat theo kiểu kia (đúng Array[Depth] = Depth)
type DeepFlatArray_<Arr, Depth extends number> = {
  0: Arr extends unknown[]
    ? DeepFlatArray_<
        FlatArray<Arr>,
        [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24][Depth]
      >
    : Arr;
  1: Arr;
}[Depth extends 0 ? 1 : 0];

/**
 * Utility function is crafted to flatten deeply nested arrays.
 * @param {any[]} list Source array need flat.
 * @example ```typescript
  type Case1 = DeepFlatArray<[['a', 'b'], ['c', 'd'], ['e', ['f', ['g'], ['h']]]], 10>;
  // Result: ["a", "b", "c", "d", "e", "f", "g", "h"]
 ```
 */
export type DeepFlatArray<Arr, Depth extends number> = DeepFlatArray_<Arr, Depth>;
