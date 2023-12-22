import { expectNotAssignable, expectType } from 'tsd';
import { Split } from '../src/Split';

type Case1 = Split<'Hello,World,TypeScript', ','>;
// Result type: ["Hello", "World", "TypeScript"]
const happyStandardCase: Case1 = ['Hello', 'World', 'TypeScript'];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
