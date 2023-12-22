interface NormalizeIndexesCanFill {
  /**
   * The pattern of the mask that defines the formatting structure for the input.
   * It typically contains characters and placeholders where user input is expected.
   */
  pattern: string;

  /**
   * A set of characters that are recognized as valid 'slots' or placeholders in the pattern.
   * These slots determine where user input can be inserted in the pattern.
   */
  slots: Set<string>;
}

/**
 * Helper function to normalize and calculate indices that can be filled based on the pattern and slots.
 * Assumes a specific structure of the 'pattern' and 'slots' passed to it.
 *
 * @param {{ pattern: string; slots: Set<string> }} param0 - Object containing the pattern and slots.
 * @returns {number[]} An array of indices that can be filled in the input mask.
 */
export const normalizeIndexesCanFill = ({ pattern, slots }: NormalizeIndexesCanFill): number[] => {
  let flagIndex = 0;
  return Array.from(pattern, (character, index) => (slots.has(character) ? (flagIndex = index + 1) : flagIndex));
};
