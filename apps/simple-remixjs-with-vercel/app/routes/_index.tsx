/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { MetaFunction } from '@remix-run/node';
import { image1 } from 'assets';
import { FC, useState } from 'react';
import { QRScanner } from 'reactjs';
import { Image, MimeType } from 'remixjs/client';
import { Button } from '~/components/Button/Button';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

const Index: FC = () => {
  const [openQr, setOpenQr] = useState(false);
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <QRScanner
        open={openQr}
        Loading={<h1>Loading</h1>}
        Reconnect={<h1>Reconnect</h1>}
        onClose={() => setOpenQr(false)}
      />
      <button onClick={() => setOpenQr(true)}>Open QR</button>
      <Image
        src={image1}
        alt="Test"
        options={{ contentType: MimeType.WEBP }}
        placeholder="blur"
        responsive={[
          {
            size: { width: 100, height: 100 },
            maxWidth: 500,
          },
          {
            size: { width: 600, height: 600 },
          },
        ]}
      />
      <Button />
      <h1 className="text-3xl text-primary-base font-bold underline">Welcome to Remix</h1>
      <ul>
        <li>
          <a target="_blank" href="https://remix.run/tutorials/blog" rel="noreferrer">
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/tutorials/jokes" rel="noreferrer">
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Index;
