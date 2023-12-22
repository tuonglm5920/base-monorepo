import { MutableRefObject } from 'react';

/**
 * Assigns the provided `node` to the given `ref`. The function works with both callback and object refs.
 *
 * @template T - The type of the `node` which the ref refers to.
 *
 * @param {React.Ref<T>} ref - The React ref to be filled. Can be a callback ref or an object ref.
 * @param {T} node - The node to be assigned to the `ref`.
 *
 * @returns {void}
 */
export const fillRef = <T>(ref: React.Ref<T>, node: T): void => {
  if (typeof ref === 'function') {
    ref(node);
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    (ref as MutableRefObject<T>).current = node;
  }
};
