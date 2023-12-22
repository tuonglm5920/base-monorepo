export type SpeechRecognitionKey = keyof typeof SPEECH_RECOGNITION_KEYS;
/**
 * This mapping defines key constants for handling speech recognition related events in KeyboardEvent.
 * It includes keys that are typically used for toggling speech input and accessing correction lists in
 * speech-to-text scenarios. This mapping remains constant regardless of the state of the "Shift" key,
 * which ensures consistent and predictable behavior in applications implementing voice-controlled features.
 * Utilizing these keys can be essential for accessibility features or enhancing user interaction in apps
 * that benefit from speech recognition capabilities.
 *
 * @example
 * let keyPressed = 'SpeechInputToggle'; // Assume this is from an event.key
 * let speechFunction = SPEECH_RECOGNITION_KEYS[keyPressed];
 * console.log(speechFunction); // Output will be 'SpeechInputToggle'
 *
 * @type {{ [key in string]: string }}
 */

export const SPEECH_RECOGNITION_KEYS = {
  SpeechCorrectionList: 'SpeechCorrectionList',
  SpeechInputToggle: 'SpeechInputToggle',
} as const;
