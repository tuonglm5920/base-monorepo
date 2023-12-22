# Overview

The `detectBrowser` module offers a suite of utilities that can help identify the user's browser, its version, and the operating system. It provides this information by analyzing the user agent string and other navigator properties.

# API

The module exports enums and functions that facilitate the detection of various browser and operating system attributes. It includes helper functions that allow developers to quickly determine whether the user is on a specific browser or operating system.

### Enums:

- **`Browser`**: Represents different browser types (e.g., Chrome, Firefox, Safari, etc.).
- **`OS`**: Represents different operating systems (e.g., Windows, Mac, Android, etc.).

### Functions:

- **`getBrowserName(navigator, document)`**: Determines the browser name.
- **`getBrowserVersion(browser, nav)`**: Fetches the browser version.
- **`getOS(navigator)`**: Identifies the operating system.
- **`isIE()`, `isFirefox()`, `isYandex()`, etc.**: Helper functions to quickly identify the browser or operating system.

# Examples

### 1. Detecting Browser Name and Version

```typescript
import { browserNameStr, browserVersion } from 'detectBrowser';

console.log(`Browser Name: ${browserNameStr}`);
console.log(`Browser Version: ${browserVersion}`);
```

### 2. Checking for Specific Browsers

```typescript
import { isIE, isFirefox } from 'detectBrowser';

console.log(`Is Internet Explorer?: ${isIE()}`);
console.log(`Is Firefox?: ${isFirefox()}`);
```

### 3. Determining the Operating System

```typescript
import { osStr } from 'detectBrowser';

console.log(`Operating System: ${osStr}`);
```

### 4. Checking for Touch Devices

```typescript
import { isTouch } from 'detectBrowser';

console.log(`Is a Touch Device?: ${isTouch()}`);
```
