import { expectNotAssignable, expectType } from 'tsd';
import { Concat } from '../src/Concat';

type Case1 = Concat<[1, 2], [3, 4]>;
const happyStandardCase: Case1 = [1, 2, 3, 4];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
