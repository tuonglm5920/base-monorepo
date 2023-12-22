# Overview

The `inputMask` utility is designed to add a dynamic input masking functionality to HTML input elements. It formats the input based on a specified pattern, defined in the element's placeholder attribute.

# API

##### Parameters

- **$el**: An HTMLInputElement to which the input mask will be applied.

##### Return value

- An object containing two methods:
  - **create**: A method that sets up the input mask by attaching event listeners to the input element.
  - **destroy**: A method that removes the event listeners, effectively disabling the input mask.

# Examples

1. Applying an input mask to a phone number input field

```typescript
// <label id="phone">
//   Telephone:
//   <input placeholder="+1 (___) ___-____" data-slots="_" />{' '}
// </label>;
const phoneInput = document.getElementById("phone") as HTMLInputElement;
const phoneMask = inputMask(phoneInput);
phoneMask.create();
```
