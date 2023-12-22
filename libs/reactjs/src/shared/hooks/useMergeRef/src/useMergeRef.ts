import { useMemorization } from '../../useMemorization';
import { mergeRef } from './utils/mergeRef';

/**
 * A custom React hook that merges multiple React refs into a single ref callback.
 *
 * @template T - The type of the ref value.
 * @param {...React.Ref<T>[]} refs - An array of React refs to be merged.
 * @returns {React.Ref<T> | undefined} - A merged ref callback or undefined.
 *
 * @example ```typescript
  const innerRef = useRef();
  const mergedRef = useMergeRef(externalRef, innerRef);
  return <div ref={mergedRef} />;
  ```
 */
export const useMergeRef = <T>(...refs: React.Ref<T>[]): React.Ref<T> | undefined => {
  return useMemorization(
    () => mergeRef(...refs),
    refs,
    (prev, next) => prev.length === next.length && prev.every((ref, i) => ref === next[i]),
  );
};
