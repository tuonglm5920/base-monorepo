import { expectNotAssignable, expectType } from 'tsd';
import { FlatArray } from '../src/FlatArray';

type Case1 = FlatArray<[1, [2, 3], 4, [5, 6], 7]>;
// Result [1, 2, 3, 4, 5, 6, 7]
const happyStandardCase: Case1 = [1, 2, 3, 4, 5, 6, 7];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
