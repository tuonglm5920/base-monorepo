import { uniq } from 'ramda';
import { getPassiveArg } from '../../getPassiveArg';
import { isBrowser } from '../../isBrowser';
import { ModifierKey } from './constants/ModifierKey';
import { NormalKey, NORMAL_KEYS } from './constants/NormalKey';

export interface ShortcutOptions {
  /** An object representing the key combination of the shortcut. */
  combination: {
    /** An array of modifier keys (e.g., 'Ctrl', 'Alt', 'Shift'). See https://en.wikipedia.org/wiki/Modifier_key for more details on modifier keys. */
    modifierKeys: ModifierKey[];
    /** The primary key of the shortcut (e.g., 'A', 'Enter'). */
    key: NormalKey;
  };
  /** A callback function that is executed when the shortcut combination is matched. The matched combination is passed as an argument. */
  onMatch: (matched: ShortcutOptions['combination']) => void;
}

/**
 * Manages keyboard shortcuts within an application.
 * It allows the addition, removal, and handling of keyboard shortcuts, along with managing their lifecycle.
 *
 * @class
 * @property {Array<ShortcutOptions & {_id: number; totalKeys: number}>} shortcutOptions - An array that stores the current set of shortcut options, each extended with a unique identifier and the total number of keys involved in the shortcut.
 * @property {number} _id - A private member used for generating unique IDs for each shortcut option.
 * @property {() => void} create - Method to start listening for keydown events and handling shortcuts.
 * @property {() => void} destroy - Method to stop listening for keydown events.
 * @property {(shortcutOptionID: number) => void} removeShortcut - Removes a shortcut based on its unique ID.
 * @property {(newShortcutOption: ShortcutOptions) => {shortcutOptionID: number; remove: () => void}} addShortcut - Adds a new shortcut and returns an object containing the unique ID of the added shortcut and a method to remove it.
 * @property {() => number} createUniqueId - Private method to create a unique ID.
 * @property {(event: KeyboardEvent) => boolean | undefined} handleKeyDown - Private callback method for handling keydown events.
 * @property {() => boolean} isFocusedInput - Private method that checks if the currently focused element should prevent shortcut handling.
 * @property {string[]} DEFAULT_IGNORED_TAGS - Static array defining tags which, when focused, will ignore shortcut handling.
 */
export class ShortcutManager {
  /** Private storage for all registered shortcut options. Each shortcut option is extended with additional metadata. */
  private _shortcutOptions: Array<ShortcutOptions & { _id: ShortcutManager['_id']; totalKeys: number }> = [];
  /** A private counter used to generate unique identifiers for each shortcut. This ensures that each shortcut can be individually referenced and managed. */
  private _id = 0;

  /**
   * Initializes the shortcut manager by attaching a keydown event listener to the document.
   * This listener is responsible for detecting and handling keyboard shortcuts as defined
   * in the `shortcutOptions` array.
   *
   * When called, this method enables the `ShortcutManager` to start listening for user
   * keyboard interactions and process them according to the configured shortcuts.
   */
  public create = (): void => {
    if (!isBrowser()) {
      return;
    }
    document.addEventListener('keydown', this._handleKeyDown, getPassiveArg());
  };

  /**
   * Deactivates the shortcut manager by removing the keydown event listener from the document.
   *
   * This method stops the `ShortcutManager` from listening to user keyboard interactions,
   * effectively disabling the processing of any defined keyboard shortcuts.
   *
   * It should be called when the shortcut functionality is no longer needed,
   * or before disposing of the `ShortcutManager` instance, to prevent memory leaks.
   */
  public destroy = (): void => {
    if (!isBrowser()) {
      return;
    }
    document.removeEventListener('keydown', this._handleKeyDown);
  };

  /**
   * Removes a specific keyboard shortcut from the manager's tracking.
   *
   * This method deletes a shortcut identified by its unique ID from the list of managed shortcuts.
   * Once removed, the shortcut will no longer trigger any actions when its key combination is pressed.
   *
   * @param {ShortcutManager['_id']} shortcutOptionID - The unique identifier of the shortcut to be removed.
   */
  public removeShortcut = (shortcutOptionID: ShortcutManager['_id']): void => {
    this._shortcutOptions = this._shortcutOptions.filter(item => item._id !== shortcutOptionID);
  };

