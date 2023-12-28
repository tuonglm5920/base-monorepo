import { ActionFunctionArgs, TypedResponse } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { Text, View } from 'reactjs';
import { authSessionStorage } from '../packages/Auth/sessionStorage';

interface ActionResponse {
  message: string;
  hasError: boolean;
  error?: string;
}

export const action = async ({ request }: ActionFunctionArgs): Promise<TypedResponse<ActionResponse>> => {
  const redirectTo = new URLSearchParams(request.url).get('redirectTo');
  return authSessionStorage.createSession({
    request,
    redirectTo: redirectTo ?? '/dashboard',
    remember: false,
    sessionData: {
      token: 'TOKEN',
      role: 'ADMIN',
    },
  });
};

const Page = () => {
  return (
    <View className="mt-[60px] mx-auto t-12 w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <View className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <Text
          tagName="h1"
          disableStrict
          className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          Sign in to your account
        </Text>
        <Form method="POST" className="space-y-4 md:space-y-6">
          <View>
            <View
              disableStrict
              tagName="label"
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </View>
            <View
              tagName="input"
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@company.com"
              required
            />
          </View>
          <View>
            <View
              tagName="label"
              disableStrict
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </View>
            <View
              tagName="input"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </View>
          <View className="flex items-center justify-between">
            <View className="flex items-start">
              <View className="flex items-center h-5">
                <View
                  tagName="input"
                  id="remember"
                  aria-describedby="remember"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  required
                />
              </View>
              <View className="ml-3 text-sm">
                <View disableStrict tagName="label" htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                  Remember me
                </View>
              </View>
            </View>
            <View
              tagName="a"
              disableStrict
              href="#"
              className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Forgot password?
            </View>
          </View>
          <View
            tagName="button"
            type="submit"
            disableStrict
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-blue-700"
          >
            Sign in
          </View>
          <View disableStrict tagName="p" className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don’t have an account yet?{' '}
            <View
              tagName="a"
              disableStrict
              href="#"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Sign up
            </View>
          </View>
        </Form>
      </View>
    </View>
  );
};

export default Page;
