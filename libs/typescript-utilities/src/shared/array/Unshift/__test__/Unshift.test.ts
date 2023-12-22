import { expectNotAssignable, expectType } from 'tsd';
import { Unshift } from '../src/Unshift';

type Case1 = Unshift<[string, boolean], number>;
// Result type: [number, string, boolean]
const happyStandardCase: Case1 = [1, 'Hello', false];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