  /**
   * Adds a new keyboard shortcut to the manager.
   *
   * This method registers a new shortcut with the specified options. Each shortcut is given a unique
   * identifier upon creation. The method returns an object containing the unique ID and a `remove`
   * function, which can be used to unregister the shortcut later.
   *
   * @param {ShortcutOptions} newShortcutOption - The configuration options for the new shortcut.
   * @returns {{ shortcutOptionID: number; remove: () => void }} An object containing the unique ID of the
   *          new shortcut and a function to unregister this shortcut.
   */
  public addShortcut = (newShortcutOption: ShortcutOptions): { shortcutOptionID: number; remove: () => void } => {
    const uniqueId = this._createUniqueId();
    this._shortcutOptions = this._shortcutOptions
      .concat({
        ...newShortcutOption,
        combination: {
          ...newShortcutOption.combination,
          modifierKeys: uniq(newShortcutOption.combination.modifierKeys),
        },
        totalKeys: newShortcutOption.combination.modifierKeys.length,
        _id: uniqueId,
      })
      .sort((a, b) => b.totalKeys - a.totalKeys);
    return {
      shortcutOptionID: uniqueId,
      remove: () => this.removeShortcut(uniqueId),
    };
  };

  /**
   * Generates a unique identifier for a new shortcut.
   *
   * This private method increments the internal unique identifier counter (`_id`) and returns the new value.
   * It's used to assign a unique ID to each newly created shortcut.
   *
   * @returns {number} The newly generated unique identifier.
   */
  private _createUniqueId = (): number => {
    return ++this._id;
  };

  /**
   * Handles the keydown event triggered by the user.
   *
   * This private method is a callback function for the keydown event listener. It processes the event to determine
   * if it matches any of the registered shortcuts. If a match is found, it triggers the corresponding action.
   *
   * @param {KeyboardEvent} event - The KeyboardEvent object representing the keydown event.
   * @returns {boolean | undefined} - Returns undefined if the input is from a focused editable element or if no shortcut matches.
   *                                  Returns true if a matching shortcut is found and its action is successfully executed.
   */
  private _handleKeyDown = (event: KeyboardEvent): boolean | undefined => {
    if (this._isFocusedInput()) {
      return;
    }
    const { _shortcutOptions: shortcutOptions } = this;
    const longestMatchingShortcut = shortcutOptions.find(({ combination }) => {
      const isHeldAllModifierKeys = combination.modifierKeys.every(
        key => event.getModifierState && event.getModifierState(key),
      );
      const isPressingKeyTrigger = event.shiftKey
        ? NORMAL_KEYS[combination.key] === NORMAL_KEYS[event.key as NormalKey]
        : combination.key === event.key;
      return isPressingKeyTrigger && isHeldAllModifierKeys;
    });
    if (longestMatchingShortcut) {
      longestMatchingShortcut.onMatch(longestMatchingShortcut.combination);
    }

    return;
  };

  /**
   * Checks if the user is currently focusing on an input field.
   *
   * This private method is used to determine whether the active element in the document is an input field or
   * an element that allows text editing. This is important to prevent shortcut actions from being triggered
   * when the user is typing in an input field or a content-editable element.
   *
   * @returns {boolean} - Returns true if the active element is an input field or content-editable element,
   *                      otherwise returns false.
   */
  private _isFocusedInput(): boolean {
    if (!isBrowser()) {
      return false;
    }
    const target = document.activeElement;
    if (target == null || target.tagName == null) {
      return false;
    }
    return ShortcutManager._DEFAULT_IGNORED_TAGS.includes(target.tagName) || target.hasAttribute('contenteditable');
  }

  /**
   * A static array of HTML tag names that should be ignored when listening for keyboard shortcuts.
   *
   * This array includes tags such as 'INPUT', 'SELECT', and 'TEXTAREA', indicating elements typically used for user input.
   * When an element with one of these tags is focused, keyboard events will not trigger shortcuts managed by the ShortcutManager.
   * This behavior ensures that normal text entry and interactions with these elements are not interfered with by shortcut functionality.
   */
  private static _DEFAULT_IGNORED_TAGS = isBrowser()
    ? [
        document.createElement('input').tagName,
        document.createElement('select').tagName,
        document.createElement('textarea').tagName,
      ]
    : [];
}
