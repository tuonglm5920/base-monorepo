export type ApplicationSelectorKey = keyof typeof APPLICATION_SELECTOR_KEYS;

/**
 * Represents a type for keys in the APPLICATION_SELECTOR_KEYS object.
 * @typedef {keyof typeof APPLICATION_SELECTOR_KEYS} ApplicationSelectorKey
 */

/**
 * A constant object that maps specific key identifiers for application launch commands.
 * This mapping relates "event.key" values from a KeyboardEvent to application launch
 * commands, providing a standardized way of handling such events across different
 * platforms or applications. These keys are not affected by the "Shift" key state.
 *
 * @example
 * let command = 'LaunchMail'; // This could be from an event.key
 * let action = APPLICATION_SELECTOR_KEYS[command];
 * console.log(action); // Output will be 'LaunchMail'
 *
 * @type {{ [key in string]: string }}
 */
export const APPLICATION_SELECTOR_KEYS = {
  LaunchCalculator: 'LaunchCalculator',
  LaunchCalendar: 'LaunchCalendar',
  LaunchContacts: 'LaunchContacts',
  LaunchMail: 'LaunchMail',
  LaunchMediaPlayer: 'LaunchMediaPlayer',
  LaunchMusicPlayer: 'LaunchMusicPlayer',
  LaunchMyComputer: 'LaunchMyComputer',
  LaunchPhone: 'LaunchPhone',
  LaunchScreenSaver: 'LaunchScreenSaver',
  LaunchSpreadsheet: 'LaunchSpreadsheet',
  LaunchWebBrowser: 'LaunchWebBrowser',
  LaunchWebCam: 'LaunchWebCam',
  LaunchWordProcessor: 'LaunchWordProcessor',
  LaunchApplication1: 'LaunchApplication1',
  LaunchApplication2: 'LaunchApplication2',
  LaunchApplication3: 'LaunchApplication3',
  LaunchApplication4: 'LaunchApplication4',
  LaunchApplication5: 'LaunchApplication5',
  LaunchApplication6: 'LaunchApplication6',
  LaunchApplication7: 'LaunchApplication7',
  LaunchApplication8: 'LaunchApplication8',
  LaunchApplication9: 'LaunchApplication9',
  LaunchApplication10: 'LaunchApplication10',
  LaunchApplication11: 'LaunchApplication11',
  LaunchApplication12: 'LaunchApplication12',
  LaunchApplication13: 'LaunchApplication13',
  LaunchApplication14: 'LaunchApplication14',
  LaunchApplication15: 'LaunchApplication15',
  LaunchApplication16: 'LaunchApplication16',
} as const;
