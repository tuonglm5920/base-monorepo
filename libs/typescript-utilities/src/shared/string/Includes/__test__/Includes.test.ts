import { expectNotAssignable, expectType } from 'tsd';
import { Includes } from '../src/Includes';

type Case1 = Includes<'HelloWorld', 'World'>;
// Result type: true
const happyStandardCase: Case1 = true;
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
