import { expectNotAssignable, expectType } from 'tsd';
import { UnionToIntersection } from '../src/UnionToIntersection';

type Case1 = UnionToIntersection<{ name: string } | { age: number }>;
// Result type: { name: string } & { age: number }
const happyStandardCase: Case1 = {
  age: 23,
  name: 'Lê Mạnh Tưởng',
};
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
