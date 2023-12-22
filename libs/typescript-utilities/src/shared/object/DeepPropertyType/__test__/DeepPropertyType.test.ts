import { expectNotAssignable, expectType } from 'tsd';
import { DeepPropertyType } from '../src/DeepPropertyType';

interface Configuration {
  database: {
    connection: {
      host: string;
      port: number;
    };
    credentials: {
      username: string;
      password: string;
    };
  };
  server: {
    port: number;
  };
}
type Case1 = DeepPropertyType<Configuration, 'database.connection'>;
// Result type:
// {
//     host: string;
//     port: number;
// }
const happyStandardCase: Case1 = {
  host: 'localhost',
  port: 3000,
};
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
