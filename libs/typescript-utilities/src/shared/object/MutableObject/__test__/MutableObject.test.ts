import { expectNotAssignable, expectType } from 'tsd';
import { MutableObject } from '../src/MutableObject';
interface User {
  readonly id: number;
  readonly name: string;
  age: number;
}
type Case1 = MutableObject<User>;
// Result type:
// {
//     id: number;
//     name: string;
//     age: number;
// }
const happyStandardCase: Case1 = {
  age: 18,
  id: 1,
  name: 'Lê Mạnh Tưởng',
};
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
