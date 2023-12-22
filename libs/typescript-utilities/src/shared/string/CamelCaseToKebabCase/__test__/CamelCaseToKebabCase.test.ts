import { expectNotAssignable, expectType } from 'tsd';
import { CamelCaseToKebabCase } from '../src/CamelCaseToKebabCase';

type Case1 = CamelCaseToKebabCase<'helloWorldExample'>;
// Result type: "hello-world-example"
const happyStandardCase: Case1 = 'hello-world-example';
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
