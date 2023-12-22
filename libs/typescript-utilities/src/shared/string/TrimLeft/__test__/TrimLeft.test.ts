import { expectNotAssignable, expectType } from 'tsd';
import { TrimLeft } from '../src/TrimLeft';

type Case1 = TrimLeft<'  Hello World'>;
// Result type: "Hello World"
const happyStandardCase: Case1 = 'Hello World';
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
