import { expectNotAssignable, expectType } from 'tsd';
import { HasTail } from '../src/HasTail';

type Case1 = HasTail<[1]>;
// Result: false
const happyStandardCase: Case1 = false;
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
