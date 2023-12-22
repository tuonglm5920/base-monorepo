import {
  forwardRef,
  ReactElement,
  createElement,
  ComponentProps,
  ElementType,
  JSXElementConstructor,
  Children,
} from 'react';

type ReactTag = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
type PropsOf<TagName extends ReactTag> = TagName extends ElementType ? ComponentProps<TagName> : never;

export type Props<TagName extends ReactTag> = Omit<ComponentProps<TagName>, 'children'> & {
  /**
   * The tag name of the HTML element to be rendered.
   * Can be any valid HTML element tag name.
   * Defaults to 'span' if not provided.
   */
  tagName?: TagName;

  /** The text content of the component. Only string children are allowed. */
  children?: string;

  /** Whether to disable the strict check for string children. */
  disableStrict?: boolean;
};

function TextComponent<TagName extends ReactTag = 'span'>(
  props: Props<TagName>,
  ref?: PropsOf<TagName>['ref'],
): ReactElement {
  const { tagName = 'span', children, disableStrict = false, ...restProps } = props;

  if (!disableStrict) {
    Children.forEach(children, child => {
      if (typeof child !== 'string') {
        throw new Error('Text component can only have text as its children.');
      }
    });
  }

  return createElement(tagName, { ...restProps, ref }, children);
}

/**
 * `Text` is a component designed to render textual content in a React application.
 * It strictly allows only string children, making it suitable for text rendering.
 * The component can dynamically render different HTML elements based on the provided tagName.
 *
 * @param props - Props for the Text component, including tagName, text content, and other HTML attributes.
 * @param ref - Ref forwarded to the HTML element rendered by the component.
 * @returns The rendered text element as the specified HTML tag.
 *
 * FIXME: Fluid font size
 */
export const Text = forwardRef(TextComponent) as <TagName extends ReactTag = 'span'>(
  props: Props<TagName> & { ref?: PropsOf<TagName>['ref'] },
) => ReactElement;
