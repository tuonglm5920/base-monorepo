# Overview

The `objectPathBracketNotation` utility is a sophisticated JavaScript function designed to parse string paths in object notations. It expertly handles both dot and bracket notations, and it is particularly adept at managing paths that contain quoted strings with potentially escaped characters. This utility is invaluable in scenarios where object paths need to be dynamically evaluated or extracted, such as in configuration management, dynamic property access, or data binding operations in complex JavaScript applications.

## API

#### Parameters

- **str**: A string representing the object path. This string can include a mix of dot and bracket notations, with or without quoted strings.

#### Return value

- An array of strings: Each element of the array represents a distinct part of the object path, parsed and extracted from the input string.

## Examples

1. **Parsing a simple dot notation path**

```typescript
const simplePath = 'part1.part2.part3';
const parts = objectPathBracketNotation(simplePath);
console.log(parts); // Output: ['part1', 'part2', 'part3']
```

2. **Handling mixed notation with brackets and quotes**

```typescript
const mixedPath = 'part1.part2["part3"].part4';
const parts = objectPathBracketNotation(mixedPath);
console.log(parts); // Output: ['part1', 'part2', 'part3', 'part4']
```
