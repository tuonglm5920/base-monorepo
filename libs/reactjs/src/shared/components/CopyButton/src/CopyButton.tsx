import classNames from 'classnames';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Text } from '../../Text';
import { View } from '../../View';
import { CopiedIcon } from './icons/CopiedIcon';
import { CopyIcon } from './icons/CopyIcon';
import './styles.css';
import { copyToClipboard } from './utils/copyToClipboard';

export interface Props {
  /** Text content that will be copied to the clipboard when the button is clicked. */
  content?: string;
  /** Text to display after the content has been successfully copied. */
  copiedText?: string;
  /** Text to be displayed on the copy button. */
  copyText?: string;
  /** RTL mode */
  rtl?: boolean;
}

/**
 * `CopyButton` is a React functional component that renders a button for copying text to the clipboard.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.content - The text content to be copied to the clipboard when the button is clicked.
 * @param {string} props.copiedText - Text to display after the content has been successfully copied. This could be a confirmation message like "Copied!".
 * @param {string} props.copyText - Text to be displayed on the copy button. This can be used to customize the button label, such as "Copy" or "Copy to Clipboard".
 * @param {boolean} props.rtl - RTL mode.
 *
 * @returns {ReactElement} A React Element representing the copy button.
 */
export const CopyButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { content = '', copiedText = 'Copied', copyText = 'Copy', rtl } = props;

  const [isCopied, setIsCopied] = useState(false);

  const timeoutRef = useRef<number | undefined>();

  useEffect(() => {
    if (isCopied) {
      timeoutRef.current = window.setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
    return (): void => {
      clearTimeout(timeoutRef.current);
    };
  }, [isCopied]);

  return (
    <View
      ref={ref}
      tagName="button"
      className="CopyButton__container"
      onClick={(): void => {
        setIsCopied(true);
        copyToClipboard(content);
      }}
    >
      <View className={classNames(rtl ? 'CopyButton__right' : '')}>{isCopied ? <CopiedIcon /> : <CopyIcon />}</View>
      <Text tagName="span" className="CopyButton__text">
        {isCopied ? copiedText : copyText}
      </Text>
    </View>
  );
});

CopyButton.displayName = 'CopyButton';
