import { expectNotAssignable, expectType } from 'tsd';
import { Length } from '../src/Length';

type Case1 = Length<[1, 2, 3, 4]>;
// Result: 4
const happyStandardCase: Case1 = 4;
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
