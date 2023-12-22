import { expectNotAssignable, expectType } from 'tsd';
import { ToMutableKeys } from '../src/ToMutableKeys';

interface UserConfig {
  readonly id: number;
  readonly name: string;
  age: number;
}
type Case1 = ToMutableKeys<UserConfig, 'name'>;
// Result type:
// {
//     readonly id: number;
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
