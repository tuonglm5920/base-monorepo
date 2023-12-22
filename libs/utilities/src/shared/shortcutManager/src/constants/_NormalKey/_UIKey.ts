export type UIKey = keyof typeof UI_KEYS;

/**
 * Maps `event.key` values from a `KeyboardEvent` to corresponding user interface (UI) key values.
 *
 * @example
 * let keyPressed = 'Escape'; // Assume this is from an event.key
 * let uiAction = UI_KEYS[keyPressed];
 * console.log(uiAction); // Output will be "'Escape'"
 *
 * @type {{ [key in string]: string }}
 */
export const UI_KEYS = {
  Accept: "'Accept'",
  Again: "'Again'",
  Attn: "'Attn'",
  Cancel: "'Cancel'",
  ContextMenu: "'ContextMenu'",
  Escape: "'Escape'",
  Execute: "'Execute'",
  Find: "'Find'",
  Finish: "'Finish'",
  Help: "'Help'",
  Pause: "'Pause'",
  Play: "'Play'",
  Props: "'Props'",
  Select: "'Select'",
  ZoomIn: "'ZoomIn'",
  ZoomOut: "'ZoomOut'",
} as const;
