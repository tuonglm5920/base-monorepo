export type IMEKey = keyof typeof IME_KEYS;

/**
 * A constant object mapping "event.key" values from a KeyboardEvent to keys associated with Input Method Editor (IME) operations.
 *
 * @example
 * let command = 'Convert'; // This could be from an event.key
 * let action = IME_KEYS[command];
 * console.log(action); // Output will be 'Convert'
 *
 * @type {{ [key in string]: string }}
 */
export const IME_KEYS = {
  AllCandidates: 'AllCandidates',
  Alphanumeric: 'Alphanumeric',
  CodeInput: 'CodeInput',
  Compose: 'Compose',
  Convert: 'Convert',
  Dead: 'Dead',
  FinalMode: 'FinalMode',
  GroupFirst: 'GroupFirst',
  GroupLast: 'GroupLast',
  GroupNext: 'GroupNext',
  GroupPrevious: 'GroupPrevious',
  ModeChange: 'ModeChange',
  NextCandidate: 'NextCandidate',
  NonConvert: 'NonConvert',
  PreviousCandidate: 'PreviousCandidate',
  Process: 'Process',
  SingleCandidate: 'SingleCandidate',
} as const;
