import { expectNotAssignable, expectType } from 'tsd';
import { AppendArgument } from '../src/AppendArgument';

type InitialFunction = (x: number, y: number) => void;
type Case1 = AppendArgument<InitialFunction, string>;
// Result type:
// (x: number, y: number, args_2: string) => void
const happyStandardCase: Case1 = () => undefined;
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
