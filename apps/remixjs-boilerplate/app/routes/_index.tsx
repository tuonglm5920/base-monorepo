import { redirect } from '@remix-run/server-runtime';
export const loader = async () => redirect('/login');

const Page = () => {
  return null;
};

export default Page;
