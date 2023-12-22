export type AudioControlKey = keyof typeof AUDIO_CONTROL_KEYS;

/**
 * Represents a type for keys in the AUDIO_CONTROL_KEYS object.
 * @typedef {keyof typeof AUDIO_CONTROL_KEYS} AudioControlKey
 */

/**
 * A constant object that maps "event.key" values from a KeyboardEvent to audio control commands.
 * This object provides a convenient way to handle keyboard events related to audio control functions
 * like volume adjustment, balance, bass, treble, and microphone controls. The mapping is designed to
 * remain consistent irrespective of whether the "Shift" key is held down.
 *
 * @example
 * let command = 'AudioVolumeUp'; // This could be from an event.key
 * let action = AUDIO_CONTROL_KEYS[command];
 * console.log(action); // Output will be 'AudioVolumeUp'
 *
 * @type {{ [key in string]: string }}
 */
export const AUDIO_CONTROL_KEYS = {
  AudioBalanceLeft: 'AudioBalanceLeft',
  AudioBalanceRight: 'AudioBalanceRight',
  AudioBassDown: 'AudioBassDown',
  AudioBassBoostDown: 'AudioBassBoostDown',
  AudioBassBoostToggle: 'AudioBassBoostToggle',
  AudioBassBoostUp: 'AudioBassBoostUp',
  AudioBassUp: 'AudioBassUp',
  AudioFaderFront: 'AudioFaderFront',
  AudioFaderRear: 'AudioFaderRear',
  AudioSurroundModeNext: 'AudioSurroundModeNext',
  AudioTrebleDown: 'AudioTrebleDown',
  AudioTrebleUp: 'AudioTrebleUp',
  AudioVolumeDown: 'AudioVolumeDown',
  AudioVolumeMute: 'AudioVolumeMute',
  AudioVolumeUp: 'AudioVolumeUp',
  MicrophoneVolumeDown: 'MicrophoneVolumeDown',
  MicrophoneVolumeMute: 'MicrophoneVolumeMute',
  MicrophoneVolumeUp: 'MicrophoneVolumeUp',
} as const;
