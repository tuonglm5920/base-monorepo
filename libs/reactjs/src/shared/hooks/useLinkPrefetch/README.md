# Overview

`useLinkPrefetch` is a custom React hook designed to manage the prefetching of links within React applications. This hook provides a simple and effective way to prefetch HTML content or other resources, enhancing the performance of web applications by reducing load times. It offers both `fetch` and `cancel` methods, allowing developers to start and stop the prefetching of resources as needed, making it a versatile tool for improving user experience in responsive web design.

# API

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `link`    | `string` | The URL of the content to be prefetched. |

#### Returns

| Return Value | Type         | Description                                 |
| ------------ | ------------ | ------------------------------------------- |
| `fetch`      | `() => void` | Method to initiate prefetching of the link. |
| `cancel`     | `() => void` | Method to cancel the ongoing prefetching.   |

# Examples

Here's a simple example of how to use `useLinkPrefetch` in a React component:

```javascript
import React from 'react';
import { useLinkPrefetch } from 'path-to-useLinkPrefetch-hook';

const LinkPrefetch: FC<Props> = ({
  link,
  children,
  nativeProps = defaultProps.nativeProps,
}) => {
  const { fetch, cancel } = useLinkPrefetch({ link });

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = (e) => {
    fetch();
    nativeProps.onMouseEnter?.(e);
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = (e) => {
    cancel();
    nativeProps.onMouseLeave?.(e);
  };

  if (!link) throw new Error('Link không thể rỗng');

  return (
    <div
      {...nativeProps}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default function App() {
  return (
    <LinkPrefetch link="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js">
      JQuery
    </LinkPrefetch>
  );
}
```
