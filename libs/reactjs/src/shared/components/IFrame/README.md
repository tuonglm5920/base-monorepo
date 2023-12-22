# Overview

The `IFrame` component is a custom React component designed to embed other React components as children within an iframe. This allows for the isolation of the embedded content from the parent document's environment.

# Props

| Prop       | Type                                                | Optional | Description                                                                                                         |
| ---------- | --------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `children` | `React.ReactNode`                                   | Yes      | The React components to be rendered inside the IFrame.                                                              |
| `...props` | `Omit<HTMLAttributes<HTMLIFrameElement>, 'srcDoc'>` | Yes      | Standard HTML attributes for an IFrame, excluding 'srcDoc', to customize the behavior and appearance of the IFrame. |

# Examples

```jsx
<div data-testid="container">
  <IFrame id="myIframe">
    <div>
      <h2>Iframe Content</h2>
      <div id="result">{state}</div>
      <button onClick={() => setState(state - 1)}>Decrement</button>
    </div>
  </IFrame>
</div>
```
