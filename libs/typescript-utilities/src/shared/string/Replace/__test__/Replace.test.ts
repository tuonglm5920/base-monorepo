import { expectNotAssignable, expectType } from 'tsd';
import { Replace } from '../src/Replace';

type Case1 = Replace<'HelloWorld', 'World', 'TypeScript'>;
// Result type: "HelloTypeScript"
const happyStandardCase: Case1 = 'HelloTypeScript';
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
