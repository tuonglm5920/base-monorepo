import { fillRef } from './fillRef';

/**
 * Merges multiple React refs into a single ref.
 *
 * @template T - The type of the `node` which the refs refer to.
 *
 * @param {...React.Ref<T>[]} refs - An array of React refs to be merged.
 *
 * @returns {React.Ref<T>} - A merged ref that can be used as a single ref while still updating all original refs.
 */
export const mergeRef = <T>(...refs: React.Ref<T>[]): React.Ref<T> => {
  const refList = refs.filter(ref => ref);
  if (refList.length <= 1) {
    return refList[0];
  }

  return (node: T) => {
    refs.forEach(ref => {
      fillRef(ref, node);
    });
  };
};
