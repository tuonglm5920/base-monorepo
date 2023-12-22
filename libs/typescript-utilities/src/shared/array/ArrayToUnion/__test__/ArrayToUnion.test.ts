import { expectNotAssignable, expectType } from 'tsd';
import { ArrayToUnion } from '../src/ArrayToUnion';

type Case1 = ArrayToUnion<[1, 2, 3]>;
const happyStandardCase: Case1 = 3;
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
