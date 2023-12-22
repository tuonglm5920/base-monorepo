import { ActionFunction } from '@remix-run/node';
import { storage } from 'remixjs/server';

export const action: ActionFunction = async ({ request }) => {
  storage.logout({ request });
  return null;
};
