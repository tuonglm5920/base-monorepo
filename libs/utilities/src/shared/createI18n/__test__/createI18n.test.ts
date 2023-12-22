import { TranslationKeyNotFoundError, createI18n } from '../src/createI18n';

const en = {
  greeting: 'Hello {{ name }}',
} as const;

const fr = {
  greeting: 'Bonjour {{name}}',
} as const;

const i18n = createI18n({
  en,
  fr,
});

describe('createI18n', () => {
  it('should return translation for the current locale', () => {
    i18n.setLocale('en');
    expect(i18n.t('greeting', { name: 'John' })).toBe('Hello John');
    i18n.setLocale('fr');
    expect(i18n.t('greeting', { name: 'John' })).toBe('Bonjour John');
  });

  it('should throw a custom error for unknown translation keys', () => {
    i18n.setLocale('en');
    // @ts-ignore
    expect(() => i18n.t('unknownKey')).toThrow(TranslationKeyNotFoundError);
    // @ts-ignore
    expect(() => i18n.t('unknownKey')).toThrow('Translation key "unknownKey" not found');
  });
});
