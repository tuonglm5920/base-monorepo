import { expectNotAssignable, expectType } from 'tsd';
import { Reverse } from '../src/Reverse';

type Case1 = Reverse<[number, string, boolean]>;
// Result type: [boolean, string, number]
const happyStandardCase: Case1 = [false, 'Hello', 1];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
