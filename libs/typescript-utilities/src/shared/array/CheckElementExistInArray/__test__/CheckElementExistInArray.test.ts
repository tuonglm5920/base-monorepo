import { expectNotAssignable, expectType } from 'tsd';
import { CheckElementExistInArray } from '../src/CheckElementExistInArray';

type Case1 = CheckElementExistInArray<[1, 2, 3], 1>;
const happyStandardCase: Case1 = true;
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
