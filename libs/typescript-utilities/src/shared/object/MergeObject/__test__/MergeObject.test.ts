import { expectNotAssignable, expectType } from 'tsd';
import { MergeObject } from '../src/MergeObject';
interface X {
  a: 1;
  b: number;
}
interface Y {
  a: 2;
  b: string;
  c: boolean;
}
type Case1 = MergeObject<X, Y>;
// Result type:
// {
//     a: 1 | 2;
//     b: number | string;
//     c?: boolean;
// }
const happyStandardCase: Case1 = {
  a: 1,
  b: 2,
  c: false,
};
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
