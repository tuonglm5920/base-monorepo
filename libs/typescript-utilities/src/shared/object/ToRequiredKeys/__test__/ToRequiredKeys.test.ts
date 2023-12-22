import { expectNotAssignable, expectType } from 'tsd';
import { ToRequiredKeys } from '../src/ToRequiredKeys';

interface User {
  id: number;
  name: string;
  age?: number;
}

type Case1 = ToRequiredKeys<User, 'age'>;
// Result type:
// {
//     id: number;
//     name: string;
//     age: number;
// }
const happyStandardCase: Case1 = { age: 23, id: 1, name: 'Lê Mạnh Tưởng' };
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
  id: 1,
};
expectNotAssignable<Case1>(happyErrorCase);
