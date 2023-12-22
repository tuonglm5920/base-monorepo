import { expectNotAssignable, expectType } from 'tsd';
import { DeepArrayToUnion } from '../src/DeepArrayToUnion';

type Case1 = DeepArrayToUnion<[1, 2, [3, 4]]>;
const happyStandardCase: Case1 = 3;
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
