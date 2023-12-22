# Overview
The `escapeRegExp` function is designed to escape any special characters in a string that might have special meaning inside a regular expression. This ensures that the string can be safely used in a dynamically generated regular expression without any unintended consequences.

# API

##### Parameters
- **str**: `string`: The input string that may contain special characters.

##### Return value
- A string with all special characters escaped.

# Examples
1. Escaping a string containing special characters
```typescript
import { escapeRegExp } from './path-to-escapeRegExp-function';

const userInput = 'Hello (world)! *+?^${}[]|';
const escapedInput = escapeRegExp(userInput);

console.log(escapedInput);
// Output: 'Hello \\(world\\)! \\*\\+\\?\\^\\$\\{\\}\\[\\]\\|'
