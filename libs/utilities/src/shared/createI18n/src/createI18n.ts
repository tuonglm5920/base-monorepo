import * as R from 'ramda';
import { localStorage } from '../../localStorage';
import { toCapitalize } from '../../toCapitalize';
import { I18n } from './types';

export type TransitionDefault = Record<string, any>;

export class TranslationKeyNotFoundError extends Error {
  constructor(key: string) {
    super(`Translation key "${key}" not found`);
    this.name = 'TranslationKeyNotFoundError';
  }

  //#region For testing
  //#endregion
}

/**
 * Creates an I18n instance for handling translations based on the provided source.
 * @template T - An object type whose properties define translation keys and their corresponding values.
 * @param {T} source - The source object containing translation keys and their values.
 * @returns {I18n<T[keyof T]>} An instance of I18n configured with the given source.
 * @example ```typescript
  const source = {
    'en': { greeting: 'Hello' },
    'fr': { greeting: 'Bonjour' },
  };
  const i18nInstance = createI18n(source);
  // Use the i18nInstance for translations
  const greetingInEnglish = i18nInstance.translate('greeting'); // Should return 'Hello'
```
 */
export const createI18n = <T extends TransitionDefault>(source: T): I18n<T[keyof T]> => {
  let _locale = localStorage.getItem('__LOCALE__') || navigator.language || 'en';
  localStorage.setItem('__LOCALE__', _locale);

  /**
   * Sets the locale
   * @param {string} locale - The locale string to set, e.g., 'en', 'fr'.
   */
  const setLocale = (locale: string): void => {
    localStorage.setItem('__LOCALE__', locale);
    _locale = localStorage.getItem('__LOCALE__') as string;
  };

  /**
   * Retrieves the current locale set.
   * @returns {string} The current locale string, e.g., 'en', 'fr'.
   */
  const getLocale = (): string => {
    return _locale.replace(/(-|_).*/g, '');
  };

  const translation: I18n<T[keyof T]>['t'] = (key, options) => {
    const _lang = source[_locale.replace(/(-|_).*/g, '')] || source['en'];
    if (!_lang) {
      return '';
    }
    const value = key.includes('.') ? R.path(key.split('.'), _lang) : _lang[key as string];
    if (!value) {
      throw new TranslationKeyNotFoundError(key);
    }
    if (!options) {
      return value?.replace(/{{(\s*\w*\s*)}}/g, '').trim();
    }
    const mappingI18nFromOptions = R.omit(['textTransform'], options);
    const text = Object.entries(mappingI18nFromOptions).reduce<string>((acc, [prop, value]) => {
      const regex = new RegExp(`{{\\s*${prop}\\s*}}`, 'g');
      if (!acc) {
        return '';
      }
      return acc.replace(regex, String(value)).trim();
    }, value);

    switch (options.textTransform) {
      case 'uppercase':
        return text.toUpperCase();
      case 'lowercase':
        return text.toLowerCase();
      case 'capitalize':
        return toCapitalize(text);
      case 'none':
      default:
        return text;
    }
  };

  return {
    setLocale,
    getLocale,
    t: translation,
  };
};
