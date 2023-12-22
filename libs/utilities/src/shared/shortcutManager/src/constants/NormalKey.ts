import { AlphabetKey, ALPHABET_KEYS } from './_NormalKey/_AlphabetKey';
import { ApplicationSelectorKey, APPLICATION_SELECTOR_KEYS } from './_NormalKey/_ApplicationSelectorKey';
import { AudioControlKey, AUDIO_CONTROL_KEYS } from './_NormalKey/_AudioControlKey';
import { BrowserControlKey, BROWSER_CONTROL_KEYS } from './_NormalKey/_BrowserControlKey';
import { DeviceKey, DEVICE_KEYS } from './_NormalKey/_DeviceKey';
import { DocumentKey, DOCUMENT_KEYS } from './_NormalKey/_DocumentKey';
import { EditingKey, EDITING_KEYS } from './_NormalKey/_EditingKey';
import { FunctionKey, FUNCTION_KEYS } from './_NormalKey/_FunctionKey';
import { IMEKey, IME_KEYS } from './_NormalKey/_IMEKey';
import { MediaControllerKey, MEDIA_CONTROLLER_KEYS } from './_NormalKey/_MediaControllerKey';
import { MultimediaKey, MULTI_MEDIA_KEYS } from './_NormalKey/_MultimediaKey';
import { NavigationKey, NAVIGATION_KEYS } from './_NormalKey/_NavigationKey';
import { NUMBERIC_KEYS, NumericKey } from './_NormalKey/_NumericKey';
import { PhoneKey, PHONE_KEYS } from './_NormalKey/_PhoneKey';
import { SpeechRecognitionKey, SPEECH_RECOGNITION_KEYS } from './_NormalKey/_SpeechRecognitionKey';
import { SymbolKey, SYMBOL_KEYS } from './_NormalKey/_SymbolKey';
import { TVControlKey, TV_CONTROL_KEYS } from './_NormalKey/_TVControlKey';
import { UIKey, UI_KEYS } from './_NormalKey/_UIKey';
import { WhiteSpaceKey, WHITE_SPACE_KEYS } from './_NormalKey/_WhiteSpaceKey';

export type NormalKey =
  | AlphabetKey
  | ApplicationSelectorKey
  | AudioControlKey
  | BrowserControlKey
  | DeviceKey
  | DocumentKey
  | EditingKey
  | FunctionKey
  | IMEKey
  | MediaControllerKey
  | MultimediaKey
  | NavigationKey
  | NumericKey
  | PhoneKey
  | SpeechRecognitionKey
  | SymbolKey
  | TVControlKey
  | UIKey
  | WhiteSpaceKey;

/** Ánh xạ giá trị "event.key" của KeyboardEvent về một giá trị ngay cả khi giữ "Shift" */
export const NORMAL_KEYS = {
  ...ALPHABET_KEYS,
  ...APPLICATION_SELECTOR_KEYS,
  ...AUDIO_CONTROL_KEYS,
  ...BROWSER_CONTROL_KEYS,
  ...DEVICE_KEYS,
  ...DOCUMENT_KEYS,
  ...EDITING_KEYS,
  ...FUNCTION_KEYS,
  ...IME_KEYS,
  ...MEDIA_CONTROLLER_KEYS,
  ...MULTI_MEDIA_KEYS,
  ...NAVIGATION_KEYS,
  ...NUMBERIC_KEYS,
  ...PHONE_KEYS,
  ...SPEECH_RECOGNITION_KEYS,
  ...SYMBOL_KEYS,
  ...TV_CONTROL_KEYS,
  ...UI_KEYS,
  ...UI_KEYS,
  ...WHITE_SPACE_KEYS,
} as const;
