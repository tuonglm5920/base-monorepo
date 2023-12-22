import { expectNotAssignable, expectType } from 'tsd';
import { TrimRight } from '../src/TrimRight';

type Case1 = TrimRight<'Hello World  '>;
// Result type: "Hello World"
const happyStandardCase: Case1 = 'Hello World';
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
