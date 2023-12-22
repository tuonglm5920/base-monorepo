export type DeviceKey = keyof typeof DEVICE_KEYS;

/**
 * A constant object mapping "event.key" values from a KeyboardEvent to various device control commands.
 * This mapping facilitates handling keyboard events for device-specific actions such as screen brightness adjustment,
 * power management, and system functions. It ensures consistent behavior for these keys irrespective of whether the
 * "Shift" key is pressed.
 *
 * @example
 * let command = 'BrightnessUp'; // This could be from an event.key
 * let action = DEVICE_KEYS[command];
 * console.log(action); // Output will be 'BrightnessUp'
 *
 * @type {{ [key in string]: string }}
 */
export const DEVICE_KEYS = {
  BrightnessDown: 'BrightnessDown',
  BrightnessUp: 'BrightnessUp',
  Eject: 'Eject',
  LogOff: 'LogOff',
  Power: 'Power',
  PowerOff: 'PowerOff',
  PrintScreen: 'PrintScreen',
  Hibernate: 'Hibernate',
  Standby: 'Standby',
  WakeUp: 'WakeUp',
} as const;
