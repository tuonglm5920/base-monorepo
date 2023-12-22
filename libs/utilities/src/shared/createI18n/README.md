# Overview
The `createI18n` function generates an I18n instance for managing translations based on a given source object. This utility is designed to simplify the i18n process for JavaScript applications.

# API
##### Parameters
- **source**: `T` - An object containing translation keys and their corresponding values for different locales.

##### Return value
- Returns an `I18n` instance configured with the given source.

##### Generic Type Parameters
- `T`: This is an object type whose properties are translation keys, and the corresponding values are translations.

##### Example Type Definition
```typescript
type TransitionDefault = {
  [locale: string]: {
    [key: string]: string;
  };
}
```

# Examples
Here is a simple example that shows how to create an I18n instance:
```typescript
const source = {
  'en-US': { greeting: 'Hello' },
  'fr-FR': { greeting: 'Bonjour' },
};

const i18nInstance = createI18n(source);

// Use the i18nInstance to retrieve translations
const greetingInEnglish = i18nInstance.translate('greeting'); // Output: 'Hello'
```
