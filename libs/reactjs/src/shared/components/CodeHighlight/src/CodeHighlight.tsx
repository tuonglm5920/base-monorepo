import { HTMLAttributes, forwardRef, useEffect, useRef } from 'react';
import './vendors/prism';
import './vendors/prism.css';
import { Text } from '../../Text';
import { View } from '../../View';

export interface Props {
  /** #### Programming language */
  language?: 'css' | 'scss' | 'js' | 'jsx' | 'tsx' | 'php' | 'go' | 'java' | 'python' | 'typescript' | 'c' | 'cpp';
  /** #### Code snippet to be displayed */
  code: string;
  /** #### Native properties for the pre element */
  nativeProps?: HTMLAttributes<HTMLPreElement>;
}

export const CodeHighlight = forwardRef<HTMLPreElement, Props>((props, ref) => {
  const { code = props.code.trim(), language = 'js', nativeProps = {} } = props;
  const _codeRef = useRef<HTMLElement | null>(null);
  const _prevCode = useRef<string>('');

  const _handleCodeHighlight = (): void => {
    if (_codeRef.current) {
      // @ts-ignore
      window.Prism.highlightElement(_codeRef.current);
    }
  };

  useEffect(() => {
    if (_prevCode.current !== code) {
      _handleCodeHighlight();
    }
    _prevCode.current = code;
  }, [code]);

  return (
    <View tagName="pre" {...nativeProps} ref={ref}>
      <Text tagName="code" ref={_codeRef} className={`language-${language}`}>
        {code}
      </Text>
    </View>
  );
});

CodeHighlight.displayName = 'CodeHighlight';
