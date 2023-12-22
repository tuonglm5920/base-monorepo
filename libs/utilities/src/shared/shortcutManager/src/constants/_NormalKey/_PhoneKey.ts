export type PhoneKey = keyof typeof PHONE_KEYS;

/**
 * Provides a mapping for specific keys related to phone functionality as recognized in a KeyboardEvent.
 * This mapping is crucial for handling events associated with phone-related keys, such as making calls,
 * accessing the camera, and navigating within a phone's interface. It remains consistent regardless of
 * whether the "Shift" key is pressed, ensuring reliable detection and processing of these specialized key events.
 *
 * @example
 * let keyPressed = 'Call'; // Assume this is from an event.key
 * let phoneFunction = PHONE_KEYS[keyPressed];
 * console.log(phoneFunction); // Output will be 'Call'
 *
 * @type {{ [key in string]: string }}
 */
export const PHONE_KEYS = {
  AppSwitch: 'AppSwitch',
  Call: 'Call',
  Camera: 'Camera',
  CameraFocus: 'CameraFocus',
  EndCall: 'EndCall',
  GoBack: 'GoBack',
  GoHome: 'GoHome',
  HeadsetHook: 'HeadsetHook',
  LastNumberRedial: 'LastNumberRedial',
  Notification: 'Notification',
  MannerMode: 'MannerMode',
  VoiceDial: 'VoiceDial',
} as const;
