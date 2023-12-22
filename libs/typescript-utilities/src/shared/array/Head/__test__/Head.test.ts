import { expectNotAssignable, expectType } from 'tsd';
import { Head } from '../src/Head';

type Case1 = Head<[1, 2, string, boolean]>;
// Result: 1
const happyStandardCase: Case1 = 1;
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
