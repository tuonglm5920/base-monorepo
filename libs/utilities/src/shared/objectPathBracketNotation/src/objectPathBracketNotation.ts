const regex = {
  "'": /\\'/g,
  '"': /\\"/g,
};

/**
 * Parses a string representing a path in an object and returns an array of its components.
 * The function is designed to handle both dot notation and bracket notation,
 * which includes handling quoted strings within the brackets. It correctly
 * handles escaped quotes and backslashes within these quoted strings.
 *
 * @param {string} str - The string representation of the object path to parse.
 *                          Example: "part1.part2['part3']['part\\'4']"
 *
 * @returns {string[]} An array of strings, each representing a part of the path.
 *                     For the example input, the output would be:
 *                     ["part1", "part2", "part3", "part'4"]
 *
 * @example
 * // returns ["part1", "part2", "part3", "part'4"]
 * objectPathBracketNotation("part1.part2['part3']['part\\'4']");
 */
export const objectPathBracketNotation = (str: string): string[] => {
  let i = 0;
  const parts: string[] = [];
  let dot, bracket, quote, closing;
  while (i < str.length) {
    dot = str.indexOf('.', i);
    bracket = str.indexOf('[', i);

    // we've reached the end
    if (dot === -1 && bracket === -1) {
      parts.push(str.slice(i, str.length));
      i = str.length;
    }
    // dots
    else if (bracket === -1 || (dot !== -1 && dot < bracket)) {
      parts.push(str.slice(i, dot));
      i = dot + 1;
    }
    // brackets
    else {
      if (bracket > i) {
        parts.push(str.slice(i, bracket));
        i = bracket;
      }
      quote = str.slice(bracket + 1, bracket + 2);

      if (quote !== '"' && quote !== "'") {
        closing = str.indexOf(']', bracket);
        if (closing === -1) {
          closing = str.length;
        }
        parts.push(str.slice(i + 1, closing));
        i = str.slice(closing + 1, closing + 2) === '.' ? closing + 2 : closing + 1;
      } else {
        closing = str.indexOf(quote + ']', bracket);
        if (closing === -1) {
          closing = str.length;
        }
        while (str.slice(closing - 1, closing) === '\\' && bracket < str.length) {
          bracket++;
          closing = str.indexOf(quote + ']', bracket);
        }
        parts.push(
          str
            .slice(i + 2, closing)
            .replace(regex[quote], quote)
            .replace(/\\+/g, function (backslash) {
              return new Array(Math.ceil(backslash.length / 2) + 1).join('\\');
            }),
        );
        i = str.slice(closing + 2, closing + 3) === '.' ? closing + 3 : closing + 2;
      }
    }
  }
  return parts;
};
