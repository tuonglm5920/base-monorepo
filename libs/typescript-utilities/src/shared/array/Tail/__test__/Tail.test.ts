import { expectNotAssignable, expectType } from 'tsd';
import { Tail } from '../src/Tail';

type Case1 = Tail<[string, number, boolean]>;
// Result type: [number, boolean]
const happyStandardCase: Case1 = [1, false];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
