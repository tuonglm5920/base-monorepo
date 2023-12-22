import { expectNotAssignable, expectType } from 'tsd';
import { MergeObjectB2A } from '../src/MergeObjectB2A';
interface A {
  x: string;
  y: number;
}
interface B {
  x: boolean;
  z: string;
}
type Case1 = MergeObjectB2A<A, B>;
// Result type:
// {
//     x: boolean;
//     y: number;
//     z: string;
// }
const happyStandardCase: Case1 = {
  x: true,
  y: 2,
  z: 'Hello',
};
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
