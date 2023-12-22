import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // we will register it after the page complete the load
    navigator.serviceWorker.register('/sw.js');
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
