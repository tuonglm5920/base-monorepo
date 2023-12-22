import { expectNotAssignable, expectType } from 'tsd';
import { LastOfUnion } from '../src/LastOfUnion';

type Case1 = LastOfUnion<'A' | 'B' | 'C'>;
// Result type: 'C'
const happyStandardCase: Case1 = 'C';
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
