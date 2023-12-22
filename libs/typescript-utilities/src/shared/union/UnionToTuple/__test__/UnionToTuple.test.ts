import { expectNotAssignable, expectType } from 'tsd';
import { UnionToTuple } from '../src/UnionToTuple';

type Case1 = UnionToTuple<string | number>;
// Result type: [string, number]
const happyStandardCase: Case1 = ['Hello', 1];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
