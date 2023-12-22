export type DocumentKey = keyof typeof DOCUMENT_KEYS;

/**
 * A constant object mapping "event.key" values from a KeyboardEvent to common document-related actions.
 * This mapping provides a standardized approach to handling keyboard events for actions such as opening,
 * closing, printing, and managing documents, as well as performing email-related operations. The functionality
 * of these keys remains consistent regardless of the state of the "Shift" key.
 *
 * @example
 * let command = 'Save'; // This could be from an event.key
 * let action = DOCUMENT_KEYS[command];
 * console.log(action); // Output will be 'Save'
 *
 * @type {{ [key in string]: string }}
 */
export const DOCUMENT_KEYS = {
  Close: 'Close',
  New: 'New',
  Open: 'Open',
  Print: 'Print',
  Save: 'Save',
  SpellCheck: 'SpellCheck',
  MailForward: 'MailForward',
  MailReply: 'MailReply',
  MailSend: 'MailSend',
} as const;
