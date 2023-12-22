import { expectNotAssignable, expectType } from 'tsd';
import { Filter } from '../src/Filter';

type Case1 = Filter<[1, 2, string, boolean], number>;
// Result: [1, 2]
const happyStandardCase: Case1 = [1, 2];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
