import {
  Children,
  ComponentProps,
  ElementType,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  createElement,
  forwardRef,
} from 'react';

type ReactTag = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;

type PropsOf<TagName extends ReactTag> = TagName extends ElementType ? ComponentProps<TagName> : never;

export type Props<TagName extends ReactTag> = Omit<ComponentProps<TagName>, 'ref'> & {
  /**
   * The tag name of the HTML element to be rendered.
   * Defaults to 'div' if not provided.
   */
  tagName?: TagName;

  /** The children of the component. */
  children?: Exclude<ReactNode, string>;

  /** Whether to disable the strict check for string children. */
  disableStrict?: boolean;
};

const ViewComponent = <TagName extends ReactTag>(props: Props<TagName>, ref: PropsOf<TagName>['ref']): ReactElement => {
  const { tagName = 'div', children, disableStrict = false, ...restProps } = props;

  if (!disableStrict) {
    Children.forEach(children, child => {
      if (typeof child === 'string' && child.trim()) {
        throw new Error('View component cannot have text strings as children. Use Text component instead.');
      }
    });
  }

  return createElement(tagName, { ...restProps, ref }, children);
};

/**
 * `View` is a flexible container component for React applications.
 * It is designed to render any HTML element specified by the tagName prop,
 * while enforcing a no-string-children policy for better structure and consistency.
 *
 * @param props - Props for the View component. Includes tagName, children, and other HTML attributes.
 * @param ref - Ref forwarded to the HTML element rendered by the component.
 * @returns The rendered HTML element.
 */
export const View = forwardRef(ViewComponent) as <TagName extends ReactTag = 'div'>(
  props: Props<TagName> & { ref?: PropsOf<TagName>['ref'] },
) => ReactElement | null;
