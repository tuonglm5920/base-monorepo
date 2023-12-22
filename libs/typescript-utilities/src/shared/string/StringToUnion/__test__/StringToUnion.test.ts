import { expectNotAssignable, expectType } from 'tsd';
import { StringToUnion } from '../src/StringToUnion';

type Case1 = StringToUnion<'Hello'>;
// Result type: "H" | "e" | "l" | "l" | "o"
const happyStandardCase: Case1 = 'H';
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
