import { ShortcutManager, ShortcutOptions } from '../src/shortcutManager';

describe('ShortcutManager', () => {
  let shortcutManager: ShortcutManager;

  // Utility function to simulate keydown events
  const simulateKeydown = (key: string, options = {}): void => {
    const event = new KeyboardEvent('keydown', { key, ...options });
    document.dispatchEvent(event);
  };

  beforeEach(() => {
    shortcutManager = new ShortcutManager();
    shortcutManager.create();
  });

  afterEach(() => {
    shortcutManager.destroy();
  });

  it('should add a new shortcut', () => {
    // Define a mock function to test the callback
    const mockCallback = jest.fn();
    const shortcutOption: ShortcutOptions = {
      combination: {
        modifierKeys: ['Control'],
        key: 'A',
      },
      onMatch: mockCallback,
    };

    // Add the test shortcut
    shortcutManager.addShortcut(shortcutOption);

    // Simulate the key combination
    simulateKeydown('A', { ctrlKey: true });

    expect(mockCallback).toHaveBeenCalled();
  });

  it('should remove a shortcut', () => {
    // Define a mock function to test the callback
    const mockCallback = jest.fn();
    const shortcutOption: ShortcutOptions = {
      combination: {
        modifierKeys: ['Control'],
        key: 'B',
      },
      onMatch: mockCallback,
    };

    // Add the test shortcut
    const { remove } = shortcutManager.addShortcut(shortcutOption);

    // Remove the test shortcut
    remove();

    // Simulate the key combination
    simulateKeydown('B', { ctrlKey: true });

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not trigger shortcut when typing in an input', () => {
    // Define a mock function to test the callback
    const mockCallback = jest.fn();
    const shortcutOption: ShortcutOptions = {
      combination: {
        modifierKeys: ['Control'],
        key: 'C',
      },
      onMatch: mockCallback,
    };

    // Add the test shortcut
    shortcutManager.addShortcut(shortcutOption);

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    // Simulate the key combination
    simulateKeydown('C', { ctrlKey: true });

    expect(mockCallback).not.toHaveBeenCalled();
  });

  // Add more tests for other methods and scenarios
});
