import { HTMLAttributes, ReactEventHandler, ReactPortal, forwardRef, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { mergeRef } from '../../../hooks/useMergeRef/src/utils/mergeRef';

const DEFAULT_SRC_DOC = '<!DOCTYPE html><html><head></head><body></body></html>';

/**
 * This component is a specialized IFrame that behaves like a standard React component, allowing React elements to be nested inside it.
 * It's designed to encapsulate and render its children elements within an IFrame context.
 *
 * @example
 * ```jsx
 * <div data-testid="container">
 *   <button id="increment" onClick={() => setState(state + 1)}>
 *     Increment
 *   </button>
 *   <IFrame id="myIframe">
 *     <div>
 *       <h2>Iframe Content</h2>
 *       <div id="result">{state}</div>
 *       <button id="decrement" onClick={() => setState(state - 1)}>
 *         Decrement
 *       </button>
 *     </div>
 *   </IFrame>
 * </div>
 * ```
 */
export const IFrame = forwardRef<HTMLIFrameElement, Omit<HTMLAttributes<HTMLIFrameElement>, 'srcDoc'>>((props, ref) => {
  const { children, title = 'IFrame', onLoad } = props;
  const [loaded, setLoaded] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const finalRef = mergeRef(ref, iframeRef);

  const handleLoaded: ReactEventHandler<HTMLIFrameElement> = event => {
    onLoad?.(event);
    setLoaded(true);
  };

  const renderContent = (): ReactPortal | null => {
    if (loaded && iframeRef.current?.contentDocument?.body) {
      return createPortal(children, iframeRef.current.contentDocument.body);
    }
    return null;
  };

  return (
    <>
      <iframe {...props} title={title} ref={finalRef} srcDoc={DEFAULT_SRC_DOC} onLoad={handleLoaded} />
      {renderContent()}
    </>
  );
});

IFrame.displayName = 'IFrame';
