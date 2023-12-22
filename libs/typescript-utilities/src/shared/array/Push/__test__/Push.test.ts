import { expectNotAssignable, expectType } from 'tsd';
import { Push } from '../src/Push';

type Case1 = Push<[number, string], boolean>;
// Result type: [number, string, boolean]
const happyStandardCase: Case1 = [1, 'Hello', false];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
