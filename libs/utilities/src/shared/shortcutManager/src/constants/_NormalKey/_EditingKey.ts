export type EditingKey = keyof typeof EDITING_KEYS;

/**
 * A constant object mapping "event.key" values from a KeyboardEvent to editing-related actions.
 * This mapping standardizes the handling of keyboard events for common editing operations, such as
 * cutting, copying, pasting, and text manipulation. The mappings ensure that the intended actions
 * are consistent, irrespective of whether the "Shift" key is held down.
 *
 * @example
 * let command = 'Copy'; // This could be from an event.key
 * let action = EDITING_KEYS[command];
 * console.log(action); // Output will be 'Copy'
 *
 * @type {{ [key in string]: string }}
 */
export const EDITING_KEYS = {
  Backspace: 'Backspace',
  Clear: 'Clear',
  Copy: 'Copy',
  CrSel: 'CrSel',
  Cut: 'Cut',
  Delete: 'Delete',
  EraseEof: 'EraseEof',
  ExSel: 'ExSel',
  Insert: 'Insert',
  Paste: 'Paste',
  Redo: 'Redo',
  Undo: 'Undo',
} as const;
