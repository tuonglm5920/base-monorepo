import { expectNotAssignable, expectType } from 'tsd';
import { Last } from '../src/Last';

type Case1 = Last<[1, 2, 3, 4]>;
// Result: 4
const happyStandardCase: Case1 = 4;
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
