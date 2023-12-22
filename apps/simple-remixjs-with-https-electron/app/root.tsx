import { cssBundleHref } from '@remix-run/css-bundle';
import { LinksFunction, LoaderFunction, redirect } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { FC } from 'react';
import styles from './tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export const loader: LoaderFunction = ({ request }) => {
  // upgrade people to https automatically

  const url = new URL(request.url);
  const hostname = url.hostname;
  const proto = request.headers.get('X-Forwarded-Proto') ?? url.protocol;

  url.host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('host') ?? url.host;
  url.protocol = 'https:';

  if (proto === 'http:' && hostname !== 'localhost') {
    return redirect(url.toString(), {
      headers: {
        'X-Forwarded-Proto': 'https',
      },
    });
  }
  return {};
};

const App: FC = () => {
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
      </body>
    </html>
  );
};

export default App;
