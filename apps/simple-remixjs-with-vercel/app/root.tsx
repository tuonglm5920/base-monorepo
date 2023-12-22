import { cssBundleHref } from '@remix-run/css-bundle';
import { LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { FC } from 'react';
import { useCallbackPrompt } from 'remixjs/client';
import { ConfirmDialog } from './components/ConfirmLeavePage/ConfirmLeavePage';
import styles from './tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

const App: FC = () => {
  const { showPrompt, confirmNavigation, cancelNavigation } = useCallbackPrompt({ when: true });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <ConfirmDialog isOpen={showPrompt} onClose={cancelNavigation} onConfirm={confirmNavigation} />
      </body>
    </html>
  );
};

export default App;
