import { expectNotAssignable, expectType } from 'tsd';
import { FunctionDetail } from '../src/FunctionDetail';

type ExampleFunction = (id: number, name: string) => boolean;
type Case1 = FunctionDetail<ExampleFunction>;
// Result type:
// {
//     parameters: [number, string];
//     returnType: boolean;
// }
const happyStandardCase: Case1 = {
  params: [1, '1'],
  returnType: false,
};
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
