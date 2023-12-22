import { ActionFunction, MetaFunction } from '@remix-run/node';
import { Form, Link } from '@remix-run/react';
import { FC } from 'react';
import { storage } from 'remixjs/server';

export const meta: MetaFunction = () => {
  return [{ title: 'Login' }];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  if (email && password) {
    const { error, redirector } = await storage.login({ request, email, password });
    return error || redirector;
  }
  return {
    email: 'Email is required',
    password: 'Password is required',
  };
};

const Login: FC = () => {
  return (
    <Form method="POST">
      <label>
        <p>Email:</p>
        <input id="email" type="email" name="email" className="border mt-1 block w-full" required />
      </label>
      <label>
        <p>Password:</p>
        <input
          id="password"
          type="password"
          name="password"
          className="border mt-1 block w-full"
          required
          autoComplete="current-password"
        />
      </label>
      <div>
        <Link to="/forgot-password" className="text-sm text-gray-600 underline hover:text-gray-900">
          Forgot your password?
        </Link>
      </div>
      <button type="submit">Login</button>
    </Form>
  );
};

export default Login;
