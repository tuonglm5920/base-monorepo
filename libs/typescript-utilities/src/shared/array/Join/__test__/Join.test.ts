import { expectNotAssignable, expectType } from 'tsd';
import { Join } from '../src/Join';

type Case1 = Join<['Hello', 'World'], ' '>;
// Result type: "Hello World"
const happyStandardCase: Case1 = 'Hello World';
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
