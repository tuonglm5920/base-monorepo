export type TVControlKey = keyof typeof TV_CONTROL_KEYS;

/**
 * Maps `event.key` values from a `KeyboardEvent` to corresponding TV control key values. This mapping is designed
 * to support applications that interact with TV remote control functionalities, ensuring that the key inputs are
 * accurately interpreted and handled. The constant covers a comprehensive range of TV-related controls, including
 * power, input selection, media context, and various other TV functions. This mapping is particularly crucial for
 * applications that aim to provide a virtual remote control experience or integrate with smart TV interfaces.
 *
 * @example
 * let keyPressed = 'TVInputHDMI1'; // Assume this is from an event.key
 * let controlFunction = TV_CONTROL_KEYS[keyPressed];
 * console.log(controlFunction); // Output will be 'TVInputHDMI1'
 *
 * @type {{ [key in string]: string }}
 */
export const TV_CONTROL_KEYS = {
  TV: 'TV',
  TV3DMode: 'TV3DMode',
  TVAntennaCable: 'TVAntennaCable',
  TVAudioDescription: 'TVAudioDescription',
  TVAudioDescriptionMixDown: 'TVAudioDescriptionMixDown',
  TVAudioDescriptionMixUp: 'TVAudioDescriptionMixUp',
  TVContentsMenu: 'TVContentsMenu',
  TVDataService: 'TVDataService',
  TVInput: 'TVInput',
  TVInputComponent1: 'TVInputComponent1',
  TVInputComponent2: 'TVInputComponent2',
  TVInputComposite1: 'TVInputComposite1',
  TVInputComposite2: 'TVInputComposite2',
  TVInputHDMI1: 'TVInputHDMI1',
  TVInputHDMI2: 'TVInputHDMI2',
  TVInputHDMI3: 'TVInputHDMI3',
  TVInputHDMI4: 'TVInputHDMI4',
  TVInputVGA1: 'TVInputVGA1',
  TVMediaContext: 'TVMediaContext',
  TVNetwork: 'TVNetwork',
  TVNumberEntry: 'TVNumberEntry',
  TVPower: 'TVPower',
  TVRadioService: 'TVRadioService',
  TVSatellite: 'TVSatellite',
  TVSatelliteBS: 'TVSatelliteBS',
  TVSatelliteCS: 'TVSatelliteCS',
  TVSatelliteToggle: 'TVSatelliteToggle',
  TVTerrestrialAnalog: 'TVTerrestrialAnalog',
  TVTerrestrialDigital: 'TVTerrestrialDigital',
  TVTimer: 'TVTimer',
} as const;
