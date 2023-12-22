import { UnionToIntersection } from '../../../union';

// Helper Type
type NonObjectKeysOf<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : T[K] extends object ? never : K;
}[keyof T];

type ValuesOf<T> = T[keyof T];
type ObjectValuesOf<T extends Object> = Exclude<Exclude<Extract<ValuesOf<T>, object>, never>, Array<any>>;

type DeepFlatten8<T extends Object> = T extends any
  ? Pick<T, NonObjectKeysOf<T>> & UnionToIntersection<DeepFlatten7<ObjectValuesOf<T>>>
  : never;

type DeepFlatten7<T extends Object> = T extends any
  ? Pick<T, NonObjectKeysOf<T>> & UnionToIntersection<DeepFlatten6<ObjectValuesOf<T>>>
  : never;

type DeepFlatten6<T extends Object> = T extends any
  ? Pick<T, NonObjectKeysOf<T>> & UnionToIntersection<DeepFlatten5<ObjectValuesOf<T>>>
  : never;

type DeepFlatten5<T extends Object> = T extends any
  ? Pick<T, NonObjectKeysOf<T>> & UnionToIntersection<DeepFlatten4<ObjectValuesOf<T>>>
  : never;

type DeepFlatten4<T extends Object> = T extends any
  ? Pick<T, NonObjectKeysOf<T>> & UnionToIntersection<DeepFlatten3<ObjectValuesOf<T>>>
  : never;

type DeepFlatten3<T extends Object> = T extends any
  ? Pick<T, NonObjectKeysOf<T>> & UnionToIntersection<DeepFlatten2<ObjectValuesOf<T>>>
  : never;

type DeepFlatten2<T extends Object> = T extends any
  ? Pick<T, NonObjectKeysOf<T>> & UnionToIntersection<DeepFlatten1<ObjectValuesOf<T>>>
  : never;

type DeepFlatten1<T extends Object> = T extends any
  ? Pick<T, NonObjectKeysOf<T>>
  : UnionToIntersection<ObjectValuesOf<T>>;

/**
 * Transforms an object with nested properties into a single-depth object. Nested keys are represented at the top level, ensuring a flat structure without concatenating the keys.
 * @param {object} sourceObject Source object.
 * @example ```typescript
  type NestedUser = {
    id: number;
    details: {
      name: string;
      age: number;
      address: {
        city: string;
        zip: number;
      };
    };
  };

  type FlattenedUser = FlatObject<NestedUser>;
  // Result type:
  // {
  //     id: number;
  //     "name": string;
  //     "age": number;
  //     "city": string;
  //     "zip": number;
  // }
  ```
 */
export type FlatObject<T extends Object> = T extends any
  ? Pick<T, NonObjectKeysOf<T>> & UnionToIntersection<DeepFlatten8<ObjectValuesOf<T>>>
  : never;
