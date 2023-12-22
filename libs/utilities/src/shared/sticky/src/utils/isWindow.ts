/**
 * Checks if the provided node is a Window object.
 * @param {HTMLElement | Window} node - The node to be checked.
 * @returns {node is Window} Returns true if the node is a Window object, false otherwise.
 */
export const isWindow = (node: HTMLElement | Window): node is Window => {
  return node === window;
};
