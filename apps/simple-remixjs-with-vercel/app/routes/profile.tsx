import { LoaderFunctionArgs } from '@remix-run/node';
import { Form, MetaFunction, useLoaderData } from '@remix-run/react';
import { FC } from 'react';
import { storage } from 'remixjs/server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  storage.checkedAuthentication({ request });

  const session = await storage.getSession({ request });
  //   REQUEST CÁI GÌ ĐÓ Ở ĐÂY
  return session;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Profile' }];
};

const Profile: FC = () => {
  const sessionData = useLoaderData();
  const session = useLoaderData<typeof loader>();

  if (session?.userInfo) {
    return (
      <div>
        <div>{JSON.stringify(sessionData)}</div>
        <div>
          <Form action="/logout" method="POST">
            <button type="submit" className="text-gray-700 hover:text-purple-700">
              Log Out
            </button>
          </Form>
        </div>
      </div>
    );
  }
  return null;
};

export default Profile;
