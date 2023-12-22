import { isBrowser } from 'utilities';

/**
 * Copies a given text string to the clipboard.
 *
 * This function takes a string as an input and uses the Clipboard API
 * to copy the content to the user's clipboard. This is typically used
 * for allowing users to easily copy text with a single click or action.
 *
 * Note: This function will only work in browser environments where the Clipboard API is supported.
 *
 * @param {string} content - The text content to be copied to the clipboard.
 */
export const copyToClipboard = async (content: string): Promise<void> => {
  if (!isBrowser()) {
    return;
  }
  try {
    await navigator.clipboard.writeText(content);
  } catch {
    const textArea = document.createElement('textarea');
    textArea.style.width = '1px';
    textArea.style.height = '1px';
    textArea.style.background = 'transparents';
    textArea.value = content;
    document.body.append(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};
