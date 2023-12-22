# Overview

The `toCapitalize` function takes a string as input and returns a new string where only the first letter is capitalized and the rest are converted to lowercase.

# API

##### Parameters

- **inputString**: The string you want to capitalize.

##### Return value

- A new string where the first letter is capitalized and the rest of the string is in lowercase.

# Examples

1. Capitalizing the first letter while converting the rest to lowercase

```typescript
const str = "hello";
const result = toCapitalize(str);
console.log(result); // Output: "Hello"
```

2. Handling a single uppercase letter

```typescript
const letter = "A";
const capitalized = toCapitalize(letter);
console.log(capitalized); // Output: "A"
```

3. Handling an empty string

```typescript
const empty = "";
const newString = toCapitalize(empty);
console.log(newString); // Output: ""
```
