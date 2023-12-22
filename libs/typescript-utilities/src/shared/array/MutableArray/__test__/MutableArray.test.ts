import { expectNotAssignable, expectType } from 'tsd';
import { MutableArray } from '../src/MutableArray';

type Case1 = MutableArray<readonly [1, 2, 3, 4]>;
// Result: [1, 2, 3, 4]
const happyStandardCase: Case1 = [1, 2, 3, 4];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
