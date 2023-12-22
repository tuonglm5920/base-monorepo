import { expectNotAssignable, expectType } from 'tsd';
import { ToOptionalKeys } from '../src/ToOptionalKeys';

interface UserData {
  id: number;
  name: string;
  age: number;
}
type Case1 = ToOptionalKeys<UserData, 'name'>;
// Result type:
// {
//     id: number;
//     name?: string;
//     age: number;
// }
const happyStandardCase: Case1 = { age: 23, id: 1 };
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
  id: 1,
};
expectNotAssignable<Case1>(happyErrorCase);
