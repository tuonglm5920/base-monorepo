import { getPassiveArg } from '../../getPassiveArg';
import { normalizeIndexesCanFill } from './utils/normalizeIndexesCanFill';

/**
 * Creates an input mask for an HTMLInputElement. This mask formats the input based on a pattern defined in the placeholder attribute.
 * It also allows for specifying a set of acceptable characters and slots for input.
 *
 * @param {HTMLInputElement} $el - The HTML input element to apply the mask to.
 * @returns {{ create: () => void; destroy: () => void }} An object containing two methods, `create` and `destroy`.
 *          `create` method sets up the input mask by attaching event listeners to the input element.
 *          `destroy` method removes these event listeners.
 */
export const inputMask = ($el: HTMLInputElement): { create: () => void; destroy: () => void } => {
  /** Flag to track if the last key pressed was 'Backspace' */
  let back = false;
  /** Retrieve the input's placeholder attribute to use as the pattern */
  const pattern = $el.getAttribute('placeholder');
  /** Create a set of allowed characters (slots) from the 'data-slots' attribute */
  const slots = new Set($el.dataset['slots'] || '_');
  /** Define a regular expression for characters that are acceptable as input */
  const accept = new RegExp($el.dataset['accept'] || '\\d', 'g');
  if (pattern) {
    /** Find the index of the first slot character in the pattern */
    const firstSlot = [...pattern].findIndex(character => slots.has(character));
    /** Calculate and normalize the indices where characters can be filled */
    const indexesCanFill = normalizeIndexesCanFill({ pattern, slots });

    /** Clean and format the input value based on the pattern and slots */
    const clean = (input: string): string[] => {
      const regexpMatch = input.match(accept) || [];
      return Array.from(pattern, character => {
        return input[0] === character || slots.has(character) ? regexpMatch.shift() || character : character;
      });
    };

    /** Format the input field's value and adjust cursor position */
    const format = (): void => {
      const [newSelectionStart, newSelectionEnd] = [$el.selectionStart, $el.selectionEnd].map(selection => {
        if (selection) {
          selection = clean($el.value.slice(0, selection)).findIndex(character => slots.has(character));
          return selection < 0
            ? indexesCanFill[indexesCanFill.length - 1]
            : back
              ? indexesCanFill[selection - 1] || firstSlot
              : selection;
        }
        return selection;
      });
      $el.value = clean($el.value).join('');
      setTimeout(() => {
        $el.setSelectionRange(newSelectionStart, newSelectionEnd);
      });
      back = false;
    };

    /** Handle the 'Backspace' key press event */
    const handleKeyDownBackSpace = (event: KeyboardEvent): void => {
      back = event.key === 'Backspace';
    };

    /** Clear the input value if it's only the pattern on blur */
    const handleBlur = (): void => {
      if ($el.value === pattern) {
        $el.value = '';
      }
    };

    return {
      create: (): void => {
        $el.addEventListener('keydown', handleKeyDownBackSpace, getPassiveArg());
        $el.addEventListener('input', format, getPassiveArg());
        $el.addEventListener('focus', format, getPassiveArg());
        $el.addEventListener('blur', handleBlur, getPassiveArg());
      },
      destroy: (): void => {
        $el.removeEventListener('keydown', handleKeyDownBackSpace);
        $el.removeEventListener('input', format);
        $el.removeEventListener('focus', format);
        $el.removeEventListener('blur', handleBlur);
      },
    };
  }
  return {
    create: () => undefined,
    destroy: () => undefined,
  };
};
