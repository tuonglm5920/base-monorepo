export type MultimediaKey = keyof typeof MULTI_MEDIA_KEYS;

/**
 * Maps "event.key" values from a KeyboardEvent to a collection of multimedia control keys.
 * This constant provides an easy-to-use reference for handling multimedia control actions like playing, pausing, recording,
 * changing tracks, and adjusting the channel. It's designed to standardize the response to these multimedia keys across
 * different environments and to maintain consistent behavior even when the "Shift" key is pressed.
 * This mapping is particularly beneficial for applications that include media playback features or need to interpret
 * multimedia-specific keyboard events.
 *
 * @example
 * let command = 'MediaPlay'; // This could be a result from an event.key
 * let action = MULTI_MEDIA_KEYS[command];
 * console.log(action); // Output will be 'MediaPlay'
 *
 * @type {{ [key in string]: string }}
 */
export const MULTI_MEDIA_KEYS = {
  ChannelUp: 'ChannelUp',
  ChannelDown: 'ChannelDown',
  MediaFastForward: 'MediaFastForward',
  MediaPause: 'MediaPause',
  MediaPlay: 'MediaPlay',
  MediaPlayPause: 'MediaPlayPause',
  MediaRecord: 'MediaRecord',
  MediaRewind: 'MediaRewind',
  MediaStop: 'MediaStop',
  MediaTrackNext: 'MediaTrackNext',
  MediaTrackPrevious: 'MediaTrackPrevious',
} as const;
