import { expectNotAssignable, expectType } from 'tsd';
import { PathKeyOfObject } from '../src/PathKeyOfObject';

interface Config {
  database: {
    host: string;
    port: number;
    user: {
      username: string;
      password: string;
    };
  };
  server: {
    port: number;
  };
}
type Case1 = PathKeyOfObject<Config>;
// Result type:
// "database.host" | "database.port" | "database.user.username" | "database.user.password" | "server.port"
const happyStandardCase: Case1 = 'database.user.password';
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
