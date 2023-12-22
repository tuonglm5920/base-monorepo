import { expectNotAssignable, expectType } from 'tsd';
import { GetRequired } from '../src/GetRequired';

interface User {
  id: number;
  name: string;
  age?: number;
  email?: string;
}
type Case1 = GetRequired<User>;
// Result type:
// {
//     id: number;
//     name: string;
// }

const happyStandardCase: Case1 = { id: 1, name: 'Lê Mạnh Tưởng' };
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
