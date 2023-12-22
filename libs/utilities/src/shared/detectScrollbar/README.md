# Overview

The `detectScrollbar` function is a utility designed to detect the presence of a vertical scrollbar in a web browser's viewport. It compares the document's height to the viewport's height to determine if a scrollbar is present.

## API

#### Parameters

- None.

#### Return Value

- Returns a `boolean`:
  - `true` if a vertical scrollbar is present.
  - `false` if no scrollbar is detected or in SSR environments.

## Examples

1. **Detecting Scrollbar Presence**

```typescript
if (detectScrollbar()) {
  console.log("Scrollbar is present.");
} else {
  console.log("No scrollbar detected.");
}
```

2. **Using in a Server-Side Rendered Application**

```typescript
// On the server
console.log(detectScrollbar()); // Output: false
```
