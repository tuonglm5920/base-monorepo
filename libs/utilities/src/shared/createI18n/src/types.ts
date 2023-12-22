import { DeepPropertyType, PathKeyOfObject, Trim } from 'typescript-utilities';

/** Get signal for replace */
type OptionKeys<T extends string> = T extends `${any}{{${infer U}}}${infer C}` ? Trim<U> | OptionKeys<C> : never;

/** Path i18n */
type Path<T> = PathKeyOfObject<T>;

/** Represents the type of text transformations */
type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

interface BaseOption {
  textTransform?: TextTransform;
}
export interface I18n<T extends Record<string, any>> {
  setLocale: (locale: string) => void;
  getLocale: () => string;
  t<K extends Path<T>>(
    key: K,
    options?: OptionKeys<DeepPropertyType<T, K>> extends never
      ? BaseOption
      : { [P in OptionKeys<DeepPropertyType<T, K>>]: string } & BaseOption,
  ): string;
}
