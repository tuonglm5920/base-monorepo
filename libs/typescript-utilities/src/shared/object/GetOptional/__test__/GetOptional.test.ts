import { expectNotAssignable, expectType } from 'tsd';
import { GetOptional } from '../src/GetOptional';

interface User {
  id: number;
  name: string;
  age?: number;
  email?: string;
}
type Case1 = GetOptional<User>;
// Result type:
// {
//     age?: number;
//     email?: string;
// }

const happyStandardCase: Case1 = {};
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
  id: 1,
};
expectNotAssignable<Case1>(happyErrorCase);
