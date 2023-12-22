import { expectNotAssignable, expectType } from 'tsd';
import { DeepFlatArray } from '../src/DeepFlatArray';

type Case1 = DeepFlatArray<[['a', 'b'], ['c', 'd'], ['e', ['f', ['g'], ['h']]]], 10>;
// Result: ["a", "b", "c", "d", "e", "f", "g", "h"]
const happyStandardCase: Case1 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
