import { MetaFunction } from '@remix-run/node';
import { FC } from 'react';
import { Text } from 'reactjs';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

const Index: FC = () => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <Text tagName="h2" disableStrict>
        Welcome to Remix!
      </Text>
    </div>
  );
};

export default Index;
